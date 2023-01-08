class Refreshers {
  static refreshAll(task) {
    TaskManager.ensureNotCancelled(task);
    Refreshers.refreshCalendar(task);

    TaskManager.ensureNotCancelled(task);
    Refreshers.refreshTests(task);

    TaskManager.ensureNotCancelled(task);
    Refreshers.refreshTodo(task);
  }

  static refreshTests() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetNames = ['Бернс', 'Гамильтон', 'Бек'];

    for (const sheetName of sheetNames) {
      const sheet = ss.getSheetByName(sheetName);

      const values = sheet.getRange('A1:B').getValues();
      let sum = 0;
      for (let rowIndex = 0; rowIndex < values.length; rowIndex++) {
        const isEmptyLine = !values[rowIndex][0] && !values[rowIndex][1];
        if (isEmptyLine) {
          sheet.getRange(rowIndex, 2).setValue(sum);
          sum = 0;
          continue;
        }

        const isSelected = !!values[rowIndex][0] && !!values[rowIndex][1];
        if (!isSelected) {
          continue;
        }

        const validation = sheet.getRange(rowIndex + 1, 2).getDataValidation();
        if (!validation) {
          continue;
        }

        const options = validation.getCriteriaValues()[0];
        const optionIndex = options.indexOf(values[rowIndex][1]);
        sum += optionIndex;
      }
    }
  }

  static refreshCalendar() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const calendarRange = ss.getRangeByName('Calendar');
    const importantDays = ss.getRange('Ежедневник!H18:H').getValues()
      .map(x => x[0])
      .filter(x => !!x)
      .map(x => new Date(x).getDate());

    calendarRange.setFontStyle('normal');

    const currentDate = new Date();
    const calendar = new Calendar();
    const calendarDays = calendar.getDays(currentDate.getMonth(), currentDate.getFullYear());

    const calendarCells = [];
    const fontStyles = [];
    const backgrounds = [];
    for (let row = 0; row < 6; row++) {
      calendarCells.push([]);
      fontStyles.push([]);
      backgrounds.push([]);

      // Заполняем календарь.
      for (let col = 0; col < 7; col++) {
        const day = calendarDays[row * 7 + col];
        calendarCells[row].push(day.thisMonth ? day.day : '');
        fontStyles[row].push(importantDays.includes(day.day) ? 'bold' : 'normal');
      }

      // Помечаем цветом ячейки: важные, текущую неделю и "другие".
      const isCurrentWeek = calendarCells[row].includes(currentDate.getDate());
      for (let col = 0; col < 7; col++) {
        backgrounds[row].push(fontStyles[row][col] === 'bold'
          ? '#D5A6BD'
          : isCurrentWeek
            ? '#9fc5e8'
            : '#ebf6ff');
      }
    }

    calendarRange.setValues(calendarCells);
    calendarRange.setFontWeights(fontStyles);
    calendarRange.setBackgrounds(backgrounds);
  }

  static refreshTodo(task) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const todoSheet = ss.getSheetByName('Тудулист');
    const emotionsSheet = ss.getSheetByName('Эмоции');
    const foodSheet = ss.getSheetByName('Питание');
    const plannerSheet = ss.getSheetByName('Ежедневник');

    const daysCount = todoSheet.getMaxRows() / 17;
    assert(Math.round(daysCount) === daysCount, 'Лишние строки в TodoList.');

    const headersRows = Array.from({ length: daysCount }, (_, i) => i * 17 + 1);

    for (const headerRow of headersRows) {
      TaskManager.ensureNotCancelled(task);
      const header = todoSheet.getRange(headerRow, 1).getValue();
      assert(header.match(/^\d+ [а-я]+ \d{4}, [а-я]+/), 'Странный заголовок в todo: ' + header);

      const emotionsHeaderRow = Refreshers._findHeaderRow(emotionsSheet, header);
      if (!emotionsHeaderRow) {
        Logger.log('Header missing in emotions: ' + header);
      } else {
        const values = emotionsSheet.getRange(emotionsHeaderRow, 1, 35, 10).getValues();
        const isFilled = values.flatMap(row => row).some(val => val === true);
        todoSheet.getRange(headerRow + 4, 2).setValue(isFilled ? 'Заполнено' : 'Не заполнено');
      }

      const foodHeaderRow = Refreshers._findHeaderRow(foodSheet, header);
      if (!foodHeaderRow) {
        Logger.log('Header missing in food: ' + header);
      } else {
        const values = foodSheet.getRange(foodHeaderRow + 2, 1, 21, 6).getValues();
        const isFilled = values.some(row => !!row[1]);
        const isBad = values.some(row => !!row[3]);
        todoSheet.getRange(headerRow + 2, 2, 2).setValues([
          [isFilled ? 'Заполнено' : 'Не заполнено'],
          [isBad ? 'Да' : 'Нет'],
        ]);
      }

      const prodHeaderRow = Refreshers._findHeaderRow(plannerSheet, header);
      if (!prodHeaderRow) {
        Logger.log('Header missing in planner: ' + header);
      } else {
        const value = plannerSheet.getRange(prodHeaderRow, 6).getValue();
        const parts = value.split('/');
        const productivity = parts[0] / Math.max(parts[1], 1);
        todoSheet.getRange(headerRow + 6, 2).setValue(productivity);
      }
    }
  }

  static _findHeaderRow(sheet, header) {
    return sheet.createTextFinder(header)
      .matchEntireCell(true)
      .findNext()
      ?.getRow();
  }
}
