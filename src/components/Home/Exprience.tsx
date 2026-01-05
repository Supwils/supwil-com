"use client";

import { motion, Variants } from "framer-motion";
// @ts-ignore - Ignoring missing type definition for UI component
import ExprienceItem from "@/components/UI/ExprienceCard";
import aboutMeDataRaw from "@/data/about-me-data.json";

interface ExperienceItemData {
    company: string;
    role: string;
    time: string;
    description: string;
    imageUrl: string;
    order?: number;
    [key: string]: any;
}

interface ExperienceData {
    title?: string;
    items?: ExperienceItemData[];
}

interface AboutMeData {
    experience?: ExperienceData;
    [key: string]: any;
}

const aboutMeData = aboutMeDataRaw as AboutMeData;

const experienceData = aboutMeData?.experience ?? {};

export default function ExprienceCard() {
    const title = experienceData.title ?? "Experience";
    const experienceItems = Array.isArray(experienceData.items) ? experienceData.items : [];
    const sortedExperience = [...experienceItems].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const titleVariants: Variants = {
        hidden: {
            opacity: 0,
            y: -50,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const timelineVariants: Variants = {
        hidden: {
            scaleY: 0,
            opacity: 0
        },
        visible: {
            scaleY: 1,
            opacity: 1,
            transition: {
                duration: 1.5,
                ease: "easeInOut",
                delay: 0.5
            }
        }
    };

    return (
        <motion.div
            className='relative flex justify-center items-center px-[3%] pb-0'
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
        >
            <section id="experience" className="container flex flex-col justify-center items-center text-center bg-[var(--background)] rounded-3xl py-[6rem] max-lg:py-[4rem] max-md:py-[3rem] relative backdrop-blur-sm bg-opacity-95 border border-[var(--border-color)] shadow-sm">

                {/* Animated Title */}
                <motion.div
                    variants={titleVariants}
                    className="flex flex-col items-center mb-16 max-lg:mb-12 max-md:mb-8"
                >
                    <motion.h2
                        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--text-color)] to-[var(--main-color)] bg-clip-text text-transparent"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        {title}
                    </motion.h2>
                    <motion.div
                        className="w-24 h-1 bg-gradient-to-r from-[var(--main-color)] to-transparent rounded-full"
                        whileHover={{ width: "8rem" }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.div>

                {/* Timeline Container */}
                <div className="relative w-full max-w-6xl">

                    {/* Central Timeline Line */}
                    <motion.div
                        className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-[var(--main-color)] via-[var(--main-color)] to-transparent rounded-full max-md:hidden"
                        style={{ height: `${sortedExperience.length * 300}px`, transformOrigin: "top" }}
                        variants={timelineVariants}
                    />

                    {/* Experience Items */}
                    <div className="flex flex-col space-y-12 max-lg:space-y-10 max-md:space-y-8">
                        {sortedExperience.map((item, index) => {
                            const isLeft = index % 2 === 0;

                            return (
                                <div key={item.order ?? `${item.company}-${item.role}-${index}`} className="relative flex items-center justify-center">

                                    {/* Timeline Node */}
                                    <motion.div
                                        className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[var(--main-color)] rounded-full border-4 border-[var(--background)] shadow-lg z-20 max-md:hidden"
                                        initial={{ scale: 0, rotate: 180 }}
                                        whileInView={{ scale: 1, rotate: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.2 + 0.8,
                                            type: "spring",
                                            stiffness: 200
                                        }}
                                        whileHover={{
                                            scale: 1.5,
                                            boxShadow: "0 0 20px rgba(var(--main-color-rgb), 0.6)"
                                        }}
                                    />

                                    {/* Experience Card Container */}
                                    <div className={`w-full flex ${isLeft ? 'justify-start' : 'justify-end'} max-md:justify-center`}>
                                        <div className={`w-[45%] max-md:w-full ${isLeft ? 'pr-8 max-md:pr-0' : 'pl-8 max-md:pl-0'}`}>
                                            <ExprienceItem
                                                {...item}
                                                index={index}
                                                isLeft={isLeft}
                                            />
                                        </div>
                                    </div>

                                    {/* Connection Line to Timeline */}
                                    <motion.div
                                        className={`absolute top-1/2 w-8 h-0.5 bg-[var(--main-color)] opacity-30 max-md:hidden ${
                                            isLeft ? 'right-1/2 mr-3' : 'left-1/2 ml-3'
                                        }`}
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.2 + 1,
                                            ease: "easeOut"
                                        }}
                                        style={{ transformOrigin: isLeft ? "right" : "left" }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Decorative Background Elements */}
                <motion.div
                    className="absolute top-10 left-10 w-20 h-20 bg-[var(--main-color)] rounded-full opacity-5 blur-xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute bottom-10 right-10 w-16 h-16 bg-[var(--main-color)] rounded-full opacity-5 blur-xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </section>
        </motion.div>
    )
}
