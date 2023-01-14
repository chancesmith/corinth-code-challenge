import Head from "next/head";
// import Image from "next/image";
import Router, { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";

const defaultEndpoint = `${process.env.API_URL}/people/`;

interface GetServerSideProps {
  query: { search: string };
}

export async function getServerSideProps(context: GetServerSideProps) {
  const { search } = context.query;
  const res = await fetch(
    search ? `${defaultEndpoint}?search=${search}` : defaultEndpoint
  );
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

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

interface HomeProps {
  data: PeopleData;
}

export default function Home({ data }: HomeProps) {
  const router = useRouter();
  const { results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);
  const [page, updatePage] = useState<null | undefined | { current: string }>({
    current: defaultEndpoint,
  });
  const [next, updateNext] = useState<string | null | undefined>(data?.next);
  const [search, updateSearch] = useState(router.query.search ?? "");
  const { current } = page?.current ? page : { current: defaultEndpoint };

  useEffect(() => {
    async function request() {
      const res = await fetch(current);
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
  }, [current, search]);

  function updateQuery(newQuery: string) {
    router.replace(!!newQuery ? `?search=${encodeURI(newQuery)}` : "");
  }

  function handleSearch(event: React.FormEvent<HTMLInputElement>) {
    const searchText = event.currentTarget.value;
    updateSearch(searchText);
    updateQuery(searchText);
  }

  function handleLoadNext() {
    updatePage({
      current: next ?? defaultEndpoint,
    });
  }

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
          <input
            type="text"
            className={styles.input}
            placeholder="luke skywalker"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className={styles.grid}>
          {results.map((person) => (
            <div key={person.name} className={styles.card}>
              <h2>{person.name}</h2>
            </div>
          ))}
        </div>
        {next && (
          <button onClick={handleLoadNext}>
            Load More Characters ({data.count - results.length} left)
          </button>
        )}
      </main>
    </>
  );
}
