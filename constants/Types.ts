export interface TvImageObj {
  medium: string;
  original: string;
}

interface TvCountryObj {
  name: string;
  code: string;
  timezone: string;
}

interface TvLinkObj {
  href: string;
  name: string;
}

type TvLinkObjs = Record<"show" | "character" | "episode", TvLinkObj>;

interface Embedded<T = unknown> {
  _embedded?: T;
}

export interface TvShow<T = unknown> extends Embedded<T> {
  id: number;
  name: string;
  summary: string;
  image: TvImageObj;
  schedule: {
    time: string;
    days: string[];
  };
  genres: string[];
  network: {
    id: number;
    name: string;
    country: TvCountryObj;
    officialSite: string;
  };
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

export interface TvShowPeople<T = unknown> extends Embedded<T> {
  id: number;
  name: string;
  country: TvCountryObj;
  birthday: string;
  deathday: string | null;
  gender: string;
  image: TvImageObj;
}

export interface TvShowEpisode<T = unknown> extends Embedded<T> {
  id: number;
  season: number;
  number: number;
  name: string;
  summary: string;
  image: TvImageObj;
  airdate: string;
  rating: {
    average: number;
  };
  _links: {
    show: TvLinkObj;
  };
}

export type TvShowDetail = TvShow<{
  seasons: TvShowEpisode[];
  episodes: TvShowSeason[];
  cast: TvShowCast[];
}>;

export type TvEpisodeDetail = TvShowEpisode<{
  guestcast: TvShowCast[];
}>;

export type TvShowPeopleDetail = TvShowPeople<{
  castcredits: { _links: TvLinkObjs }[];
  guestcastcredits: { _links: TvLinkObjs }[];
}>;

export type TvSearchResult = {
  score: number;
  show: TvShow;
  people: TvShowPeople;
  [key: string]: any;
};
