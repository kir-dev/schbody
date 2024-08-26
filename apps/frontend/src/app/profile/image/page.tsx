import Th1 from '@/components/typography/typography';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Page() {
  return (
    <Card className='w-96 m-auto p-8 gap-4 flex flex-col'>
      <Th1 className='m-0'>Profil kép feltöltése</Th1>
      <p>Válassz egy kiváló képet magadról!</p>
      <Input type='file' />
      <Button type='submit'>Tovább</Button>
    </Card>
  );
}
