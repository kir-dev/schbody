import Link from 'next/link';
import { PropsWithChildren } from 'react';

interface THeaderLinkProps {
  href: string;
  title: string;
  className?: string;
  onClick?: () => void;
}

export function THeaderLink({ className, href, title, onClick }: THeaderLinkProps) {
  return (
    <Link href={href} onClick={onClick}>
      <h2
        className={`${className} text-md font-medium hover:bg-black hover:text-white transition px-4 rounded-md py-2 `}
      >
        {title}
      </h2>
    </Link>
  );
}

interface TextProps extends PropsWithChildren {
  className?: string;
}

export function TTitle({ children, className }: TextProps) {
  return <h1 className={`${className} text-4xl max-md:text-2xl font-bold max-md:mx-2 my-3`}>{children}</h1>;
}

export default function Th1({ children, className }: TextProps) {
  return <h1 className={`${className} text-3xl max-md:text-xl font-bold m-8 ml-0`}>{children}</h1>;
}

export function Th2({ children, className }: TextProps) {
  return <h2 className={`${className} text-xl font-bold `}>{children}</h2>;
}
