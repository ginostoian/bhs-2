"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import {
  ArrowDown,
  ArrowUp,
  BookmarkPlus,
  ChevronDown,
  ChevronRight,
  Copy,
  CornerDownLeft,
  GripVertical,
  Heading,
  Library,
  MessageSquareText,
  PanelTop,
  Plus,
  Trash2,
} from "lucide-react";
import { formatCurrency } from "@/libs/documentFormat";
import { quoteCategoryTotal } from "@/libs/quoteTerms";
import { blankItem, evaluateNumber, lineMargin, lineTotal } from "./quoteModel";
import { Menu, cx } from "./ui";

// ─── Column model ───────────────────────────────────────────────────────────

const COLUMNS = {
  name: { label: "Item", width: "minmax(150px,1.1fr)", editable: true },
  description: {
    label: "Description",
    width: "minmax(170px,2fr)",
    editable: true,
    multiline: true,
  },
  quantity: { label: "Qty", width: "60px", editable: true, numeric: true },
  unit: { label: "Unit", width: "64px", editable: true },
  unitPrice: {
    label: "Rate",
    width: "100px",
    editable: true,
    numeric: true,
    money: true,
  },
  total: { label: "Total", width: "108px", numeric: true, money: true },
  costPrice: {
    label: "Cost",
    width: "92px",
    editable: true,
    numeric: true,
    money: true,
    internal: true,
  },
  margin: { label: "Margin", width: "68px", numeric: true, internal: true },
};

const BASE_COLS = [
  "name",
  "description",
  "quantity",
  "unit",
  "unitPrice",
  "total",
];
const COST_COLS = ["costPrice", "margin"];

const isMod = (e) => e.metaKey || e.ctrlKey;
const MOD_LABEL =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)
    ? "⌘"
    : "Ctrl+";

const formatQty = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 1000) / 1000);
};

const rawValue = (item, col) => {
  const value = item[col];
  if (value === null || value === undefined) return "";
  return String(value);
};

const marginClass = (margin) => {
  if (margin === null) return "text-[#A3A8A4]";
  if (margin < 15) return "text-[#B42318]";
  if (margin < 25) return "text-[#8A5A00]";
  return "text-[#2F6B3F]";
};

/** Commit a typed value into a patch for `col`, or return an error string. */
const parseCell = (col, value) => {
  const meta = COLUMNS[col];
  if (!meta.numeric) return { [col]: value };
  const trimmed = String(value).trim();
  if (trimmed === "") {
    return { [col]: col === "costPrice" ? null : col === "quantity" ? 1 : 0 };
  }
  const n = evaluateNumber(trimmed);
  if (n === null) return { error: `“${trimmed}” isn't a number or formula` };
  return { [col]: n };
};

// ─── Cell editor ────────────────────────────────────────────────────────────

function CellEditor({ col, initial, valueRef, appendRef, onCommit, onCancel }) {
  const ref = useRef(null);
  const [value, setValue] = useState(initial.value);
  valueRef.current = value;
  appendRef.current = (text) => setValue((v) => v + text);
  useEffect(() => () => (appendRef.current = null), [appendRef]);
  const multiline = COLUMNS[col].multiline;

  // Layout effect: take focus before the next keystroke can reach the grid
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const end = el.value.length;
    // Typing replaces; Enter/F2/double-click puts the caret at the end
    el.setSelectionRange(end, end);
  }, []);

  useEffect(() => {
    if (!multiline || !ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [value, multiline]);

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    } else if (e.key === "Enter" && !(multiline && (e.shiftKey || e.altKey))) {
      e.preventDefault();
      onCommit(value, e.shiftKey ? "up" : "down", isMod(e));
    } else if (e.key === "Tab") {
      e.preventDefault();
      onCommit(value, e.shiftKey ? "left" : "right");
    }
    e.stopPropagation();
  };

  const common = {
    ref,
    value,
    onChange: (e) => setValue(e.target.value),
    onKeyDown,
    onBlur: () => onCommit(value, null),
    className: cx(
      "block w-full !rounded-none border-0 bg-white px-2 py-1.5 text-sm text-[#202925] outline-none ring-2 ring-inset ring-[#4D5B4B]",
      COLUMNS[col].numeric && "text-right tabular-nums",
    ),
    spellCheck: !COLUMNS[col].numeric,
    inputMode: COLUMNS[col].numeric ? "decimal" : undefined,
  };

  return multiline ? (
    <textarea
      rows={1}
      {...common}
      className={cx(common.className, "resize-none")}
    />
  ) : (
    <input {...common} />
  );
}

