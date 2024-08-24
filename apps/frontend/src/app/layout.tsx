import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

import Footer from '@/components/ui/Footer';
import Header from '@/components/ui/Header';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '💪SCHBody',
  description: 'A Schönherz koli konditerme',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='hu'>
      <body className={`${inter.className} min-h-dvh flex flex-col justify-between`}>
        <Header />
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
