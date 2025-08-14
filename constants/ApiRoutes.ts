const tvMazeBaseAPI = "https://api.tvmaze.com";

export const getTvShows = () => `${tvMazeBaseAPI}/shows`;
export const getTvShowById = (resourceId: number | string) => `${tvMazeBaseAPI}/shows/${resourceId}?embed[]=seasons&embed[]=episodes&embed[]=cast`
export const getTvEpisodesBySeasonId = (resourceId: number | string) => `${tvMazeBaseAPI}/seasons/${resourceId}/episodes`
export const getTvEpisodeById = (resourceId: number | string) => `${tvMazeBaseAPI}/episodes/${resourceId}?embed=guestcast`
export const getTvPeopleById = (resourceId: number | string) => `${tvMazeBaseAPI}/people/${resourceId}?embed[]=castcredits&embed[]=guestcastcredits`
