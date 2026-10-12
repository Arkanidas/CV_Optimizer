
"use client";

import { useState } from "react";
import { testFonts } from "../fonts";

const sampleLetter = `Dear Hiring Manager,

I am writing to express my interest in the position at your company. My experience building modern web applications and solving technical problems has prepared me to contribute to your team.

In my previous projects, I have worked with React, TypeScript, and modern frontend tools to create user-friendly interfaces. I value clean design, maintainable code, and collaboration.

I would welcome the opportunity to discuss how my skills and experience could contribute to your organization.

Kind regards,

Alex Morgan`;

export default function FontPreviewPage() {
  const [selectedId, setSelectedId] = useState(testFonts[0].id);
  const selectedFont =
    testFonts.find((font) => font.id === selectedId) ?? testFonts[0];

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-10 text-gray-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold">
            Font Preview Studio
          </h1>
          <p className="mt-2 text-gray-600">
            Compare fonts before adding them to your cover letter editor.
          </p>
        </header>

        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <label
            htmlFor="font-picker"
            className="mb-2 block text-sm font-semibold"
          >
            Choose a font to preview
          </label>

          <select
            id="font-picker"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
          >
            {testFonts.map((font) => (
              <option key={font.id} value={font.id}>
                {font.label}
              </option>
            ))}
          </select>

          <p className="mt-3 text-sm text-gray-500">
            Selected font: {selectedFont.label}
          </p>
        </section>

        <section className="overflow-hidden rounded-xl border bg-white shadow-md">
          <div className="border-b bg-gray-50 px-8 py-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Cover letter preview
            </p>
          </div>

          <article
            className="mx-auto max-w-3xl whitespace-pre-line px-8 py-10 text-gray-800 sm:px-14 sm:py-14"
            style={{
              fontFamily: selectedFont.font.style.fontFamily,
              fontSize: "12pt",
              lineHeight: 1.7,
            }}
          >
            {sampleLetter}
          </article>
        </section>

        <section className="rounded-xl border bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold">
            Compare all fonts
          </h2>

          <div className="space-y-3">
            {testFonts.map((font) => (
              <button
                key={font.id}
                type="button"
                onClick={() => setSelectedId(font.id)}
                className={`block w-full rounded-lg border p-4 text-left transition ${
                  selectedId === font.id
                    ? "border-violet-500 bg-violet-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <span className="mb-2 block text-xs font-semibold text-gray-500">
                  {font.label}
                </span>
                <span
                  className="block text-gray-900"
                  style={{
                    fontFamily: font.font.style.fontFamily,
                    fontSize: "18px",
                  }}
                >
                  The quick brown fox jumps over the lazy dog.
                </span>
                <span
                  className="mt-1 block text-sm text-gray-600"
                  style={{
                    fontFamily: font.font.style.fontFamily,
                  }}
                >
                  Professional writing deserves beautiful typography.
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
