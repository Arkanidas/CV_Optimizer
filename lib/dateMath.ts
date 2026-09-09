
export function monthsBetween(startDate: string | null, endDate: string | null): number {
  if (!startDate) return 0;

  const parse = (value: string): { year: number; month: number } | null => {
    const match = value.match(/^(\d{4})-(\d{2})$/);
    if (!match) return null;
    return { year: parseInt(match[1], 10), month: parseInt(match[2], 10) };
  };

  const start = parse(startDate);
  if (!start) return 0;

  let end: { year: number; month: number };
  if (!endDate || endDate.toLowerCase() === "present") {
    const now = new Date();
    end = { year: now.getFullYear(), month: now.getMonth() + 1 };
  } else {
    const parsedEnd = parse(endDate);
    if (!parsedEnd) return 0;
    end = parsedEnd;
  }

  const months = (end.year - start.year) * 12 + (end.month - start.month);
  return Math.max(0, months);
}

export function monthsToYearsLabel(months: number): string {
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years === 0) return `${remMonths} month${remMonths === 1 ? "" : "s"}`;
  if (remMonths === 0) return `${years} year${years === 1 ? "" : "s"}`;
  return `${years} year${years === 1 ? "" : "s"}, ${remMonths} month${remMonths === 1 ? "" : "s"}`;
}