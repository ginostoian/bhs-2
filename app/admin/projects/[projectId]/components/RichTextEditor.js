"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./NotesTab.module.css";

/**
 * Rich Text Editor Component
 * Provides basic text formatting capabilities without external dependencies
 */
export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter your note content...",
}) {
  const editorRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isList, setIsList] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateToolbarState();
    handleContentChange();
  };

  const updateToolbarState = () => {
    if (editorRef.current) {
      setIsBold(document.queryCommandState("bold"));
      setIsItalic(document.queryCommandState("italic"));
      setIsUnderline(document.queryCommandState("underline"));
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text =
      e.clipboardData.getData("text/html") ||
      e.clipboardData.getData("text/plain");

    // Clean up pasted content to maintain formatting
    const cleanText = text.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      "",
    );

    document.execCommand("insertHTML", false, cleanText);
    handleContentChange();
  };

  const toggleList = () => {
    execCommand("insertUnorderedList");
    setIsList(!isList);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const clearFormatting = () => {
    execCommand("removeFormat");
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setIsList(false);
  };

  return (
    <div
      className={`${styles["rich-text-editor"]} overflow-hidden rounded-lg border border-gray-300`}
    >
      {/* Toolbar */}
      <div
        className={`${styles.toolbar} flex flex-wrap items-center gap-1 border-b border-gray-300 bg-gray-50 p-2`}
      >
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className={`${styles["toolbar-button"]} rounded p-2 transition-colors hover:bg-gray-200 ${isBold ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
          title="Bold"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => execCommand("italic")}
          className={`${styles["toolbar-button"]} rounded p-2 transition-colors hover:bg-gray-200 ${isItalic ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
          title="Italic"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10 4v12m4-12v12"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => execCommand("underline")}
          className={`${styles["toolbar-button"]} rounded p-2 transition-colors hover:bg-gray-200 ${isUnderline ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
          title="Underline"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3M4 21h16"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
            />
          </svg>
        </button>

        <div
          className={`${styles["toolbar-divider"]} mx-1 h-6 w-px bg-gray-300`}
        ></div>

        <button
          type="button"
          onClick={toggleList}
          className={`${styles["toolbar-button"]} rounded p-2 transition-colors hover:bg-gray-200 ${isList ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
          title="Bullet List"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={insertLink}
          className={`${styles["toolbar-button"]} rounded p-2 text-gray-700 transition-colors hover:bg-gray-200`}
          title="Insert Link"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div
          className={`${styles["toolbar-divider"]} mx-1 h-6 w-px bg-gray-300`}
        ></div>

        <button
          type="button"
          onClick={clearFormatting}
          className={`${styles["toolbar-button"]} rounded p-2 text-gray-700 transition-colors hover:bg-gray-200`}
          title="Clear Formatting"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onPaste={handlePaste}
        onKeyUp={updateToolbarState}
        onMouseUp={updateToolbarState}
        className={`${styles["editor-area"]} min-h-[200px] p-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500`}
        style={{
          fontFamily: "inherit",
          fontSize: "14px",
          lineHeight: "1.6",
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  );
}
