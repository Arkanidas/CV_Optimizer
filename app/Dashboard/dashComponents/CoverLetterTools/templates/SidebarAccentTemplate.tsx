import type { ParsedLetter } from "../letterParser";
import type { LetterFormat } from "../letterFormat";

export default function SidebarAccentTemplate({
  parsed,
  format,
}: {
  parsed: ParsedLetter;
  format: LetterFormat;
}) {
  return (
    <div className="relative flex flex-col pl-6">
      <div
        className="absolute -left-10 top-0 h-full w-2 sm:-left-14"
        style={{ backgroundColor: format.accentColor }}
      />
      <p className="mb-6 text-lg font-semibold" style={{ color: format.accentColor }}>
        {parsed.senderName || "Your Name"}
      </p>
      {parsed.greeting && <p>{parsed.greeting}</p>}
      <div className="mt-4 flex flex-col gap-4">
        {parsed.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {parsed.signOff && (
        <div className="mt-4">
          <p>{parsed.signOff}</p>
          <p className="font-semibold">{parsed.senderName}</p>
        </div>
      )}
    </div>
  );
}