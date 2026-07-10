"use client";

import { useRef, useState } from "react";
import useSWR from "swr";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import {
  Bold,
  CheckSquare,
  Edit3,
  Heading2,
  Italic,
  Link,
  List,
  Paperclip,
  Pin,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";
import FileUpload from "@/components/FileUpload";

const tools = [
  { label: "Bold", Icon: Bold, before: "**", after: "**" },
  { label: "Italic", Icon: Italic, before: "_", after: "_" },
  { label: "Heading", Icon: Heading2, before: "## ", after: "" },
  { label: "List", Icon: List, before: "- ", after: "" },
  { label: "Checklist", Icon: CheckSquare, before: "- [ ] ", after: "" },
  { label: "Link", Icon: Link, before: "[", after: "](https://)" },
];

const markdownPlugins = [remarkGfm, remarkBreaks];
const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="mb-2 mt-4 text-xl font-bold text-slate-950 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-4 text-lg font-bold text-slate-950 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-3 text-base font-semibold text-slate-900 first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-950">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del className="text-slate-500">{children}</del>,
  ul: ({ children, className }) => (
    <ul
      className={`mb-3 space-y-1 last:mb-0 ${className?.includes("contains-task-list") ? "list-none pl-0" : "list-disc pl-5"}`}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children, className }) => (
    <li
      className={
        className?.includes("task-list-item") ? "flex items-start" : "pl-0.5"
      }
    >
      {children}
    </li>
  ),
  input: ({ checked, type }) => (
    <input
      type={type}
      checked={checked}
      readOnly
      disabled
      className="mr-2 rounded border-slate-300 text-blue-600"
    />
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-4 border-slate-300 pl-3 italic text-slate-600">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-blue-700 underline decoration-blue-200 underline-offset-2 hover:decoration-blue-500"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.9em] text-slate-800">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <table className="my-3 w-full border-collapse text-left text-xs">
      {children}
    </table>
  ),
  th: ({ children }) => (
    <th className="border border-slate-200 bg-slate-100 px-2 py-1.5 font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-slate-200 px-2 py-1.5">{children}</td>
  ),
  hr: () => <hr className="my-4 border-slate-200" />,
};

