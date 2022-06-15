/* eslint-disable react/require-default-props */
import Head from 'next/head';
import { toast, ToastContainer } from 'react-toastify'; // https://fkhadra.github.io/react-toastify/
import 'react-toastify/dist/ReactToastify.min.css';
import { Flash } from '../helpers/types';
import Footer from './footer';
import Header from './header';

type Props = {
  children: React.ReactNode;
  flash?: Flash;
};

export default function Layout({ children, flash }: Props) {
  if (flash) toast(flash.message, flash.toastifyOptions); // https://fkhadra.github.io/react-toastify/icons/#built-in-icons
  return (
    <>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossOrigin="anonymous"
        />
      </Head>
      <Header />
      <ToastContainer />
      <main className="container-lg">{children}</main>
      <Footer />
    </>
  );
}
