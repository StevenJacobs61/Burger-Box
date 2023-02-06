import Layout from '../components/layout/layout'
import '../styles/globals.css'
import {Provider} from 'react-redux'
import store  from '../redux/store';
import Head from 'next/head';


function MyApp({ Component, pageProps}) {



  return (
    <>
    <Head>
    <script src='../public/epos-2.22.0' type='text/javascript'/>
    </Head>
  <Provider store ={store}>
  <Layout>

    <Component {...pageProps} />

  </Layout>
  </Provider>
  </>
  );
}

export default MyApp
