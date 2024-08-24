'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import UserProfileBanner from '@/components/ui/UserProfileBanner';
import useProfile from '@/hooks/useProfile';
import { useToast } from '@/lib/use-toast';

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
      const response = await axios.post('/api/submit', JSON.stringify(values));
      if (response.status === 200) {
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
      toast({
        title: 'Nem várt hiba történt!',
        description: error.message,
        variant: 'destructive',
      });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-16 2xl:mx-64 xl:mx-32 max-xl:mx-8'>
        <UserProfileBanner
          user={user}
          editingIsOn={editingIsOn}
          onClick={() => setEditingIsOn(true)}
          onSubmit={() => onSubmit(form.getValues())}
        />
        <Card>
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
        <Card>
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
        <Card>
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
  );
}
