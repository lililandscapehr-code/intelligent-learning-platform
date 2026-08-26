"use client";

import { useCallback, useRef, useState } from "react";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Eye,
  EyeOff,
} from "lucide-react";

// ── Markdown renderer ──────────────────────────────────────────
export function renderMarkdown(text: string): string {
  if (!text) return "";
  return (
    text
      // Headings
      .replace(/^### (.+)$/gm, '<h5 class="text-white font-bold text-sm mt-3 mb-1">$1</h5>')
      .replace(/^## (.+)$/gm, '<h4 class="text-white font-bold text-base mt-4 mb-1">$1</h4>')
      .replace(/^# (.+)$/gm, '<h3 class="text-white font-bold text-lg mt-4 mb-1">$1</h3>')
      // Bold + italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Code
      .replace(/`(.+?)`/g, '<code class="bg-neutral-800 text-amber-300 px-1 rounded font-mono text-xs">$1</code>')
      // LaTeX block $$...$$
      .replace(/\$\$([\s\S]+?)\$\$/g, '<span class="font-mono text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded text-sm">$1</span>')
      // LaTeX inline $...$
      .replace(/\$(.+?)\$/g, '<span class="font-mono text-amber-200 text-sm">$1</span>')
      // Bullet list items
      .replace(/^[-•] (.+)$/gm, '<li class="ml-5 list-disc text-neutral-200 mb-0.5">$1</li>')
      // Numbered list items
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal text-neutral-200 mb-0.5">$1</li>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="border-neutral-700 my-3" />')
      // Paragraph breaks
      .replace(/\n\n/g, '</p><p class="mb-2 text-neutral-200 leading-relaxed">')
      // Line breaks
      .replace(/\n/g, '<br />')
  );
}

// ── Toolbar button helper ─────────────────────────────────────
interface ToolbarButtonProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}
function ToolbarButton({ onClick, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
    >
      {children}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  accentColor?: "amber" | "sky" | "violet" | "emerald";
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write content here...",
  rows = 10,
  label,
  accentColor = "amber",
}: RichTextEditorProps) {
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const accentBorderFocus: Record<string, string> = {
    amber:   "focus:border-amber-500",
    sky:     "focus:border-sky-500",
    violet:  "focus:border-violet-500",
    emerald: "focus:border-emerald-500",
  };

  /** Wrap the current selection or insert at cursor */
  const wrapSelection = useCallback(
    (before: string, after: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.slice(start, end) || "text";
      const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
      onChange(newValue);
      // Restore selection after React re-render
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
      }, 0);
    },
    [value, onChange]
  );

  /** Insert at cursor or start of line */
  const insertAtLineStart = useCallback(
    (prefix: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const newValue = value.slice(0, lineStart) + prefix + value.slice(lineStart);
      onChange(newValue);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length);
      }, 0);
    },
    [value, onChange]
  );

  const insertAtCursor = useCallback(
    (text: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const newValue = value.slice(0, start) + text + value.slice(start);
      onChange(newValue);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    },
    [value, onChange]
  );

  return (
    <div className="space-y-1">
      {label && (
        <p className="text-xs font-semibold text-neutral-400">{label}</p>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 rounded-t-lg border border-b-0 border-neutral-700 bg-neutral-900 px-2 py-1">
        <ToolbarButton title="Bold (**text**)" onClick={() => wrapSelection("**", "**")}>
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Italic (*text*)" onClick={() => wrapSelection("*", "*")}>
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="mx-1 h-4 w-px bg-neutral-700" />
        <ToolbarButton title="Heading 1 (# text)" onClick={() => insertAtLineStart("# ")}>
          <Heading1 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Heading 2 (## text)" onClick={() => insertAtLineStart("## ")}>
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="mx-1 h-4 w-px bg-neutral-700" />
        <ToolbarButton title="Bullet list (- item)" onClick={() => insertAtLineStart("- ")}>
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Numbered list (1. item)" onClick={() => insertAtLineStart("1. ")}>
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="mx-1 h-4 w-px bg-neutral-700" />
        <ToolbarButton title="Inline code (`code`)" onClick={() => wrapSelection("`", "`")}>
          <Code className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Inline LaTeX ($formula$)" onClick={() => insertAtCursor("$formula$")}>
          <span className="font-mono text-xs leading-none">∑</span>
        </ToolbarButton>
        <ToolbarButton title="Display LaTeX ($$formula$$)" onClick={() => insertAtCursor("\n$$formula$$\n")}>
          <span className="font-mono text-xs leading-none">∫</span>
        </ToolbarButton>

        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setPreview((v) => !v)}
            title={preview ? "Back to editor" : "Preview rendered markdown"}
            className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            {preview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {preview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {/* Editor or Preview */}
      {preview ? (
        <div
          className="min-h-[120px] rounded-b-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm leading-relaxed text-neutral-200"
          dangerouslySetInnerHTML={{
            __html: `<p class="mb-2 text-neutral-200 leading-relaxed">${renderMarkdown(value)}</p>`,
          }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={`w-full rounded-b-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-600 font-mono leading-relaxed ${accentBorderFocus[accentColor]}`}
        />
      )}

      <p className="text-[10px] text-neutral-600">
        Supports **bold**, *italic*, `code`, # headings, - bullets, $LaTeX$
      </p>
    </div>
  );
}
