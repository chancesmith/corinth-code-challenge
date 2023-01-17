import Head from "next/head";
import LoadingText from "@/components/Loading";
import { usePagination } from "@/hooks/usePagination";
import styles from "@/styles/Home.module.css";
import { PeopleData, Person } from "@/types";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { getPeople, peopleEndpoint } from "@/lib/db-lib";

export default function Home() {
  const router = useRouter();
  const { data, results, handleLoadNext, next, updateData } =
    usePagination(peopleEndpoint);
  const [search, updateSearch] = useState(router.query.search ?? "");

  useEffect(() => {
    getPeople({ search }).then((newData) => {
      updateData(newData);
    });
  }, [search, updateData]);

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
        {data && next && (
          <button onClick={handleLoadNext} className={styles.button}>
            Load More Characters{" "}
            {data?.count ? `(${data?.count - results.length} left)` : ""}
          </button>
        )}
      </main>
    </>
  );
}
