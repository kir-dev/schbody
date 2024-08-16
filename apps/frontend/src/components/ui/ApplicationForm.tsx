'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  name: z.string(),
  neptun: z.string(),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 pb-16'>
        <Card className='m-8 my-4'>
          <CardHeader>
            <CardTitle>Személyes adatok</CardTitle>
            <CardDescription>Ellenőrízd személyes adataid, szükség esetén módosíts rajtuk!</CardDescription>
          </CardHeader>
          <CardContent className='md:grid-cols-2 md:grid gap-4'>
            <FormField
              control={form.control}
              name='name'
              render={(field: object) => (
                <FormItem>
                  <FormLabel>Név</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='neptun'
              render={(field: object) => (
                <FormItem>
                  <FormLabel>Neptun</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
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
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>Szoba szám</FormLabel>
                    <FormDescription>Ezt a szobád ajtaján tudod megnézni xd</FormDescription>
                  </div>
                  <FormControl>
                    <InputOTP maxLength={4} disabled={!form.watch('is_sch_resident')}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card className='m-8'>
          <CardHeader>
            <CardTitle>Kondi szabályzat</CardTitle>
            <CardDescription>Már csak egy dolog van hátra!</CardDescription>
          </CardHeader>
          <CardContent className='md:grid md:grid-cols-2'>
            <FormField
              control={form.control}
              name='terms'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Elfogadom a konditerem használati szabályzatát</FormLabel>
                    <FormDescription>
                      <Link href='/rules'>A szabályzatot ide kattintva tudod elolvasni</Link>
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button className='float-right w-60 h-16 m-8'>Jelentkezés leadása</Button>
      </form>
    </Form>
  );
}
