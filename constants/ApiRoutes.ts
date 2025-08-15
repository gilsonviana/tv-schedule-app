const tvMazeBaseAPI = "https://api.tvmaze.com";

export const getTvShows = (pageNumber?: number) =>
  pageNumber
    ? `${tvMazeBaseAPI}/shows?page=${pageNumber}`
    : `${tvMazeBaseAPI}/shows`;
export const getTvShowById = (resourceId: number | string) =>
  `${tvMazeBaseAPI}/shows/${resourceId}?embed[]=seasons&embed[]=episodes&embed[]=cast`;
export const getTvEpisodesBySeasonId = (resourceId: number | string) =>
  `${tvMazeBaseAPI}/seasons/${resourceId}/episodes`;
export const getTvEpisodeById = (resourceId: number | string) =>
  `${tvMazeBaseAPI}/episodes/${resourceId}?embed=guestcast`;
export const getTvPeopleById = (resourceId: number | string) =>
  `${tvMazeBaseAPI}/people/${resourceId}?embed[]=castcredits&embed[]=guestcastcredits`;
export const searchQueryUrl = (
  queryString: string,
  type: "show" | "person" | string
) => `${tvMazeBaseAPI}/search/${type}?q=${queryString}`;
