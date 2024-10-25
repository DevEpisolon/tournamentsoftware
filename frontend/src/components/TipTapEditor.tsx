// TipTapEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Heading from '@tiptap/extension-heading'
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
  LuRedo,
  LuText
} from 'react-icons/lu'

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50 rounded-lg p-2 flex gap-1 flex-wrap">
      {/* Heading Dropdown */}
      <select
        onChange={(e) => {
          const level = parseInt(e.target.value);
          editor.chain().focus().toggleHeading({ level }).run();
        }}
        value={
          [1, 2, 3, 4, 5, 6].find(level => editor.isActive('heading', { level })) || ''
        }
        className="p-1 rounded border border-gray-300 hover:bg-gray-50"
      >
        <option value="">Normal</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
        <option value="5">Heading 5</option>
        <option value="6">Heading 6</option>
      </select>

      <div className="h-6 w-px bg-gray-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('paragraph') ? 'bg-gray-200' : ''
          }`}
      >
        <LuText />
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

// Add type for heading levels
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const CustomHeading = Heading.configure({
  levels: [1, 2, 3, 4, 5, 6],
  HTMLAttributes: {
    class: 'font-bold', // Base class for all headings
    // Individual level classes will be added in the renderHTML function
  },
}).extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level as HeadingLevel;
    const classes = {
      1: 'text-4xl mb-4', // Heading 1
      2: 'text-3xl mb-3', // Heading 2
      3: 'text-2xl mb-2', // Heading 3
      4: 'text-xl mb-2',  // Heading 4
      5: 'text-lg mb-1',  // Heading 5
      6: 'text-base mb-1' // Heading 6
    };

    // Combine base classes with level-specific classes
    if (level in classes) {
      HTMLAttributes.class = `${HTMLAttributes.class || ''} ${classes[level]}`;
    }

    const hasLevel = this.options.levels.includes(level);
    const tag = `h${hasLevel ? level : this.options.levels[0]}`;

    return [tag, HTMLAttributes, 0];
  }
});

const TipTapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        heading: {
          levels: [1, 2, 3]
        }
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc ml-4'
        }
      }),
      CustomHeading,
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal ml-4'
        }
      }),
      ListItem,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: `
        <p>
          I like lists. Let’s add one:
        </p>
        <ul>
          <li>This is a bullet list.</li>
          <li>And it has three list items.</li>
          <li>Here is the third one.</li>
        </ul>
        <p>
          Do you want to see one more? I bet! Here is another one:
        </p>
        <ol>
          <li>That’s a different list, actually it’s an ordered list.</li>
          <li>It also has three list items.</li>
          <li>And all of them are numbered.</li>
        </ol>
        <p>
          Lists would be nothing without list items.
        </p>
      `,
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
