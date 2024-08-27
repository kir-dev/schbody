import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiCheck, FiX } from 'react-icons/fi';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PostEntity } from '@/types/post-entity';

const formSchema = z.object({
  title: z.string().min(1, 'A címnek legalább 1 karakter hosszúnak kell lennie'),
  content: z
    .string()
    .min(10, 'A tartalomnak legalább 10 karakter hosszúnak kell lennie')
    .max(5000, 'A tartalom nem lehet hosszabb, mint 5000 karakter'),
});

export default function PostCreateOrEditDialog({
  p,
  closeDialog,
  onSave,
}: {
  p: PostEntity | null | undefined;
  closeDialog: () => void;
  onSave: (id: number | undefined, title: string, content: string) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });
  const { reset } = form;
  useEffect(() => {
    if (p !== undefined) {
      reset({
        title: p?.title ?? '',
        content: p?.content ?? '',
      });
    }
  }, [p, reset]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(p?.id, values.title, values.content);
    closeDialog();
  }

  return (
    <Dialog open={p !== null} onOpenChange={closeDialog}>
      <DialogContent className='sm:max-w-[425px] md:min-w-[800px]'>
        <DialogHeader>
          <DialogTitle> Hír szerkesztése</DialogTitle>
          <DialogDescription>Minden változtatást az eredeti szerző nevében végzel</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cím</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tartalom</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit'>
                <FiCheck /> Közzététel
              </Button>
              <Button variant='secondary' onClick={closeDialog}>
                <FiX />
                Mégse
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
