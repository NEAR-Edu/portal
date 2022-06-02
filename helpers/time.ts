import dayjs, { OpUnitType, QUnitType } from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // https://day.js.org/docs/en/timezone/converting-to-zone
import advancedFormat from 'dayjs/plugin/advancedFormat'; // https://day.js.org/docs/en/plugin/advanced-format
import relativeTime from 'dayjs/plugin/relativeTime'; // https://day.js.org/docs/en/plugin/relative-time

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

export const defaultFormat = 'YYYY-MM-DD h:mm a zzz'; // https://day.js.org/docs/en/display/format // TODO: Support locale. https://day.js.org/docs/en/plugin/localized-format

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
