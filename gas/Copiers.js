function test_copiers() {
  Copiers.copyAll();
}

class Copiers {
  static copyAll() {
    Copiers.copyEmotions();
    Copiers.copyPlanner();
    Copiers.copyFood();

    Copiers.copyBerns();
    Copiers.copyHamilton();
    Copiers.copyBek();

    Copiers.copyTodo();
  }

  static copyEmotions() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Эмоции');

    const currentDate = dateToHeader(new Date());
    const lastDate = sheet.getRange('A1').getValue();
    if (currentDate === lastDate) {
      Logger.log('Date is actual.');
      return;
    }

    sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(pr => pr.remove());

    sheet.insertRowsBefore(1, 36);
    sheet.getRange('A37:72').copyTo(sheet.getRange('A1:36'));

    // Clear and init
    sheet.getRange('A1').setValue(currentDate);
    sheet.getRangeList([
      'A4:A19', 'C4:C24', 'E4:E21', 'G4:G22', 'I4:I25',
      'A27:A33', 'C27:C35', 'E27:E35', 'G27:G35', 'I27:I35'
    ]).setValue(false);

    // Shadow old
    Copiers._shadow(sheet, 'A37:J');

    // Protect
    Copiers._protect(
      sheet,
      36,
      [
        { start: { row: 4, col: 1 }, end: { row: 19, col: 1 } },
        { start: { row: 4, col: 3 }, end: { row: 24, col: 3 } },
        { start: { row: 4, col: 5 }, end: { row: 21, col: 5 } },
        { start: { row: 4, col: 7 }, end: { row: 22, col: 7 } },
        { start: { row: 4, col: 9 }, end: { row: 25, col: 9 } },

        { start: { row: 27, col: 1 }, end: { row: 33, col: 1 } },
        { start: { row: 27, col: 3 }, end: { row: 35, col: 3 } },
        { start: { row: 27, col: 5 }, end: { row: 35, col: 5 } },
        { start: { row: 27, col: 7 }, end: { row: 35, col: 7 } },
        { start: { row: 27, col: 9 }, end: { row: 35, col: 9 } },
      ],
      []);
  }

  static copyPlanner() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Ежедневник');

    const currentDate = dateToHeader(new Date());
    const lastDate = sheet.getRange('A1').getValue();
    if (currentDate === lastDate) {
      Logger.log('Date is actual.');
      return;
    }

    sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(pr => pr.remove());

    sheet.insertRowsBefore(1, 19);
    sheet.getRange('H20:O').moveTo(sheet.getRange('H1'));

    sheet.getRange('A20:G38').copyTo(sheet.getRange('A1:G19'));
    const oldTasks = sheet.getRange('A3:F16').getValues()
      .filter(vals => !vals[1] && !!vals[2]);

    // Clear and init
    sheet.getRange('A1').setValue(currentDate);
    sheet.getRangeList(['A3:F16', 'B17']).clearContent();
    if (oldTasks.length > 0) {
      sheet.getRange(3, 1, oldTasks.length, 6).setValues(oldTasks);
    }

    // Shadow old
    Copiers._shadow(sheet, 'A20:G');

    // Protect
    Copiers._protect(
      sheet,
      19,
      [
        { start: { row: 3, col: 1 }, end: { row: 16, col: 6 } },
        { start: { row: 17, col: 2 }, end: { row: 18, col: 6 } },
      ],
      ['H3:O9', 'H18:O']);
  }

  static copyFood() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Питание');

    const currentDate = dateToHeader(new Date());
    const lastDate = sheet.getRange('A1').getValue();
    if (currentDate === lastDate) {
      Logger.log('Date is actual.');
      return;
    }

    sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(pr => pr.remove());

    sheet.insertRowsBefore(1, 23);
    sheet.getRange('A24:46').copyTo(sheet.getRange('A1:23'));

    // Clear and init
    sheet.getRange('A1').setValue(currentDate);
    sheet.getRange('A3:22').clearContent();

    // Shadow old
    Copiers._shadow(sheet, 'A24:F');

    // Protect
    Copiers._protect(
      sheet,
      23,
      [
        { start: { row: 3, col: 1 }, end: { row: 22, col: 6 } },
      ],
      []);
  }

  static copyBerns() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Бернс');

    const currentDate = dateToHeader(new Date());
    const lastDate = sheet.getRange('A1').getValue();
    if (currentDate === lastDate) {
      Logger.log('Date is actual.');
      return;
    }

    sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(pr => pr.remove());

    sheet.insertRowsBefore(1, 32);
    sheet.getRange('A33:64').copyTo(sheet.getRange('A1:33'));

    // Clear and init
    sheet.getRange('A1').setValue(currentDate);
    sheet.getRange('B3:B31').clearContent();

    // Shadow old
    Copiers._shadow(sheet, 'A33:B');

    // Protect
    Copiers._protect(
      sheet,
      32,
      [
        { start: { row: 3, col: 2 }, end: { row: 20, col: 2 } },
        { start: { row: 22, col: 2 }, end: { row: 26, col: 2 } },
        { start: { row: 28, col: 2 }, end: { row: 30, col: 2 } },
      ],
      []);
  }

  static copyHamilton() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Гамильтон');

    const currentDate = dateToHeader(new Date());
    const lastDate = sheet.getRange('A1').getValue();
    if (currentDate === lastDate) {
      Logger.log('Date is actual.');
      return;
    }

    sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(pr => pr.remove());

    sheet.insertRowsBefore(1, 25);
    sheet.getRange('A26:50').copyTo(sheet.getRange('A1:25'));

    // Clear and init
    sheet.getRange('A1').setValue(currentDate);
    sheet.getRange('B2:B24').clearContent();

    // Shadow old
    Copiers._shadow(sheet, 'A26:B');

    // Protect
    Copiers._protect(
      sheet,
      25,
      [
        { start: { row: 2, col: 2 }, end: { row: 23, col: 2 } }
      ],
      []);
  }

  static copyBek() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Бек');

    const currentDate = dateToHeader(new Date());
    const lastDate = sheet.getRange('A1').getValue();
    if (currentDate === lastDate) {
      Logger.log('Date is actual.');
      return;
    }

    sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(pr => pr.remove());

    sheet.insertRowsBefore(1, 24);
    sheet.getRange('A25:48').copyTo(sheet.getRange('A1:24'));

    // Clear and init
    sheet.getRange('A1').setValue(currentDate);
    sheet.getRange('B2:B23').clearContent();

    // Shadow old
    Copiers._shadow(sheet, 'A25:B');

    // Protect
    Copiers._protect(
      sheet,
      24,
      [
        { start: { row: 2, col: 2 }, end: { row: 22, col: 2 } }
      ],
      []);
  }

  static copyTodo() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Тудулист');

    const currentDate = dateToHeader(new Date());
    const lastDate = sheet.getRange('A1').getValue();
    if (currentDate === lastDate) {
      Logger.log('Date is actual.');
      return;
    }

    sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(pr => pr.remove());

    sheet.insertRowsBefore(1, 17);
    sheet.getRange('A18:34').copyTo(sheet.getRange('A1:17'));

    // Clear and init
    sheet.getRange('A1').setValue(currentDate);
    sheet.getRange('B2:B16').clearContent();

    // Shadow old
    Copiers._shadow(sheet, 'A18:B');

    // Protect
    Copiers._protect(
      sheet,
      17,
      [
        { start: { row: 2, col: 2 }, end: { row: 2, col: 2 } },
        { start: { row: 6, col: 2 }, end: { row: 6, col: 2 } },
        { start: { row: 8, col: 2 }, end: { row: 16, col: 2 } },
      ],
      []);
  }

  static _shadow(sheet, rangeName) {
    sheet.getRange(rangeName).setFontColor('lightgrey');
    sheet.getRange(rangeName).setBackground('white');
  }

  static _protect(sheet, rowsPerDay, relativeEditableRanges, absoluteEditableRanged) {
    const daysCount = sheet.getMaxRows() / rowsPerDay;
    assert(Math.round(daysCount) === daysCount, 'Лишние строки в ' + sheet.getName());

    const unprotectedRanges = absoluteEditableRanged.map(r => sheet.getRange(r));
    const headersRows = Array.from({ length: daysCount }, (_, i) => i * rowsPerDay + 1);
    for (const headerRow of headersRows) {
      for (const rangeBorders of relativeEditableRanges) {
        const range = sheet.getRange(
          headerRow - 1 + rangeBorders.start.row,
          rangeBorders.start.col,
          rangeBorders.end.row - rangeBorders.start.row + 1,
          rangeBorders.end.col - rangeBorders.start.col + 1);

        unprotectedRanges.push(range);
      }
    }

    sheet.clearNotes();
    unprotectedRanges.forEach(x => {
      //x.setNote('Unprotected');
      Logger.log(x.getA1Notation());
    });

    const protection = sheet.protect();
    protection.setUnprotectedRanges(unprotectedRanges);
    protection.setWarningOnly(true);
  }
}