const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export const timeAgo = (date: Date): string => {
  const now = new Date();
  const diff = (date.getTime() - now.getTime()) / 1000;

  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ] as const;

  for (const [unit, seconds] of units) {
    const value = Math.round(diff / seconds);
    if (Math.abs(value) >= 1) return formatter.format(value, unit);
  }

  return "Just Now";
};
