export function TTitle({ children }: { children: React.ReactNode }) {
  return <h1 className='text-4xl font-bold mx-8 my-3'>{children}</h1>;
}

export default function Th1({ children }: { children: React.ReactNode }) {
  return <h1 className='text-3xl font-bold m-8'>{children}</h1>;
}

export function Th2({ children }: { children: React.ReactNode }) {
  return <h2 className='text-xl font-bold'>{children}</h2>;
}
