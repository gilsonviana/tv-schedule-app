import axios from "axios";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface UseCustomSWRParams {
  enabled?: boolean;
  wait?: number;
}

const enableRequest = (url: string, enabled = true): string | null => {
  return enabled ? url : null;
};

export const useCustomSWR = <T>(url: string, opts?: UseCustomSWRParams) => {
  const [debouncedUrl] = useDebounce(url, opts?.wait ?? 100);
  const obj = useSWR<T>(
    enableRequest(debouncedUrl, opts?.enabled),
    fetcher
  );
  return obj;
};
