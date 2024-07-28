
export async function getStaticProps() {
    try {
        const data = await GetLatestMangas();
        if (data.error) { return { props: { errorCode: 404 } }; }
        return { props: { latestmangas: data }, };
    } catch (error) {
        console.error(error);
        return { props: { errorCode: 500 } };
    }
}


import { Rubik } from '@next/font/google';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GetLatestMangas } from "@/actions/manga";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { DOMAIN, APP_NAME } from "@/config";
const roboto = Rubik({ subsets: ['latin'], weight: '800', });
const roboto3 = Rubik({ subsets: ['latin'], weight: '600', });


export default function Home({ latestmangas }) {



    return (
        <div>
            <Navbar />
            <br />

            <div className='max-w-[1200px] mx-auto'>

                <h1 className={`${roboto.className} text-2xl text-center text-white font-bold tracking-wider mb-8`}>New Mangas</h1>


                <div className='flex text-[13px] flex-wrap justify-center items-center gap-2 mb-10 text-blue-300'>

                    <div className='flex items-center gap-2'>
                        <div><FaHome /></div>
                        <div><Link prefetch={false} href={`${DOMAIN}`}>Home</Link></div>
                    </div>

                    <div>{`->`}</div>

                    <div><Link prefetch={false} href={`${DOMAIN}/new-mangas`}>New Mangas</Link></div>
                </div>



                <div className="flex justify-center items-center gap-10 flex-wrap px-8">
                    {latestmangas?.map((manga, index) => (

                        <div className="hover:scale-110 transition-transform rounded shadow w-[190px] bg-[#091e25]" key={index}>
                            <Link prefetch={false} href={`${DOMAIN}/manga/${manga?.slug}`}>
                                <img src={manga?.photo} alt={`${manga?.name} Cover`} className="mb-2 h-[200px] w-[190px] object-cover" />
                                <div className='px-4 py-3 text-white'>
                                    <p className='text-[12px] pb-1.5'>{`Total Chapters:  ${manga?.totalChapters ?? 0}`}</p>
                                    <div style={{ height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }} className={`${roboto3.className} font-bold text-[13px] mb-1 text-wrap break-words`}>{manga?.name}</div>
                                </div>
                            </Link>
                        </div>

                    )).slice(0, 50)}
                </div>
            </div>

            <br />
            <Footer />
        </div>
    );
}