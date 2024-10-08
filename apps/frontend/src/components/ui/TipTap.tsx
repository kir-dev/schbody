import { Bold } from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import { Heading } from '@tiptap/extension-heading';
import { Italic } from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';

import { Toolbar } from '@/components/ui/Toolbar';

export default function TipTap({ content, onChange }: { content: string; onChange: (content: string) => void }) {
  const editor = useEditor({
    extensions: [
      Heading.configure({ HTMLAttributes: { class: 'text-2xl' } }),
      Text,
      Paragraph,
      Bold,
      Italic,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: { class: 'text-red underline' },
      }),
      BulletList.configure({ HTMLAttributes: { class: 'list-disc ml-4' } }),
      ListItem,
      Document,
    ],
    immediatelyRender: false,
    content: content,
    editorProps: {
      attributes: {
        class: 'rounded border border-input bg-back focus:outline h-20 p-2 min-h-40 h-auto max-h-72 overflow-scroll',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div>
      <Toolbar editor={editor!} />
      <EditorContent editor={editor!} />
    </div>
  );
}
