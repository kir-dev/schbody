'use client';
import { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import { GoLink } from 'react-icons/go';
import { LuBold, LuHeading1, LuItalic, LuList } from 'react-icons/lu';

import { Card } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';

type Props = {
  editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
  if (!editor) return null;
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;

    const url = window.prompt('URL', previousUrl);
    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <Card className='p-1 flex gap-1'>
      <Toggle
        pressed={editor.isActive('heading', { level: 1 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <LuHeading1 />
      </Toggle>
      <Toggle pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
        <LuBold />
      </Toggle>
      <Toggle pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
        <LuItalic />
      </Toggle>
      <Toggle
        pressed={editor.isActive('link')}
        onPressedChange={() => {
          if (editor?.isActive('link')) {
            editor.chain().focus().unsetLink().run();
          } else {
            setLink();
          }
        }}
      >
        <GoLink />
      </Toggle>
      <Toggle
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <LuList />
      </Toggle>
    </Card>
  );
}
