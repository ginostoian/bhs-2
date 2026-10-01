"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  blankHeading,
  blankItem,
  blankSection,
  toPayload,
  uid,
} from "./quoteModel";

const HISTORY_LIMIT = 150;
const COALESCE_MS = 900;
const AUTOSAVE_MS = 1200;

// Server-owned fields merged back after a save (never part of undo history)
const META_FIELDS = [
  "_id",
  "quoteNumber",
  "status",
  "publicToken",
  "sentAt",
  "viewCount",
  "firstViewed",
  "lastViewed",
  "createdAt",
  "updatedAt",
  "createdBy",
  "lastModifiedBy",
];

const setPath = (obj, path, value) => {
  let target = obj;
  for (let i = 0; i < path.length - 1; i++) target = target[path[i]];
  target[path[path.length - 1]] = value;
};

const cloneItem = (item) => ({ ...item, _id: undefined, _key: uid() });

/** Apply one edit to a (cloned) quote. Returns nothing; mutates `q`. */
const applyEdit = (q, action) => {
  const sections = q.services;
  switch (action.type) {
    case "set":
      setPath(q, action.path, action.value);
      break;
    case "updateItem":
      Object.assign(sections[action.s].items[action.i], action.patch);
      break;
    case "insertItems": {
      const items = action.items.map((item) => blankItem(item));
      sections[action.s].items.splice(action.at, 0, ...items);
      break;
    }
    case "setItems":
      sections[action.s].items = action.items;
      break;
    case "deleteItem":
      sections[action.s].items.splice(action.i, 1);
      break;
    case "duplicateItem": {
      const copy = cloneItem(sections[action.s].items[action.i]);
      sections[action.s].items.splice(action.i + 1, 0, copy);
      break;
    }
    case "moveItem": {
      const [item] = sections[action.from.s].items.splice(action.from.i, 1);
      sections[action.to.s].items.splice(action.to.i, 0, item);
      break;
    }
    case "updateSection":
      Object.assign(sections[action.s], action.patch);
      break;
    case "addSection": {
      const section =
        action.kind === "heading"
          ? blankHeading(action.name)
          : blankSection(
              action.name,
              action.items?.map((i) => blankItem(i)),
            );
      sections.splice(action.at ?? sections.length, 0, section);
      break;
    }
    case "addSections": {
      const created = action.sections.map((s) =>
        blankSection(
          s.categoryName,
          s.items.map((i) => blankItem(i)),
        ),
      );
      sections.splice(action.at ?? sections.length, 0, ...created);
      break;
    }
    case "deleteSection":
      sections.splice(action.s, 1);
      break;
    case "duplicateSection": {
      const src = sections[action.s];
      sections.splice(action.s + 1, 0, {
        ...src,
        _id: undefined,
        _key: uid(),
        categoryName: src.categoryName
          ? `${src.categoryName} (copy)`
          : src.categoryName,
        items: (src.items || []).map(cloneItem),
      });
      break;
    }
    case "moveSection": {
      const to = action.s + action.dir;
      if (to < 0 || to >= sections.length) break;
      const [section] = sections.splice(action.s, 1);
      sections.splice(to, 0, section);
      break;
    }
    default:
      throw new Error(`Unknown edit ${action.type}`);
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "load":
      return {
        quote: action.quote,
        past: [],
        future: [],
        version: 0,
        lastEdit: null,
      };
    case "meta":
      return { ...state, quote: { ...state.quote, ...action.patch } };
    case "undo": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        ...state,
        quote: { ...previous, ...pickMeta(state.quote) },
        past: state.past.slice(0, -1),
        future: [state.quote, ...state.future],
        version: state.version + 1,
        lastEdit: null,
      };
    }
    case "redo": {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return {
        ...state,
        quote: { ...next, ...pickMeta(state.quote) },
        past: [...state.past, state.quote],
        future: rest,
        version: state.version + 1,
        lastEdit: null,
      };
    }
    case "edit": {
      const quote = structuredClone(state.quote);
      applyEdit(quote, action.edit);
      // Typing into the same field in quick succession is one undo step
      const e = action.edit;
      const coalesceKey =
        e.type === "set"
          ? e.path.join(".")
          : e.type === "updateItem"
            ? `item.${e.s}.${e.i}.${Object.keys(e.patch).join(",")}`
            : e.type === "updateSection"
              ? `section.${e.s}.${Object.keys(e.patch).join(",")}`
              : null;
      const now = Date.now();
      const coalesce =
        coalesceKey &&
        state.lastEdit?.key === coalesceKey &&
        now - state.lastEdit.at < COALESCE_MS;
      return {
        quote,
        past: coalesce
          ? state.past
          : [...state.past, state.quote].slice(-HISTORY_LIMIT),
        future: [],
        version: state.version + 1,
        lastEdit: { key: coalesceKey, at: now },
      };
    }
    default:
      return state;
  }
};

