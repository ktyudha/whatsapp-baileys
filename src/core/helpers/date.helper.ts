import dayjs from "dayjs";
import "dayjs/locale/id";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.locale("id");
dayjs.extend(customParseFormat);

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────

export type DateInput = Date | string;

export type DateSeparator = "-" | "." | "/";

export type DateFormat =
  | "YMD" // 2026-08-01
  | "JFY" // 01 Agustus 2026
  | "JFYs" // 01 Ags 2026
  | "DayJFY" // Senin, 01 Agustus 2026
  | "MDY" // 08/01/2026
  | "YM" // 2026/08
  | "MY" // Agustus 2026
  | "Time" // 14:30
  | "DateTime"; // 2026-08-01 14:30

export type DateRangeTemplates = {
  full: string;
  sameYear: string;
  sameMonth: string;
  sameDay: string;
};

// ─────────────────────────────────────────
// PRESETS
// ─────────────────────────────────────────

export const DATE_RANGE_PRESETS: Record<DateFormat, DateRangeTemplates> = {
  YMD: {
    full: "YYYY-MM-DD",
    sameYear: "MM-DD",
    sameMonth: "DD",
    sameDay: "YYYY-MM-DD",
  },
  JFY: {
    full: "DD MMMM YYYY",
    sameYear: "DD MMMM",
    sameMonth: "DD",
    sameDay: "DD MMMM YYYY",
  },
  JFYs: {
    full: "DD MMM YYYY",
    sameYear: "DD MMM",
    sameMonth: "DD",
    sameDay: "DD MMM YYYY",
  },
  DayJFY: {
    full: "dddd, DD MMMM YYYY",
    sameYear: "dddd, DD MMMM",
    sameMonth: "DD",
    sameDay: "dddd, DD MMMM YYYY",
  },
  MDY: {
    full: "MM/DD/YYYY",
    sameYear: "MM/DD",
    sameMonth: "DD",
    sameDay: "MM/DD/YYYY",
  },
  YM: {
    full: "YYYY/MM",
    sameYear: "MM",
    sameMonth: "MM",
    sameDay: "YYYY/MM",
  },
  MY: {
    full: "MMMM YYYY",
    sameYear: "MMMM",
    sameMonth: "MMMM",
    sameDay: "MMMM YYYY",
  },
  Time: {
    full: "HH:mm",
    sameYear: "HH:mm",
    sameMonth: "HH:mm",
    sameDay: "HH:mm",
  },
  DateTime: {
    full: "YYYY-MM-DD HH:mm",
    sameYear: "MM-DD HH:mm",
    sameMonth: "DD HH:mm",
    sameDay: "HH:mm",
  },
};

// ─────────────────────────────────────────
// CONSTANTS (Dipindahkan ke atas agar aman diakses)
// ─────────────────────────────────────────

export const today = new Date();

export const formatDateAsYMD = (
  date: DateInput,
  separator: DateSeparator = "-",
): string => dayjs(date).format(`YYYY${separator}MM${separator}DD`);

export const formatDateAsJFY = (date: DateInput, short = false): string =>
  dayjs(date)
    .locale("id")
    .format(short ? "DD MMM YYYY" : "DD MMMM YYYY");

export const formatDateAsYM = (date: DateInput, template = "YYYY/MM"): string =>
  dayjs(date).format(template);

export const todayYMDString = formatDateAsYMD(today);
export const todayJFYString = formatDateAsJFY(today);
export const todayYM = formatDateAsYM(today); // 2026/08
export const todayYMDash = formatDateAsYM(today, "YYYY-MM"); // 2026-08
export const todayMYDash = formatDateAsYM(today, "MM-YYYY"); // 08-2026
export const todayMYSlash = formatDateAsYM(today, "MM/YYYY"); // 08/2026

// CURRENT
export const currentMonth = today.getMonth();
export const currentYear = today.getFullYear();

// ─────────────────────────────────────────
// FORMATTERS
// ─────────────────────────────────────────

export const formatDateAsDayJFY = (date: DateInput): string =>
  dayjs(date).locale("id").format("dddd, DD MMMM YYYY");

export const formatDateAsMDY = (
  date: DateInput,
  separator: DateSeparator = "/",
): string => dayjs(date).format(`MM${separator}DD${separator}YYYY`);

export const formatTime = (date: DateInput, template = "HH:mm"): string =>
  dayjs(date).format(template);

export const parseYMToMY = (ym: string): string =>
  dayjs(ym).locale("id").format("MMMM YYYY");

// ADD DAYS
export interface AddDaysProps {
  days: number;
  date?: DateInput;
  format?: DateFormat;
}

export const addDays = ({
  days,
  date = today,
  format,
}: AddDaysProps): string | Date => {
  const result = dayjs(date).add(days, "day");
  if (!format) return result.toDate();

  const template = DATE_RANGE_PRESETS[format].full;
  return result.locale("id").format(template);
};

// ─────────────────────────────────────────
// DATE RANGE
// ─────────────────────────────────────────

export const formatDateRange = (
  startDate: DateInput,
  endDate: DateInput,
  preset: DateFormat | DateRangeTemplates = "YMD",
): string => {
  const start = dayjs(startDate).locale("id");
  const end = dayjs(endDate).locale("id");

  const templates: DateRangeTemplates =
    typeof preset === "string" ? DATE_RANGE_PRESETS[preset] : preset;

  const sameYear = start.year() === end.year();
  const sameMonth = sameYear && start.month() === end.month();
  const sameDay = sameMonth && start.date() === end.date();

  if (sameDay) return start.format(templates.sameDay);
  if (sameMonth)
    return `${start.format(templates.sameMonth)} - ${end.format(templates.full)}`;
  if (sameYear)
    return `${start.format(templates.sameYear)} - ${end.format(templates.full)}`;

  return `${start.format(templates.full)} - ${end.format(templates.full)}`;
};

// ─────────────────────────────────────────
// PARSERS
// ─────────────────────────────────────────

export const formatMonthValue = (date = new Date()): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const parseMonthValue = (
  value: string,
): { year: number; month: number } => {
  const [year, month] = value.split("-");
  return { year: Number(year), month: Number(month) };
};

export const parseMonthAndRange = (
  value: string,
  template?: string,
): { year: number; month: number; start_date: string; end_date: string } => {
  const base = dayjs(value, ["YYYY-MM", "MM-YYYY"], true);
  return {
    year: base.year(),
    month: base.month() + 1,
    start_date: base.startOf("month").format(template ?? "YYYY-MM-DD"),
    end_date: base.endOf("month").format(template ?? "YYYY-MM-DD"),
  };
};

export const parseYMDToDate = (ymd: string): Date =>
  dayjs(ymd, "YYYY-MM-DD").toDate();

export const parseDateTimeToDate = (
  value: string,
  template = "YYYY-MM-DD HH:mm:ss",
): Date => dayjs(value, template).toDate();

// ─────────────────────────────────────────
// VALIDATORS
// ─────────────────────────────────────────

export const isEqualToday = (date: DateInput): boolean =>
  dayjs(date).isSame(dayjs(), "day");

export const isBeforeToday = (date: DateInput): boolean =>
  dayjs(date).isBefore(dayjs(), "day");

export const isDateAfterToday = (date: DateInput): boolean =>
  dayjs(date).isAfter(dayjs(), "day");
