"use client";

import { useEffect } from "react";
import Typed from "typed.js";
import Image from "next/image";
import styles from "./WelcomeCard.module.css";

export default function WelcomeCard()
{
    useEffect(() =>
    {
        const typed = new Typed('.multiple-text', {
            strings: ['Software Developer', 'Web Developer', 'Student', 'Athletic Trainer'],
            typeSpeed: 100,
            backSpeed: 100,
            backDelay: 1000,
            loop: true
        });

        return () =>
        {
            typed.destroy();
        };
    }, []);

    return (
        <div className="relative flex justify-center items-center px-[3%] pb-0 min-h-[70vh]">
            <section className="flex justify-center items-center text-left w-[70%] bg-[var(--background)] rounded-2xl px-[3%] py-[10rem] mt-2 relative z-10 max-lg:w-[90%] max-md:flex-col max-md:py-12 max-md:mt-12" id="home">

                {/* Content Section */}
                <div className="flex-1 pr-8 max-md:text-center max-md:mb-8 max-md:pr-0">
                    <h3 className="text-[2.5rem] font-bold text-[var(--text-color)] mb-4 max-md:text-[2rem] max-sm:text-[1.8rem]">
                        Hello, It&apos;s Me
                    </h3>

                    <h1 className="text-[4rem] font-bold text-[var(--text-color)] leading-[1.3] mb-4 max-md:text-[2.6rem] max-sm:text-[2.2rem]">
                        Wilson Shang
                    </h1>

                    <h3 className="text-[2.5rem] font-bold text-[var(--text-color)] mb-6 max-md:text-[2rem] max-sm:text-[1.8rem]">
                        And I&apos;m a <span className="multiple-text text-[var(--main-color)]"></span>
                    </h3>

                    <p className="text-[1.7rem] font-normal text-[var(--text-color)] mb-8 whitespace-pre-line max-md:text-[1rem] max-sm:text-[0.9rem]">
                        Glad to see you here. Welcome to my personal website. Wish you had fun from here. Check out the site to know me more or Ask me for anything!.
                        {/* Welcome to my personal website! I&apos;m a passionate developer who loves creating innovative solutions and exploring new technologies.
                        {'\n\n'}
                        I enjoy building web applications, learning about software architecture, and sharing knowledge with the community. */}
                    </p>

                    {/* Social Media Links */}
                    <div className="flex gap-6 mb-8 max-md:justify-center">
                        <a
                            href="https://www.linkedin.com/in/huahao-shang-7b59b2224/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex justify-center items-center w-16 h-16 bg-transparent border-2 border-[var(--main-color)] rounded-full text-2xl text-[var(--main-color)] transition-all duration-500 hover:bg-[var(--main-color)] hover:text-white hover:shadow-[0_0_1rem_var(--main-color)]"
                        >
                            <i className='bx bxl-linkedin'></i>
                        </a>

                        <a
                            href="https://github.com/Supwils/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex justify-center items-center w-16 h-16 bg-transparent border-2 border-[var(--main-color)] rounded-full text-2xl text-[var(--main-color)] transition-all duration-500 hover:bg-[var(--main-color)] hover:text-white hover:shadow-[0_0_1rem_var(--main-color)]"
                        >
                            <i className='bx bxl-github'></i>
                        </a>

                        <a
                            href='https://space.bilibili.com/479803243'
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex justify-center items-center w-16 h-16 bg-transparent border-2 border-[var(--main-color)] rounded-full text-2xl text-[var(--main-color)] transition-all duration-500 hover:bg-[var(--main-color)] hover:text-white hover:shadow-[0_0_1rem_var(--main-color)]"
                        >
                            <i className="fa-brands fa-bilibili"></i>
                        </a>
                    </div>

                    {/* Download CV Button */}
                    <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="inline-block px-4 py-4 bg-opacity-30 rounded-[3rem] shadow-[0_0_0.5rem_var(--main-color)] text-[1.2rem] text-[var(--text-color)] tracking-[0.1rem] font-semibold transition-all duration-500 hover:bg-[var(--main-color)] hover:text-white hover:shadow-none"
                    >
                        Download CV
                    </a>
                </div>

                {/* Image Section */}
                <div className="flex-1 flex justify-center items-center max-md:w-full max-md:flex-shrink-0">
                    <div className={`${styles.image_flip_container} max-md:mx-auto`}>
                        <div className={styles.image_float}>
                            <div className={styles.image_flip}>
                                <Image
                                    src="/images/HuahaoSea.png"
                                    width={1000}
                                    height={1000}
                                    className={styles.front_img}
                                    alt="Huahao Shang Front"
                                    priority
                                />
                                <Image
                                    src="/images/Huahao.png"
                                    width={1000}
                                    height={1000}
                                    className={styles.back_img}
                                    alt="Huahao Shang Back"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}