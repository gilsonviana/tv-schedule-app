export const tvMazeBaseAPI = "https://api.tvmaze.com";

export const tvMazeApiRoutes = {
  shows: "/shows",
} as const;

export const tvMazeApiRoute = (route: keyof typeof tvMazeApiRoutes) => {
  return tvMazeBaseAPI + tvMazeApiRoutes[route]
};
