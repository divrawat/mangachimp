import { Shantell_Sans, Rubik } from '@next/font/google';
import "@/styles/globals.css";
import NProgress from 'nprogress';
import Router from 'next/router';
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());
NProgress.configure({ showSpinner: false })
import { useEffect } from 'react';

/*
const shantellSans = Rubik({
  subsets: ['latin'],
  weight: '400',
});
*/

function MyApp({ Component, pageProps }) {
  /*
  useEffect(() => {
    const disableRightClick = (event) => { event.preventDefault(); };
    document.addEventListener('contextmenu', disableRightClick);
  }, []);
  */

  return (
    <>
      {/* <style jsx global>{`
         :root {--font-shantell-sans: ${shantellSans.style.fontFamily}; }
        body {font-family: var(--font-shantell-sans);}        
      `}</style> */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;