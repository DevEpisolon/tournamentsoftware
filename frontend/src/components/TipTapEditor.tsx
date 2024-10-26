// TipTapEditor.tsx
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Heading from '@tiptap/extension-heading'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import React, { useCallback, useState } from 'react'
import {
  LuBold,
  LuFileEdit,
  LuEye,
  LuItalic,
  LuList,
  LuListOrdered,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuUndo,
  LuRedo,
  LuTable,
  LuX
} from 'react-icons/lu'

// Define interface for MenuBar props
interface MenuBarProps {
  editor: Editor | null;
  isPreview: boolean;
  togglePreview: () => void;
}

interface TableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTable: (rows: number, cols: number) => void;
};

const TableDialog = ({ isOpen, onClose, onCreateTable }: TableDialogProps) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTable(rows, cols);
    onClose();
    setRows(3);
    setCols(3);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 min-w-[300px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Insert Table</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <LuX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Rows:
              <input
                type="number"
                min="1"
                max="10"
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Columns:
              <input
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Create Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MenuBar = React.memo(({ editor, isPreview, togglePreview }: MenuBarProps) => {
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);

  if (!editor) {
    return null;
  };

  const insertTable = (rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
  };

  return (
    <div className="border-b border-gray-200 bg-gray-50 rounded-lg p-2 flex gap-1 flex-wrap">
      <button
        onClick={togglePreview}
        className="mr-4 shadow sm rounded-md "
      >
        {isPreview ? (
          <><LuFileEdit className="w-4 h-4 my-2 mx-1" /></>
        ) : (
          <><LuEye className="w-4 h-4 mx-1" /></>
        )}
      </button>

      {!isPreview && (
        <div className='flex'>
          {/* Heading Dropdown */}
          <select
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                editor.chain().focus().setParagraph().run();
              } else {
                const level = parseInt(value) as HeadingLevel;
                editor.chain().focus().toggleHeading({ level }).run();
              }
            }}
            value={
              [1, 2, 3, 4, 5, 6].find(level => editor.isActive('heading', { level })) ||
              (editor.isActive('paragraph') ? '' : undefined)
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
          <button
            onClick={() => setIsTableDialogOpen(true)}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('table') ? 'bg-gray-200' : ''
              }`}
            title="Insert Table"
          >
            <LuTable size={16} />
          </button>

          <div className="h-6 w-px bg-gray-300 mx-1" />
          <TableDialog
            isOpen={isTableDialogOpen}
            onClose={() => setIsTableDialogOpen(false)}
            onCreateTable={insertTable}
          />
        </div>
      )}
    </div>
  )
});

// Add type for, Editor heading levels
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

// Custom heading using Tailwindcss
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
  const [isPreview, setIsPreview] = useState<boolean>(false);


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
      Table.configure({
        resizable: true,
        handleWidth: 5,
        cellMinWidth: 100,
        lastColumnResizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full relative',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border group',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border bg-gray-100 p-2 font-bold relative',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border p-2 relative',
        },
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
    editable: true,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  })

  // Toggle between edit and preview. Re-renders only for editor changes
  const togglePreview = useCallback(() => {
    setIsPreview(prev => {
      if (editor) {
        editor.setEditable(prev);
      }
      return !prev;
    });
  }, [editor]);

  // Retrieve editor content or nothing if null
  const getContent = React.useCallback(() => {
    return editor?.getHTML() ?? '<p></p>';
  }, [editor]);

  return (
    <div className="border rounded-lg shadow-sm bg-white text-black">
      <MenuBar editor={editor} isPreview={isPreview} togglePreview={togglePreview} />
      <div className="p-4 overflow-auto h-96">
        {isPreview ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: getContent() }}
          >
          </div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  )
}

export default TipTapEditor
