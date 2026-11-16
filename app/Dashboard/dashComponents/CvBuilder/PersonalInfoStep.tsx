"use client";

import { ArrowRight, Lightbulb, Link2, MapPin, Sparkles } from "lucide-react";
import CvField from "./CvField";
import PhotoUpload from "./PhotoUpload";
import { CARD } from "./cvBuilderTheme";
import {
  PERSONAL_FIELD_IDS,
  type PersonalErrors,
  type PersonalInfo,
} from "./cvBuilderDraft";

interface PersonalInfoStepProps {
  value: PersonalInfo;
  onChange: (next: PersonalInfo) => void;
  errors: PersonalErrors;
  // What the Suggest button puts in the headline. Empty = nothing to suggest.
  headlineSuggestion: string;
  onContinue: () => void;
}

export default function PersonalInfoStep({
  value,
  onChange,
  errors,
  headlineSuggestion,
  onContinue,
}: PersonalInfoStepProps) {
  const set = (field: keyof PersonalInfo) => (next: string) => onChange({ ...value, [field]: next });

  return (
    // @container makes the layout inside follow the width of THIS card, not
    // the window. That way it also works when the sidebar is open or closed.
    <section className={`@container rounded-3xl border p-6 sm:p-8 ${CARD}`}>
      <span className="inline-flex rounded-full bg-violet-500/20 px-3.5 py-1 text-sm font-semibold text-violet-200 light:bg-violet-100 light:text-violet-800">
        Step 1 of 6
      </span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-white light:text-stone-900">
        Personal information
      </h2>
      <p className="mt-2 max-w-xl text-base text-white/60 light:text-stone-600">
        Tell us about yourself. This information will be used to personalize your CV and make it
        stand out.
      </p>

      {/* The photo is beside the fields from a card width of 672px, otherwise
          above them */}
      <div className="mt-8 grid gap-6 @2xl:grid-cols-[220px_minmax(0,1fr)]">
        <PhotoUpload value={value.photo} onChange={set("photo")} />

        <div className="grid content-start gap-x-5 gap-y-5 @md:grid-cols-2">
          <CvField
            id={PERSONAL_FIELD_IDS.firstName}
            label="First name"
            required
            value={value.firstName}
            onChange={set("firstName")}
            error={errors.firstName}
            autoComplete="given-name"
            maxLength={40}
          />
          <CvField
            id={PERSONAL_FIELD_IDS.lastName}
            label="Last name"
            required
            value={value.lastName}
            onChange={set("lastName")}
            error={errors.lastName}
            autoComplete="family-name"
            maxLength={40}
          />

          <CvField
            className="@md:col-span-2"
            id={PERSONAL_FIELD_IDS.headline}
            label="Professional headline"
            required
            value={value.headline}
            onChange={set("headline")}
            error={errors.headline}
            placeholder="For example: Full Stack Developer | React & TypeScript"
            maxLength={90}
            rightSlot={
              <button
                type="button"
                onClick={() => set("headline")(headlineSuggestion)}
                disabled={!headlineSuggestion}
                title={
                  headlineSuggestion
                    ? "Fill in a headline from your chosen role"
                    : "Choose a role first to get a suggestion"
                }
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-violet-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40 light:text-violet-700 light:hover:bg-violet-100"
              >
                <Sparkles className="h-4 w-4" />
                Suggest
              </button>
            }
          />

          <CvField
            id={PERSONAL_FIELD_IDS.email}
            label="Email address"
            required
            type="email"
            value={value.email}
            onChange={set("email")}
            error={errors.email}
            autoComplete="email"
            maxLength={120}
          />
          <CvField
            id={PERSONAL_FIELD_IDS.phone}
            label="Phone number"
            optional
            type="tel"
            value={value.phone}
            onChange={set("phone")}
            error={errors.phone}
            placeholder="+46 70 123 45 67"
            autoComplete="tel"
            maxLength={30}
          />

          <CvField
            id="cv-location"
            label="Location"
            icon={MapPin}
            value={value.location}
            onChange={set("location")}
            placeholder="Stockholm, Sweden"
            autoComplete="address-level2"
            maxLength={80}
          />
          <CvField
            id="cv-linkedin"
            label="LinkedIn"
            optional
            icon={Link2}
            type="url"
            value={value.linkedin}
            onChange={set("linkedin")}
            placeholder="linkedin.com/in/yourname"
            autoComplete="url"
            maxLength={120}
          />
        </div>
      </div>

      {/* BOTTOM ROW: the explanation, and the Continue button.
          Light: violet-100 box. */}
      <div className="mt-8 flex flex-col gap-4 @xl:flex-row @xl:items-center">
        <div className="flex flex-1 items-start gap-4 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4 light:border-violet-200 light:bg-violet-100/70">
          <Lightbulb className="mt-0.5 h-6 w-6 shrink-0 text-violet-300 light:text-violet-700" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-semibold text-white light:text-stone-900">
              Why do we need this?
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-white/60 light:text-stone-600">
              This helps us create a professional CV that matches your target role and industry.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.5)] transition hover:bg-violet-500 light:bg-violet-700 light:shadow-[0_8px_20px_-6px_rgba(109,40,217,0.55)] light:hover:bg-violet-800"
        >
          Continue
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}