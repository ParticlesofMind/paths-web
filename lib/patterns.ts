import type { UserPattern, UserPatternRow } from "@/types/patterns";

export function toUserPattern(row: UserPatternRow): UserPattern {
  const d = row.default_settings;
  const u = row.user_settings;
  return {
    id: row.id,
    templatePatternId: d.template_pattern_id,
    name: d.pattern_name,
    symbol: d.pattern_symbol,
    method: d.pattern_method,
    archetype: d.pattern_archetype,
    feedbackType: d.feedback_type,
    timeSlot: u.time_slot,
    selectedDays: u.selected_days,
    color: u.selected_color,
    holidayEnabled: u.holiday_enabled,
    skipEnabled: u.skip_enabled,
    alertTime: u.alert_time,
    instances: Object.values(row.pattern_instances ?? {}),
  };
}

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const WEEKDAY_SHORT: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

/** Returns the Weekday string for a given Date. */
export function dateToWeekday(date: Date): string {
  return WEEKDAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
}

/** Returns the 7 dates of the ISO week containing `date` (Mon–Sun). */
export function getWeekDates(date: Date): Date[] {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const nd = new Date(d);
    nd.setDate(d.getDate() + i);
    return nd;
  });
}

/** Format a Date as "ddMMyyyy" (key format used in iOS app). */
export function formatDateKey(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}${mm}${yyyy}`;
}

/** Returns patterns scheduled on a specific weekday label. */
export function patternsForDay(patterns: UserPattern[], weekday: string): UserPattern[] {
  return patterns.filter((p) => p.selectedDays.includes(weekday));
}
