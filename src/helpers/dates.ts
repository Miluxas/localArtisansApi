export function nextXDays(n: number): Date {
  if (n < 1) return new Date();
  const future = new Date().setDate(new Date().getDate() + n);
  return new Date(future);
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isSameOrBefore(date: Date): boolean {
  return date.getTime() <= Date.now();
}

export function getEndOfDayDateTime(date: Date): Date {
  const endOfTodayDateTime = new Date(date);
  endOfTodayDateTime.setUTCHours(23, 59, 59, 999);
  return endOfTodayDateTime;
}

export function getStartOfDayDateTime(date: Date): Date {
  const startOfTodayDateTime = new Date(date);
  startOfTodayDateTime.setUTCHours(0, 0, 0, 0);
  return startOfTodayDateTime;
}
