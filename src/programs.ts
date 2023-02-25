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

enum StartionId {
  FMT = 'FMT', // TOKYO FM
  INT = 'INT', // interfm
}

/**
 * 曜日に対応した番組表を返す関数
 * @param day number
 * @returns Program[]
 */
export function getProgramsList(day: number): Program[] {
  // 番組リスト
  const data: dataConfig = {
    programs: {
      '0': [],
      '4': [
        {
          title: 'レック クリンぱっ！presents 佐藤満春のジャマしないラジオ',
          station_id: StartionId.INT,
          start_time: '2200',
          end_time: '2300',
        },
      ],
      '5': [
        {
          title: 'ヒアロビューティー presents トーキョー・エフエムロヒー',
          station_id: StartionId.FMT,
          start_time: '1200',
          end_time: '1230',
        },
        {
          title: 'ベルク presents 日向坂46の余計な事までやりましょう',
          station_id: StartionId.FMT,
          start_time: '2000',
          end_time: '2030',
        },
      ],
    },
  };

  // 曜日に対応した番組リストを返す
  return data.programs[String(day)];
}
