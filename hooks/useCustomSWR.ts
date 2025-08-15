import axios from "axios";
import { flatMap } from "lodash";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useDebounce } from "use-debounce";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface UseCustomSWRParams {
  enabled?: boolean;
  wait?: number;
}

interface TvShowResponse<T = unknown> {
  items: T[];
}

const enableRequest = (url: string, enabled = true): string | null => {
  return enabled ? url : null;
};

export const useCustomSWR = <T>(url: string, opts?: UseCustomSWRParams) => {
  const [debouncedUrl] = useDebounce(url, opts?.wait ?? 100);
  const obj = useSWR<T>(
    enableRequest(opts?.wait ? debouncedUrl : url, opts?.enabled),
    fetcher
  );
  return obj;
};

export const useCustomInfineSWR = <T>(url: (pageIndex: number | undefined) => string) => {
  const getKey = (
    pageIndex: number,
    previousPageData: TvShowResponse | null
  ) => {
    if (previousPageData && previousPageData.items?.length === 0) return null;
    return url(pageIndex || 0);
  };
  const obj = useSWRInfinite<T>(
    getKey,
    fetcher
  );
  const items = flatMap(obj.data);

  return {
    ...obj,
    data: items
  }
};
