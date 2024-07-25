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
    const [data, mangapercategory, categories] = await Promise.all([
      getMangasHomePage(),
      getHomePageMangaPerCategory(),
      getCategories(),
    ]);

    if (data.error) {
      return { props: { errorCode: 404 } };
    }

    return {
      props: {
        mangas: data?.data || [],
        mangapercategory: mangapercategory,
        categories: categories?.categories || [],
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
import { getMangasHomePage, getHomePageMangaPerCategory } from "@/actions/manga";
import { getCategories } from '@/actions/category';
import Link from "next/link";
import { DOMAIN, APP_NAME } from "@/config";
const roboto = Rubik({ subsets: ['latin'], weight: '800', });
register();


export default function Home({ mangas, mangapercategory, categories }) {

  const [selectedCategory, setSelectedCategory] = useState('Shonen'); // Default category

  const handleChangeCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <Navbar />
      <br />

      <h1 className={`${roboto.className} text-base-color font-extrabold sm:text-3xl text-2xl px-3 text-center mb-10 mt-5`}>
        {`${APP_NAME}: Ultimate Destination For Reading Mangas`}
      </h1>




      <Swiper loop={true} centeredSlides={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination, Navigation]} className="mySwiper" >

        {mangas?.map((manga, index) => (
          <SwiperSlide key={index}>

            <div className="max-w-[1150px] shadow border mx-auto md:h-[420px] rounded-lg overflow-hidden bg-[whitesmoke] text-base-color">
              <div className="md:flex gap-28 justify-center cursor-pointer">
                <div className="flex justify-center md:block sm:pt-0 pt-3">
                  <Link href={`${DOMAIN}/manga/${manga?.slug}`}>
                    <img src={manga?.photo} alt={manga?.fullname} className="hover:scale-105 transition-transform sm:h-[420px] h-[300px]" />
                  </Link>
                </div>

                <div className="p-4 flex-1">
                  <Link href={`${DOMAIN}/manga/${manga?.slug}`}>
                    <h2 className={`${roboto.className} text-2xl font-bold text-center md:text-left`}>{manga?.fullname}</h2>
                  </Link>

                  <p className="text-[15px] mt-5 md:pr-5 text-base-text-color">{`Read ${manga?.fullname} ${manga?.type} online in English language. ${manga?.description}`}</p>

                  <div className="flex flex-wrap md:justify-start justify-center gap-4 mt-10 mb-5">
                    {manga?.categories?.map((category, index) => (
                      <Link key={index} href={`${DOMAIN}/categories/${category?.slug}?page=1`} className="bg-base-color hover:scale-110 transition-transform active:scale-95 text-white px-2 py-1.5 rounded-md inline-block text-sm">
                        {category?.name}
                      </Link>
                    ))}
                  </div>

                  <Link href={`${DOMAIN}/manga/${manga?.slug}`} className="flex justify-center md:block mb-5 mt-7"> <button className="bg-base-color text-white px-3 py-2 rounded hover:scale-125 transition-transform active:scale-95 text-[15px]">Start Reading &nbsp; 🡆</button></Link>


                </div>
              </div>
            </div>

          </SwiperSlide>))}

      </Swiper>



      <div className='max-w-[1142px] mx-auto pt-5'>
        <div className='flex gap-3 justify-center bg-base-dark-color flex-wrap py-5 px-2 md:py-0 md:px-0 rounded'>
          {categories?.map((category) => (
            <div key={category.slug} onClick={() => handleChangeCategory(category?.name)}
              className={`cursor-pointer px-3 uppercase py-2 text-[13px] text-white font-bold ${selectedCategory === category.name ? 'bg-[blue] rounded' : 'text-white hover:scale-105 transition-transform active:scale-90 hover:bg-[blue] hover:rounded'}`}>
              {category?.name}
            </div>
          ))}
        </div>
      </div>


      <h2 className="text-2xl font-extrabold my-6 text-center uppercase text-base-color">{selectedCategory}</h2>
      <main className="max-w-[1250px] mx-auto px-2 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-12 flex-wrap justify-center">
          {mangapercategory[selectedCategory]?.map((manga) => (
            <Link href={`${DOMAIN}/manga/${manga?.slug}`} key={manga?.slug} className="bg-white overflow-hidden shadow rounded-b w-[180px] flex flex-col hover:scale-110 transition-transform">
              <img className='w-[180px] object-contain' src={manga?.photo} alt={manga?.name} />
              <div className="px-4 py-3">
                <h3 className="text-[14.5px] font-bold mb-[3px] text-base-color w-[150px]">{manga?.name}</h3>
                <p className="text-[12px] text-base-text-color font-bold">{`Total Chapters:  ${manga?.totalChapters ?? 0}`}</p>
              </div>
            </Link>
          ))}

        </div>
      </main>











      <br />
      <Footer />
    </div>
  );
}