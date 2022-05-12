import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // https://day.js.org/docs/en/timezone/converting-to-zone
import advancedFormat from 'dayjs/plugin/advancedFormat'; // https://day.js.org/docs/en/plugin/advanced-format

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export const defaultFormat = 'YYYY-MM-DD h:mm a zzz'; // https://day.js.org/docs/en/display/format // TODO: Support locale. https://day.js.org/docs/en/plugin/localized-format

export function getFormattedDateTime(dateTime: Date | string, timeZone: string, format: string = defaultFormat) {
  const result = dayjs(dateTime).tz(timeZone).format(format); // https://day.js.org/docs/en/timezone/converting-to-zone
  console.log({ dateTime, timeZone, format, result });
  return result;
}
