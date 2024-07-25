
import type { NextPage } from 'next';
import Head from 'next/head';
import Footer from '../src/footer/footer';

const Home: NextPage = () => {
  return (
    <div className="flex max-h-fit">
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