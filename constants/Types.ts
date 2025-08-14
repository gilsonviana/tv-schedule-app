interface TvImageObj {
  medium: string;
  original: string;
}

export interface TvShow<T = unknown> {
  id: number;
  name: string;
  summary: string;
  image: TvImageObj;
  schedule: {
    time: string
    days: string[];
  };
  genres: string[];
  _embedded?: T;
}

export interface TvShowCast {
  person: {
    id: number;
    name: string;
    image: TvImageObj;
  };
  character: {
    id: number;
    name: string;
    image: TvImageObj;
  };
}

export interface TvShowSeason {
  id: number;
  number: number;
  episodeOrder: number;
  summary: string;
  image: TvImageObj;
  premiereDate: string;
}

export interface TvShowEpisode {
  id: number;
  season: number;
  number: number;
  summary: string;
  image: TvImageObj;
  airdate: string;
}

export type TvShowDetail = TvShow<{
  seasons: TvShowEpisode[];
  episodes: TvShowSeason[];
  cast: TvShowCast[];
}>;
