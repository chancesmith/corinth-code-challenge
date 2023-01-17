import { PeopleData, Person } from "@/types";
import { useEffect, useState } from "react";

export const usePagination = (endpoint: string) => {
  const [data, updateData] = useState<PeopleData | null>(null);
  const [results, updateResults] = useState<Person[]>([]);
  const [page, updatePage] = useState<null | undefined | { current: string }>({
    current: endpoint,
  });
  const [next, updateNext] = useState<string | null | undefined>(data?.next);

  useEffect(() => {
    async function request() {
      const res = await fetch(page?.current ?? endpoint);
      const nextRequest = await res.json();

      // We're seeing the first page
      if (!nextRequest.previous) {
        updateResults(nextRequest.results);
        updateNext(nextRequest.next);
        return;
      }

      if (nextRequest.next) {
        // add the next page to the current results
        updateNext(nextRequest.next);
        updateResults((prev) => [...prev, ...nextRequest.results]);
      } else {
        updateNext(null);
      }
    }

    request();
  }, [endpoint, page]);

  useEffect(() => {
    if (!data) return;

    updateResults(data?.results);
    updateNext(data.next);
  }, [data]);

  function handleLoadNext() {
    if (!next) return;
    updatePage({
      current: next,
    });
  }

  return { results, handleLoadNext, next, data, updateData };
};
