export type TournamentStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | string;

function startOfDay(value: Date) {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(value: Date) {
  const d = new Date(value);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function getEffectiveTournamentStatus({
  status,
  date,
  endDate,
  now = new Date(),
}: {
  status?: TournamentStatus | null;
  date: Date | string;
  endDate?: Date | string | null;
  now?: Date;
}) {
  if (status === "COMPLETED") return "COMPLETED";

  const start = new Date(date);
  const end = endDate ? new Date(endDate) : start;

  if (Number.isNaN(start.getTime())) return status || "UPCOMING";

  if (now > endOfDay(end)) return "COMPLETED";
  if (now >= startOfDay(start) && now <= endOfDay(end)) return "ONGOING";

  return status || "UPCOMING";
}
