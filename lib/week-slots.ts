import { localDate } from "@/lib/dates";

export type MealSlot = "breakfast" | "lunch" | "snack" | "dinner";

export const MEAL_SLOTS: MealSlot[] = ["breakfast", "lunch", "snack", "dinner"];

export const MEAL_SLOT_KEYS: Record<MealSlot, string> = {
  breakfast: "meal.breakfast",
  lunch: "meal.lunch",
  snack: "meal.snack",
  dinner: "meal.dinner",
};

/** Monday of the week containing `d`, as YYYY-MM-DD (local). */
export function weekStartMonday(d = new Date()): string {
  const x = new Date(d);
  const day = x.getDay(); // 0 Sun … 6 Sat
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return localDate(x);
}

export const WEEKDAY_KEYS = [
  "meal.day.mon",
  "meal.day.tue",
  "meal.day.wed",
  "meal.day.thu",
  "meal.day.fri",
  "meal.day.sat",
  "meal.day.sun",
] as const;

export function isMealSlot(v: string): v is MealSlot {
  return MEAL_SLOTS.includes(v as MealSlot);
}
