interface LetterEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LetterEditor({ value, onChange }: LetterEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck
      placeholder="Your cover letter will appear here..."
      className="min-h-[770px] w-full max-w-[750px] width-900 resize-none rounded-sm border border-3 px-10 py-12 font-arial text-[15px] leading-relaxed text-white/90 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 sm:px-14"
    />
  );
}