const pickMeta = (quote) =>
  Object.fromEntries(META_FIELDS.map((k) => [k, quote[k]]));

/**
 * Editor state with undo/redo and autosave.
 * - New quotes are created (POST) on the first edit, then updated (PUT).
 * - `saveNow(extra)` flushes immediately, e.g. to change status; it
 *   resolves with the server response and rejects with `.errors` on 422.
 */
export default function useQuoteEditor(initialQuote, { onCreated } = {}) {
  const [state, dispatch] = useReducer(reducer, null, () => ({
    quote: initialQuote,
    past: [],
    future: [],
    version: 0,
    lastEdit: null,
  }));
  const [saveState, setSaveState] = useState({
    status: initialQuote._id ? "saved" : "new",
    at: null,
    error: null,
  });

  const stateRef = useRef(state);
  stateRef.current = state;
  const savedVersion = useRef(0);
  const inFlight = useRef(null);
  const onCreatedRef = useRef(onCreated);
  onCreatedRef.current = onCreated;

  const persist = useCallback(async (extra = {}) => {
    // Serialise saves so a POST always lands before the following PUT
    while (inFlight.current) await inFlight.current.catch(() => {});

    const { quote, version } = stateRef.current;
    const id = quote._id;
    const run = (async () => {
      setSaveState((s) => ({ ...s, status: "saving", error: null }));
      const response = await fetch(
        id ? `/api/admin/quoting/${id}` : "/api/admin/quoting",
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...toPayload(quote), ...extra }),
        },
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        const error = new Error(result.error || "Couldn't save the quote");
        error.errors = result.errors;
        error.status = response.status;
        throw error;
      }
      return result.quote;
    })();
    inFlight.current = run;

    try {
      const saved = await run;
      savedVersion.current = Math.max(savedVersion.current, version);
      dispatch({ type: "meta", patch: pickMeta(saved) });
      setSaveState({ status: "saved", at: new Date(), error: null });
      if (!id && saved._id) onCreatedRef.current?.(saved);
      return saved;
    } catch (error) {
      // A rejected status change isn't a failed autosave of the edits
      setSaveState({
        status: error.status === 422 ? "saved" : "error",
        at: null,
        error: error.message,
      });
      throw error;
    } finally {
      if (inFlight.current === run) inFlight.current = null;
    }
  }, []);

  // Debounced autosave whenever the document changes
  useEffect(() => {
    if (state.version === 0 || state.version === savedVersion.current) return;
    setSaveState((s) =>
      s.status === "saving" ? s : { ...s, status: "dirty" },
    );
    const timer = setTimeout(() => {
      persist().catch(() => {});
    }, AUTOSAVE_MS);
    return () => clearTimeout(timer);
  }, [state.version, persist]);

  // Warn before leaving with unsaved edits
  useEffect(() => {
    const handler = (event) => {
      const { version } = stateRef.current;
      if (version !== savedVersion.current || inFlight.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const edit = useCallback((edit) => dispatch({ type: "edit", edit }), []);
  const set = useCallback(
    (path, value) =>
      dispatch({ type: "edit", edit: { type: "set", path, value } }),
    [],
  );
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);
  const load = useCallback((quote) => {
    savedVersion.current = 0;
    dispatch({ type: "load", quote });
  }, []);

  const hasUnsaved = () =>
    stateRef.current.version !== savedVersion.current || !!inFlight.current;

  return {
    quote: state.quote,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    saveState,
    edit,
    set,
    undo,
    redo,
    load,
    saveNow: persist,
    hasUnsaved,
  };
}
