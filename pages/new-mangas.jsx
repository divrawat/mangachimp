export async function getServerSideProps({ query, res }) {
    try {
        const { page } = query;
        const data = await GetLatestMangas(page);

        res.setHeader(
            'Cache-Control',
            'public, s-maxage=10800, stale-while-revalidate=59'
        );

        if (data.error) {
            return { props: { errorCode: 404 } };
        }

        return { props: { latestmangas: data.mangas, totalCount: data.totalCount } };

    } catch (error) {
        console.error(error);
        return { props: { errorCode: 500 } };
    }
}



import Head from 'next/head';
import { DOMAIN, APP_NAME, NOT_FOUND_IMAGE } from '@/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaHome } from "react-icons/fa";
import { Rubik } from '@next/font/google';
import { GetLatestMangas } from '@/actions/manga';
const roboto = Rubik({ subsets: ['latin'], weight: '600', });
const roboto2 = Rubik({ subsets: ['latin'], weight: '800', });



const NewMangas = ({ latestmangas, errorCode, totalCount, category }) => {

    if (errorCode) {
        return (
            <>
                <Navbar />
                <div className="text-center text-white">
                    <h1 className="text-3xl font-bold mt-5 mb-8">404 Page Not Found</h1>
                    <div className="flex justify-center items-center px-5">
                        <img height={350} width={350} src={`${NOT_FOUND_IMAGE}`} className="rounded-full" />
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const router = useRouter();
    const { page } = router.query;
    const [currentPage, setCurrentPage] = useState(Number(page) || 1);

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
                "@id": `${DOMAIN}/new-chapters?page=${currentPage}/#webpage`,
                "url": `${DOMAIN}/new-chapters?page=${currentPage}`,
                "name": `New Chapters`,
                "isPartOf": { "@id": `${DOMAIN}/#website` },
                "description": `${DESCRIPTION}`,
                "breadcrumb": { "@id": `${DOMAIN}/new-chapters?page=${currentPage}/#breadcrumb` },
                "inLanguage": "en-US",
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${DOMAIN}/new-chapters?page=${currentPage}/#breadcrumb`,
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
                            "@id": `${DOMAIN}/new-chapters?page=${currentPage}`,
                            "url": `${DOMAIN}/new-chapters?page=${currentPage}`,
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
            <link rel="canonical" href={`${DOMAIN}/new-chapters?page=${currentPage}`} />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={`${APP_NAME}: New Mangas`} />
            <meta property="og:description" content={DESCRIPTION} />
            <meta property="og:type" content="webiste" />
            <meta property="og:url" content={`${DOMAIN}/new-mangas?page=${currentPage}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />
            <meta property="og:image:type" content="image/webp" />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        </Head >
    );




    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.push(`${DOMAIN}/new-mangas?page=${page}`);
    };

    const totalPages = Math.ceil(totalCount / 30);
    const maxPagesToShow = 5;
    const pageNumbers = [];

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (startPage > 1) { pageNumbers.push(1); if (startPage > 2) { pageNumbers.push('...'); } }
    for (let i = startPage; i <= endPage; i++) { pageNumbers.push(i); }
    if (endPage < totalPages) { if (endPage < totalPages - 1) { pageNumbers.push('...'); } pageNumbers.push(totalPages); }


    return (
        <>
            {head()}
            <Navbar />
            <main>
                <article>
                    <div className=' max-w-[1350px] mx-auto p-3 text-white'>

                        <h1 className={`${roboto2.className}  text-3xl font-semibold mb-3 text-center uppercase`}>New Mangas</h1>

                        <div className='flex text-[13px] flex-wrap justify-center items-center gap-2 mb-2 text-blue-300'>

                            <div className='flex items-center gap-2'>
                                <div><FaHome /></div>
                                <div><Link prefetch={false} href={`${DOMAIN}`}>Home</Link></div>
                            </div>

                            <div>{`->`}</div>

                            <div><Link prefetch={false} href={`${DOMAIN}/new-mangas?page=${currentPage}`}>New Mangas</Link></div>
                        </div>


                        <p className='text-center mb-3 font-bold'>{`Total Mangas - ${totalCount}`}</p>

                        <p className='text-center font-bold mb-8'>{`Page ${currentPage}`}</p>


                        <div className="flex justify-center sm:gap-10 gap-3 flex-wrap">
                            {latestmangas?.map((manga, index) => (
                                <div className="hover:scale-110 transition-transform rounded shadow sm:w-[200px] w-[45%] bg-[#091e25]" key={index}>
                                    <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`}>
                                        <img src={manga?.photo} alt={`${manga?.name} Cover`} className="mb-2 sm:h-[220px] sm:w-[200px] w-[full]  object-cover" />
                                        <div className='p-3'>
                                            <p className="sm:text-[12px] text-[10px] mb-1.5">{`Total Chapters:  ${manga?.totalChapters ?? 0}`}</p>
                                            <p className={`${roboto.className} sm:text-[14px] text-[12px] mb-1 text-wrap break-words`}>{manga?.name}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <div className='flex justify-center flex-wrap items-center my-10 mx-4 gap-5' id='pagination'>
                            {pageNumbers?.map((pageNum, index) => (
                                <Link prefetch={false} key={index} href={`${DOMAIN}/new-mangas?page=${currentPage}`}
                                    className={`${roboto2.className} mx-2 px-4 py-2 rounded-lg ${currentPage === pageNum ? 'bg-[#0f2a33] text-white' : 'bg-[white] hover:bg-[#0f2a33] hover:text-white text-[black]'}`}
                                    onClick={() => { if (typeof pageNum === 'number') { handlePageChange(pageNum); } }}>
                                    {pageNum}
                                </Link>
                            ))}
                        </div>


                    </div>

                </article>
            </main>
            <Footer />
        </>
    );
};


export default NewMangas;
