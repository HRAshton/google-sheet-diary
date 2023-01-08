function test_statistics() {
  Statistics.refresh();
}

class Statistics {
  static refresh(task) {
    const rows = Statistics.getCells();

    assert(rows.every(row => row.length === 1 + 15 + 3 + 1 + 139), 'Unexpected columns count');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Сводка');

    TaskManager.ensureNotCancelled(task);
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, sheet.getMaxColumns()).clear();
    sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }

  static getCells() {
    const todoListData = Statistics.getTodoData();
    const emotionsData = Statistics.getEmotionsData();
    const testsData = Statistics.getTestsData();

    const allHeaders = [
      ...Object.keys(todoListData),
      ...Object.keys(emotionsData),
      ...Object.values(testsData).flatMap(x => Object.keys(x)),
    ]
      .filter((item, i, arr) => arr.indexOf(item) === i);

    const rows = [];
    for (const header of allHeaders) {
      const date = headerToDate(header);

      const emotions = emotionsData[header]
        ? emotionsData[header].sort((a, b) => a[1].localeCompare(b[1]))
        : Array(139).fill([false, null]);
      assert(emotions.length === 139, 'Unexpected emotions count at ' + header);

      rows.push([
        date,

        ...(todoListData[header] || Array(15).fill('')),

        testsData['Бернс'][header] || '',
        testsData['Гамильтон'][header] || '',
        testsData['Бек'][header] || '',

        emotions
          .filter(pair => pair[0])
          .map(pair => pair[1])
          .join(','),
        ...emotions.map(pair => pair[0]),
      ]);
    }

    rows.sort((a, b) => a[0] - b[0]);

    return rows;
  }

  static getTodoData() {
    const rowsPerDay = 17;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Тудулист');

    const daysCount = sheet.getMaxRows() / rowsPerDay;
    assert(Math.round(daysCount) === daysCount, 'Лишние строки в ' + sheet.getName());

    const headersRows = Array.from({ length: daysCount }, (_, i) => i * rowsPerDay + 1);

    const data = {};
    for (const headerRow of headersRows) {
      const header = sheet.getRange(headerRow, 1).getValue();
      assert(header.match(/^\d+ [а-я]+ \d{4}, [а-я]+/), 'Странный заголовок в todo: ' + header);

      const values = sheet.getRange(headerRow + 1, 2, rowsPerDay - 2)
        .getValues()
        .map(row => row[0]);
      data[header] = values;
    }

    return data;
  }

  static getEmotionsData() {
    const rowsPerDay = 36;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Эмоции');

    const daysCount = sheet.getMaxRows() / rowsPerDay;
    assert(Math.round(daysCount) === daysCount, 'Лишние строки в ' + sheet.getName());

    const headersRows = Array.from({ length: daysCount }, (_, i) => i * rowsPerDay + 1);

    const data = {};
    for (const headerRow of headersRows) {
      const header = sheet.getRange(headerRow, 1).getValue();
      assert(header.match(/^\d+ [а-я]+ \d{4}, [а-я]+/), 'Странный заголовок: ' + header);

      const emotions = [
        sheet.getRange(headerRow + 3, 1, 16, 2),
        sheet.getRange(headerRow + 3, 3, 21, 2),
        sheet.getRange(headerRow + 3, 5, 18, 2),
        sheet.getRange(headerRow + 3, 7, 19, 2),
        sheet.getRange(headerRow + 3, 9, 22, 2),

        sheet.getRange(headerRow + 26, 1, 7, 2),
        sheet.getRange(headerRow + 26, 3, 9, 2),
        sheet.getRange(headerRow + 26, 5, 9, 2),
        sheet.getRange(headerRow + 26, 7, 9, 2),
        sheet.getRange(headerRow + 26, 9, 9, 2),
      ]
        .flatMap(range => range.getValues())
        .map(pair => [!!pair[0], pair[1]]);

      assert(emotions.length === 139, 'Wrong emotions count.');
      assert(emotions.every(x => !!x[1]), 'Emotion empty.');

      data[header] = emotions;
    }

    return data;
  }

  static getTestsData() {
    const rowsPerDay = [
      { sheetName: 'Бернс', rows: 32 },
      { sheetName: 'Гамильтон', rows: 25 },
      { sheetName: 'Бек', rows: 24 },
    ];
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const data = {};
    for (const sheetWithRows of rowsPerDay) {
      const sheet = ss.getSheetByName(sheetWithRows.sheetName);

      const daysCount = sheet.getMaxRows() / sheetWithRows.rows;
      assert(Math.round(daysCount) === daysCount, 'Лишние строки в ' + sheet.getName());

      const headersRows = Array.from({ length: daysCount }, (_, i) => i * sheetWithRows.rows + 1);

      data[sheetWithRows.sheetName] = {};
      for (const headerRow of headersRows) {
        const header = sheet.getRange(headerRow, 1).getValue();
        assert(header.match(/^\d+ [а-я]+ \d{4}, [а-я]+/), 'Странный заголовок в todo: ' + header);

        const value = sheet.getRange(headerRow + sheetWithRows.rows - 2, 2).getValue();
        data[sheetWithRows.sheetName][header] = value;
      }
    }

    return data;
  }
}