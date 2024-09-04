'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import { z } from 'zod';

import api from '@/components/network/apiSetup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Switch } from '@/components/ui/switch';
import useProfile from '@/hooks/useProfile';
import { useToast } from '@/lib/use-toast';
import { ApplicationPeriodEntity } from '@/types/application-period-entity';

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
    terms: z.boolean().refine((data) => data, { message: 'A szabályzatot el kell fogadnod' }),
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
export default function ApplicationForm({ currentPeriod }: { currentPeriod: ApplicationPeriodEntity }) {
  const user = useProfile();
  const { toast } = useToast();
  const effectCalledRef = useRef(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickName: 'Bujdi Bohoc',
      email: 'email@gmail.com',
      isSchResident: false,
      roomNumber: 0,
      terms: false,
    },
  });

  useEffect(() => {
    if (user && !effectCalledRef.current) {
      effectCalledRef.current = true;
      form.setValue('nickName', user.data?.nickName || '');
      form.setValue('email', user.data?.email || '');
      form.setValue('isSchResident', user.data?.isSchResident || false);
      form.setValue('roomNumber', user.data?.roomNumber || 0);
      effectCalledRef.current = false;
    }
  }, [user.data]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onSubmit({ terms, ...values }: z.infer<typeof formSchema>) {
    try {
      const updateResponse = await api.patch('/users/me', values);
      const response = await api.post('/application', {
        applicationPeriodId: currentPeriod.id,
      });
      if (response.status === 201 && updateResponse.status === 200) {
        toast({
          title: 'Sikeres jelentkezés!',
          description: 'Köszönjük, hogy kitöltötted a jelentkezési lapot!',
        });
        await mutate('/application/my');
        router.push('/');
      } else {
        toast({
          title: 'Hiba történt!',
          description: 'Valami nem stimmel a szerverrel, próbáld újra később!',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        toast({
          title: 'Már jelentkeztél erre az időszakra!',
          variant: 'destructive',
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <Card>
          <CardHeader>
            <CardTitle>Személyes adatok</CardTitle>
            <CardDescription>Ellenőrízd személyes adataid, szükség esetén módosíts rajtuk!</CardDescription>
          </CardHeader>
          <CardContent className='md:grid-cols-4 grid gap-4'>
            <FormItem>
              <FormLabel>Név</FormLabel>
              <Input disabled value={user.data?.fullName} />
            </FormItem>
            <FormItem>
              <FormLabel>Neptun</FormLabel>
              <Input disabled value={user.data?.neptun} />
            </FormItem>
            <FormField
              control={form.control}
              name='nickName'
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
              name='email'
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
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kollégiumi bentlakás</CardTitle>
            <CardDescription>Ellenőrízd régebben megadott viszonyod, szükség esetén módosíts rajta!</CardDescription>
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
                      disabled={!form.watch('isSchResident')}
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
        <Card>
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
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button type='submit'>Jelentkezés leadása</Button>
      </form>
    </Form>
  );
}
