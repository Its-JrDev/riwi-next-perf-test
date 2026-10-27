export function isValidReservationWindow(start: Date, end: Date): boolean {
  if (!(start instanceof Date) || !(end instanceof Date)) return false;

  const startTime = start.getTime();
  const endTime = end.getTime();

  if (Number.isNaN(startTime) || Number.isNaN(endTime)) return false;
  if (startTime >= endTime) return false;
  if (start.toDateString() !== end.toDateString()) return false;

  const durationHours = (endTime - startTime) / (1000 * 60 * 60);
  if (
    !Number.isInteger(durationHours) ||
    durationHours < 1 ||
    durationHours > 4
  ) {
    return false;
  }

  if (
    start.getMinutes() !== 0 ||
    start.getSeconds() !== 0 ||
    end.getMinutes() !== 0 ||
    end.getSeconds() !== 0
  ) {
    return false;
  }

  const startHour = start.getHours();
  const endHour = end.getHours();

  if (startHour < 7 || startHour >= 21) return false;
  if (endHour > 21 || (endHour === 21 && end.getMinutes() > 0)) return false;
  if (endHour - startHour !== durationHours) return false;

  return true;
}

export function canCancelBooking(
  startTime: Date,
  now: Date = new Date(),
): boolean {
  const limitTime = new Date(startTime.getTime() - 2 * 60 * 60 * 1000);
  return now.getTime() <= limitTime.getTime();
}

export function hasTimeOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
): boolean {
  return startA < endB && endA > startB;
}
