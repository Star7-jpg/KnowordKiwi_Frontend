"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";

interface TipTapProps {
  content: string;
  onChange: (richText: string) => void;
}

const Tiptap = ({ content, onChange }: TipTapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "ml-6 list-disc",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "ml-6 list-decimal",
          },
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "bg-bg-gray prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] border border-gray-700 rounded-md py-2 px-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
