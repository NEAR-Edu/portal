import dayjs, { ManipulateType, OpUnitType, QUnitType } from 'dayjs';

import utc from 'dayjs/plugin/utc'; // https://day.js.org/docs/en/plugin/utc
import timezone from 'dayjs/plugin/timezone'; // https://day.js.org/docs/en/timezone/converting-to-zone
import advancedFormat from 'dayjs/plugin/advancedFormat'; // https://day.js.org/docs/en/plugin/advanced-format
import relativeTime from 'dayjs/plugin/relativeTime'; // https://day.js.org/docs/en/plugin/relative-time
import { getShortTime, getTimeZoneAbbrev } from './string';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

export const defaultFormat = 'YYYY-MM-DD h:mm a zzz'; // https://day.js.org/docs/en/display/format // ONEDAY: Support locale. https://day.js.org/docs/en/plugin/localized-format

export function getFormattedDateTime(dateTime: Date | string, timeZone: string, format: string = defaultFormat) {
  const result = dayjs(dateTime).tz(timeZone).format(format); // https://day.js.org/docs/en/timezone/converting-to-zone
  console.log({ dateTime, timeZone, format, result });
  return result;
}

export function timeFromNow(moment: string, fromNow = false): string {
  return dayjs(moment).fromNow(fromNow);
}

export function timeFromNowIfSoon(moment: string, cutoffValue: number, cutoffUnit: QUnitType | OpUnitType, fromNow = false): string {
  const diff = dayjs(moment).diff(dayjs(), cutoffUnit);
  return diff <= cutoffValue ? timeFromNow(moment, fromNow) : '';
}

export function browserTimeZoneGuess(): string {
  const guess = dayjs.tz.guess(); // https://day.js.org/docs/en/timezone/guessing-user-timezone
  console.log({ guess });
  return guess;
}

export function getNowUtc(): string {
  return dayjs.utc().format();
}

export function getMomentBefore(moment: string, value: number, unit: ManipulateType): string {
  return dayjs(moment).subtract(value, unit).format();
}

function parseDuration(duration: string): { durationValue: number; durationUnit: ManipulateType } {
  const durationValue = parseInt(duration, 10);
  const durationUnit: ManipulateType = duration.includes('day') ? 'day' : 'hour'; // ONEDAY: Check that this is correct.
  console.log({ durationValue, durationUnit });
  return { durationValue, durationUnit };
}

export function getEndTime(startDateTime: Date, duration: string): Date {
  const { durationValue, durationUnit } = parseDuration(duration);
  return dayjs(startDateTime).add(durationValue, durationUnit).toDate();
}

export function getTimeRange(startDateTime: Date, duration: string): string {
  const endDateTime = getEndTime(startDateTime, duration);
  const timeZoneAbbrev = getTimeZoneAbbrev(startDateTime);
  return `${getShortTime(startDateTime)} - ${getShortTime(endDateTime)} ${timeZoneAbbrev}`;
}
