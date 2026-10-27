import assert from "node:assert/strict";
import test from "node:test";
import { canCancelBooking, isValidReservationWindow } from "./booking-rules";

test("acepta una reserva de 2 horas en horario completo", () => {
  const start = new Date("2026-10-27T10:00:00");
  const end = new Date("2026-10-27T12:00:00");

  assert.equal(isValidReservationWindow(start, end), true);
});

test("rechaza reservas fuera de horas completas o con horario nocturno", () => {
  const invalid1 = new Date("2026-10-27T10:30:00");
  const invalid2 = new Date("2026-10-27T11:45:00");
  const invalid3 = new Date("2026-10-27T21:30:00");
  const invalid4 = new Date("2026-10-28T08:00:00");

  assert.equal(isValidReservationWindow(invalid1, invalid2), false);
  assert.equal(
    isValidReservationWindow(new Date("2026-10-27T20:00:00"), invalid3),
    false,
  );
  assert.equal(
    isValidReservationWindow(new Date("2026-10-27T21:00:00"), invalid4),
    false,
  );
});

test("permite cancelar si faltan al menos dos horas para el inicio", () => {
  const now = new Date("2026-10-27T08:00:00");
  const start = new Date("2026-10-27T11:00:00");

  assert.equal(canCancelBooking(start, now), true);
});

test("rechaza cancelar cuando faltan menos de dos horas", () => {
  const now = new Date("2026-10-27T09:30:00");
  const start = new Date("2026-10-27T11:00:00");

  assert.equal(canCancelBooking(start, now), false);
});
