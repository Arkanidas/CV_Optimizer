import type { ParsedLetter } from "../letterParser";
import type { LetterFormat } from "../letterFormat";

export default function AccentHeaderTemplate({
  parsed,
  format,
}: {
  parsed: ParsedLetter;
  format: LetterFormat;
}) {
  return (
    <div className="flex flex-col">
      <div
        className="-mx-10 -mt-12 mb-8 px-10 py-6 sm:-mx-14"
        style={{ backgroundColor: "#2563eb" }}
      >
        <p className="text-xl font-semibold text-white">
          {parsed.senderName || "Your Name"}
        </p>
      </div>

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
    </div>
  );
}