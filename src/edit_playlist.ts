/**
 * Spotifyに関する操作を行う関数
 * @param data string[][]
 * @return void
 */
export function operateSpotify(data: string[][]): void {
  // アクセストークンを取得
  const accessToken = getAccessToken();

  // 環境変数の取得
  const props = PropertiesService.getScriptProperties().getProperties();
  const playlistId = props.PLAYLIST_ID;

  // 追加するTrackのUriを取得
  const trackUris = data
    .map((elm) => {
      const artistName = elm[1];
      const trackName = elm[2];
      return searchTrack(accessToken, trackName, artistName);
    })
    .filter((elm) => {
      return elm !== '';
    });

  addTracks(accessToken, trackUris, playlistId);
}

/**
 * アクセストークンを取得する
 * @return accessToken string
 */
function getAccessToken(): string {
  // 定数
  const TOKEN_URL = 'https://accounts.spotify.com/api/token';

  // 環境変数の取得
  const props = PropertiesService.getScriptProperties().getProperties();
  const CLIENT_ID = props.CLIENT_ID;
  const CLIENT_SECRET = props.CLIENT_SECRET;
  const REFRESH_TOKEN = props.REFRESH_TOKEN;

  // 認証情報の生成
  const auth = Utilities.base64Encode(`${CLIENT_ID}:${CLIENT_SECRET}`);

  // リクエスト
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    headers: {
      Authorization: `Basic ${auth}`,
    },
    payload: {
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    },
  };
  const response = UrlFetchApp.fetch(TOKEN_URL, options);
  const data = JSON.parse(response.getContentText());

  return data.access_token;
}

/**
 * Spotify APIでtrackを検索し、trackのIDを返す関数
 * @param accessToken string
 * @param track string
 * @param artist string
 * @return string
 */
function searchTrack(
  accessToken: string,
  track: string,
  artist: string
): string {
  // クエリストリング
  const QUERY_STRING = encodeURIComponent(`track:${track} artist:${artist}`);

  // リクエスト
  const url = `https://api.spotify.com/v1/search?q=${QUERY_STRING}&type=track`;
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());

  // トラック情報の抽出
  const trackInfo = result.tracks.items[0];

  // トラックが取得可能な場合
  if (trackInfo.uri && trackInfo.available_markets.includes('JP')) {
    return trackInfo.uri;
  } else {
    return '';
  }
}

/**
 *
 */
function addTracks(
  accessToken: string,
  trackUris: string[],
  playlistId: string
): void {
  // リクエスト
  const url = `https://api.spotify.com/v1//playlists/${playlistId}/tracks`;
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    payload: {
      uris: trackUris,
    },
  };
  const response = UrlFetchApp.fetch(url, options);
}
