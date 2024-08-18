'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit2, FiUser, FiUserCheck } from 'react-icons/fi';
import { z } from 'zod';

import { Th2, TTitle } from '@/components/typography/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import useProfile from '@/hooks/useProfile';

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
    can_help_noobs: z.boolean(),
    public_desc: z.string().optional(),
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
      nickname: 'aaa',
      contact_email: 'aaa',
      is_sch_resident: false,
      room_number: 0,
      can_help_noobs: false,
      public_desc: '',
    },
  });

  const { data: user, error, isLoading } = useProfile();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setEditingIsOn(false);
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

  const { reset } = form;
  useEffect(() => {
    if (user) {
      reset({
        nickname: user.nickName || '',
        contact_email: user.email || '',
        is_sch_resident: user.isSchResident || false,
        room_number: user.roomNumber || 0,
        can_help_noobs: user.canHelpNoobs || false,
        public_desc: user.publicDesc || '',
      });
    }
  }, [user, reset]);

  const [editingIsOn, setEditingIsOn] = React.useState(false);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile.</p>;

  return (
    <div className='space-y-4 pb-16 md:mx-32 max-md:mx-8'>
      <Card className='mx-8 my-4 flex max-md:flex-col md:flex-row'>
        <div className='min-w-44 min-h-44 w-1/5 h-full aspect-square relative'>
          <Image
            src='https://mozsarmate.me/marci.jpg'
            placeholder='blur'
            blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII='
            alt='PROFIL KEP'
            fill
            className='rounded-l-xl'
          />
          <div className='w-full absolute flex bottom-2'>
            <Button variant='secondary' className='block m-auto'>
              Profilkép módosítása
            </Button>
          </div>
        </div>
        <div className='w-full relative'>
          <CardContent>
            <div className='flex mt-10 justify-between'>
              <div className='flex items-start'>
                <div>
                  <TTitle className='mt-0'>{user?.fullName}</TTitle>
                  <Th2 className='ml-8'>{user?.neptun}</Th2>
                </div>
                {/*{user?.role !== Role.USER && (*/}
                <Badge className='text-md px-4 py-2 rounded-xl' variant='secondary'>
                  {user?.role}
                </Badge>
                {/*)}*/}
              </div>
              <div className='flex gap-4'>
                {!editingIsOn && (
                  <Button variant='secondary' onClick={() => setEditingIsOn(true)}>
                    Adatok szerkesztése
                  </Button>
                )}
                {editingIsOn && (
                  <Button type='submit' onClick={form.handleSubmit(onSubmit)}>
                    Mentés
                  </Button>
                )}
                <Link href='/auth/logout'>
                  <Button variant='destructive'>Kijelenkezés</Button>
                </Link>
              </div>
            </div>
            <div className='flex gap-16 m-8 font-mono mb-0'>
              <span title='Első bejelentkezés'>
                <FiUser size={24} />
                {user?.createdAt?.slice(0, 10)}
              </span>
              <span title='Utolsó változtatás'>
                <FiEdit2 size={24} />
                {user?.updatedAt?.slice(0, 10)}
              </span>
              <span title='Utolsó változtatás'>
                <FiUserCheck size={24} />
                {user?.profileSeenAt?.slice(0, 10)}
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className='mx-8 my-4'>
            <CardHeader className='flex items-start flex-row justify-between'>
              <div>
                <CardTitle>Személyes adatok</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='w-full md:grid-cols-2 md:grid gap-4 '>
              <FormField
                control={form.control}
                name='nickname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Becenév</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!editingIsOn} />
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
                      <Input {...field} disabled={!editingIsOn} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card className='mx-8 my-4'>
            <CardHeader>
              <CardTitle>Kollégiumi bentlakás</CardTitle>
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
                        disabled={!editingIsOn}
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
                        disabled={!form.watch('is_sch_resident') || !editingIsOn}
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
          <Card className='mx-8 my-4'>
            <CardHeader>
              <CardTitle>Admin beállítások - ezt majd vegyuk ki usereknel</CardTitle>
            </CardHeader>
            <CardContent className='md:grid-cols-2 md:grid gap-4'>
              <FormField
                control={form.control}
                name='can_help_noobs'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
                    <div className='space-y-0.5'>
                      <FormLabel>Tudsz segíteni a többieknek az edzésben?</FormLabel>
                      <FormDescription>Ha igen, írj egy rövid leírást erről</FormDescription>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Switch
                        disabled={!editingIsOn}
                        checked={field.value}
                        onCheckedChange={(data) => {
                          field.onChange(data);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='public_desc'
                render={({ field }) => (
                  <FormItem
                    className={`flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm ${form.watch('can_help_noobs') ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <div className='space-y-0.5'>
                      <FormLabel>Leírás</FormLabel>
                      <FormDescription>
                        A tagokat listázó oldalon ez a szöveg fog megjelenni a neved alatt
                      </FormDescription>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder='...'
                        className='resize-none'
                        {...field}
                        disabled={!editingIsOn || !form.watch('can_help_noobs')}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
