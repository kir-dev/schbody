'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z
  .object({
    nickname: z.string({
      required_error: 'Ez a mező kötelező',
      invalid_type_error: 'String, tesó!',
    }),
    contact_email: z.string().email(),
    is_sch_resident: z.boolean().optional(),
    room_number: z
      .union([
        z.literal(0 && NaN),
        z
          .number()
          .int()
          .gte(201, { message: 'Ilyen szoba nem létezik' })
          .lte(1816, { message: 'Ilyen szoba nem létezik' }),
      ])
      .optional()
      .nullable()
      .refine(
        (data) => {
          if (!data) return true;
          const lastTwoDigits = data! % 100;
          return lastTwoDigits >= 1 && lastTwoDigits <= 16;
        },
        { message: 'Cseles, de ilyen szoba nem létezik' }
      ),
    terms: z.boolean().refine((data) => data, { message: 'A szabályzatot el kell fogadnod' }),
  })
  .refine(
    (data) => {
      if (data.is_sch_resident) {
        return data.room_number !== 0 && data.room_number !== undefined;
      }
      return true;
    },
    {
      path: ['room_number'],
      message: 'A szoba szám megadása kötelező, ha kolis vagy.',
    }
  );
export default function ProfileForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: 'Bujdi Bohoc',
      contact_email: 'email@gmail.com',
      is_sch_resident: false,
      room_number: 0,
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      //await response.json();
      if (response.ok) {
        toast({
          title: 'Sikeres módosítás!',
        });
        router.push('/');
      } else {
        toast({
          title: 'Hiba történt!',
          description: 'Valami nem stimmel a szerverrel, próbáld újra később!',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 pb-16 md:mx-32 max-md:mx-8'>
        <Card className='m-8 my-4 flex'>
          <div className='min-w-1/4 max-w-1/2 h-full aspect-square relative'>
            <Image
              src='https://mozsarmate.me/marci.jpg'
              placeholder='blur'
              blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII='
              alt='PROFIL KEP'
              fill
              className='h-full aspect-square rounded-l-xl'
            />
            <Button className='z-10 absolute bottom-2 self-center' src='/set'>
              Valami
            </Button>
          </div>
          <div className=''>
            <CardHeader>
              <CardTitle>Személyes adatok</CardTitle>
              <CardDescription>Ellenőrízd személyes adataid, szükség esetén módosíts rajtuk!</CardDescription>
            </CardHeader>
            <CardContent className='w-full md:grid-cols-2 md:grid gap-4 '>
              <FormItem>
                <FormLabel>Név</FormLabel>
                <Input disabled value='Minta Pista' />
              </FormItem>
              <FormItem>
                <FormLabel>Neptun</FormLabel>
                <Input disabled value='NEPTUN' />
              </FormItem>
              <FormField
                control={form.control}
                name='nickname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Becenév</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='contact_email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kapcsolattartási email cím</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </div>
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
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(data) => {
                        field.onChange(data);
                        form.resetField('room_number');
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='room_number'
              render={({ field }) => (
                <FormItem
                  className={`flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm ${form.watch('is_sch_resident') ? 'opacity-100' : 'opacity-0'}`}
                >
                  <div className='space-y-0.5'>
                    <FormLabel>Szoba szám</FormLabel>
                    <FormDescription>Ezt a szobád ajtaján tudod megnézni xd</FormDescription>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <InputOTP
                      maxLength={form.watch('room_number')?.toString().startsWith('1') ? 4 : 3}
                      disabled={!form.watch('is_sch_resident')}
                      value={field.value ? `${field.value}` : ''}
                      onChange={(value: string) => {
                        let numericValue = parseInt(value, 10);
                        if (isNaN(numericValue)) {
                          numericValue = 0;
                        }
                        field.onChange(numericValue);
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        {form.watch('room_number')?.toString().startsWith('1') && <InputOTPSlot index={3} />}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
