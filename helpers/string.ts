/* eslint-disable import/prefer-default-export */

export function getShortLocalizedDate(dateTime: Date): string {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
  // https://stackoverflow.com/a/70589451/470749
  const locale = undefined; // Detects from browser
  const day = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
  }).format(dateTime);
  const dateTimeStr = new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short',
  })
    .format(dateTime)
    .replaceAll(',', '');
  const timeZone = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    timeZoneName: 'short',
  })
    .format(dateTime)
    .slice(4); // removes the 2-digit day and the comma and space. https://bobbyhadz.com/blog/javascript-get-timezone-name#:~:text=Use%20the%20Intl.,resolvedOptions().
  return `${day} ${dateTimeStr} ${timeZone}`;
}
