import { faqData } from '@/components/data/faqData';
import Th1 from '@/components/typography/typography';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

export default function FaqPage() {
  return (
    <>
      <Th1>Gyakran ismételt kérdések</Th1>
      <Accordion type='multiple' className='w-full' orientation='vertical' defaultValue={faqData.map((faq) => faq.key)}>
        {faqData.map((faq) => (
          <Card key={faq.key} className='py-0 px-4 my-4'>
            <AccordionItem value={faq.key} className='border-b-0'>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </>
  );
}
