'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { LuBuilding2, LuFileEdit } from 'react-icons/lu';
import { z } from 'zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Switch } from '@/components/ui/switch';
import UserProfileBanner from '@/components/ui/UserProfileBanner';
import useProfile from '@/hooks/useProfile';
import { useToast } from '@/lib/use-toast';
import { ProfileFormSchema } from '@/zod-form-schemas/ProfileFormSchema';

import api from '../network/apiSetup';
import MemberProfileData from './MemberProfileData';

export default function ProfileForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      nickName: '',
      email: '',
      isSchResident: false,
      roomNumber: 0,
      canHelpNoobs: false,
      publicDesc: '',
    },
  });

  const { data: user, error, isLoading, mutate } = useProfile();

  async function onSubmit({ roomNumber, ...values }: z.infer<typeof ProfileFormSchema>) {
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
        mutate();
      } else {
        toast({
          title: 'Hiba történt!',
          description: 'Valami nem stimmel a szerverrel, próbáld újra később!',
          variant: 'destructive',
        });
      }
    } catch {
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
          setEditingIsOn={setEditingIsOn}
          onSubmit={() => onSubmit(form.getValues())}
        />
        <Card>
          <CardHeader className='flex items-start flex-row justify-between'>
            <div>
              <CardTitle>
                <LuFileEdit />
                Személyes adatok
              </CardTitle>
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
            <CardTitle>
              <LuBuilding2 />
              Kollégiumi bentlakás
            </CardTitle>
          </CardHeader>
          <CardContent className='md:grid-cols-2 grid gap-4'>
            <FormField
              control={form.control}
              name='isSchResident'
              render={({ field }) => (
                <FormItem className='flex flex-row gap-2 items-center justify-between rounded-lg border p-4 shadow-sm'>
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
                  className={`flex flex-col md:flex-row gap-1 md:items-center justify-between rounded-lg border p-4 shadow-sm ${form.watch('isSchResident') ? 'opacity-100' : 'opacity-0'}`}
                >
                  <div className='space-y-0.5'>
                    <FormLabel>Szoba szám</FormLabel>
                    <FormDescription>Ezt a szobád ajtaján tudod megnézni xd</FormDescription>
                    <FormMessage />
                  </div>
                  <div className='flex self-center'>
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
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        {user && (user.role === 'BODY_MEMBER' || user.role === 'BODY_ADMIN' || user.role === 'SUPERUSER') && (
          <MemberProfileData form={form} editingIsOn={editingIsOn} />
        )}
      </form>
    </Form>
  );
}
