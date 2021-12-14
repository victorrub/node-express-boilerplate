export function FormatDate(date: Date = new Date()): string {
  const formattedDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const formattedTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  return `${formattedDate} ${formattedTime}`;
}
