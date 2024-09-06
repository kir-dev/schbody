'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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

import api from '../network/apiSetup';

const formSchema = z
  .object({
    nickName: z.string({
      required_error: 'Ez a mező kötelező',
      invalid_type_error: 'String, tesó!',
    }),
    email: z.string().email(),
    isSchResident: z.boolean().optional(),
    roomNumber: z
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
    canHelpNoobs: z.boolean(),
    publicDesc: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isSchResident) {
        return data.roomNumber !== 0 && data.roomNumber !== undefined;
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickName: '',
      email: '',
      isSchResident: false,
      roomNumber: 0,
      canHelpNoobs: false,
      publicDesc: '',
    },
  });

  const { data: user, error, isLoading } = useProfile();

  async function onSubmit({ roomNumber, ...values }: z.infer<typeof formSchema>) {
    setEditingIsOn(false);
    try {
      const response = await api.patch(
        '/users/me',
        JSON.stringify(values.isSchResident ? { ...values, roomNumber } : values)
      );
      if (response.status === 200) {
        toast({
          title: 'Sikeres módosítás!',
        });
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
        variant: 'destructive',
      });
    }
  }

  const { reset } = form;
  useEffect(() => {
    if (user) {
      reset({
        nickName: user.nickName || '',
        email: user.email || '',
        isSchResident: user.isSchResident || false,
        roomNumber: user.roomNumber || 0,
        canHelpNoobs: user.canHelpNoobs || false,
        publicDesc: user.publicDesc || '',
      });
    }
  }, [user, reset]);

  const [editingIsOn, setEditingIsOn] = React.useState(false);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile.</p>;

  if (!user) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
              name='nickName'
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
              name='email'
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
          <CardContent className='md:grid-cols-2 grid gap-4'>
            <FormField
              control={form.control}
              name='isSchResident'
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
                        form.resetField('roomNumber');
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='roomNumber'
              render={({ field }) => (
                <FormItem
                  className={`flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm ${form.watch('isSchResident') ? 'opacity-100' : 'opacity-0'}`}
                >
                  <div className='space-y-0.5'>
                    <FormLabel>Szoba szám</FormLabel>
                    <FormDescription>Ezt a szobád ajtaján tudod megnézni xd</FormDescription>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <InputOTP
                      maxLength={form.watch('roomNumber')?.toString().startsWith('1') ? 4 : 3}
                      disabled={!form.watch('isSchResident') || !editingIsOn}
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
                        {form.watch('roomNumber')?.toString().startsWith('1') && <InputOTPSlot index={3} />}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        {user && (user.role === 'BODY_MEMBER' || user.role === 'BODY_ADMIN' || user.role === 'SUPERUSER') && (
          <Card>
            <CardHeader>
              <CardTitle>Körtag beállítások</CardTitle>
            </CardHeader>
            <CardContent className='md:grid-cols-2 grid gap-4'>
              <FormField
                control={form.control}
                name='canHelpNoobs'
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
                name='publicDesc'
                render={({ field }) => (
                  <FormItem
                    className={`flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm ${form.watch('canHelpNoobs') ? 'opacity-100' : 'opacity-0'}`}
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
                        disabled={!editingIsOn || !form.watch('canHelpNoobs')}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}
      </form>
    </Form>
  );
}
