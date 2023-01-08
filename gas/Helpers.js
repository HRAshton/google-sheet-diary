function dateToHeader(date) {
  const days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  const dateStr = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${days[date.getDay()]}`;

  return dateStr; // + " copy " + new Date().getMinutes();
}

function headerToDate(header) {
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  const parts = header.split(' ');
  const day = parts[0];
  const month = months.indexOf(parts[1]);
  const year = parts[2].substring(0, 4);

  const date = new Date(year, month, day);

  date.setTime(date.getTime() + 4 * 60 * 60 * 1000); // To Moscow timezone.

  return date;
}

function assert(cond, errorMessage) {
  if (!cond) {
    throw new Error(errorMessage);
  }
}