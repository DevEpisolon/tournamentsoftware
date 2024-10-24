// TipTapEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import {
  LuBold,
  LuItalic,
  LuList,
  LuListOrdered,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuHeading,
  LuUndo,
  LuRedo
} from 'react-icons/lu'

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-2 flex gap-1 flex-wrap">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
          }`}
      >
        <LuHeading size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''
          }`}
      >
        <LuBold size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''
          }`}
      >
        <LuItalic size={16} />
      </button>

      <div className="h-6 w-px bg-gray-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''
          }`}
      >
        <LuList size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''
          }`}
      >
        <LuListOrdered size={16} />
      </button>

      <div className="h-6 w-px bg-gray-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
          }`}
      >
        <LuAlignLeft size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
          }`}
      >
        <LuAlignCenter size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
          }`}
      >
        <LuAlignRight size={16} />
      </button>

      <div className="h-6 w-px bg-gray-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-200"
      >
        <LuUndo size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-200"
      >
        <LuRedo size={16} />
      </button>
    </div>
  )
}

const TipTapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
    ],
    content: '<p>Start typing here...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  })

  return (
    <div className="border rounded-lg shadow-sm bg-white text-black">
      <MenuBar editor={editor} />
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default TipTapEditor
