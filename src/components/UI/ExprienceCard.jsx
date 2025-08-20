"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ExprienceItem({ company, role, time, description, imageUrl, index, isLeft }) {
    const [isHovered, setIsHovered] = useState(false);

    const cardVariants = {
        hidden: {
            opacity: 0,
            x: isLeft ? -100 : 100,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut"
            }
        }
    };

    const hoverVariants = {
        hover: {
            scale: 1.03,
            y: -8,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            variants={{ ...cardVariants, ...hoverVariants }}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            viewport={{ once: true, margin: "-50px" }}
            className={`group relative bg-[var(--background)] backdrop-blur-sm bg-opacity-80 border border-[var(--border-color)] rounded-2xl p-8 max-lg:p-6 max-md:p-5 shadow-lg hover:border-[var(--main-color)] transition-all duration-300 cursor-pointer overflow-hidden ${isLeft ? 'mr-auto' : 'ml-auto'
                } w-full max-w-[500px] max-lg:max-w-[450px] max-md:max-w-none`}
        >
            {/* Animated background gradient */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[var(--main-color)] to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl"
                animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
            />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col space-y-4">
                {/* Header with Image and Title */}
                <div className="flex items-center space-x-4 max-sm:space-x-3">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                    >
                        <div className="w-16 h-16 max-lg:w-14 max-lg:h-14 max-md:w-12 max-md:h-12 rounded-full overflow-hidden border-2 border-[var(--main-color)] shadow-lg">
                            <Image
                                src={imageUrl}
                                alt={company}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <motion.div
                            className="absolute -inset-1 bg-[var(--main-color)] rounded-full opacity-20 blur-sm"
                            animate={isHovered ? { scale: 1.2, opacity: 0.3 } : { scale: 1, opacity: 0.2 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                        <motion.h3
                            className="text-left text-[var(--text-color)] text-2xl max-lg:text-xl max-md:text-lg font-bold mb-1 group-hover:text-[var(--main-color)] transition-colors duration-300"
                            animate={isHovered ? { x: 4 } : { x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {role}
                        </motion.h3>
                        <div className="flex flex-wrap items-center gap-2 text-lg max-lg:text-base max-md:text-sm">
                            <span className="text-[var(--text-color)] font-semibold">{company}</span>
                            <span className="w-1 h-1 bg-[var(--main-color)] rounded-full"></span>
                            <span className="text-[var(--text-color)] opacity-70 font-medium">{time}</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <motion.div
                    animate={isHovered ? { x: 8 } : { x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pl-20 max-lg:pl-18 max-md:pl-16 max-sm:pl-0"
                >
                    <p className="text-left text-[var(--text-color)] text-base max-lg:text-sm max-md:text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        {description}
                    </p>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                    className="absolute top-4 right-4 w-3 h-3 bg-[var(--main-color)] rounded-full opacity-40"
                    animate={isHovered ? { scale: 1.5, opacity: 0.8 } : { scale: 1, opacity: 0.4 }}
                    transition={{ duration: 0.3 }}
                />
                <motion.div
                    className="absolute bottom-4 right-6 w-2 h-2 bg-[var(--main-color)] rounded-full opacity-30"
                    animate={isHovered ? { scale: 1.3, opacity: 0.6 } : { scale: 1, opacity: 0.3 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                />
            </div>
        </motion.div>
    )
}