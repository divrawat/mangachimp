
export async function getStaticProps() {
    try {
        const data = await GetLatestMangas();
        if (data.error) { return { props: { errorCode: 404 } }; }
        return { props: { latestmangas: data }, };
    } catch (error) {
        console.error(error);
        return { props: { errorCode: 500 } };
    }
}


import { Rubik } from '@next/font/google';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GetLatestMangas } from "@/actions/manga";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { DOMAIN, APP_NAME } from "@/config";
const roboto = Rubik({ subsets: ['latin'], weight: '800', });
const roboto3 = Rubik({ subsets: ['latin'], weight: '600', });
import Head from 'next/head';

export default function Home({ latestmangas }) {

    const DESCRIPTION = `Newly added mangas, manhwas, manhuas, webtoons, and comics. Read and enjoy the latest chapters of your favorite manga series.`;

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${DOMAIN}/#organization`,
                "name": `${APP_NAME}`,
                "url": `${DOMAIN}`,
                // "sameAs": [
                //     "https://www.facebook.com/WebsiteManhwatop",
                //     "https://www.instagram.com/manhwatop_official",
                //     "https://www.linkedin.com/in/top-manhwa-711673205/",
                //     "https://www.youtube.com/channel/UC6cpVPKJuqqxhFH_37rZ5gw",
                //     "https://www.pinterest.com/ManhwaTopOfficial/",
                //     "https://twitter.com/manhwatop"
                // ],
                "logo": {
                    "@type": "ImageObject",
                    "@id": `${DOMAIN}/#logo`,
                    "inLanguage": "en-US",
                    "url": "",
                    "caption": `${APP_NAME}`
                },
                "image": {
                    "@id": `${DOMAIN}/#logo`
                }
            },
            {
                "@type": "WebSite",
                "@id": `${DOMAIN}/#website`,
                "url": `${DOMAIN}`,
                "name": `${APP_NAME}`,
                "description": "",
                "publisher": { "@id": `${DOMAIN}/#organization` },
                "inLanguage": "en-US"
            },
            {
                "@type": "CollectionPage",
                "@id": `${DOMAIN}/new-mangas/#webpage`,
                "url": `${DOMAIN}/new-mangas`,
                "name": `New Mangas`,
                "isPartOf": { "@id": `${DOMAIN}/#website` },
                "description": `${DESCRIPTION}`,
                "breadcrumb": { "@id": `${DOMAIN}/new-mangas/#breadcrumb` },
                "inLanguage": "en-US",
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${DOMAIN}/new-chapters/#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "item": {
                            "@type": "WebPage",
                            "@id": `${DOMAIN}`,
                            "url": `${DOMAIN}`,
                            "name": "Home"
                        }
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "item": {
                            "@type": "WebPage",
                            "@id": `${DOMAIN}/new-mangas`,
                            "url": `${DOMAIN}/new-mangas`,
                            "name": "Manga"
                        }
                    }
                ]
            }
        ]
    };



    const head = () => (
        <Head>
            <title>{`${APP_NAME}: New Mangas`}</title>
            <meta name="description" content={DESCRIPTION} />
            <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large" />
            <meta name="googlebot" content="noarchive" />
            <meta name="robots" content="noarchive" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="website" />
            <link rel="canonical" href={`${DOMAIN}/new-chapters`} />
            <meta property="og:title" content={`${APP_NAME}: New Mangas`} />
            <meta property="og:description" content={DESCRIPTION} />
            <meta property="og:type" content="webiste" />
            <meta property="og:url" content={`${DOMAIN}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />
            <meta property="og:image:type" content="image/webp" />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        </Head >
    );


    return (
        <>
            {head()}
            <Navbar />
            <br />
            <main>
                <article>

                    <div className='max-w-[1200px] mx-auto'>

                        <h1 className={`${roboto.className} text-2xl text-center text-white font-bold tracking-wider mb-8`}>New Mangas</h1>


                        <div className='flex text-[13px] flex-wrap justify-center items-center gap-2 mb-10 text-blue-300'>

                            <div className='flex items-center gap-2'>
                                <div><FaHome /></div>
                                <div><Link prefetch={false} href={`${DOMAIN}`}>Home</Link></div>
                            </div>

                            <div>{`->`}</div>

                            <div><Link prefetch={false} href={`${DOMAIN}/new-mangas`}>New Mangas</Link></div>
                        </div>



                        <div className="flex justify-center items-center gap-10 flex-wrap px-8">
                            {latestmangas?.map((manga, index) => (

                                <div className="hover:scale-110 transition-transform rounded shadow w-[190px] bg-[#091e25]" key={index}>
                                    <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`}>
                                        <img src={manga?.photo} alt={`${manga?.name} Cover`} className="mb-2 h-[200px] w-[190px] object-cover" />
                                        <div className='px-4 py-3 text-white'>
                                            <p className='text-[12px] pb-1.5'>{`Total Chapters:  ${manga?.totalChapters ?? 0}`}</p>
                                            <p style={{ height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }} className={`${roboto3.className} font-bold text-[13px] mb-1 text-wrap break-words`}>{manga?.name}</p>
                                        </div>
                                    </Link>
                                </div>

                            )).slice(0, 50)}
                        </div>
                    </div>
                </article>
            </main >

            <br />
            <Footer />
        </>
    );
}