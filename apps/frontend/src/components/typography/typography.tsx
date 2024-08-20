import React from 'react';

export function TTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h1 className={`${className} text-4xl font-bold md:mx-8 max-md:mx-2 my-3`}>{children}</h1>;
}

export function THeaderLink({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`${className} text-md font-medium `}>{children}</h2>;
}

export default function Th1({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h1 className={`${className} text-3xl font-bold m-8`}>{children}</h1>;
}

export function Th2({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`${className} text-xl font-bold `}>{children}</h2>;
}
