import Head from 'next/head'
import MediaProcessingPage from '../components/MediaProcessingPage';

const Home = () => {
  return (
    <>
      <Head>
        <title>Media Processor</title>
        <meta name="description" content="pet project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MediaProcessingPage />
    </>
  )
}

export default Home;
