import type { ParsedLetter } from "../letterParser";
import type { LetterFormat } from "../letterFormat";

export default function ClassicTemplate({
  parsed,
  format,
}: {
  parsed: ParsedLetter;
  format: LetterFormat;
}) {
  return (
    <div className="flex flex-col gap-4">
      {parsed.greeting && <p>{parsed.greeting}</p>}
      {parsed.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {parsed.signOff && (
        <div className="mt-4">
          <p>{parsed.signOff}</p>
          <p className="font-semibold">{parsed.senderName}</p>
        </div>
      )}
    </div>
  );
}