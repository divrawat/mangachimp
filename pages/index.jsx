/*
export async function getServerSideProps() {
  try {
    const data = await getMangasHomePage();
    if (data.error) {
      return { props: { errorCode: 404 } };
    } else { return { props: { mangas: data?.data } }; }
  } catch (error) {
    console.error(error);
    return { props: { errorCode: 500 } };
  }
}
  */


export async function getStaticProps() {
  try {
    const [data, mangapercategory, categories, latestmangas] = await Promise.all([
      getMangasHomePage(),
      getHomePageMangaPerCategory(),
      getCategories(),
      GetLatestMangas()
    ]);

    if (data.error) {
      return { props: { errorCode: 404 } };
    }


    return {
      props: {
        mangas: data?.data || [],
        mangapercategory: mangapercategory,
        categories: categories?.categories || [],
        latestmangas: latestmangas
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

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMangasHomePage, getHomePageMangaPerCategory, GetLatestMangas } from "@/actions/manga";
import { getCategories } from '@/actions/category';
import { FaArrowAltCircleRight } from "react-icons/fa";
import Link from "next/link";
import { DOMAIN, APP_NAME } from "@/config";
const roboto = Rubik({ subsets: ['latin'], weight: '800', });
const roboto2 = Rubik({ subsets: ['latin'], weight: '400', });
const roboto3 = Rubik({ subsets: ['latin'], weight: '600', });
register();


export default function Home({ mangas, mangapercategory, categories, latestmangas }) {

  const [selectedCategory, setSelectedCategory] = useState('Shonen');

  const handleChangeCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <Navbar />
      <br />

      <h1 className={`${roboto.className} tracking-wider text-white font-extrabold text-2xl px-3 text-center mb-10 mt-5`}>
        {`${APP_NAME}: Ultimate Destination For Reading Mangas`}
      </h1>




      <Swiper loop={true} centeredSlides={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination, Navigation]} className="mySwiper" >

        {mangas?.map((manga, index) => (
          <SwiperSlide key={index}>

            <div className={`${roboto2.className} max-w-[1150px] shadow mx-auto md:h-[420px] rounded-lg overflow-hidden bg-[#091e25] text-white`}>
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

                  <p className="text-[15px] mt-5 md:pr-5">{`Read ${manga?.fullname} ${manga?.type} online in English language. ${manga?.description}`}</p>


                  <div className='max-w-[600px]'>
                    <div className="flex flex-wrap md:justify-start justify-center gap-4 mt-10 mb-5">
                      {manga?.categories?.map((category, index) => (
                        <Link key={index} href={`${DOMAIN}/categories/${category?.slug}?page=1`} className=" bg-[#051015] hover:scale-110 transition-transform active:scale-95 text-white px-2 py-1.5 rounded-md inline-block text-sm">
                          {category?.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link href={`${DOMAIN}/manga/${manga?.slug}`} className="flex justify-center md:block mb-5 mt-7"> <div className="bg-[#051015] text-white px-3 py-2 w-[160px] rounded hover:scale-110 transition-transform active:scale-95 text-[15px]">

                    <div className="flex gap-3 items-center">
                      <div className='font-bold tracking-wider'>Start Reading</div>
                      <div><FaArrowAltCircleRight /></div>
                    </div>
                  </div>


                  </Link>


                </div>
              </div>
            </div>

          </SwiperSlide>))}
      </Swiper>











      <div className='max-w-[1200px] mx-auto pt-8'>

        <div className={`${roboto.className} text-2xl text-center text-white font-bold tracking-wider my-5`}>Newly Added</div>


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
                      <h3 style={{ height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }} className={`${roboto3.className} font-bold text-[13px] mb-1 text-wrap break-words`}>{manga?.name}</h3>

                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            </div>
          ))}
        </Swiper>

      </div>



      <div className='max-w-[1142px] mx-auto pt-8'>

        <div className='flex gap-3 justify-center md:mt-[80px] mt-5  bg-[#040c0f] flex-wrap py-5 px-2 md:py-0 md:px-0 rounded'>
          {categories?.map((category) => (
            <div key={category?.slug} onClick={() => handleChangeCategory(category?.name)}
              className={`cursor-pointer px-3 uppercase py-2 text-[13px] text-white font-bold ${selectedCategory === category?.name ? 'bg-[#091e25] rounded' : 'text-white hover:scale-105 transition-transform active:scale-90 hover:bg-[#091e25] hover:rounded'}`}>
              {category?.name}
            </div>
          ))}
        </div>
      </div>


      <h2 className={`${roboto.className} text-2xl tracking-wider font-extrabold my-6 text-center uppercase text-white`}>{selectedCategory}</h2>
      <div className="max-w-[1300px] mx-auto px-2 sm:px-6 lg:px-8 py-4 text-white">
        <div className="flex gap-12 flex-wrap justify-center">
          {mangapercategory[selectedCategory]?.map((manga) => (
            <Link href={`${DOMAIN}/manga/${manga?.slug}`} key={manga?.slug} className="bg-[#091e25] overflow-hidden shadow rounded-b w-[190px] flex flex-col hover:scale-110 transition-transform">
              <img className='w-[190px] h-[220px] object-cover' src={manga?.photo} alt={manga?.name} />
              <div className="px-4 py-5">
                <p className="text-[12px] pb-1.5">{`Total Chapters:  ${manga?.totalChapters ?? 0}`}</p>
                <h3 style={{ height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }} className="text-[14px] font-bold  w-[185px]">{manga?.name}</h3>

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