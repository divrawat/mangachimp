
export async function getStaticProps() {
    try {
        const data = await getLatestMangaChapters();
        if (data.error) { return { props: { errorCode: 404 } }; }
        return { props: { latestmangachapters: data }, };

    } catch (error) {
        console.error(error);
        return { props: { errorCode: 500 } };
    }
}

import { Rubik } from '@next/font/google';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLatestMangaChapters } from '@/actions/chapter';
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { DOMAIN, APP_NAME } from "@/config";
const roboto = Rubik({ subsets: ['latin'], weight: '800', });
const roboto3 = Rubik({ subsets: ['latin'], weight: '600', });



export default function Home({ latestmangachapters }) {


    return (
        <div>
            <Navbar />
            <br />

            <h2 className={`${roboto.className} my-2 pb-6 font-bold text-2xl tracking-wider text-white text-center px-3`}>New Chapters</h2>


            <div className='flex text-[13px] flex-wrap justify-center items-center gap-2 mb-10 text-blue-300'>

                <div className='flex items-center gap-2'>
                    <div><FaHome /></div>
                    <div><Link prefetch={false} href={`${DOMAIN}`}>Home</Link></div>
                </div>

                <div>{`->`}</div>

                <div><Link prefetch={false} href={`${DOMAIN}/new-chapters`}>New Chapters</Link></div>
            </div>






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
                    )).slice(0, 50)}
                </div>
            </div>


            <br />
            <Footer />
        </div>
    );
}