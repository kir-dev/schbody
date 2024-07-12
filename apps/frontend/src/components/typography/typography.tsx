export default function Th1({ text }: { text: string }) {
  return <h1 className='text-3xl font-bold m-8'>{text}</h1>;
}

export function Th2({ text }: { text: string }) {
  return <h2 className='text-xl font-bold'>{text}</h2>;
}
