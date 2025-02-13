'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuBuilding2, LuCrown, LuPencil, LuSave, LuX } from 'react-icons/lu';
import { z } from 'zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Switch } from '@/components/ui/switch';
import UserProfileBanner from '@/components/ui/UserProfileBanner';
import useProfile from '@/hooks/useProfile';
import { useToast } from '@/lib/use-toast';
import { ApplicationEntityWithPeriod, ApplicationStatus } from '@/types/application-entity';
import { ProfileFormSchema } from '@/zod-form-schemas/ProfileFormSchema';

import api from '../network/apiSetup';
import MemberProfileData from './MemberProfileData';
import { Button } from '@/components/ui/button';

// Custom hook or API call to fetch user's applications
async function fetchUserApplications() {
  // Replace with an actual API call
  return await api.get<ApplicationEntityWithPeriod[]>('/users/me/applications');
}

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
      idNumber: '',
    },
  });

  const { data: user, error, isLoading, mutate } = useProfile();
  const [isIdFieldDisabled, setIsIdFieldDisabled] = useState(false);
  const [editingIsOn, setEditingIsOn] = useState(false);

  useEffect(() => {
    async function checkApplicationStatus() {
      try {
        const applications = await fetchUserApplications();
        const hasRestrictedStatus = applications.data.some(
          (app: ApplicationEntityWithPeriod) =>
            app.status === ApplicationStatus.DISTRIBUTED || app.status === ApplicationStatus.WAITING_FOR_OPS
        );
        setIsIdFieldDisabled(hasRestrictedStatus);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      }
    }

    checkApplicationStatus();
  }, []);

  const onSubmit = async ({ roomNumber, ...values }: z.infer<typeof ProfileFormSchema>) => {
    setEditingIsOn(false);
    try {
      const response = await api.patch(
        '/users/me',
        JSON.stringify(values.isSchResident ? { ...values, roomNumber } : values)
      );
      if (response.status === 200) {
        toast({
          title: 'Sikeres módosítás!',
          description: 'A profilod adatai mentésre kerültek!',
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
  };

  function onReset() {
    setEditingIsOn(false);
    form.reset();
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
        idNumber: user.idNumber || '',
      });
    }
  }, [user, reset]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile.</p>;

  if (!user) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <UserProfileBanner user={user} />
        <Card>
          <div className='md:z-1 md:float-right md:mt-6 md:mx-6 flex gap-4 max-md:w-full max-md:p-6 max-md:pb-0 max-md:justify-center'>
            {!editingIsOn && (
              <Button variant='secondary' className='w-full' onClick={() => setEditingIsOn(true)}>
                <LuPencil />
                Adatok szerkesztése
              </Button>
            )}
            {editingIsOn && (
              <>
                <Button type='submit'>
                  <LuSave />
                  Mentés
                </Button>
                <Button variant='destructive' onClick={onReset}>
                  <LuX />
                  Mégse
                </Button>
              </>
            )}
          </div>
          <CardHeader className='flex items-start flex-row justify-between mt-2'>
            <div>
              <CardTitle>
                <LuCrown />
                Személyes adatok
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='md:grid-cols-2 grid gap-4'>
            <FormField
              control={form.control}
              name='nickName'
              render={({ field }) => (
                <FormItem className='flex flex-col md:flex-row gap-2 items-start md:items-center justify-between rounded-lg border p-4 shadow-sm'>
                  <div className='flex-1 space-y-0.5'>
                    <FormLabel>Becenév</FormLabel>
                    <FormDescription>Hogyan szólíthatunk?</FormDescription>
                    <FormMessage />
                  </div>
                  <FormControl className='flex-1'>
                    <Input {...field} disabled={!editingIsOn} className='m-0' />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='flex flex-col md:flex-row gap-2 items-start md:items-center justify-between rounded-lg border p-4 shadow-sm'>
                  <div className='flex-1 space-y-0.5'>
                    <FormLabel>Email cím</FormLabel>
                    <FormDescription>Ide küldjük majd a fontos infókat</FormDescription>
                    <FormMessage />
                  </div>
                  <FormControl className='flex-1 m-0 border'>
                    <Input {...field} className='m-0' disabled={!editingIsOn} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='idNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Személyi szám</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isIdFieldDisabled || !editingIsOn} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardHeader className='pt-2'>
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
                    <FormLabel>Szobaszám</FormLabel>
                    <FormDescription>Ezt a szobád ajtaján tudod megnézni</FormDescription>
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
