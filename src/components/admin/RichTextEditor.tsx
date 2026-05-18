"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-[250px] w-full animate-pulse bg-muted rounded-md border border-input"></div>
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  // Memoize modules to prevent re-rendering issues
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'clean']
    ],
  }), []);

  return (
    <div className={`rich-text-container ${className || ''}`}>
      <ReactQuill 
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
      <style jsx global>{`
        .rich-text-container .quill {
          display: flex;
          flex-direction: column;
        }
        .rich-text-container .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          border-color: hsl(var(--input)) !important;
          background-color: hsl(var(--muted) / 0.3);
          font-family: inherit;
        }
        .rich-text-container .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          border-color: hsl(var(--input)) !important;
          min-height: 250px;
          font-family: inherit;
          font-size: 1rem;
          background-color: transparent;
        }
        .rich-text-container .ql-editor {
          min-height: 250px;
        }
        .rich-text-container .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
        }
        /* Fix colors for editor */
        .rich-text-container .ql-editor {
          color: var(--foreground);
        }
        .rich-text-container .ql-picker {
          color: var(--foreground);
        }
        .rich-text-container .ql-stroke {
          stroke: var(--foreground);
        }
        .rich-text-container .ql-fill {
          fill: var(--foreground);
        }
        .rich-text-container .ql-picker-options {
          background-color: var(--background);
          border-color: var(--border);
        }
        /* Active states */
        .rich-text-container .ql-active .ql-stroke {
          stroke: var(--primary) !important;
        }
        .rich-text-container .ql-active .ql-fill {
          fill: var(--primary) !important;
        }
        .rich-text-container .ql-active .ql-picker {
          color: var(--primary) !important;
        }
        .rich-text-container .ql-active .ql-picker-label {
          color: var(--primary) !important;
        }
      `}</style>
    </div>
  );
}
