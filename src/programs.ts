import { StartionId } from './stations';

export type Program = {
  title: string;
  station_id: StartionId;
  start_time: string;
  end_time: string;
};

type dataConfig = {
  programs: {
    [key: string]: Program[];
  };
};

/**
 * 曜日に対応した番組表を返す関数
 * @param day number
 * @returns Program[]
 */
export function getProgramsList(day: number): Program[] {
  // 番組リスト
  const data: dataConfig = {
    programs: {
      // 日曜日
      '0': [
        {
          title: 'TAKUMIZM',
          station_id: StartionId.BAYFM78,
          start_time: '0030',
          end_time: '0100',
        },
        {
          title: '阿川佐和子＆ふかわりょう 日曜のほとり',
          station_id: StartionId.QRR,
          start_time: '1000',
          end_time: '1200',
        },
        {
          title: 'UR LIFESTYLE COLLEGE',
          station_id: StartionId.FMJ,
          start_time: '1800',
          end_time: '1900',
        },
        {
          title: '802 BINTANG GARDEN',
          station_id: StartionId.FM802,
          start_time: '2100',
          end_time: '2200',
        },
        {
          title: 'Mercedes-Benz THE EXPERIENCE',
          station_id: StartionId.FMJ,
          start_time: '2100',
          end_time: '2200',
        },
        {
          title: 'MUSIC FREAKS',
          station_id: StartionId.FM802,
          start_time: '2200',
          end_time: '2359',
        },
      ],
      // 月曜日
      '1': [
        {
          title: 'Daisy Holiday!',
          station_id: StartionId.INT,
          start_time: '0100',
          end_time: '0130',
        },
        {
          title: 'FLAG RADIO',
          station_id: StartionId.ALPHASTATION,
          start_time: '2100',
          end_time: '2200',
        },
        {
          title: 'ROCK KIDS 802 -OCHIKEN Goes ON!!-',
          station_id: StartionId.FM802,
          start_time: '2200',
          end_time: '2300',
        },
      ],
      // 火曜日
      '2': [],
      // 水曜日
      '3': [
        {
          title: 'SPARK',
          station_id: StartionId.FMJ,
          start_time: '0000',
          end_time: '0100',
        },
      ],
      // 木曜日
      '4': [
        {
          title: 'JUMP OVER',
          station_id: StartionId.FMJ,
          start_time: '0200',
          end_time: '0300',
        },
        {
          title: 'レック クリンぱっ!presents 佐藤満春のジャマしないラジオ',
          station_id: StartionId.INT,
          start_time: '2200',
          end_time: '2300',
        },
      ],
      // 金曜日
      '5': [
        {
          title: 'ヒアロビューティー presents トーキョー・エフエムロヒー',
          station_id: StartionId.FMT,
          start_time: '1200',
          end_time: '1230',
        },
        {
          title: 'NICE POP RADIO',
          station_id: StartionId.ALPHASTATION,
          start_time: '2000',
          end_time: '2100',
        },
        {
          title: 'J-WAVE MONTHLY SELECTION',
          station_id: StartionId.FMJ,
          start_time: '2200',
          end_time: '2230',
        },
      ],
      // 土曜日
      '6': [
        {
          title: 'WATASHITACHI NO SLEEPOVER',
          station_id: StartionId.FMJ,
          start_time: '0130',
          end_time: '0200',
        },
        {
          title: 'FLIP SIDE PLANET',
          station_id: StartionId.FMJ,
          start_time: '0230',
          end_time: '0300',
        },
        {
          title: 'JA全農 COUNTDOWN JAPAN',
          station_id: StartionId.FMT,
          start_time: '1300',
          end_time: '1353',
        },
        {
          title: 'NTT Group BIBLIOTHECA 〜THE WEEKEND LIBRARY〜',
          station_id: StartionId.FMJ,
          start_time: '1500',
          end_time: '1600',
        },
      ],
    },
  };

  // 曜日に対応した番組リストを返す
  return data.programs[String(day)];
}
