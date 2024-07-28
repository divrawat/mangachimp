export async function getStaticPaths() {
    const slugs = ["one-piece"];
    const paths = slugs.map(slug => ({ params: { slug } }));
    return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
    try {
        const response = await getmangachaptersRelated(params?.slug);
        if (response?.error) { return { props: { errorcode: true } }; }

        const sortChapters = (chapterNumbers) => {
            return chapterNumbers?.sort((a, b) => {
                const parseChapter = (chapter) => {
                    const match = chapter.match(/(\d+)([a-z]*)/i);
                    return [parseInt(match[1]), match[2] || ''];
                };
                const [numA, suffixA] = parseChapter(a);
                const [numB, suffixB] = parseChapter(b);
                return numA !== numB ? numA - numB : suffixA.localeCompare(suffixB);
            });
        };

        const chapterNumbers = response?.data?.map(chapter => chapter.chapterNumber) || [];
        const sortedchapterNumbers = sortChapters(chapterNumbers);
        const reversedChapterNumbers = sortedchapterNumbers.reverse();
        return { props: { manga: response, chapterArray: reversedChapterNumbers } };
    } catch (error) {
        console.error('Error fetching manga data:', error);
        return { props: { errorcode: true } };
    }
}



import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { getmangachaptersRelated } from '@/actions/manga';
import { DOMAIN, APP_NAME } from '@/config';
import { FaHome } from "react-icons/fa";
import { GiBlackBook } from "react-icons/gi";
import { Rubik } from '@next/font/google';
import { FaArrowRightLong } from "react-icons/fa6";
import { AiFillChrome } from "react-icons/ai";
const roboto = Rubik({ subsets: ['latin'], weight: '800' });
const roboto2 = Rubik({ subsets: ['latin'], weight: '700', });

