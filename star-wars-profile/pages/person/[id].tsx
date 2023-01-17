import Head from "next/head";
import { Fact } from "@/components/Fact";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import { convertCmToInches, convertKgToLbs } from "./utils";

const defaultEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/people`;

interface GetServerSideProps {
  params: { id: string };
}

export async function getServerSideProps(context: GetServerSideProps) {
  const { id } = context.params;
  const res = await fetch(`${defaultEndpoint}/${id}`);
  const data = (await res.json()) as Person;

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
          <h1>{data.name}</h1>
          <div>
            <button onClick={handleConversionToggle} className={styles.button}>
              {isMetric ? "Switch to Imperial" : "Switch to Metric"}
            </button>
          </div>
        </div>

        <h2>About Me</h2>
        <div className={styles.grid}>
          <Fact title="Height" value={height} />
          <Fact title="Mass" value={weight} />
          <Fact title="Birth Year" value={data.birth_year} />
          <Fact title="Species" value={data.species.join(",")} />
          <Fact title="Hair Color" value={data.hair_color} />
        </div>

        <h2>Films Appeared In</h2>
        <div className={styles.grid}>
          {data.films.map((film) => (
            <div key={film}>
              <h3>{film}</h3>
            </div>
          ))}
        </div>

        <h2>Starships flown in</h2>
        <div className={styles.grid}>
          {data.starships.map((starship) => (
            <div key={starship}>
              <h3>{starship}</h3>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
