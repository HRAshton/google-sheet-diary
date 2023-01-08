class Calendar {
  getDays(monthIndex, year) {
    var firstDay = Calendar.getFirstDayOfMonth(monthIndex, year).getDay();
    if (firstDay == 0)
      firstDay = 6;
    else
      firstDay--;

    var daysFromLastMonth = firstDay;
    var result = [];

    var daysInLastMonth = Calendar.daysInMonth(monthIndex - 1);
    var first = daysInLastMonth - daysFromLastMonth + 1;
    for (var i = 0; i < daysFromLastMonth; i++) {
      result.push(Calendar.MonthDay(first + i, false));
    }

    for (var i = 1; i <= Calendar.daysInMonth(monthIndex); i++)
      result.push(Calendar.MonthDay(i, true));

    var daysDone = result.length;
    var daysToGo = (6 * 7) - daysDone;
    for (var i = 1; i <= daysToGo; i++)
      result.push(Calendar.MonthDay(i, false));

    return result;
  }

  static getFirstDayOfMonth(zeroBasedMonthNum, fullYear) {
    var monthNames = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var dateStr = `${monthNames[zeroBasedMonthNum]} 1, ${fullYear}, 00:00:00`;
    var monthStart = new Date(dateStr);
    return monthStart;
  }

  static daysInMonth(zeroBasedMonthNumber) {
    var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return days[zeroBasedMonthNumber];
  }

  static MonthDay(number, isThisMonth) {
    return {
      day: number,
      thisMonth: isThisMonth,
    };
  }
}
