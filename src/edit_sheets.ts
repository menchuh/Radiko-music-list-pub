import dayjs from 'dayjs';

/**
 * 二次元配列のデータをスプレッドシートに書き込む関数
 * @param data string[][]
 * @return void
 */
export function saveDataToSheet(data: string[][]): void {
  // プロパティの取得
  const props = PropertiesService.getScriptProperties();
  const SHEET_NAME = props.getProperty('SHEET_NAME');
  if (!SHEET_NAME) {
    throw Error(`The script property 'SHEET_NAME' is not exist.`);
  }

  // シートの取得
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw Error(`The sheet ${SHEET_NAME} is not exists. Error!`);
  }

  // 書き込みの開始位置、終了位置を取得
  const startRowNum = sheet.getLastRow() + 1;
  const startColumnNum = 1;
  const addValuesCount = data.length;
  const addValueElementCount = data[0].length;
  const range = sheet.getRange(
    startRowNum,
    startColumnNum,
    addValuesCount,
    addValueElementCount
  );

  // 書き込み
  range.setValues(data);
}

/**
 * XMLのitem Elementから必要なattributeを取得する関数
 * @param item Element
 * @returns string[]
 */
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
