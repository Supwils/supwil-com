"use client";

import { useEffect } from "react";
import Typed from "typed.js";
import Image from "next/image";
import styles from "./Welcome.module.css";
import aboutMeData from "@/data/about-me-data.json";

const welcomeData = aboutMeData?.welcome ?? {};
const defaultFrontImage = {
    src: "/images/HuahaoSea.png",
    alt: "Profile Image Front"
};
const defaultBackImage = {
    src: "/images/Huahao.png",
    alt: "Profile Image Back"
};

export default function WelcomeCard() {
    useEffect(() => {
        const roles = Array.isArray(welcomeData.typedRoles) ? welcomeData.typedRoles : [];
        if (roles.length === 0) return;

        const typed = new Typed('.multiple-text', {
            strings: roles,
            typeSpeed: 100,
            backSpeed: 100,
            backDelay: 1000,
            loop: true
        });

        return () => {
            typed.destroy();
        };
    }, []);

    const greeting = welcomeData.greeting ?? "Hello, It's Me";
    const name = welcomeData.name ?? "";
    const headlinePrefix = welcomeData.headlinePrefix ?? "And I'm a";
    const intro = welcomeData.intro ?? "";
    const cvLabel = welcomeData.cv?.label ?? "Download CV";
    const cvHref = welcomeData.cv?.href ?? "#";
    const frontImage = welcomeData.images?.front ?? defaultFrontImage;
    const backImage = welcomeData.images?.back ?? defaultBackImage;

    return (
        <div className="relative flex justify-center items-center px-[3%] py-8 min-h-[70vh]">
            <section className="container flex justify-center items-center text-left bg-[var(--background)] rounded-2xl py-[5rem] mt-4 relative z-10 max-md:flex-col max-md:py-8 max-md:mt-12" id="home">

                    {/* Content Section */}
                    <div className="flex-1 pr-8 max-md:text-center max-md:mb-8 max-md:pr-0">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text-color)] mb-4">
                        {greeting}
                        </h3>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-color)] leading-[1.3] mb-4">
                        {name}
                        </h1>

                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text-color)] mb-6">
                        {headlinePrefix} <span className="multiple-text text-[var(--main-color)]"></span>
                        </h3>

                        <p className="text-base md:text-lg lg:text-xl font-normal text-[var(--text-color)] mb-8 whitespace-pre-line">
                        {intro}
                        </p>

                    {/* Social Media Links */}
                    <div className="flex gap-6 mb-8 max-md:justify-center">
                        {(welcomeData.socialLinks ?? []).map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.label}
                                className="inline-flex justify-center items-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-transparent border-2 border-[var(--main-color)] rounded-full text-2xl md:text-3xl text-[var(--main-color)] transition-all duration-500 hover:bg-[var(--main-color)] hover:text-white hover:shadow-[0_0_1rem_var(--main-color)]"
                            >
                                <i className={link.iconClassName}></i>
                            </a>
                        ))}
                    </div>

                    {/* Download CV Button */}
                    {/* <a
                        href={cvHref}
                        onClick={(e) => {
                            if (cvHref === "#") e.preventDefault();
                        }}
                        className="inline-block px-4 py-4 bg-opacity-30 rounded-[3rem] shadow-[0_0_0.5rem_var(--main-color)] text-base md:text-lg text-[var(--text-color)] tracking-[0.1rem] font-semibold transition-all duration-500 hover:bg-[var(--main-color)] hover:text-white hover:shadow-none"
                    >
                        {cvLabel}
                    </a> */}
                </div>

                {/* Image Section */}
                <div className="flex-1 flex justify-center items-center max-md:w-full max-md:flex-shrink-0">
                    <div className={`${styles.image_flip_container} max-md:mx-auto`}>
                        <div className={styles.image_float}>
                            <div className={styles.image_flip}>
                                <Image
                                    src={frontImage.src}
                                    width={1000}
                                    height={1000}
                                    className={styles.front_img}
                                    alt={frontImage.alt}
                                    priority
                                />
                                <Image
                                    src={backImage.src}
                                    width={1000}
                                    height={1000}
                                    className={styles.back_img}
                                    alt={backImage.alt}
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