function NoteMarkdown({ children }) {
  const markdown = String(children || "")
    .replace(/\*\*[ \t]+([^*\n]+?)[ \t]+\*\*/g, "**$1**")
    .replace(/__[ \t]+([^_\n]+?)[ \t]+__/g, "__$1__")
    .replace(/_[ \t]+([^_\n]+?)[ \t]+_/g, "_$1_");
  return (
    <div className="mt-2 break-words text-sm leading-6 text-slate-700">
      <ReactMarkdown
        remarkPlugins={markdownPlugins}
        components={markdownComponents}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

export default function NotesTab({ leadId }) {
  const { data, mutate, isLoading } = useSWR(
    `/crm/leads/${leadId}/notes`,
    (url) => apiClient.get(url),
    { revalidateOnFocus: false },
  );
  const { data: users } = useSWR(
    "/admin/check-users",
    (url) => apiClient.get(url),
    { revalidateOnFocus: false },
  );
  const [draft, setDraft] = useState({
    title: "Note",
    body: "",
    tags: "",
    pinned: false,
    attachments: [],
  });
  const [editing, setEditing] = useState(null);
  const textarea = useRef(null);
  const format = (before, after) => {
    const element = textarea.current;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const selected = draft.body.slice(start, end);
    const selectedWithFormatting =
      after && selected.trim()
        ? `${selected.match(/^\s*/)?.[0] || ""}${before}${selected.trim()}${after}${selected.match(/\s*$/)?.[0] || ""}`
        : `${before}${selected}${after}`;
    const body =
      draft.body.slice(0, start) +
      selectedWithFormatting +
      draft.body.slice(end);
    setDraft((current) => ({ ...current, body }));
    requestAnimationFrame(() => element.focus());
  };
  const save = async () => {
    if (!draft.body.trim()) return;
    const mentionedUsers = (users?.users || [])
      .filter((user) => {
        const name = user.name?.trim();
        return (
          name && draft.body.toLowerCase().includes(`@${name.toLowerCase()}`)
        );
      })
      .map((user) => user.id);
    const payload = {
      ...draft,
      tags: draft.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      mentionedUsers,
    };
    if (editing)
      await apiClient.put(`/crm/leads/${leadId}/notes/${editing}`, payload);
    else await apiClient.post(`/crm/leads/${leadId}/notes`, payload);
    setDraft({
      title: "Note",
      body: "",
      tags: "",
      pinned: false,
      attachments: [],
    });
    setEditing(null);
    await mutate();
    toast.success(editing ? "Note updated" : "Note added");
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    await apiClient.delete(`/crm/leads/${leadId}/notes/${id}`);
    await mutate();
  };

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap gap-1 border-b border-slate-200 pb-2">
          {tools.map(({ label, Icon, before, after }) => (
            <button
              key={label}
              type="button"
              title={label}
              onClick={() => format(before, after)}
              className="rounded p-2 text-slate-600 hover:bg-slate-100"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        <input
          value={draft.title}
          onChange={(event) =>
            setDraft((current) => ({ ...current, title: event.target.value }))
          }
          className="mt-3 w-full border-0 px-0 text-sm font-semibold focus:ring-0"
          placeholder="Note title"
        />
        <textarea
          ref={textarea}
          value={draft.body}
          onChange={(event) =>
            setDraft((current) => ({ ...current, body: event.target.value }))
          }
          rows={6}
          className="mt-1 w-full resize-y rounded-lg border-slate-200 text-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Add context, decisions, objections or site-visit notes… Use @name to flag a teammate."
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={draft.tags}
            onChange={(event) =>
              setDraft((current) => ({ ...current, tags: event.target.value }))
            }
            className="rounded-lg border-slate-200 text-sm"
            placeholder="Tags: call, requirement, objection"
          />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={draft.pinned}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  pinned: event.target.checked,
                }))
              }
              className="rounded border-slate-300 text-blue-600"
            />
            <Pin className="h-4 w-4" />
            Pin
          </label>
        </div>
        <div className="mt-3 rounded-lg border border-dashed border-slate-200 p-2">
          <FileUpload
            folder={`crm-notes/${leadId}`}
            maxFiles={5}
            onUploadComplete={(files) =>
              setDraft((current) => ({
                ...current,
                attachments: [
                  ...current.attachments,
                  ...files.map((file) => ({
                    name: file.originalName,
                    url: file.url,
                    type: file.contentType,
                    size: file.size,
                  })),
                ],
              }))
            }
          />
        </div>
        <div className="mt-3 flex justify-end gap-2">
          {editing ? (
            <button
              onClick={() => {
                setEditing(null);
                setDraft({
                  title: "Note",
                  body: "",
                  tags: "",
                  pinned: false,
                  attachments: [],
                });
              }}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>
          ) : null}
          <button
            onClick={save}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {editing ? "Save note" : "Add note"}
          </button>
        </div>
      </section>
      <div className="space-y-3">
        {isLoading ? (
          <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
        ) : (
          (data?.notes || []).map((note) => (
            <article
              key={note.id || note._id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    {note.pinned ? (
                      <Pin className="h-3.5 w-3.5 text-blue-600" />
                    ) : null}
                    {note.title}
                  </h3>
                  <NoteMarkdown>{note.body}</NoteMarkdown>
                </div>
                <div className="flex">
                  <button
                    onClick={() => {
                      setEditing(note.id || note._id);
                      setDraft({
                        title: note.title,
                        body: note.body,
                        tags: (note.tags || []).join(", "),
                        pinned: note.pinned,
                        attachments: note.attachments || [],
                      });
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600"
                    aria-label="Edit note"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(note.id || note._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600"
                    aria-label="Delete note"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {note.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              {note.attachments?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {note.attachments.map((file) => (
                    <a
                      key={file.url}
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-700"
                    >
                      <Paperclip className="h-3 w-3" />
                      {file.name}
                    </a>
                  ))}
                </div>
              ) : null}
              <p className="mt-3 text-xs text-slate-400">
                {note.createdBy?.name || "Admin"} ·{" "}
                {new Date(note.createdAt).toLocaleString("en-GB")}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
