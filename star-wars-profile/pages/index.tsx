import Head from "next/head";
// import Image from "next/image";
import Router, { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import { useCallback, useEffect, useState } from "react";
import LoadingText from "@/components/Loading";

const defaultEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/people/`;

interface Person {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

interface PeopleData {
  count: number;
  next?: string;
  previous?: string;
  results: Person[];
}

const usePagination = (endpoint: string) => {
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
        updateResults((prev) => {
          return [...prev, ...nextRequest.results];
        });
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

export default function Home() {
  const router = useRouter();
  const { data, results, handleLoadNext, next, updateData } =
    usePagination(defaultEndpoint);
  const [search, updateSearch] = useState(router.query.search ?? "");

  const getPeople = useCallback(async () => {
    const url = !!search
      ? `${defaultEndpoint}?search=${search}`
      : defaultEndpoint;
    const res = await fetch(url);

    return (await res.json()) as PeopleData;
  }, [search]);

  useEffect(() => {
    getPeople().then((newData) => {
      updateData(newData);
    });
  }, [search, getPeople, updateData]);

  function updateQuery(newQuery: string) {
    router.replace(!!newQuery ? `?search=${encodeURI(newQuery)}` : "");
  }

  function handleSearch(event: React.FormEvent<HTMLInputElement>) {
    const searchText = event.currentTarget.value;
    updateSearch(searchText);
    updateQuery(searchText);
  }

  if (!results) return <div>Loading...</div>;

  const getPersonId = (person: Person) => person.url.split("/").slice(-2, -1);

  return (
    <>
      <Head>
        <title>StarWars - Profile</title>
        <meta
          name="description"
          content="Discover more about your favorite Star Wars characters."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>
            Search for your favorite Star Wars character and see their profile.
          </p>
        </div>

        <div className={styles.search}>
          <label htmlFor="search" className={styles.label}>
            Search
          </label>
          <input
            type="text"
            id="search"
            className={styles.input}
            placeholder="luke skywalker"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className={styles.peopleList}>
          {!data ? (
            <LoadingText />
          ) : (
            results.map((person) => (
              <a
                key={person.name}
                className={styles.person}
                href={`/person/${getPersonId(person)}`}
              >
                <h2>{person.name}</h2>
              </a>
            ))
          )}
        </div>
        {next && (
          <button onClick={handleLoadNext} className={styles.button}>
            Load More Characters{" "}
            {data?.count ? `(${data?.count - results.length} left)` : ""}
          </button>
        )}
      </main>
    </>
  );
}
