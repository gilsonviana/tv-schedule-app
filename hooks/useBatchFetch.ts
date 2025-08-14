import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { TvEpisodeDetail } from "@/constants/Types";
import { isEmpty } from "lodash";

export const useBatchFetch = <T>(urls: string[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const data = useRef<T[]>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      const res = await Promise.allSettled<T>(
        urls.map(async (url) => {
          const { data } = await axios.get(url);
          return data;
        })
      );
      data.current = res
        .filter((r: PromiseSettledResult<T>) => r.status === "fulfilled")
        .map((r: any) => r.value);

      setIsLoading(false);
    };
    if (!isEmpty(urls)) {
      fetchAll();
    }
  }, [urls]);

  return {
    data: data.current,
    isLoading,
  };
};
