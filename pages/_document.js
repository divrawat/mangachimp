import { Html, Head, Main, NextScript } from "next/document";
import { FAVICON, IMAGES_SUBDOMAIN } from "@/config";

export default function Document() {
  return (
    <Html lang="en">
      <Head>


        <link rel="icon" type="image/x-icon" href={`${IMAGES_SUBDOMAIN}/public/favicon.ico`} />
        <link rel="icon" href={`${FAVICON}`} sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href={`${IMAGES_SUBDOMAIN}/public/apple-touch-icon.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${IMAGES_SUBDOMAIN}/public/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${IMAGES_SUBDOMAIN}/public/favicon-16x16.png`} />
        <link rel="icon" type="image/png" sizes="192x192" href={`${IMAGES_SUBDOMAIN}/public/android-chrome-192x192.png`} />
        <link rel="icon" type="image/png" sizes="512x512" href={`${IMAGES_SUBDOMAIN}/public/android-chrome-512x512.png`} />

      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}