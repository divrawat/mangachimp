
export async function getStaticProps() {
  try {
    const page = 1;
    const [data,
      // mangapercategory,
      categories, latestmangas, latestmangachapters] = await Promise.all([
        getMangasHomePage(),
        // getHomePageMangaPerCategory(),
        getCategories(),
        GetLatestMangas(page),
        getLatestMangaChapters(),
      ]);

    if (data.error) {
      return { props: { errorCode: 404 } };
    }


    return {
      props: {
        mangas: data?.data || [],
        // mangapercategory: mangapercategory,
        categories: categories?.categories || [],
        latestmangas: latestmangas.mangas,
        latestmangachapters: latestmangachapters,
      },
    };
  } catch (error) {
    console.error(error);
    return { props: { errorCode: 500 } };
  }
}



import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Rubik } from '@next/font/google';
import { register } from 'swiper/element/bundle';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "swiper/swiper-bundle.css";

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMangasHomePage, getHomePageMangaPerCategory, GetLatestMangas } from "@/actions/manga";
import { getLatestMangaChapters } from '@/actions/chapter';
import { getCategories } from '@/actions/category';
import { FaArrowAltCircleRight } from "react-icons/fa";
import Head from 'next/head';
import Link from "next/link";
import { DOMAIN, APP_NAME } from "@/config";

const roboto = Rubik({ subsets: ['latin'], weight: '800', });
const roboto2 = Rubik({ subsets: ['latin'], weight: '400', });
const roboto3 = Rubik({ subsets: ['latin'], weight: '600', });
register();
import { useRouter } from 'next/router';

