type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

/**
 * Spotifyに関する操作を行う関数
 * @param data string[][]
 * @return void
 */
export function operateSpotify(data: string[][]): void {
  // 定数
  const ARTIST_NAME_INDEX = 1;
  const TRACK_NAME_INDEX = 2;

  // 環境変数の取得
  const props = PropertiesService.getScriptProperties().getProperties();
  const playlistId = props.PLAYLIST_ID;

  // アクセストークンを取得
  const accessToken = getAccessToken();

  // 追加済みのTrackのリストを取得
  const addedTrackUris = getAddedTracks(accessToken, playlistId);

  // 追加するTrackのUriを取得
  const trackUris = data
    .map((elm) => {
      const artistName = elm[ARTIST_NAME_INDEX];
      const trackName = elm[TRACK_NAME_INDEX];
      return searchTrack(accessToken, trackName, artistName);
    })
    .filter((uri) => {
      // Trackの重複を防ぐ
      return uri !== '' && !addedTrackUris.includes(uri);
    });

  // Trackをプレイリストに追加
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
  const data: AccessTokenResponse = JSON.parse(response.getContentText());

  return data.access_token;
}

/**
 * Spotify APIで、指定したプレイリストに現在されているTrackを取得する関数
 * @param accessToken string
 * @param playlistId string
 */
function getAddedTracks(accessToken: string, playlistId: string): string[] {
  // 定数
  const LIMIT = 50;

  // 変数
  const trackIds = [];

  // nextがある場合ループする
  while (true) {
    // リクエスト
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${LIMIT}`;
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = UrlFetchApp.fetch(url, options);
    const result: SpotifyApi.PlaylistTrackResponse = JSON.parse(
      response.getContentText()
    );

    // Trackを追加
    trackIds.push(
      ...result.items
        .map((item: SpotifyApi.PlaylistTrackObject) => {
          if (item && item.track) return item.track.uri;
          else return '';
        })
        .filter((uri) => uri)
    );

    // nextがない場合、ループを抜ける
    if (!result.next) break;
  }

  return trackIds;
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
  let queryString = '';
  if (isMultiByteStr(track) || isMultiByteStr(artist)) {
    queryString = encodeURIComponent(`${track} ${artist}`);
  } else {
    queryString = encodeURIComponent(`track:${track} artist:${artist}`);
  }

  // リクエスト
  const url = `https://api.spotify.com/v1/search?q=${queryString}&type=track`;
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = UrlFetchApp.fetch(url, options);
  const result: SpotifyApi.TrackSearchResponse = JSON.parse(
    response.getContentText()
  );

  // トラック情報の抽出
  const trackInfo = result.tracks.items[0];

  // トラックが取得可能な場合
  if (
    trackInfo &&
    trackInfo.available_markets &&
    trackInfo.available_markets.includes('JP') &&
    trackInfo.name === track
  ) {
    return trackInfo.uri;
  } else {
    return '';
  }
}

/**
 * Spotify APIで指定したプレイリストにTrackを追加する関数
 * @param accessToken string
 * @param uri string
 * @param playlistId string
 * @returns void
 */
function addTracks(
  accessToken: string,
  uris: string[],
  playlistId: string
): void {
  // リクエスト
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    payload: JSON.stringify({
      uris: uris,
      position: 0,
    }),
  };
  UrlFetchApp.fetch(url, options);
}

function isMultiByteStr(str: string) {
  // 正規表現
  const multibyteRegExp = new RegExp(/^[^\x01-\x7E\uFF61-\uFF9F]+$/);

  return multibyteRegExp.test(str);
}
