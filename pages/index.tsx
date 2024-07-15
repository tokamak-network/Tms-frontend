import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Footer from '../src/footer/footer';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>MultiSender App</title>
        <meta content="Tokamak MultiSender App" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Footer />
    </div>
  );
};

export default Home;
