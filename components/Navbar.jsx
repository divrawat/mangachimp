import Link from "next/link";
import React, { useRef } from 'react';
import { NavbarName, navLinks } from "@/config";
import { Rubik } from '@next/font/google';
const roboto = Rubik({
    subsets: ['latin'],
    weight: '800',
});

export default function Navbar() {

    const menuRef = useRef(null);

    const toggle = (ref) => {
        if (ref.current.style.display === 'block') { ref.current.style.display = 'none'; }
        else { ref.current.style.display = 'block'; }
    };


    return (

        <nav className="md:pb-1 md:pt-1  text-[white] bg-[#091e25]">
            <div className="container mx-auto md:flex items-center justify-center md:justify-between max-w-[1200px]">
                <div className="flex items-center md:space-x-4 justify-between">
                    <div className="flex items-center">
                        {/* {logo} */}
                        <span className=" text-lg tracking-wider text-[19px] font-extrabold md:text-[22px]"><Link className={`${roboto.className}`} href="/">{NavbarName}</Link></span>

                    </div>
                    <div className="flex gap-5 items-center">
                        <span onClick={() => toggle(menuRef)} className="md:hidden text-[22px] font-extrabold mr-4">☰</span>
                    </div>
                </div>

                <div className="md:pb-0  md:mt-0  md:bg-transparent ">
                    <ul id="menu" ref={menuRef} className="md:flex md:space-x-10 md:pb-0 pb-4 items-center font-bold  text-center leading-[3] hidden">
                        {navLinks.map((link, index) => (
                            <li key={index}>
                                <Link prefetch={false} href={link.href} className="hover:text-[#a5a5f3] font-bold hover:underline">{link.text}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>


    );
}
