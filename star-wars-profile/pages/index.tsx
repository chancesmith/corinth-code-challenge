import Head from "next/head";
// import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
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
          />
        </div>

        <div className={styles.grid}>character details coming soon...</div>
      </main>
    </>
  );
}
