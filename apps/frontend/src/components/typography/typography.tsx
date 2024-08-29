import React from 'react';

export function TTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h1 className={`${className} text-4xl max-md:text-2xl font-bold md:mx-8 max-md:mx-2 my-3`}>{children}</h1>;
}

export function THeaderLink({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`${className} text-md font-medium hover:bg-black hover:text-white transition px-4 rounded-md py-2 `}>
      {children}
    </h2>
  );
}

export default function Th1({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h1 className={`${className} text-3xl max-md:text-xl font-bold m-8 ml-0`}>{children}</h1>;
}

export function Th2({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`${className} text-xl font-bold `}>{children}</h2>;
}
