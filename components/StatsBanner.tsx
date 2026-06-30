"use client";

import CountUp from "@/components/CountUp";

const stats = [
  {
    value: 663,
    suffix: "+",
    label: "CVs optimized",
  },
  {
    value: 85,
    suffix: "%",
    label: "Avg ATS match",
  },
  {
    value: 415,
    suffix: "+",
    label: "Cover letters optimized",
  },
];

export default function StatsBanner() {
  return (
    <div className="w-full border-y border-white/12 px-4 py-3  sm:px-8 lg:px-16 backdrop-saturate-150">
      <dl className="mx-auto flex w-full max-w-7xl flex-col divide-y divide-white/20 md:flex-row md:items-center md:justify-between md:divide-x md:divide-y-0">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-1 flex-col items-center justify-center px-6 py-5 text-center md:px-12 md:py-4 xl:px-20"
          >
            <dt className="order-2 mt-3 text-xs font-medium uppercase tracking-[0.24em] text-white/52">
              {stat.label}
            </dt>
            <dd className="order-1 text-4xl font-semibold leading-none text-[#ffc338] sm:text-5xl">
              <CountUp to={stat.value} duration={2.2} separator="," />
              {stat.suffix}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
