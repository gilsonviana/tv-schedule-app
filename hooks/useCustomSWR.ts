import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface UseCustomSWRParams {
  enabled?: boolean;
}

const enableRequest = (url: string, enabled = true): string | null => {
  return enabled ? url : null;
};

export const useCustomSWR = <T>(url: string, opts?: UseCustomSWRParams) => {
  const obj = useSWR<T[]>(enableRequest(url, opts?.enabled), fetcher);
  return obj;
};
