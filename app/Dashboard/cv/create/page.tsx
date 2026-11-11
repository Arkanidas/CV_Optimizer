import Link from "next/link";

export default function CreateCvPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white light:text-stone-900">Create a new CV</h1>
      <p className="mt-2 text-sm text-white/60 light:text-stone-600">This page is coming next.</p>
      <Link
        href="/dashboard/cv"
        className="mt-6 inline-block text-sm text-violet-300 transition hover:text-violet-200 light:text-violet-700 light:hover:text-violet-900"
      >
        ← Back
      </Link>
    </div>
  );
}