/*
export async function getServerSideProps({ params }) {

    const response = await getParticularMangachapterwithRelated(params.slug, params.chapter);
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

    const chapterNumbers = response?.allchapterNumbers?.map(chapter => chapter.chapterNumber) || [];
    const sortedchapterNumbers = sortChapters(chapterNumbers);
    const reversedChapterNumbers = sortedchapterNumbers.reverse();
    return { props: { manga: response?.manga, chapterData: response?.chapterData, relatedMangas: response?.relatedMangas, chapterArray: reversedChapterNumbers } }
}
*/



export async function getStaticPaths() {
    const paths = [{ params: { slug: 'one-piece', chapter: 'chapter-1' } }];
    return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
    try {
        const response = await getParticularMangachapterwithRelated(params.slug, params.chapter);
        if (response?.error) { { return { props: { errorcode: true } }; } }

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

        const chapterNumbers = response?.allchapterNumbers?.map(chapter => chapter.chapterNumber) || [];
        const sortedchapterNumbers = sortChapters(chapterNumbers);

        return {
            props: {
                manga: response?.manga, chapterData: response?.chapterData, relatedMangas: response?.relatedMangas, chapterArray: sortedchapterNumbers,
            }
        };
    } catch (error) {
        console.error('Error fetching manga data:', error);
        { return { props: { errorcode: true } }; }
    }
}








import { getParticularMangachapterwithRelated } from "@/actions/chapter";
import Head from "next/head";
import Link from "next/link";
import { APP_NAME, DOMAIN, IMAGES_SUBDOMAIN, NOT_FOUND_IMAGE } from "@/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Rubik } from '@next/font/google';
import { FaHome } from "react-icons/fa";
import { GiBlackBook } from "react-icons/gi";
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import { AiFillChrome } from "react-icons/ai";
const roboto = Rubik({ subsets: ['latin'], weight: '800', });
import DisqusComments from '@/components/DisQus';






