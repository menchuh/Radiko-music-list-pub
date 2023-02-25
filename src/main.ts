import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { getProgramsList, Program } from './programs';
import { getRowData, saveDataToSheet } from './edit_sheets';

/**
 * メイン関数
 * 曲目リストをスプレッドシートに追記する
 * @returns void
 */
export function main(): void {
  // 日本語化
  dayjs.locale('ja');

  // 定数
  const SLEEP_SECOND = 1;
  // 変数
  const addValues: string[][] = [];

  try {
    // 曜日に対応した番組表を取得
    const dayOfWeek = dayjs().day() - 1; // 前日を取得する
    const programs = getProgramsList(dayOfWeek);

    // 番組がない場合は処理を終了
    if (!programs) {
      Logger.log('No program is exist today.');
      return;
    }

    // 曲目のリストを取得
    programs.forEach((p: Program) => {
      // 昨日の日付を取得
      const yesterday = dayjs().subtract(1, 'day').format('YYYYMMDD');
      // params
      const stationId = p.station_id;
      const startTime = `${yesterday}${p.start_time}00`;
      const endTime = `${yesterday}${p.end_time}00`;

      // リクエスト
      const url = `https://radiko.jp/v2/api/noa?station_id=${stationId}&ft=${startTime}&to=${endTime}`;
      const response = UrlFetchApp.fetch(url);
      Utilities.sleep(SLEEP_SECOND * 1000);

      // コンテンツ取得
      const xml = XmlService.parse(response.getContentText());
      const root = xml.getRootElement();
      const items = root.getChild('noa').getChildren('item');

      // 配列に格納
      items.forEach((item) => {
        addValues.push(getRowData(item));
      });
    });

    // スプレッドシートに追記
    saveDataToSheet(addValues);
  } catch (e) {
    Logger.log(e);
  }
}

// main関数をglobalに持たせて参照可能にする
declare let global: any;
global.main = main;
