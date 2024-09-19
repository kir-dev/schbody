import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

import Footer from '@/components/ui/Footer';
import Header from '@/components/ui/Header';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SCHBody💪',
  description: 'A Schönherz koli konditerme',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='hu'>
      <head>
        <script defer data-domain='body.sch.bme.hu' src='https://visit.kir-dev.hu/js/script.js' />
      </head>
      <body
        className={`${inter.className} min-h-dvh flex flex-col justify-between`}
        style={{
          background: "url('/bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgb(238,238,238)',
        }}
      >
        <div>
          <Header />
          <div className='space-y-4 py-8 2xl:mx-64 xl:mx-32 max-xl:mx-8 max-md:mx-4'>{children}</div>
        </div>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
