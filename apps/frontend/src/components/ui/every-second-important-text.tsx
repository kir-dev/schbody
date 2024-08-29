export default function EverySecondImportantText({ parts }: { parts: string[] }) {
  return (
    <p>
      {parts.map((part, idx) => (
        <span key={part} className={idx % 2 === 1 ? 'font-bold' : 'italic'}>
          {part}
        </span>
      ))}
    </p>
  );
}
