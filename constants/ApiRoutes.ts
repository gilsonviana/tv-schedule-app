const tvMazeBaseAPI = "https://api.tvmaze.com";

export const getTvShows = () => `${tvMazeBaseAPI}/shows`;
export const getTvShowById = (resourceId: number | string) => `${tvMazeBaseAPI}/shows/${resourceId}?embed[]=seasons&embed[]=episodes&embed[]=cast`