// ─── Sheet ──────────────────────────────────────────────────────────────────

/**
 * Spreadsheet-style editor for quote sections and line items.
 * Keyboard: arrows/Tab move · type or Enter to edit · Enter commits and moves
 * down (adds a row at the end of a section) · Esc cancels · Delete clears ·
 * ⌘/Ctrl+Enter insert row · ⌘/Ctrl+D duplicate · ⌘/Ctrl+⌫ delete row ·
 * Alt+↑/↓ move row · paste multi-row/column data from Excel or Sheets.
 */
export default function QuoteSheet({
  quote,
  edit,
  showCosts,
  onOpenRow,
  onOpenCatalogue,
  onSaveToCatalogue,
}) {
  const sections = quote.services;
  const cols = useMemo(
    () => (showCosts ? [...BASE_COLS, ...COST_COLS] : BASE_COLS),
    [showCosts],
  );
  const gridTemplate = useMemo(
    () => ["36px", ...cols.map((c) => COLUMNS[c].width), "64px"].join(" "),
    [cols],
  );
  const minWidth = showCosts ? 940 : 780;

  const gridRef = useRef(null);
  const [active, setActive] = useState(null); // { s, i, c }
  const [editing, setEditing] = useState(null); // { value, pos }
  // Synchronous mirror of `editing` so blur + click can't commit twice
  const editingRef = useRef(null);
  const editorValue = useRef("");
  const lastPointer = useRef("mouse");
  // Lets keystrokes that arrive before the editor has focus still land in it
  const appendRef = useRef(null);
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [describing, setDescribing] = useState(() => new Set());

  // Flattened navigable rows (category items only, visible sections)
  const rows = useMemo(() => {
    const out = [];
    sections.forEach((section, s) => {
      if (section.type === "heading" || collapsed.has(section._key)) return;
      section.items.forEach((_, i) => out.push({ s, i }));
    });
    return out;
  }, [sections, collapsed]);

  const rowIndex = (pos) =>
    rows.findIndex((r) => r.s === pos?.s && r.i === pos?.i);

  // Keep the selection valid after structural changes / undo
  useEffect(() => {
    if (!active) return;
    const item = sections[active.s]?.items?.[active.i];
    if (!item || !cols.includes(active.c)) {
      editingRef.current = null;
      setEditing(null);
      setActive(rows[0] ? { ...rows[0], c: "name" } : null);
    }
  }, [sections, cols, active, rows]);

  // Scroll the active cell into view
  useEffect(() => {
    if (!active) return;
    const el = gridRef.current?.querySelector(
      `[data-cell="${active.s}-${active.i}-${active.c}"]`,
    );
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);

  // Synchronous on purpose: a deferred focus drops keys typed straight after
  // Enter/Tab. (The editor's blur then commits nothing — editingRef is clear.)
  const focusGrid = () => gridRef.current?.focus({ preventScroll: true });

  const stopEditing = () => {
    editingRef.current = null;
    setEditing(null);
  };

  const select = useCallback((pos) => {
    setActive(pos);
  }, []);

  const move = useCallback(
    (from, dir) => {
      if (!from) return;
      const ci = cols.indexOf(from.c);
      const ri = rowIndex(from);
      if (dir === "left" || dir === "right") {
        const step = dir === "left" ? -1 : 1;
        let nextCol = ci + step;
        let nextRow = ri;
        if (nextCol < 0) {
          nextCol = cols.length - 1;
          nextRow = ri - 1;
        } else if (nextCol >= cols.length) {
          nextCol = 0;
          nextRow = ri + 1;
        }
        if (rows[nextRow]) setActive({ ...rows[nextRow], c: cols[nextCol] });
      } else {
        const nextRow = ri + (dir === "up" ? -1 : 1);
        if (rows[nextRow]) setActive({ ...rows[nextRow], c: from.c });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cols, rows],
  );

  const insertRow = (s, at, focus = true) => {
    edit({ type: "insertItems", s, at, items: [{}] });
    if (focus) setActive({ s, i: at, c: "name" });
  };

  const deleteRow = (s, i) => {
    edit({ type: "deleteItem", s, i });
    const remaining = sections[s].items.length - 1;
    if (remaining > 0)
      setActive({ s, i: Math.min(i, remaining - 1), c: active?.c || "name" });
  };

  const moveRow = (s, i, dir) => {
    const items = sections[s].items;
    if (dir === -1 && i > 0) {
      edit({ type: "moveItem", from: { s, i }, to: { s, i: i - 1 } });
      setActive((a) => a && { ...a, i: i - 1 });
      return;
    }
    if (dir === 1 && i < items.length - 1) {
      edit({ type: "moveItem", from: { s, i }, to: { s, i: i + 1 } });
      setActive((a) => a && { ...a, i: i + 1 });
      return;
    }
    // Cross into the neighbouring category section
    let t = s + dir;
    while (sections[t] && sections[t].type === "heading") t += dir;
    if (!sections[t]) return;
    const toIndex = dir === -1 ? sections[t].items.length : 0;
    edit({ type: "moveItem", from: { s, i }, to: { s: t, i: toIndex } });
    setActive((a) => a && { ...a, s: t, i: toIndex });
  };

  const commit = (value, direction, withMod) => {
    const current = editingRef.current;
    if (!current) return;
    stopEditing();
    const { s, i, c } = current.pos;
    const item = sections[s]?.items?.[i];
    if (!item) return;
    let name = item.name;
    if (value !== rawValue(item, c)) {
      const patch = parseCell(c, value);
      if (patch.error) {
        toast.error(patch.error);
        focusGrid();
        return;
      }
      edit({ type: "updateItem", s, i, patch });
      if (c === "name") name = value;
    }
    const isLastInSection = i === sections[s].items.length - 1;
    if (
      direction === "down" &&
      (withMod || (isLastInSection && name?.trim()))
    ) {
      // Excel-style fast entry: Enter on a filled last row starts a new one
      insertRow(s, i + 1);
      setActive({ s, i: i + 1, c: withMod ? c : "name" });
    } else if (direction) {
      move(current.pos, direction);
    }
    if (direction) focusGrid();
  };

  const startEditing = (initialValue) => {
    if (!active || !COLUMNS[active.c].editable) return;
    const item = sections[active.s].items[active.i];
    const next = {
      value: initialValue ?? rawValue(item, active.c),
      pos: { ...active },
    };
    editingRef.current = next;
    setEditing(next);
  };

  const clearCell = () => {
    if (!active || !COLUMNS[active.c].editable) return;
    const patch = parseCell(active.c, "");
    edit({ type: "updateItem", s: active.s, i: active.i, patch });
  };

  const onKeyDown = (e) => {
    if (e.target !== gridRef.current) return;
    if (editingRef.current) {
      // Fast typing: the editor is opening but hasn't taken focus yet
      if (e.key.length === 1 && !isMod(e) && !e.altKey) {
        e.preventDefault();
        if (appendRef.current) appendRef.current(e.key);
        else {
          editingRef.current = {
            ...editingRef.current,
            value: editingRef.current.value + e.key,
          };
          setEditing(editingRef.current);
        }
      }
      return;
    }
    if (!active) {
      if (!active && rows[0] && e.key.startsWith("Arrow")) {
        e.preventDefault();
        setActive({ ...rows[0], c: "name" });
      }
      return;
    }
    const { s, i } = active;
    const key = e.key;

    if (isMod(e) && key === "Enter") {
      e.preventDefault();
      insertRow(s, i + 1);
    } else if (isMod(e) && key.toLowerCase() === "d") {
      e.preventDefault();
      edit({ type: "duplicateItem", s, i });
      setActive({ ...active, i: i + 1 });
    } else if (isMod(e) && (key === "Backspace" || key === "Delete")) {
      e.preventDefault();
      deleteRow(s, i);
    } else if (e.altKey && (key === "ArrowUp" || key === "ArrowDown")) {
      e.preventDefault();
      moveRow(s, i, key === "ArrowUp" ? -1 : 1);
    } else if (key.startsWith("Arrow")) {
      e.preventDefault();
      move(active, key.slice(5).toLowerCase());
    } else if (key === "Tab") {
      e.preventDefault();
      move(active, e.shiftKey ? "left" : "right");
    } else if (key === "Enter" || key === "F2") {
      e.preventDefault();
      if (COLUMNS[active.c].editable) startEditing();
      else move(active, "down");
    } else if (key === "Backspace" || key === "Delete") {
      e.preventDefault();
      clearCell();
    } else if (key === "Escape") {
      setActive(null);
    } else if (key.length === 1 && !isMod(e) && !e.altKey) {
      if (COLUMNS[active.c].editable) {
        e.preventDefault();
        startEditing(key);
      }
    }
  };

  const onCopy = (e) => {
    if (e.target !== gridRef.current || editing || !active) return;
    const item = sections[active.s]?.items?.[active.i];
    if (!item) return;
    const value =
      active.c === "total"
        ? String(lineTotal(item))
        : active.c === "margin"
          ? String(lineMargin(item) ?? "")
          : rawValue(item, active.c);
    e.clipboardData.setData("text/plain", value);
    e.preventDefault();
  };

  // Paste a block of cells (tab/newline separated) starting at the active cell
  const onPaste = (e) => {
    if (e.target !== gridRef.current || editing || !active) return;
    const text = e.clipboardData.getData("text/plain");
    if (!text) return;
    e.preventDefault();

    const lines = text.replace(/\r/g, "").split("\n");
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    const grid = lines.map((line) => line.split("\t"));
    const editableCols = cols.filter((c) => COLUMNS[c].editable);
    const startCol = Math.max(editableCols.indexOf(active.c), 0);
    const { s, i } = active;
    const items = sections[s].items.map((item) => ({ ...item }));
    let errors = 0;

    grid.forEach((cells, r) => {
      const target = i + r;
      if (!items[target]) items.splice(target, 0, blankItem());
      cells.forEach((cell, k) => {
        const col = editableCols[startCol + k];
        if (!col) return;
        const patch = parseCell(col, cell.trim());
        if (patch.error) errors++;
        else Object.assign(items[target], patch);
      });
    });

    edit({ type: "setItems", s, items });
    if (grid.length > 1 || grid[0].length > 1) {
      toast.success(
        `Pasted ${grid.length} row${grid.length === 1 ? "" : "s"}${
          errors ? ` · ${errors} cell${errors === 1 ? "" : "s"} skipped` : ""
        }`,
      );
    } else if (errors) {
      toast.error("That value isn't a number");
    }
  };

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;
    const from = {
      s: sections.findIndex((x) => x._key === source.droppableId),
      i: source.index,
    };
    const to = {
      s: sections.findIndex((x) => x._key === destination.droppableId),
      i: destination.index,
    };
    if (from.s === to.s && from.i === to.i) return;
    edit({ type: "moveItem", from, to });
    setActive({ ...to, c: active?.c || "name" });
  };

  const toggle = (setter, key) =>
    setter((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  // ── Rendering ─────────────────────────────────────────────────────────────

  const renderCell = (section, s, item, i, c) => {
    const meta = COLUMNS[c];
    const isActive = active?.s === s && active?.i === i && active?.c === c;
    const isEditing =
      editing?.pos.s === s && editing?.pos.i === i && editing?.pos.c === c;

    let display;
    if (c === "total") display = formatCurrency(lineTotal(item));
    else if (c === "margin") {
      const m = lineMargin(item);
      display = (
        <span className={marginClass(m)}>
          {m === null ? "—" : `${Math.round(m)}%`}
        </span>
      );
    } else if (c === "quantity") display = formatQty(item.quantity);
    else if (meta.money)
      display =
        item[c] === null || item[c] === undefined ? (
          <span className="text-[#A3A8A4]">—</span>
        ) : (
          formatCurrency(item[c])
        );
    else if (item[c]) display = item[c];
    else if (c === "name" || (active?.s === s && active?.i === i))
      // Hints only on empty names and the selected row, to keep the sheet calm
      display = (
        <span className="text-[#A3A8A4]">
          {c === "name"
            ? "Item name"
            : c === "description"
              ? "Description"
              : ""}
        </span>
      );

    return (
      <div
        key={c}
        role="gridcell"
        data-cell={`${s}-${i}-${c}`}
        aria-selected={isActive}
        onMouseDown={(e) => {
          if (isEditing) return;
          e.preventDefault();
          // Clicking away from an open editor keeps what was typed
          if (editingRef.current) commit(editorValue.current, null);
          // Touch has no double-click or typing-to-edit: tap again to edit
          if (isActive && meta.editable && lastPointer.current !== "mouse") {
            startEditing();
          } else {
            select({ s, i, c });
          }
          gridRef.current?.focus({ preventScroll: true });
        }}
        onPointerDown={(e) => {
          lastPointer.current = e.pointerType || "mouse";
        }}
        onDoubleClick={() => meta.editable && startEditing()}
        className={cx(
          "relative min-h-[36px] border-r border-[#EDE9E0] text-sm",
          !meta.editable && "bg-[#FAF8F4]",
          meta.internal && "bg-[#FBF7F1]",
          c === "total" && "font-semibold",
          isActive && !isEditing && "z-[1] ring-2 ring-inset ring-[#4D5B4B]",
        )}
      >
        {isEditing ? (
          <div className="absolute inset-x-0 top-0 z-10 min-h-full bg-white shadow-[0_4px_12px_rgba(32,41,37,0.15)]">
            <CellEditor
              col={c}
              initial={editing}
              valueRef={editorValue}
              appendRef={appendRef}
              onCommit={commit}
              onCancel={() => {
                stopEditing();
                focusGrid();
              }}
            />
          </div>
        ) : (
          <div
            className={cx(
              "px-2 py-1.5",
              meta.numeric && "text-right tabular-nums",
              meta.multiline
                ? "whitespace-pre-line text-[13px] leading-snug text-[#4A524D]"
                : "truncate",
            )}
          >
            {display}
          </div>
        )}
      </div>
    );
  };

  const renderRow = (section, s, item, i, provided, snapshot) => {
    const hasNotes = !!(item.notes || item.internalNote);
    const rowActive = active?.s === s && active?.i === i;
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        role="row"
        className={cx(
          "grid border-b border-[#EDE9E0] bg-white",
          rowActive && "bg-[#FBFAF7]",
          snapshot.isDragging && "shadow-lg ring-1 ring-[#D8D2C6]",
        )}
        style={{
          ...provided.draggableProps.style,
          gridTemplateColumns: gridTemplate,
        }}
      >
        <div
          {...provided.dragHandleProps}
          title="Drag to reorder"
          className="group flex items-start justify-center border-r border-[#EDE9E0] pt-2 text-[11px] text-[#A3A8A4] hover:bg-[#F4F1EA]"
        >
          <span className="group-hover:hidden">{i + 1}</span>
          <GripVertical className="hidden h-4 w-4 group-hover:block" />
        </div>
        {cols.map((c) => renderCell(section, s, item, i, c))}
        <div className="flex items-start justify-end gap-0.5 px-1 pt-1">
          <button
            type="button"
            title={hasNotes ? "Notes (has notes)" : "Row details & notes"}
            onClick={() => onOpenRow({ s, i })}
            className={cx(
              "inline-flex h-7 w-7 items-center justify-center hover:bg-[#EDE9E0]",
              hasNotes ? "text-[#A65B43]" : "text-[#A3A8A4]",
            )}
          >
            <MessageSquareText className="h-4 w-4" />
          </button>
          <Menu
            label="Row actions"
            items={[
              {
                label: "Insert row above",
                icon: Plus,
                onClick: () => insertRow(s, i),
              },
              {
                label: "Insert row below",
                icon: Plus,
                shortcut: `${MOD_LABEL}↵`,
                onClick: () => insertRow(s, i + 1),
              },
              {
                label: "Duplicate row",
                icon: Copy,
                shortcut: `${MOD_LABEL}D`,
                onClick: () => edit({ type: "duplicateItem", s, i }),
              },
              {
                label: "Details & notes",
                icon: MessageSquareText,
                onClick: () => onOpenRow({ s, i }),
              },
              {
                label: "Save to catalogue",
                icon: BookmarkPlus,
                onClick: () => onSaveToCatalogue({ s, i }),
                disabled: !item.name,
              },
              "divider",
              {
                label: "Move up",
                icon: ArrowUp,
                shortcut: "Alt↑",
                onClick: () => moveRow(s, i, -1),
              },
              {
                label: "Move down",
                icon: ArrowDown,
                shortcut: "Alt↓",
                onClick: () => moveRow(s, i, 1),
              },
              "divider",
              {
                label: "Delete row",
                icon: Trash2,
                danger: true,
                shortcut: `${MOD_LABEL}⌫`,
                onClick: () => deleteRow(s, i),
              },
            ]}
          />
        </div>
      </div>
    );
  };

  const sectionMenu = (section, s) =>
    [
      section.type !== "heading" && {
        label:
          section.description || describing.has(section._key)
            ? "Hide description"
            : "Add client description",
        icon: PanelTop,
        onClick: () => {
          if (section.description)
            edit({ type: "updateSection", s, patch: { description: "" } });
          toggle(setDescribing, section._key);
        },
      },
      section.type !== "heading" && {
        label: "Add from catalogue",
        icon: Library,
        onClick: () => onOpenCatalogue(s),
      },
      section.type !== "heading" && {
        label: "Duplicate section",
        icon: Copy,
        onClick: () => edit({ type: "duplicateSection", s }),
      },
      {
        label: "Insert heading above",
        icon: Heading,
        onClick: () => edit({ type: "addSection", kind: "heading", at: s }),
      },
      "divider",
      {
        label: "Move up",
        icon: ArrowUp,
        disabled: s === 0,
        onClick: () => edit({ type: "moveSection", s, dir: -1 }),
      },
      {
        label: "Move down",
        icon: ArrowDown,
        disabled: s === sections.length - 1,
        onClick: () => edit({ type: "moveSection", s, dir: 1 }),
      },
      "divider",
      {
        label: section.type === "heading" ? "Delete heading" : "Delete section",
        icon: Trash2,
        danger: true,
        onClick: () => {
          const count = section.items?.length || 0;
          if (
            count > 1 &&
            !window.confirm(
              `Delete “${section.categoryName}” and its ${count} rows? You can undo this.`,
            )
          )
            return;
          edit({ type: "deleteSection", s });
        },
      },
    ].filter(Boolean);

  const seamlessInput =
    "min-w-0 !rounded-none border-0 bg-transparent px-1 py-0.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#4D5B4B]";

  return (
    <div className="overflow-x-auto">
      <div
        ref={gridRef}
        role="grid"
        tabIndex={0}
        aria-label="Quote line items"
        onKeyDown={onKeyDown}
        onCopy={onCopy}
        onPaste={onPaste}
        className="outline-none"
        style={{ minWidth }}
      >
        {/* Column headers */}
        <div
          role="row"
          className="sticky top-0 z-[2] grid border-b border-[#D8D2C6] bg-[#F4F1EA] text-[10px] font-bold uppercase tracking-[0.08em] text-[#7A807B]"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          <div className="px-2 py-2 text-center">#</div>
          {cols.map((c) => (
            <div
              key={c}
              role="columnheader"
              className={cx(
                "px-2 py-2",
                COLUMNS[c].numeric && "text-right",
                COLUMNS[c].internal && "text-[#A65B43]",
              )}
            >
              {COLUMNS[c].label}
            </div>
          ))}
          <div />
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          {sections.map((section, s) =>
            section.type === "heading" ? (
              <div
                key={section._key}
                className="flex items-start gap-3 border-b border-[#EDE9E0] bg-[#FBFAF7] px-3 py-3"
              >
                <div className="mt-1 h-10 w-[3px] shrink-0 bg-[#A65B43]" />
                <div className="min-w-0 flex-1">
                  <input
                    value={section.headingText || ""}
                    onChange={(e) =>
                      edit({
                        type: "updateSection",
                        s,
                        patch: { headingText: e.target.value },
                      })
                    }
                    placeholder="Heading"
                    aria-label="Heading text"
                    className={cx(seamlessInput, "w-full text-base font-bold")}
                  />
                  <textarea
                    rows={1}
                    value={section.headingDescription || ""}
                    onChange={(e) =>
                      edit({
                        type: "updateSection",
                        s,
                        patch: { headingDescription: e.target.value },
                      })
                    }
                    placeholder="Optional description shown to the client"
                    aria-label="Heading description"
                    className={cx(
                      seamlessInput,
                      "mt-0.5 w-full resize-y text-sm text-[#4A524D]",
                    )}
                  />
                </div>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#A65B43]">
                  Heading
                </span>
                <Menu label="Heading actions" items={sectionMenu(section, s)} />
              </div>
            ) : (
              <Fragment key={section._key}>
                <div className="flex items-center gap-2 border-b border-[#3E4A3C] bg-[#4D5B4B] px-2 py-1.5 text-white">
                  <button
                    type="button"
                    onClick={() => toggle(setCollapsed, section._key)}
                    className="inline-flex h-7 w-7 items-center justify-center hover:bg-white/10"
                    aria-label={
                      collapsed.has(section._key)
                        ? "Expand section"
                        : "Collapse section"
                    }
                  >
                    {collapsed.has(section._key) ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  <input
                    value={section.categoryName || ""}
                    onChange={(e) =>
                      edit({
                        type: "updateSection",
                        s,
                        patch: { categoryName: e.target.value },
                      })
                    }
                    placeholder="Section name"
                    aria-label="Section name"
                    className={cx(
                      seamlessInput,
                      "flex-1 font-semibold text-white placeholder:text-white/60 focus:text-[#202925]",
                    )}
                  />
                  <span className="text-xs text-white/70">
                    {section.items.length}{" "}
                    {section.items.length === 1 ? "row" : "rows"}
                  </span>
                  <span className="min-w-[96px] text-right font-bold tabular-nums">
                    {formatCurrency(
                      quoteCategoryTotal({
                        items: section.items.map((it) => ({
                          total: lineTotal(it),
                        })),
                      }),
                    )}
                  </span>
                  <Menu
                    label="Section actions"
                    items={sectionMenu(section, s)}
                    trigger={({ toggle: open }) => (
                      <button
                        type="button"
                        onClick={open}
                        aria-label="Section actions"
                        className="inline-flex h-7 w-7 items-center justify-center text-white/80 hover:bg-white/10"
                      >
                        •••
                      </button>
                    )}
                  />
                </div>

                {(section.description || describing.has(section._key)) && (
                  <div className="border-b border-[#EDE9E0] bg-[#FBFAF7] px-3 py-2">
                    <textarea
                      rows={2}
                      value={section.description || ""}
                      onChange={(e) =>
                        edit({
                          type: "updateSection",
                          s,
                          patch: { description: e.target.value },
                        })
                      }
                      placeholder="Description shown to the client under this section"
                      aria-label="Section description"
                      className={cx(
                        seamlessInput,
                        "w-full resize-y text-sm text-[#4A524D]",
                      )}
                    />
                  </div>
                )}

                {!collapsed.has(section._key) && (
                  <Droppable droppableId={section._key}>
                    {(dropProvided, dropSnapshot) => (
                      <div
                        ref={dropProvided.innerRef}
                        {...dropProvided.droppableProps}
                        className={cx(
                          dropSnapshot.isDraggingOver && "bg-[#F4F1EA]",
                        )}
                      >
                        {section.items.map((item, i) => (
                          <Draggable
                            key={item._key}
                            draggableId={item._key}
                            index={i}
                          >
                            {(provided, snapshot) =>
                              renderRow(section, s, item, i, provided, snapshot)
                            }
                          </Draggable>
                        ))}
                        {dropProvided.placeholder}
                        <div className="flex items-center gap-1 border-b border-[#EDE9E0] px-2 py-1.5">
                          <button
                            type="button"
                            onClick={() => insertRow(s, section.items.length)}
                            className="inline-flex h-7 items-center gap-1 px-2 text-xs font-medium text-[#4D5B4B] hover:bg-[#F4F1EA]"
                          >
                            <Plus className="h-3.5 w-3.5" /> Row
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenCatalogue(s)}
                            className="inline-flex h-7 items-center gap-1 px-2 text-xs font-medium text-[#4D5B4B] hover:bg-[#F4F1EA]"
                          >
                            <Library className="h-3.5 w-3.5" /> From catalogue
                          </button>
                          {section.items.length === 0 && (
                            <span className="ml-2 text-xs text-[#A3A8A4]">
                              Empty section — add a row or paste from Excel
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </Droppable>
                )}
              </Fragment>
            ),
          )}
        </DragDropContext>

        {sections.length === 0 && (
          <div className="px-4 py-10 text-center text-sm text-[#7A807B]">
            No sections yet. Add one below, or start from a template.
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-[#EDE9E0] bg-[#FBFAF7] px-3 py-2.5">
        <button
          type="button"
          onClick={() =>
            edit({ type: "addSection", kind: "category", name: "New section" })
          }
          className="inline-flex h-8 items-center gap-1.5 border border-[#D8D2C6] bg-white px-3 text-sm font-medium hover:bg-[#F4F1EA]"
        >
          <Plus className="h-4 w-4" /> Section
        </button>
        <button
          type="button"
          onClick={() => edit({ type: "addSection", kind: "heading" })}
          className="inline-flex h-8 items-center gap-1.5 border border-[#D8D2C6] bg-white px-3 text-sm font-medium hover:bg-[#F4F1EA]"
        >
          <Heading className="h-4 w-4" /> Heading
        </button>
        <button
          type="button"
          onClick={() => onOpenCatalogue(null, "templates")}
          className="inline-flex h-8 items-center gap-1.5 border border-[#D8D2C6] bg-white px-3 text-sm font-medium hover:bg-[#F4F1EA]"
        >
          <Library className="h-4 w-4" /> Insert template
        </button>
        <span className="ml-auto hidden items-center gap-1 text-xs text-[#7A807B] md:flex">
          <CornerDownLeft className="h-3.5 w-3.5" /> Type to edit · Enter on the
          last row adds one · paste straight from Excel
        </span>
      </div>
    </div>
  );
}
