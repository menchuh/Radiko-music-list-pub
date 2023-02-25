import dayjs from 'dayjs';

export function saveDataToSheet(data: string[][]): void {
  // 定数
  const SHEET_NAME = '曲目リスト';

  // シートの取得
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw Error(`The sheet ${SHEET_NAME} is not exists. Error!`);
  }

  // 書き込みの開始位置、終了位置を取得
  const START_ROW_NUM = sheet.getLastRow() + 1;
  const START_COLUMN_NUM = 1;
  const ADD_VALUES_NUM = data.length;
  const ADD_VALUE_ELEMENT_NUM = data[0].length;
  const range = sheet.getRange(
    START_ROW_NUM,
    START_COLUMN_NUM,
    ADD_VALUES_NUM,
    ADD_VALUE_ELEMENT_NUM
  );

  // 書き込み
  range.setValues(data);
}

export function getRowData(
  item: GoogleAppsScript.XML_Service.Element
): string[] {
  return [
    item.getAttribute('program_title').getValue(),
    item.getAttribute('artist').getValue(),
    item.getAttribute('title').getValue(),
    dayjs(item.getAttribute('stamp').getValue()).format(
      'YYYY/MM/DD(dd) HH:mm:ss'
    ),
  ];
}
