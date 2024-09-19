import { addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

import api from '@/components/network/apiSetup';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/DatePickerWithRange';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useApplicationPeriods, { usePeriod } from '@/hooks/usePeriod';
import { toast } from '@/lib/use-toast';
import { ApplicationPeriodEntity } from '@/types/application-period-entity';

type props = {
  period?: ApplicationPeriodEntity;
};
export default function PeriodCreateOrEditDialog(props: props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });
  const period = usePeriod(props.period ? props.period.id : -1);
  const { mutate: mutateAll } = useApplicationPeriods(0);

  useEffect(() => {
    if (props.period) {
      setName(props.period.name);
      setDate({
        from: new Date(props.period.applicationPeriodStartAt),
        to: new Date(props.period.applicationPeriodEndAt),
      });
    }
  }, []);

  async function onSave() {
    if (date === undefined) return;
    if (name === '') return;
    if (props.period) {
      await api
        .patch(`/application-periods/${props.period.id}`, {
          name,
          applicationPeriodStartAt: date.from,
          applicationPeriodEndAt: date.to,
        })
        .catch((error) => {
          return toast({ title: 'Hiba történt!', description: error.response?.data?.message || 'Ismeretlen hiba' });
        });

      await period?.mutate();
      setOpen(false);
      return;
    }
    await api
      .post(`/application-periods`, {
        name,
        applicationPeriodStartAt: date.from,
        applicationPeriodEndAt: date.to,
      })
      .catch((error) => {
        return toast({ title: 'Hiba történt!', description: error.response?.data?.message || 'Ismeretlen hiba' });
      });
    await mutateAll();
    setOpen(false);
    return;
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='max-md:w-full'>
          {props.period ? 'Szerkesztés' : '+ Új jelentkezési időszak létrehozása'}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader className='mb-4'>
          <DialogTitle>{props.period ? 'Időszak szerkesztése' : 'Új időszak létrehozása'}</DialogTitle>
          <DialogDescription>A változtatásaid mentés után azonnal hatályba lépnek</DialogDescription>
        </DialogHeader>
        <Label htmlFor='name' className='text-right'>
          Név
        </Label>
        <Input id='name' placeholder='2024. ősz' onChange={(event) => setName(event.target.value)} value={name} />

        <Label htmlFor='datepicker' className='text-right'>
          Időszak kezdete és vége
        </Label>
        <DatePickerWithRange id='datepicker' date={date} setDate={setDate} />
        <DialogFooter>
          <Button type='submit' onClick={onSave}>
            {props.period ? 'Mentés' : 'Időszak létrehozása'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