const MangaPage = ({ errorcode, manga, chapterArray }) => {

    const mangaurl = manga?.manga?.slug;

    if (errorcode) {
        const head = () => (
            <Head>
                <title>{`404 Page Not Found: ${APP_NAME}`}</title>
            </Head >
        );
        return (
            <>
                {head()}
                <Navbar />
                <div className="text-center py-10">
                    <h1 className="text-3xl font-bold mt-10">404 Page Not Found</h1>
                    <p className="text-lg mt-4">The page you are looking for does not exist.</p>
                </div>
                <Footer />
            </>
        );
    }

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": ["Person", "Organization"],
                "@id": `${DOMAIN}/#person`,
                "name": `${APP_NAME}`,
                // "sameAs": ["https://twitter.com/ozulscans"],
                "logo": {
                    "@type": "ImageObject",
                    "@id": `${DOMAIN}/#logo`,
                    // "url": "https://kingofshojo.com/wp-content/uploads/2024/03/adawewtyy-1.png",
                    // "contentUrl": "https://kingofshojo.com/wp-content/uploads/2024/03/adawewtyy-1.png",
                    "caption": `${APP_NAME}`,
                    "inLanguage": "en-US",
                    // "width": "512",
                    // "height": "534"
                },
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
                "@type": "ImageObject",
                "@id": `${manga?.manga?.photo}`,
                "url": `${manga?.manga?.photo}`,
                "width": "1280",
                "height": "1830",
                "inLanguage": "en-US"
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${DOMAIN}/${mangaurl}/#breadcrumb`,
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
                            "@id": `${DOMAIN}/${mangaurl}`,
                            "name": `${manga?.manga?.name}`
                        }
                    },
                ]
            },
            {
                "@type": "WebPage",
                "@id": `${DOMAIN}/${mangaurl}/#webpage`,
                "url": `${DOMAIN}/${mangaurl}/#webpage`,
                "name": `${manga?.manga?.name} ${manga?.manga?.type}: ${APP_NAME}`,
                "isPartOf": {
                    "@id": `${DOMAIN}/#website`
                },
                "primaryImageOfPage": {
                    "@id": `${manga?.manga?.photo}`
                },
                "inLanguage": "en-US",
                "breadcrumb": {
                    "@id": `${DOMAIN}/${mangaurl}/#breadcrumb`
                }
            },
            {
                "@type": "Person",
                "@id": `${DOMAIN}/${mangaurl}/#author`,
                "image": {
                    "@type": "ImageObject",
                    "@id": "https://secure.gravatar.com/avatar/?s=96&amp;d=mm&amp;r=g",
                    "url": "https://secure.gravatar.com/avatar/?s=96&amp;d=mm&amp;r=g",
                    "inLanguage": "en-US"
                }
            },
            {
                "@type": "Article",
                "headline": `Read ${manga?.manga?.name} ${manga?.manga?.type}: ${APP_NAME}`,
                "articleSection": `${manga?.manga?.categories}`,
                "author": {
                    "@id": `${DOMAIN}/${mangaurl}/#author`
                },
                "publisher": {
                    "@id": `${DOMAIN}/#person`
                },
                "description": `${manga?.manga?.description}`,
                "name": `Read ${manga?.manga?.name} ${manga?.manga?.type}: ${APP_NAME}`,
                "@id": `${DOMAIN}/${mangaurl}/#richSnippet`,
                "isPartOf": {
                    "@id": `${DOMAIN}/${mangaurl}/#webpage`
                },
                "image": {
                    "@id": `${manga?.manga?.photo}`
                },
                "inLanguage": "en-US",
                "mainEntityOfPage": {
                    "@id": `${DOMAIN}/${mangaurl}/#webpage`
                }
            }
        ]
    }

    const DESCRIPTION = `Read ${manga?.manga?.name} ${manga?.manga?.type} online. ${manga?.manga?.description}`;

    const head = () => (
        <Head>
            <title>{`${manga?.manga?.name} ${manga?.manga?.type}: ${APP_NAME}`}</title>
            <meta name="description" content={DESCRIPTION} />
            <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large" />
            <meta name="googlebot" content="noarchive" />
            <meta name="robots" content="noarchive" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="article" />
            <link rel="canonical" href={`${DOMAIN}/${mangaurl}`} />
            <meta property="og:title" content={`${manga?.manga?.name} ${manga?.manga?.type}: ${APP_NAME}`} />
            <meta property="og:description" content={DESCRIPTION} />
            <meta property="og:type" content="webiste" />
            <meta property="og:url" content={`${DOMAIN}/${mangaurl}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />
            <meta property="og:image" content={`${manga?.manga?.photo}`} />
            <meta property="og:image:secure_url" content={`${manga?.manga?.photo}`} />
            <meta property="og:image:type" content="image/webp" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${manga?.manga?.name} ${manga?.manga?.type}: ${APP_NAME}`} />
            <meta name="twitter:description" content={DESCRIPTION} />
            <meta name="twitter:site" content="@mangachimp" />
            <meta name="twitter:creator" content="@mangachimp" />
            <meta name="twitter:image" content={`${manga?.manga?.photo}`} />
            <meta name="twitter:label1" content="Written by" />
            <meta name="twitter:data1" content={`${APP_NAME}`} />
            <meta name="twitter:label2" content="Time to read" />
            <meta name="twitter:data2" content="1 minute" />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        </Head >
    );


    function splitTextIntoParagraphs(text, sentencesPerParagraph = 3) {
        const sentences = text?.match(/[^\.!\?]+[\.!\?]+/g) || [];
        const paragraphs = [];
        for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
            const paragraph = sentences.slice(i, i + sentencesPerParagraph).join(' ').trim();
            paragraphs.push(paragraph);
        }
        return paragraphs;
    }

    const paragraphs = splitTextIntoParagraphs(manga?.manga?.longdescription);

    return (
        <>
            {head()}
            <Navbar />
            <main>
                <article>

                    <div className='px-3'>
                        <div className='max-w-[1000px] mx-auto mt-8 bg-[#091e25] rounded shadow px-3 text-white '>
                            <h1 className={`${roboto.className} text-center font-bold text-3xl pt-6 pb-5 `}>{`${manga?.manga?.fullname} ${manga?.manga?.type}`}</h1>
                            <img className="mx-auto w-[200px]" src={`${manga?.manga?.photo}`} alt="Manga Cover" />
                            <p className="my-5 leading-[2] md:px-6 px-2 text-center ">{manga?.manga?.description}</p>

                            <div className='max-w-[800px] mx-auto'>
                                <div className="flex flex-wrap justify-center gap-5 px-4">
                                    {manga?.manga?.categories?.map((category, index) => (
                                        <Link prefetch={false} href={`${DOMAIN}/categories/${category?.slug}?page=1`} key={index} className="text-white text-[13px] bg-[#051015]  font-bold py-1.5 px-2 rounded hover:scale-110 active:scale-95 transition-transform">
                                            {category?.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>


                            <div className="flex justify-center items-center md:gap-[150px] sm:gap-[100px] pb-8 gap-10 flex-wrap mt-14">
                                <div className="text-center">
                                    <h3 className="font-bold text-[21px] mb-2">Release</h3>
                                    <p>{manga?.manga?.releaseDate}</p>
                                </div>

                                <div className="text-center">
                                    <h3 className="font-bold text-[21px] mb-2">Author</h3>
                                    <p>{manga?.manga?.author}</p>
                                </div>

                                <div className="text-center">
                                    <h3 className="font-bold text-[21px] mb-2">Type</h3>
                                    <p>{manga?.manga?.type}</p>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div className={`${roboto.className} text-3xl px-2 font-bold tracking-wider text-center md:mt-[100px] mt-10 mb-5 text-white`}>{`Read ${manga?.manga?.name} ${manga?.manga?.type}`}</div>

                    <div className='flex justify-center text-[13px] flex-wrap items-center gap-3 mb-10 text-blue-300'>

                        <div className='flex items-center gap-2'>
                            <div><FaHome /></div>
                            <div><Link prefetch={false} href={`${DOMAIN}`}>Home</Link></div>
                        </div>

                        <div>{`->`}</div>

                        <div className='flex items-center gap-2'>
                            <div><AiFillChrome /></div>
                            <div><Link prefetch={false} href={`${DOMAIN}/manga/${mangaurl}`}>{`${manga?.manga?.name}`}</Link></div>
                        </div>

                    </div>


                    <div className="mt-10 max-w-[1100px] mb-10 mx-auto px-5 flex flex-wrap justify-center">
                        {chapterArray?.map((chapternumber, index) => (
                            <div className="flex hover:scale-105 active:scale-95 transition-transform" key={index}>
                                <Link prefetch={false} href={`${DOMAIN}/manga/${mangaurl}/chapter-${chapternumber}`} className="p-5 hover:underline text-white">
                                    <p className="w-[200px] bg-[#091e25] text-center p-5 rounded shadow font-bold break-words border-l-4 
                                ">
                                        {` Chapter ${chapternumber}`}
                                    </p>
                                </Link>
                            </div>
                        ))}
                    </div>



                    <div className="max-w-[1200px] mx-auto mt-10">
                        <h2 className={`${roboto.className} text-center text-3xl font-bold pb-10 text-white`}>Related</h2>
                        <div className="flex justify-center gap-10 flex-wrap pb-10">
                            {manga?.relatedMangas?.map((manga, index) => (
                                <div className="hover:scale-110 transition-transform rounded shadow text-center w-[180px] bg-[#091e25] text-white" key={index}>
                                    <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`}>
                                        <img src={manga?.photo} alt={`${manga?.name} Cover`} className="mb-2 h-[200px] w-[180px] object-cover" />
                                        <div className='px-2 py-3'>
                                            <div className={`${roboto2.className} text-[15px] font-semibold mb-1 text-wrap break-words`}>{manga?.name}</div>
                                            <p className="text-[13px] my-2 py-1  font-bold">{`Total Chapters:  ${manga?.totalChapters ?? 0}`}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='max-w-[800px] mx-auto mt-10 px-5 '>
                        {paragraphs?.map((paragraph, index) => (
                            <p key={index} className=' py-6 tracking-wider leading-8 text-[15px]'>{paragraph}</p>
                        ))}
                    </div>

                </article >
            </main>
            <Footer />
        </>
    );
}


export default MangaPage;