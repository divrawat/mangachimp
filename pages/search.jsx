import { SearchAllMangas } from "@/actions/search";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DOMAIN, APP_NAME } from "@/config";
import { Rubik } from '@next/font/google';
const roboto = Rubik({ subsets: ['latin'], weight: '800', });

const SearchedPage = () => {

    const [mangas, setMangas] = useState([]);

    const router = useRouter();
    const { manganame } = router.query;


    function fetchMangas() {
        SearchAllMangas(manganame).then((data) => {
            setMangas(data?.mangas);
        });
    }

    useEffect(() => { fetchMangas(); }, [manganame]);


    return (
        <>
            <Navbar />

            <h1 className={`${roboto.className} text-2xl text-center text-white font-bold tracking-wider mt-5 mb-8`}>Search Results for <span className="text-blue-400 text-3xl px-3">{manganame}</span></h1>

            <div className="max-w-[1300px] mx-auto px-2 sm:px-6 lg:px-8 py-4 text-white">
                <div className="flex gap-12 flex-wrap justify-center">
                    {mangas && mangas.length > 0 ? (
                        mangas.map((manga, index) => (
                            <Link
                                href={`${DOMAIN}/manga/${manga?.slug}`}
                                key={index}
                                className="bg-[#091e25] overflow-hidden shadow rounded-b w-[190px] flex flex-col hover:scale-110 transition-transform"
                            >
                                <img
                                    className='w-[190px] h-[220px] object-cover'
                                    src={manga?.photo}
                                    alt={manga?.name}
                                />
                                <div className="px-4 py-5">
                                    <p className="text-[12px] pb-1.5">{`Total Chapters: ${manga?.totalChapters ?? 0}`}</p>
                                    <div
                                        style={{ height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                        className="text-[14px] font-bold w-[185px]"
                                    >
                                        {manga?.name}
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="flex justify-center items-center w-full text-center text-gray-400">
                            <p>No manga found.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}


export default SearchedPage;