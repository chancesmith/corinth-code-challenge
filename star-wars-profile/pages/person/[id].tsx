import Head from "next/head";
import { Fact } from "@/components/Fact";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import { convertCmToInches, convertKgToLbs } from "./utils";
import Link from "next/link";
import people from "@/lib/db-lib";
import { Person } from "@/types";

interface GetServerSideProps {
  params: { id: string };
}

export async function getServerSideProps(context: GetServerSideProps) {
  const { id } = context.params;
  const data = await people.getPerson({ id });

  // get names of films
  const filmNames = await Promise.all(
    data.films.map(async (film) => {
      const res = await fetch(film);
      const data = await res.json();
      return data.title as string;
    })
  );
  data.films = filmNames;

  // get names of starships
  const starshipNames = await Promise.all(
    data.starships.map(async (starship) => {
      const res = await fetch(starship);
      const data = await res.json();
      return data.name as string;
    })
  );
  data.starships = starshipNames;

  return {
    props: {
      data,
    },
  };
}

interface HomeProps {
  data: Person;
}

export default function Home({ data }: HomeProps) {
  const [isMetric, setIsMetric] = useState(true);

  const height = isMetric
    ? `${data.height} cm`
    : `${convertCmToInches(Number(data.height))} inches`;

  const weight = isMetric
    ? `${data.mass} kg`
    : `${convertKgToLbs(Number(data.mass))} lbs`;

  function handleConversionToggle() {
    setIsMetric(!isMetric);
  }

  return (
    <>
      <Head>
        <title>StarWars - {data.name}&apos;s Profile</title>
        <meta
          name="description"
          content={`Discover more about ${data.name}.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.header}>
          <Link href={"/"}>← Back</Link>

          <h1>{data.name}</h1>

          <button onClick={handleConversionToggle} className={styles.button}>
            {isMetric ? "Switch to Imperial" : "Switch to Metric"}
          </button>
        </div>

        <h2>About Me</h2>
        <div className={styles.factList}>
          {height && <Fact title="Height" value={height} />}

          {weight && <Fact title="Mass" value={weight} />}

          {data.birth_year && (
            <Fact title="Birth Year" value={data.birth_year} />
          )}

          {data.species.length ? (
            <Fact title="Species" value={data.species.join(",")} />
          ) : null}

          {data.hair_color && (
            <Fact title="Hair Color" value={data.hair_color} />
          )}
        </div>

        <h2>Films Appeared In</h2>
        <ul className={styles.list}>
          {data.films.map((film) => (
            <li key={film}>{film}</li>
          ))}
        </ul>

        <h2>Starships flown in</h2>
        <ul className={styles.list}>
          {data.starships.map((starship) => (
            <li key={starship}>{starship}</li>
          ))}
        </ul>
      </main>
    </>
  );
}
