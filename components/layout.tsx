/* eslint-disable react/require-default-props */
import Head from 'next/head';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Footer from './footer';
import Header from './header';

type Props = {
  children: React.ReactNode;
  flash?: string;
};

export default function Layout({ children, flash }: Props) {
  if (flash) toast.error(flash, { toastId: 'access-denied' }); // ONEDAY: Allow other styles of toast.
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
      <main>{children}</main>
      <Footer />
    </>
  );
}
