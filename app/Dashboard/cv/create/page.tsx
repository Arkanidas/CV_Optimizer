"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  readCvSetup,
  type CvSetup,
} from "@/app/dashboard/dashComponents/CvHome/cvSetup";

export default function CreateCvPage() {
  const [setup, setSetup] = useState<CvSetup | null>(null);

  // sessionStorage only exists in the browser, so it's read after mount
  useEffect(() => {
    setSetup(readCvSetup());
  }, []);

  const rows: [string, string][] = setup
    ? [
        ["CV type", setup.cvType ?? "-"],
        ["Industry", setup.industry],
        ["Occupation", setup.occupation],
        ["Experience", `${setup.experienceLevel} (${setup.experienceYears})`],
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white light:text-stone-900">Create a new CV</h1>
      <p className="mt-2 text-sm text-white/60 light:text-stone-600">This page is coming next.</p>

      {setup ? (
        <dl className="mt-6 grid max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-white/50 light:text-stone-500">{label}</dt>
              <dd className="text-white light:text-stone-900">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-6 text-sm text-white/50 light:text-stone-500">
          No choices found. Go back and pick an industry, occupation and experience level.
        </p>
      )}

      <Link
        href="/dashboard/cv"
        className="mt-6 inline-block text-sm text-violet-300 transition hover:text-violet-200 light:text-violet-700 light:hover:text-violet-900"
      >
        ← Back
      </Link>
    </div>
  );
}