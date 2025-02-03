import React from 'react';
import { Img, Section, Text } from '@react-email/components';

export const Footer = () => {
  return (
    <Section className='text-center flex flex-col items-center'>
      <Img alt='Body logo' height='42' src='https://body.sch.bme.hu/default_pfp.jpg' />
      <Text className='my-[8px] text-[16px] font-semibold leading-[24px] text-gray-900'>SCHBody</Text>
    </Section>
  );
};
