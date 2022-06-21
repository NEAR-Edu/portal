export function getTimeZoneAbbrev(dateTime: Date): string {
  const locale = undefined; // Detects from browser
  const timeZoneAbbrev = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    timeZoneName: 'short',
  })
    .format(dateTime)
    .slice(4); // removes the 2-digit day and the comma and space. https://bobbyhadz.com/blog/javascript-get-timezone-name#:~:text=Use%20the%20Intl.,resolvedOptions().
  return timeZoneAbbrev;
}

export function getShortLocalizedDate(dateTime: Date): string {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
  // https://stackoverflow.com/a/70589451/470749
  const locale = undefined; // Detects from browser
  const dayOfWeek = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
  }).format(dateTime);
  const dateTimeStr = new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short',
  })
    .format(dateTime)
    .replaceAll(',', ''); // https://stackoverflow.com/questions/72637010/replaceall-is-not-working-in-next-js-node-js-when-deployed-to-render-com-ser
  const timeZoneAbbrev = getTimeZoneAbbrev(dateTime);
  return `${dayOfWeek} ${dateTimeStr} ${timeZoneAbbrev}`;
}

export function getFullLocalizedDate(dateTime: Date): string {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
  // https://stackoverflow.com/a/70589451/470749
  const locale = undefined; // Detects from browser
  const dayOfWeek = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
  }).format(dateTime);
  const dateTimeStr = new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
  }).format(dateTime); // https://stackoverflow.com/questions/72637010/replaceall-is-not-working-in-next-js-node-js-when-deployed-to-render-com-ser

  return `${dayOfWeek} ${dateTimeStr}`;
}

export function getShortTime(dateTime: Date): string {
  const locale = undefined; // Detects from browser
  const shortTimeStr = new Intl.DateTimeFormat(locale, {
    timeStyle: 'short',
  })
    .format(dateTime)
    .toLowerCase();
  return shortTimeStr;
}
