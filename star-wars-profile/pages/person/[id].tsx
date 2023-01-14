import Head from "next/head";
// import Image from "next/image";
import Router, { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";

const defaultEndpoint = `${process.env.API_URL}/people`;

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
        <h2>About Me</h2>
        <div className={styles.grid}>
          <div>
            <h3>Name</h3>
            <p>{data.name}</p>
          </div>
          <div>
            <h3>Height</h3>
            <p>{data.height} cm</p>
          </div>
          <div>
            <h3>Birth Year</h3>
            <p>{data.birth_year}</p>
          </div>
          <div>
            <h3>Species</h3>
            <p>{data.species}</p>
          </div>
          <div>
            <h3>Species</h3>
            <p>{data.species}</p>
          </div>
          <div>
            <h3>Hair Color</h3>
            <p>{data.hair_color}</p>
          </div>
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
