import dayjs from "dayjs";
import { parse } from "date-fns";
import advancedFormat from "dayjs/plugin/advancedFormat";

import { RangeValue } from "@react-types/shared";

dayjs.extend(advancedFormat);

export function parseDate(dateValue: string | undefined) {
  if (dateValue == null) return;

  const parsedDate = parse(dateValue, "yyyyyy-MM-dd", new Date());

  // Check for Invalid Date
  if (isNaN(+parsedDate)) return;
  parsedDate.setHours(new Date().getHours());
  return parsedDate;
}

export const parseRangeDate = (
  date?: RangeValue<string>,
): RangeValue<Date> | undefined => {
  if (!date) return;

  const start = parseDate(date.start);
  const end = parseDate(date.end);
  if (!start || !end) return;
  return { start, end };
};

export function stringifyDate(date: Date) {
  return format(date, "YYYY-MM-DD");
}

export function isInvalidDateRange(
  value: Date,
  minValue?: Date,
  maxValue?: Date,
) {
  return (
    value != null &&
    ((minValue != null && value < minValue) ||
      (maxValue != null && value > maxValue))
  );
}

export const subDays = (date: Date, amount: number) =>
  dayjs(date).subtract(amount, "day").toDate();

export const subMonths = (date: Date, amount: number) =>
  dayjs(date).subtract(amount, "months").toDate();

export const subWeeks = (date: Date, amount: number) =>
  dayjs(date).subtract(amount, "weeks").toDate();

export const subYears = (date: Date, amount: number) =>
  dayjs(date).subtract(amount, "years").toDate();

export const addDays = (date: Date, amount: number) =>
  dayjs(date).add(amount, "day").toDate();

export const addMonths = (date: Date, amount: number) =>
  dayjs(date).add(amount, "months").toDate();

export const addYears = (date: Date, amount: number) =>
  dayjs(date).add(amount, "years").toDate();

export const addWeeks = (date: Date, amount: number) =>
  dayjs(date).add(amount, "weeks").toDate();

export const getDate = (date: Date) => dayjs(date).get("date");

export const getHours = (date: Date) => dayjs(date).get("hours");

export const getMinutes = (date: Date) => dayjs(date).get("minutes");

export const getMonth = (date: Date) => dayjs(date).get("months");

export const getSeconds = (date: Date) => dayjs(date).get("seconds");

export const getYear = (date: Date) => dayjs(date).get("years");

export const setDate = (date: Date, value: number) =>
  dayjs(date).set("date", value).toDate();

export const setHours = (date: Date, value: number) =>
  dayjs(date).set("hour", value).toDate();

export const setMinutes = (date: Date, value: number) =>
  dayjs(date).set("minute", value).toDate();

export const setSeconds = (date: Date, value: number) =>
  dayjs(date).set("second", value).toDate();

export const setMonth = (date: Date, value: number) =>
  dayjs(date).set("month", value).toDate();

export const setYear = (date: Date, value: number) =>
  dayjs(date).set("year", value).toDate();

export const startOfMonth = (date: Date) => {
  return dayjs(date).startOf("month");
};

export const startOfDay = (date: Date) => {
  return dayjs(date).startOf("day");
};

export const endOfMonth = (date: Date) => {
  return dayjs(date).endOf("month");
};

export const getDaysInMonth = (date: Date) => dayjs(date).daysInMonth();

export const isSameMonth = (date1: Date, date2: Date) =>
  dayjs(date1).isSame(date2, "month");

export const isSameDay = (date1: Date, date2: Date) =>
  dayjs(date1).isSame(date2, "day");

export const isWeekend = (date: Date) => {
  const day = dayjs(date).get("day");
  return day === 0 || day === 6;
};

export const format = (date: Date, fmt: string) => {
  return dayjs(date).format(fmt);
};

export function closestTo(
  dirtyDateToCompare: Date | number,
  dirtyDatesArray: (Date | number)[],
): Date {
  let dateToCompare = dayjs(dirtyDateToCompare);

  if (!dateToCompare.isValid()) {
    return new Date(NaN);
  }

  let timeToCompare = dateToCompare.toDate().getTime();

  let datesArray;
  // `dirtyDatesArray` is undefined or null
  if (dirtyDatesArray == null) {
    datesArray = [];

    // `dirtyDatesArray` is Array, Set or Map, or object with custom `forEach` method
  } else if (typeof dirtyDatesArray.forEach === "function") {
    datesArray = dirtyDatesArray;

    // If `dirtyDatesArray` is Array-like Object, convert to Array. Otherwise, make it empty Array
  } else {
    datesArray = Array.prototype.slice.call(dirtyDatesArray);
  }

  let result: Date | null;
  let minDistance: number;
  datesArray.forEach(function (dirtyDate: any) {
    let currentDate = dayjs(dirtyDate);

    if (!currentDate.isValid()) {
      result = new Date(NaN);
      minDistance = NaN;
      return;
    }

    let distance = Math.abs(timeToCompare - currentDate.toDate().getTime());
    if (result == null || distance < minDistance) {
      result = currentDate.toDate();
      minDistance = distance;
    }
  });

  // @ts-ignore
  return result;
}
