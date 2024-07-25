
export async function getServerSideProps({ query, res }) {
    try {
        const { slug, page } = query;
        const data = await singleCategory(slug, page);

        if (data.error) {
            return { props: { errorCode: 404 } };
        } else {
            return { props: { category: data.category, mangas: data.mangas, query, totalCount: data.totalCount } };
        }

    } catch (error) {
        console.error(error);
        return { props: { errorCode: 500 } };
    }
}







import Head from 'next/head';
import { singleCategory } from '@/actions/category';
import { DOMAIN, APP_NAME } from '@/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaHome } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { Rubik } from '@next/font/google';
const roboto = Rubik({
    subsets: ['latin'],
    weight: '700',
});

const Category = ({ errorCode, category, mangas, query, totalCount }) => {

    if (errorCode) {
        return (
            <>
                <Navbar />
                <div>
                    <br />
                    <div className="flex justify-center items-center h-[70vh]">
                        <img src="/404.jpg" className="max-w-full max-h-full" alt="" />
                    </div>
                    <div className=' text-center font-bold text-5xl mb-10'>Page Not Found</div>
                </div>
                <Footer />
            </>
        );
    }

    const router = useRouter();
    const { slug } = router.query;
    const [currentPage, setCurrentPage] = useState(Number(query.page) || 1);


    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": `${DOMAIN}/#person`,
                "name": `${APP_NAME}`,
                // "sameAs": ["https://twitter.com/ozulscans"],
                "image": {
                    "@type": "ImageObject",
                    "@id": `${DOMAIN}/#logo`,
                    // "url": "https://kingofshojo.com/wp-content/uploads/2024/03/adawewtyy-1.png",
                    // "contentUrl": "https://kingofshojo.com/wp-content/uploads/2024/03/adawewtyy-1.png",
                    "caption": `${APP_NAME}`,
                    "inLanguage": "en-US",
                    // "width": "512",
                    // "height": "534"
                }
            },
            {
                "@type": "WebSite",
                "@id": `${DOMAIN}/#website`,
                "url": `${DOMAIN}`,
                "name": `${APP_NAME}`,
                "publisher": {
                    "@id": `${DOMAIN}/#person`
                },
                "inLanguage": "en-US"
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${DOMAIN}/categories/${category.slug}?page=${currentPage}/#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "item": {
                            "@id": `${DOMAIN}`,
                            "name": "Home"
                        }
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "item": {
                            "@id": `${DOMAIN}/categories`,
                            "name": `Categories`
                        }
                    }
                ]
            },
            {
                "@type": "CollectionPage",
                "@id": `${DOMAIN}/categories/${category.slug}?page=${currentPage}/#webpage`,
                "url": `${DOMAIN}/categories/${category.slug}?page=${currentPage}`,
                "name": `${category.name} Page ${currentPage}: ${APP_NAME}`,
                "isPartOf": {
                    "@id": `${DOMAIN}/#website`
                },
                "inLanguage": "en-US",
                "breadcrumb": {
                    "@id": `${DOMAIN}/categories/${category.slug}?page=${currentPage}/#breadcrumb`
                }
            }
        ]
    }


    const DESCRIPTION = `Read ${category.name} manga, smahwa, manhua online. This page contains all the ${category.name} manga/mahwa/manhua available on ${APP_NAME}.`;



    const head = () => (
        <Head>
            <title>{`${category.name} Page ${currentPage}: ${APP_NAME}`}</title>
            <meta name="description" content={DESCRIPTION} />
            <link rel="canonical" href={`${DOMAIN}/categories/${category.name}?page=${currentPage}`} />
            <meta property="og:title" content={`${category.name} Page ${currentPage}: ${APP_NAME}`} />
            <meta property="og:description" content={DESCRIPTION} />
            <meta property="og:type" content="webiste" />
            <meta name="robots" content="follow, index, noarchive, max-snippet:-1, max-video-preview:-1, max-image-preview:large" />
            <meta property="og:url" content={`${DOMAIN}/categories/${category.name}?page=${currentPage}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />
            <meta property="og:image:type" content="image/webp" />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        </Head >
    );




    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.push(`${DOMAIN}/categories/${slug}?page=${page}`);
    };

    const totalPages = Math.ceil(totalCount / 18);
    const maxPagesToShow = 5;
    const pageNumbers = [];

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
            pageNumbers.push('...');
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
    }

    return (
        <>
            {head()}
            <Navbar />

            <div className='my-5 max-w-[1350px] mx-auto p-3'>

                <h1 className={`${roboto.className} text-base-color text-3xl font-semibold mb-5 text-center`}>{category.name}</h1>
                <p className='text-center mb-5 text-base-color'>{`Total Results: ${totalCount}`}</p>

                <div className='flex flex-wrap justify-center items-center gap-3 mb-10 text-blue-600'>

                    <div className='flex items-center gap-2'>
                        <div><FaHome /></div>
                        <div><Link prefetch={false} href={`${DOMAIN}`}>Home</Link></div>
                    </div>

                    <div>🢥</div>

                    <div><Link prefetch={false} href={`${DOMAIN}/categories/${category?.slug}?page=${currentPage}`}>{category.name}</Link></div>
                </div>

                <div className="flex justify-center gap-10 flex-wrap">
                    {mangas?.map((manga, index) => (
                        <div className="hover:scale-110 transition-transform border rounded shadow text-center w-[200px] bg-white" key={index}>
                            <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`}>
                                <img src={manga?.photo} alt={`${manga?.name} Cover`} className="mb-2 h-[220px] w-[200px] object-cover" />
                                <div className='px-5 py-3 '>
                                    <h3 className={`${roboto.className} text-base-color text-lg mb-1 text-wrap break-words`}>{manga?.name}</h3>
                                    <p className="text-sm mb-1 text-base-text-color">{`Total Chapters:  ${manga?.totalChapters ?? 0}`}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>


                <div className='flex justify-center items-center my-10' id='pagination'>
                    {pageNumbers.map((pageNum, index) => (
                        <Link prefetch={false} key={index} href={`${DOMAIN}/categories/${slug}?page=${pageNum}`} className={`mx-2 px-4 py-2 rounded-lg ${currentPage === pageNum ? 'bg-base-dark-color text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                            onClick={() => { if (typeof pageNum === 'number') { handlePageChange(pageNum); } }}>
                            {pageNum}
                        </Link>
                    ))}
                </div>


            </div>


            <Footer />
        </>
    );
};


export default Category;
