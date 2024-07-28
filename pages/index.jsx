
export async function getStaticProps() {
  try {
    const [data, mangapercategory, categories, latestmangas, latestmangachapters] = await Promise.all([
      getMangasHomePage(),
      getHomePageMangaPerCategory(),
      getCategories(),
      GetLatestMangas(),
      getLatestMangaChapters(),
    ]);

    if (data.error) {
      return { props: { errorCode: 404 } };
    }


    return {
      props: {
        mangas: data?.data || [],
        mangapercategory: mangapercategory,
        categories: categories?.categories || [],
        latestmangas: latestmangas,
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
import Link from "next/link";
import { DOMAIN, APP_NAME } from "@/config";
const roboto = Rubik({ subsets: ['latin'], weight: '800', });
const roboto2 = Rubik({ subsets: ['latin'], weight: '400', });
const roboto3 = Rubik({ subsets: ['latin'], weight: '600', });
register();


export default function Home({ mangas, mangapercategory, categories, latestmangas, latestmangachapters }) {

  const [selectedCategory, setSelectedCategory] = useState('');
  const handleChangeCategory = (category) => { setSelectedCategory(category); };

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





  return (
    <div>
      <Navbar />
      <br />



      <h1 className={`${roboto.className}  text-[white] tracking-wider font-extrabold text-2xl px-3 text-center mb-10 mt-5`}>
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
                  <Link href={`${DOMAIN}/manga/${manga?.slug}`}>
                    <img src={manga?.photo} alt={manga?.fullname} className="hover:scale-105 transition-transform sm:h-[420px] h-[300px]" />
                  </Link>
                </div>

                <div className="p-4 flex-1">
                  <Link href={`${DOMAIN}/manga/${manga?.slug}`}>
                    <h2 className={`${roboto.className} text-2xl font-bold text-center tracking-wider md:text-left`}>{manga?.fullname}</h2>
                  </Link>

                  <p className="text-[15px] mt-5 md:pr-5 text-center md:text-left">{`Read ${manga?.fullname} ${manga?.type} online in English language. ${manga?.description}`}</p>


                  <div className='max-w-[600px] mx-auto md:mx-0'>
                    <div className="flex flex-wrap md:justify-start justify-center gap-4 mt-10 mb-5">
                      {manga?.categories?.map((category, index) => (
                        <Link key={index} href={`${DOMAIN}/categories/${category?.slug}?page=1`} className=" bg-[#051015] hover:scale-110 transition-transform active:scale-95 text-white px-2 py-1.5 rounded-md inline-block text-sm">
                          {category?.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link href={`${DOMAIN}/manga/${manga?.slug}`} className="flex justify-center md:block mb-5 mt-7">
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
        <div className="flex gap-12 flex-wrap justify-center">
          {latestmangachapters?.map((manga, index) => (
            <div key={index} className="bg-[#091e25] overflow-hidden shadow rounded-b w-[210px] flex flex-col">
              <Link href={`${DOMAIN}/manga/${manga?.slug}`}> <img className='w-[210px] h-[250px] object-cover' src={manga?.photo} alt={manga?.manganame} /></Link>
              <div className="px-4 py-5">
                <Link href={`${DOMAIN}/manga/${manga?.slug}`}>
                  <div className={`${roboto3.className} text-[15px] font-bold w-[200px] pb-3`}>{manga?.mangaName}</div>
                </Link>

                <Link href={`${DOMAIN}/manga/${manga?.slug}/chapter-${manga?.latestChapterNumber}`}>
                  <div className='flex gap-2 items-center'>
                    <div>
                      <p className="text-[10px] font-semibold px-1.5 py-1 rounded bg-[#051015]">{`Chapter ${manga?.latestChapterNumber}`}</p>
                    </div>
                    <div><p className='text-[9px]'>{manga?.latestChapterDate}</p></div>
                  </div>
                </Link>


                <Link href={`${DOMAIN}/manga/${manga?.slug}/chapter-${manga?.secondlatestChapterNumber}`}>
                  <div className='flex gap-2 items-center mt-3'>
                    <div>
                      <p className="text-[10px] font-semibold px-1.5 py-1 rounded bg-[#051015]">{`Chapter ${manga?.secondlatestChapterNumber}`}</p>
                    </div>
                    <div><p className='text-[9px]'>{manga?.secondlatestChapterDate}</p></div>
                  </div>
                </Link>


              </div>
            </div>
          )).slice(0, 30)}
        </div>
      </div>














      <div className='max-w-[1200px] mx-auto pt-8'>

        <div className={`${roboto.className} text-2xl text-center text-white font-bold tracking-wider my-5`}>Newly Added Mangas</div>
        <Swiper slidesPerView={1} spaceBetween={5} pagination={{ clickable: true }} modules={[Autoplay, Pagination]} className="mySwiper"
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          breakpoints={{
            '@0.00': {
              slidesPerView: 1,
              spaceBetween: 5,
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
            <div className="flex justify-center items-center gap-5 flex-wrap" key={index}>
              <SwiperSlide>
                <div className="hover:scale-110 transition-transform rounded shadow w-[190px] bg-[#091e25]" key={index}>
                  <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`}>
                    <img src={manga?.photo} alt={`${manga?.name} Cover`} className="mb-2 h-[200px] w-[190px] object-cover" />
                    <div className='px-4 py-3 text-white'>
                      <p className='text-[12px] pb-1.5'>{`Total Chapters:  ${manga?.totalChapters ?? 0}`}</p>
                      <div style={{ height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }} className={`${roboto3.className} font-bold text-[13px] mb-1 text-wrap break-words`}>{manga?.name}</div>

                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            </div>
          )).slice(0, 25)}
        </Swiper>
      </div>



      <div className='max-w-[1262px] mx-auto pt-8'>
        <div className='flex gap-3 justify-center md:mt-[80px] mt-5 bg-[#07161a] flex-wrap py-5 px-2 md:py-0 md:px-0 rounded'>
          <div
            onClick={() => handleChangeCategory('')}
            className={`cursor-pointer px-3 uppercase py-2 text-[13px] text-white font-bold ${selectedCategory === '' ? 'bg-[#2a798f] rounded' : 'text-white hover:scale-105 transition-transform active:scale-90 hover:bg-[#2a798f] hover:rounded'}`}>
            All Mangas
          </div>
          {categories?.map((category) => (
            <div key={category?.slug} onClick={() => handleChangeCategory(category?.name)}
              className={`cursor-pointer px-3 uppercase py-2 text-[13px] text-white font-bold ${selectedCategory === category?.name ? 'bg-[#2a798f] rounded' : 'text-white hover:scale-105 transition-transform active:scale-90 hover:bg-[#2a798f] hover:rounded'}`}>
              {category?.name}
            </div>
          ))}
        </div>
      </div>

      <h2 className={`${roboto.className} text-2xl tracking-wider font-extrabold my-6 text-center uppercase text-white`}>
        {selectedCategory === '' ? 'All Mangas' : selectedCategory}
      </h2>

      <div className="max-w-[1300px] mx-auto px-2 sm:px-6 lg:px-8 py-4 text-white">
        <div className="flex gap-12 flex-wrap justify-center">
          {getMangasToDisplay().map((manga, index) => (
            <Link href={`${DOMAIN}/manga/${manga?.slug}`} key={index} className="bg-[#091e25] overflow-hidden shadow rounded-b w-[190px] flex flex-col hover:scale-110 transition-transform">
              <img className='w-[190px] h-[220px] object-cover' src={manga?.photo} alt={manga?.name} />
              <div className="px-4 py-5">
                <p className="text-[12px] pb-1.5">{`Total Chapters: ${manga?.totalChapters ?? 0}`}</p>
                <div style={{ height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }} className="text-[14px] font-bold w-[185px]">{manga?.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>


      <br />
      <Footer />
    </div>
  );
}