export default function Chapter({ errorcode, manga, chapterArray, relatedMangas, chapterData }) {

    if (errorcode) {
        const head = () => (<Head> <title>{`404 Page Not Found: ${APP_NAME}`}</title> </Head>);
        return (
            <>
                {head()}
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



    const [chaptersArray, setChaptersArray] = useState([]);
    useEffect(() => { setChaptersArray(chapterArray); }, [manga?.slug]);

    const router = useRouter();
    const DESCRIPTION = `Read ${manga?.name} chapter ${chapterData?.chapterNumber} online. ${manga?.description}`;

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
                "@type": "BreadcrumbList",
                "@id": `${DOMAIN}/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}/#breadcrumb`,
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
                            // "@id": "https://kingofshojo.com/category/omniscient-readers-viewpoint/",
                            "name": `${DOMAIN}/manga/${manga?.slug}`
                        }
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "item": {
                            "@id": `${DOMAIN}/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}/`,
                            "name": `${manga?.name} Chapter ${chapterData?.chapterNumber}`
                        }
                    }
                ]
            },
            {
                "@type": "WebPage",
                "@id": `${DOMAIN}/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}/#webpage`,
                "url": `${DOMAIN}/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}`,
                "name": `${manga?.name} Chapter ${chapterData?.chapterNumber}: ${APP_NAME}`,
                "isPartOf": {
                    "@id": `${DOMAIN}/#website`
                },
                "primaryImageOfPage": {
                    "@id": `${IMAGES_SUBDOMAIN}/${manga?.slug}/chapter-${chapterData?.chapterNumber}/1.webp`
                },
                "inLanguage": "en-US",
                "breadcrumb": {
                    "@id": `${DOMAIN}/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}/#breadcrumb`
                }
            },
            {
                "@type": "Person",
                "@id": `${DOMAIN}/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}/#author`,
                "image": {
                    "@type": "ImageObject",
                    "@id": "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g",
                    "url": "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g",
                    "inLanguage": "en-US"
                }
            },
            {
                "@type": "BlogPosting",
                "headline": `${manga?.name} Chapter ${chapterData?.chapterNumber}: ${APP_NAME}`,
                "articleSection": `${manga?.slug}`,
                "author": {
                    "@id": `${DOMAIN}/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}/#author`
                },
                "publisher": {
                    "@id": `${DOMAIN}/#person`
                },
                "description": `${DESCRIPTION}`,
                "name": `${manga?.name} Chapter ${chapterData?.chapterNumber}: ${APP_NAME}`,
                "@id": `${DOMAIN}/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}/#richSnippet`,
                "isPartOf": {
                    "@id": `${DOMAIN}/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}/#webpage`
                },
                "image": {
                    "@id": `${IMAGES_SUBDOMAIN}/${manga?.slug}/chapter-${chapterData?.chapterNumber}/1.webp`
                },
                "inLanguage": "en-US",
                "mainEntityOfPage": {
                    "@id": `${DOMAIN}/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}/#webpage`
                }
            }
        ]
    }


    const head = () => (
        <Head>
            <title>{`${manga?.name} Chapter ${chapterData?.chapterNumber}: ${APP_NAME}`}</title>
            <meta name="description" content={DESCRIPTION} />
            <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large" />
            <meta name="googlebot" content="noarchive" />
            <meta name="robots" content="noarchive" />
            <link rel="canonical" href={`${DOMAIN}/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}`} />
            <meta property="og:title" content={`${manga?.name} Chapter ${chapterData?.chapterNumber}`} />
            <meta property="og:description" content={DESCRIPTION} />
            <meta property="og:type" content="webiste" />
            <meta property="og:url" content={`${DOMAIN}/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />
            <meta property="og:image" content={`${IMAGES_SUBDOMAIN}/${manga?.slug}/chapter-${chapterData?.chapterNumber}/1.webp`} />
            <meta property="og:image:secure_url" content={`${IMAGES_SUBDOMAIN}/${manga?.slug}/chapter-${chapterData?.chapterNumber}/1.webp`} />
            <meta property="og:image:type" content="image/webp" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${manga?.name} Chapter ${chapterData?.chapterNumber}: ${APP_NAME}`} />
            <meta name="twitter:description" content={DESCRIPTION} />
            <meta name="twitter:site" content="@mangachimp" />
            <meta name="twitter:creator" content="@mangachimp" />
            <meta name="twitter:image" content={`${manga?.photo}`} />
            <meta name="twitter:label1" content="Written by" />
            <meta name="twitter:data1" content={`${APP_NAME}`} />
            <meta name="twitter:label2" content="Time to read" />
            <meta name="twitter:data2" content="1 minute" />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        </Head>
    );


    const navigateTo = (event) => {
        const selectedCountry = event.target.value;
        if (selectedCountry !== '') {
            router.push(`${selectedCountry}`);
        }
    };

    let currentIndexAfterSorting = chapterArray?.findIndex(ch => ch === chapterData?.chapterNumber);
    let prevChapter = currentIndexAfterSorting > 0 ? chapterArray[currentIndexAfterSorting - 1] : null;
    let nextChapter = currentIndexAfterSorting < chapterArray.length - 1 ? chapterArray[currentIndexAfterSorting + 1] : null;

    const images = [];
    for (let i = 1; i <= chapterData?.numImages; i++) { images.push(`${IMAGES_SUBDOMAIN}/${manga?.slug}/chapter-${chapterData?.chapterNumber}/${i}.webp`); }


    function splitTextIntoParagraphs(text, sentencesPerParagraph = 3) {
        const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
        const paragraphs = [];
        for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
            const paragraph = sentences.slice(i, i + sentencesPerParagraph).join(' ').trim();
            paragraphs.push(paragraph);
        }
        return paragraphs;
    }

    const paragraphs = splitTextIntoParagraphs(manga?.longdescription);


    return (
        <>
            {head()}
            <Navbar />
            <main>
                <article>
                    <h1 className={`${roboto.className} text-white font-extrabold sm:text-3xl text-2xl text-center px-4 pt-5 mb-3`}>{`${manga?.name} Chapter ${chapterData?.chapterNumber}`}</h1>

                    <div className='flex justify-center flex-wrap items-center gap-2 text-[13px] mb-10 text-blue-300'>

                        <div className='flex items-center gap-2'>
                            <div><FaHome /></div>
                            <div><Link prefetch={false} href={`${DOMAIN}`}>Home</Link></div>
                        </div>

                        <div>{`->`}</div>

                        <div className='flex items-center gap-2'>
                            <div><AiFillChrome /></div>
                            <div><Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`}>{`${manga?.name}`}</Link></div>
                        </div>

                        <div>{`->`}</div>

                        <div className='flex items-center gap-2'>
                            <div><GiBlackBook /></div>
                            <div><Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}`}>{` Chapter ${chapterData?.chapterNumber}`}</Link></div>
                        </div>

                    </div>


                    <div className='mx-3  px-1 pb-5'>
                        <div className="flex justify-between max-w-[800px] items-center mx-auto md:pb-[50px] mt-5">
                            {nextChapter !== null ? (
                                <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}/chapter-${nextChapter}`}>
                                    <button className="text-[black] font-bold text-[13px] hover:scale-105 active:scale-95 transition-transform rounded bg-[white] px-2 py-1.5">
                                        <div className='flex items-center gap-2 justify-center'>
                                            <div className='pt-[1.5px]'><FaArrowAltCircleLeft /></div>
                                            <div>Prev</div>
                                        </div>
                                    </button>
                                </Link>
                            ) : (
                                <button className="text-[white] text-[13px] rounded bg-[gray] px-2 py-1.5 font-bold cursor-not-allowed" disabled>
                                    <div className='flex items-center gap-2 justify-center'>
                                        <div className='pt-[1.5px]'><FaArrowAltCircleLeft /></div>
                                        <div>Prev</div>
                                    </div>
                                </button>
                            )}



                            <div className="w-[120px]">
                                <select className="bg-[white] cursor-pointer border border-gray-300 text-gray-900 text-[13.5px] rounded-lg block w-full   p-1.5" onChange={navigateTo}>
                                    {
                                        chaptersArray?.map((chapter, index) => (
                                            <option className='cursor-pointer' selected={`${DOMAIN}/manga/${manga?.slug}/chapter-${chapter}` === `${DOMAIN}/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}`}
                                                key={index} value={`${DOMAIN}/manga/${manga?.slug}/chapter-${chapter}`}>{`Chapter ${chapter}`}</option>
                                        ))
                                    }
                                </select>
                            </div>



                            {prevChapter !== null ? (
                                <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}/chapter-${prevChapter}`}>
                                    <button className="text-[black] text-[13px] hover:scale-105 active:scale-95 transition-transform rounded
                                 bg-[white] px-2 py-1.5 font-bold">
                                        <div className='flex items-center gap-2 justify-center'>
                                            <div>Next</div>
                                            <div className='pt-[1.5px]'><FaArrowAltCircleRight /></div>
                                        </div>
                                    </button>
                                </Link>
                            ) : (
                                <button className="text-[white] text-[13px] rounded bg-[gray] px-2 py-1.5 font-bold cursor-not-allowed" disabled>
                                    <div className='flex items-center gap-2 justify-center'>
                                        <div>Next</div>
                                        <div className='pt-[1.5px]'><FaArrowAltCircleRight /></div>
                                    </div>
                                </button>
                            )}

                        </div>
                    </div>


                    {images?.map((imageSrc, index) => (
                        <div className='allimages' key={index}>
                            <img key={index} src={imageSrc} alt={`${manga?.name} Chapter ${chapterData?.chapterNumber} Image ${index + 1}`} />
                        </div>
                    ))}





                    <div className='py-10 bg-[#051015]'>
                        <h2 className='text-4xl text-center text-[white] font-blod px-4 mb-10'>Comment Section</h2>
                        <section className='max-w-[1000px] mx-auto px-5'>
                            <DisqusComments url={`/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}`} identifier={`${DOMAIN}/manga/${manga?.slug}/chapter-${chapterData?.chapterNumber}`} title={`${manga?.name} Chapter ${chapterData?.chapterNumber}`} />
                        </section>
                    </div>



                    <div className="max-w-[1300px] mx-auto mt-10">

                        <h2 className={`${roboto.className} text-center text-white text-3xl font-bold pb-10`}>Related</h2>

                        <div className="flex justify-center sm:gap-10 gap-3 flex-wrap pb-10 px-3">
                            {relatedMangas?.map((manga, index) => (
                                <div className="hover:scale-110 transition-transform text-white rounded shadow sm:w-[200px] w-[140px] bg-[#051015]" key={index}>
                                    <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`}>
                                        <img src={manga?.photo} alt={`${manga?.name} Cover`} className="mb-2 sm:h-[230px] sm:w-[200px] w-[140px] h-[160px] object-cover" />
                                        <div className='sm:px-5 px-3 py-3'>
                                            <p className="sm:text-[11.5px] text-[9px] mb-1 font-bold">{` Total Chapters:  ${manga?.chapterCount}`}</p>
                                            <p className="sm:text-[13.5px] text-[11px] font-bold mb-1 text-wrap break-words">{manga?.name}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>


                </article>

                <div className='max-w-[800px] mx-auto mt-10'>
                    {paragraphs?.map((paragraph, index) => (
                        <p key={index} className=' py-6 tracking-wider leading-7 text-[15px]'>{paragraph}</p>
                    ))}
                </div>

            </main>
            <Footer />
        </>
    );

}