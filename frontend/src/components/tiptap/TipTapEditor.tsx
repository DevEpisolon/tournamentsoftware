import React, { useState } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Heading from '@tiptap/extension-heading'

const TipTapEditor = () => {
  const { status } = useTournamentPage();
  const [isPreview, setIsPreview] = useState<boolean>(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc ml-4'
        }
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal ml-4'
        }
      }),
      TextAlign.configure({
        types: ['paragraph', 'heading']
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
        HTMLAttributes: {
          class: 'font-bold'
        }
      }),
      ListItem,
    ],
    content: '',
  });

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  return (
    <div className="tip-tap-editor">
      <MenuBar editor={editor} isPreview={isPreview} togglePreview={togglePreview} />
      {isPreview ? (
        <div className="editor-preview">
          <div dangerouslySetInnerHTML={{ __html: sanitizeContent(editor?.getHTML() || '') }} />
        </div>
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
};

export default TipTapEditor;