export default function Home({ mangas, categories, latestmangas, latestmangachapters }) {

  // const [selectedCategory, setSelectedCategory] = useState('');
  // const handleChangeCategory = (category) => { setSelectedCategory(category); };

  /*
  const getMangasToDisplay = () => {
    let mangasToDisplay = [];
    if (selectedCategory === '') { mangasToDisplay = Object.values(mangapercategory).flat(); }
    else { mangasToDisplay = mangapercategory[selectedCategory] || []; }
    const seenSlugs = new Set();
    const uniqueMangas = mangasToDisplay.filter(manga => {
      if (seenSlugs.has(manga.slug)) { return false; }
      seenSlugs.add(manga.slug);
      return true;
    });
    return uniqueMangas;
  };
  */

  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    router.push(`/search?manganame=${query}`);
  };

  const DESCRIPTION = `Manga Chimp is your go-to destination for exploring and enjoying a vast collection of manga, manhwas, manhuas etc. Discover the latest releases, read your favorite series for free, and dive into an immersive manga experience with high-quality images and personalized recommendations.`

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
        "publisher": { "@id": `${DOMAIN}/#person` },
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${DOMAIN}/search?manganame={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "CollectionPage",
        "@id": `${DOMAIN}/#webpage`,
        "url": `${DOMAIN}`,
        "name": `${APP_NAME}: The Ultimate Destination For Reading Mangas`,
        "about": { "@id": `${DOMAIN}/#person` },
        "isPartOf": { "@id": `${DOMAIN}/#website` },
        "inLanguage": "en-US"
      }
    ]
  };


  const head = () => (
    <Head>
      <title>{`${APP_NAME}: The Ultimate Destination For Reading Manga, Manhwa, Manhua, WebComic, Novels`}</title>
      <meta name="description" content={DESCRIPTION} />
      <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large" />
      <meta name="googlebot" content="noarchive" />
      <meta name="robots" content="noarchive" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <link rel="canonical" href={`${DOMAIN}`} />
      <meta property="og:title" content={`${APP_NAME}: The Ultimate Destination For Reading Manga, Manhwa, Manhua, WebComic, Novels`} />
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


      <form className="max-w-md mx-auto px-5" onSubmit={handleSubmit}>
        <label htmlFor='default-search' className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input autoComplete='off' value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a manga ..." type="search" id="default-search" className="bg-[#0e2834] block w-full p-4 ps-10 text-sm text-white border border-gray-500 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
          <button type="submit" className="text-white absolute end-2.5 font-bold bottom-2.5 bg-[#051015] hover:scale-110 transition-transform focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-4 py-2">Search</button>
        </div>
      </form>




      <h1 className={`${roboto.className}  text-[white] tracking-wider font-extrabold text-2xl px-3 text-center my-10`}>
        {`${APP_NAME}: Ultimate Destination For Reading Mangas`}
      </h1>



      <Swiper loop={true} centeredSlides={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination, Navigation]} className="mySwiper" >

        {mangas?.map((manga, index) => (
          <SwiperSlide key={index}>
            <div className={`${roboto2.className} bg-[#091e25]  max-w-[1150px] shadow mx-auto md:h-[420px] rounded-lg overflow-hidden  text-white`}>
              <div className="md:flex gap-28 justify-center cursor-pointer">
                <div className="flex justify-center md:block sm:pt-0 pt-3">
                  <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`}>
                    <img src={manga?.photo} alt={manga?.fullname} className="hover:scale-105 transition-transform sm:h-[420px] h-[300px]" />
                  </Link>
                </div>

                <div className="p-4 flex-1">
                  <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`}>
                    <h2 className={`${roboto.className} text-2xl font-bold text-center tracking-wider md:text-left`}>{manga?.fullname}</h2>
                  </Link>

                  <p className="text-[15px] mt-5 md:pr-5 text-center md:text-left">{`Read ${manga?.fullname} ${manga?.type} online in English language. ${manga?.description}`}</p>


                  <div className='max-w-[600px] mx-auto md:mx-0'>
                    <div className="flex flex-wrap md:justify-start justify-center gap-4 mt-10 mb-5">
                      {manga?.categories?.map((category, index) => (
                        <Link prefetch={false} key={index} href={`${DOMAIN}/categories/${category?.slug}?page=1`} className=" bg-[#051015] hover:scale-110 transition-transform active:scale-95 text-white px-2 py-1.5 rounded-md inline-block text-sm">
                          {category?.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`} className="flex justify-center md:block mb-5 mt-7">
                    <div className="bg-[#051015] text-white px-3 py-2 w-[160px] rounded hover:scale-110 transition-transform active:scale-95 text-[15px]">

                      <div className="flex gap-3 items-center">
                        <div className='font-bold tracking-wider text-[14px]'>Start Reading</div>
                        <div><FaArrowAltCircleRight /></div>
                      </div>
                    </div>
                  </Link>

                </div>
              </div>
            </div>
          </SwiperSlide>))}
      </Swiper>






      <h2 className={`${roboto.className} my-7 font-bold text-2xl tracking-wider text-white text-center px-3`}>Latest Chapters</h2>
      <div className="max-w-[1400px] mx-auto px-2 sm:px-6 lg:px-8 py-4 text-white">
        <div className="flex sm:gap-12 gap-3 flex-wrap justify-center">
          {latestmangachapters?.map((manga, index) => (
            <div key={index} className="bg-[#091e25] overflow-hidden shadow rounded-b sm:w-[210px] w-[140px] flex flex-col">
              <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`}> <img className='sm:w-[210px] sm:h-[250px] object-cover w-[140px] h-[160px]' src={manga?.photo} alt={manga?.manganame} /></Link>
              <div className="px-4 py-5">
                <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`}>
                  <div className={`${roboto3.className} sm:text-[15px] text-[12px] font-bold w-[115px] pb-3`}>{manga?.mangaName}</div>
                </Link>

                <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}/chapter-${manga?.latestChapterNumber}`}>
                  <div className='flex gap-2 items-center'>
                    <div>
                      <p className="sm:text-[10px] text-[8px] font-semibold px-1.5 py-1 rounded bg-[#051015] break-words text-wrap">{`Chapter ${manga?.latestChapterNumber ?? 0}`}</p>
                    </div>
                    <div><p className='sm:text-[9px] text-[7px]'>{`${manga?.latestChapterDate ?? 0}`}</p></div>
                  </div>
                </Link>


                <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}/chapter-${manga?.secondlatestChapterNumber}`}>
                  <div className='flex gap-2 items-center mt-3'>
                    <div>
                      <p className="sm:text-[10px] text-[8px] font-semibold px-1.5 py-1 rounded bg-[#051015]">{`Chapter ${manga?.secondlatestChapterNumber ?? 0}`}</p>
                    </div>
                    <div><p className='sm:text-[9px] text-[7px]'>{`${manga?.secondlatestChapterDate ?? 0}`}</p></div>
                  </div>
                </Link>
              </div>
            </div>
          )).slice(0, 30)}
        </div>
      </div>






      <div className='max-w-[1200px] mx-auto pt-8 px-2'>

        <div className={`${roboto.className} text-2xl text-center px-3 text-white font-bold tracking-wider my-5`}>Newly Added Mangas</div>
        <Swiper slidesPerView={1} spaceBetween={5} pagination={{ clickable: true }} modules={[Autoplay, Pagination]} className="mySwiper"
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          breakpoints={{
            '@0.00': {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            '@0.75': {
              slidesPerView: 2,
              spaceBetween: 5,
            },
            '@1.00': {
              slidesPerView: 3,
              spaceBetween: 5,
            },
            '@1.50': {
              slidesPerView: 4,
              spaceBetween: 5,
            },
            '@2': {
              slidesPerView: 5,
              spaceBetween: 5,
            },
          }}
        >

          {latestmangas?.map((manga, index) => (
            <SwiperSlide key={index}>
              <div className="hover:scale-110 transition-transform rounded shadow sm:w-[190px] sm:h-[330px] h-[280px] w-[140px] bg-[#091e25]" >
                <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`}>
                  <img src={manga?.photo} alt={`${manga?.name} Cover`} className="mb-2 sm:h-[200px] sm:w-[190px] h-[160px] w-[140px] object-cover" />
                  <div className='sm:px-4 px-2 py-3 text-white'>
                    <p className='sm:text-[12px] font-bold text-[9px] pb-1.5'>{`Total Chapters:  ${manga?.totalChapters ?? 0}`}</p>
                    <p className={`${roboto3.className} font-bold sm:text-[13px] text-[11px] mb-1 text-wrap break-words`}>{manga?.name}</p>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          )).slice(0, 25)}
        </Swiper>
      </div>



      {/* <div className='max-w-[1262px] mx-auto pt-8'>
        <div className='flex gap-3 justify-center md:mt-[80px] mt-5 bg-[#07161a] flex-wrap py-5 px-2 md:py-0 md:px-0 rounded'>
          <div
            onClick={() => handleChangeCategory('')}
            className={`cursor-pointer px-3 uppercase py-2 text-[13px] text-white font-bold ${selectedCategory === '' ? 'bg-[#2a798f] rounded' : 'text-white hover:scale-105 transition-transform active:scale-90 hover:bg-[#2a798f] hover:rounded'}`}>
            All Mangas
          </div>
          {categories?.map((category, index) => (
            <p key={index} onClick={() => handleChangeCategory(category?.name)}
              className={`cursor-pointer px-3 uppercase py-2 text-[13px] text-white font-bold ${selectedCategory === category?.name ? 'bg-[#2a798f] rounded' : 'text-white hover:scale-105 transition-transform active:scale-90 hover:bg-[#2a798f] hover:rounded'}`}>
              {category?.name}
            </p>
          ))}
        </div>
      </div> */}

      {/* <h2 className={`${roboto.className} text-2xl tracking-wider font-extrabold my-6 text-center uppercase text-white`}>
        {selectedCategory === '' ? 'All Mangas' : selectedCategory}
      </h2> */}

      {/* <div className="max-w-[1300px] mx-auto px-2 sm:px-6 lg:px-8 py-4 text-white">
        <div className="flex sm:gap-12 gap-3 flex-wrap justify-center">
          {getMangasToDisplay().map((manga, index) => (
            <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`} key={index} className="bg-[#091e25] overflow-hidden shadow rounded-b sm:w-[190px] w-[140px] flex flex-col hover:scale-110 transition-transform">
              <img className='sm:w-[190px] sm:h-[220px] h-[160px] w-[140px] object-cover' src={manga?.photo} alt={manga?.name} />
              <div className="px-4 py-5">
                <p className="sm:text-[12px] font-bold text-[10px] pb-1.5">{`Total Chapters: ${manga?.totalChapters ?? 0}`}</p>
                <p className="sm:text-[14px] text-[12px] font-bold ">{manga?.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div> */}



      <div className={`${roboto.className} text-2xl text-center mb-10 text-white font-bold tracking-wider mt-10`}>All Categories</div>

      <div className='max-w-[1000px] mx-auto px-5'>
        <div className='text-white flex gap-10 flex-wrap justify-center items-center'>
          {categories?.map((category, index) => (
            <Link prefetch={false} key={index} href={`${DOMAIN}/categories/${category.slug}?page=1`} className='bg-[#091e25] px-2.5 py-1.5 font-bold rounded  text-sm hover:scale-110 transition-transform'>
              {category?.name}
            </Link>
          ))}
        </div>
      </div>



      <br />
      <Footer />
    </>
  );
}