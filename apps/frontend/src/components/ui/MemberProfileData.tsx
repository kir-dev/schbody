import { UseFormReturn } from 'react-hook-form';
import { LuUserCheck } from 'react-icons/lu';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function MemberProfileData({
  form,
  editingIsOn,
}: {
  form: UseFormReturn<
    {
      canHelpNoobs: boolean;
      nickName: string;
      email: string;
      publicDesc?: string | undefined;
      isSchResident?: boolean | undefined;
      roomNumber?: number | null | undefined;
    },
    any,
    undefined
  >;
  editingIsOn: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <LuUserCheck />
          Körtag beállítások
        </CardTitle>
      </CardHeader>
      <CardContent className='md:grid-cols-2 grid gap-4'>
        <FormField
          control={form.control}
          name='canHelpNoobs'
          render={({ field }) => (
            <FormItem className='flex flex-row gap-2 items-center justify-between rounded-lg border p-4 shadow-sm'>
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
                <FormDescription>A tagokat listázó oldalon ez a szöveg fog megjelenni a neved alatt</FormDescription>
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
  );
}
