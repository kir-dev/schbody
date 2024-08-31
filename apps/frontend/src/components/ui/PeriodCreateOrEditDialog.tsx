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
  const { mutate: mutateCur } = usePeriod(props.period ? props.period.id : 0);
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

      await mutateCur();
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
        <Button>{props.period ? 'Szerkesztés' : '+ Új jelentkezési időszak létrehozása'}</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader className='mb-4'>
          <DialogTitle>{props.period ? 'Időszak szerkesztése' : 'Új időszak létrehozása'}</DialogTitle>
          <DialogDescription>A változtatásaid mentés után azonnal hatályba lépnek</DialogDescription>
        </DialogHeader>
        <Label htmlFor='name' className='text-right'>
          Név
        </Label>
        <Input
          id='name'
          placeholder='Őszi jelentkezési időszak 2024'
          onChange={(event) => setName(event.target.value)}
          value={name}
        />

        <Label htmlFor='datepicker' className='text-right'>
          Időszak kezdete és vége
        </Label>
        <DatePickerWithRange id='datepicker' date={date} setDate={setDate} />
        <DialogFooter>
          <Button type='submit' onClick={onSave}>
            Időszak létrehozása
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/*<Dialog>
            <DialogTrigger asChild className='max-md:w-full'>
              <Button>Szerkesztés</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <form>
                <DialogHeader>
                  <DialogTitle>Jelentkezési időszak szerkesztése</DialogTitle>
                  <DialogDescription>A változtatásaid mentés után azonnal hatályba lépnek</DialogDescription>
                </DialogHeader>
                <div className='mt-4'>
                  <Label htmlFor='name'>Név</Label>
                  <Input id='name' defaultValue={period.name} />
                </div>
                <div className='grid grid-cols-2 gap-4 mt-4'>
                  <div>
                    <Label htmlFor='appliction-start' className='text-right'>
                      Jelenetkezés kezdete
                    </Label>
                    <Input
                      id='appliction-start'
                      defaultValue={period.applicationPeriodStartAt.toString().toString().slice(0, 10)}
                      type='date'
                    />
                  </div>
                  <div>
                    <Label htmlFor='appliction-end' className='text-right'>
                      Jelenetkezés vége
                    </Label>
                    <Input
                      id='appliction-end'
                      type='date'
                      defaultValue={period.applicationPeriodEndAt.toString().toString().slice(0, 10)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type='submit' className='mt-4'>
                    Mentés
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>*/
