'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  name: z.string(),
  nickname: z.string({ message: 'Nem lehet üres' }),
  contact_email: z.string().email({ message: 'Nem érvényes email cím' }),
  is_sch_resident: z.boolean(),
  room_number: z.number().int().gte(201).lte(1816).optional(),
  terms: z.boolean(),
});
export default function ApplicationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const a = values;
    values = a;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Card className='m-8'>
          <CardHeader>
            <CardTitle>Személyes adatok</CardTitle>
            <CardDescription>Ellenőrízd személyes adataid, szükség esetén módosíts rajtuk!</CardDescription>
          </CardHeader>
          <CardContent className='md:grid-cols-3 md:grid gap-4'>
            <FormField
              control={form.control}
              name='name'
              render={(field: object) => (
                <FormItem>
                  <FormLabel>Név</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormDescription>PéK-ből átvett adat</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='nickname'
              render={(field: object) => (
                <FormItem>
                  <FormLabel>Becenév</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='contact_email'
              render={(field: object) => (
                <FormItem>
                  <FormLabel>Kapcsolattartási email cím</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className='m-8'>
          <CardHeader>
            <CardTitle>Kollégiumi bentlakás</CardTitle>
            <CardDescription>Ellenőrízd régebben megadott viszonyod, szükség esetén módosíts rajta!</CardDescription>
          </CardHeader>
          <CardContent className='md:grid-cols-2 md:grid gap-4'>
            <FormField
              control={form.control}
              name='is_sch_resident'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>A Schönherz Kollégiumban laksz?</FormLabel>
                    <FormDescription>Ha igen, kérlek add meg a szobaszámod is</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='room_number'
              render={(field: object) => (
                <FormItem>
                  <FormLabel>Szoba szám</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>A szoba számát a szobád ajtaján találod xd</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
