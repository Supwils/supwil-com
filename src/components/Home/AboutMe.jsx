import { Icon } from '@iconify/react';
import aboutMeData from "@/data/about-me-data.json";

const aboutData = aboutMeData?.about ?? {};
const skillsData = aboutMeData?.skills ?? {};

export default function AboutMeCard() {
    const title = aboutData.title ?? "About Me";
    const description = aboutData.description ?? "";
    const skillsTitle = skillsData.title ?? "My Skills";
    const categories = Array.isArray(skillsData.categories) ? skillsData.categories : [];

    return (
        <div className='relative flex justify-center items-center px-[3%] pb-20'>
            <section
                id="about"
                className="container flex flex-col justify-center items-start text-left bg-[var(--background)] rounded-2xl relative z-10 max-md:py-16 max-md:mt-12 pb-10"
            >
                {/* About Me Text Section */}
                <div className='w-full mb-12'>
                    <h2 className='text-[var(--text-color)] text-2xl md:text-3xl lg:text-4xl font-bold font-mono mb-8'>
                        {title}
                    </h2>
                    <p className='text-[var(--text-color)] text-lg md:text-xl lg:text-2xl font-normal leading-relaxed whitespace-pre-line'>
                        {description}
                    </p>
                </div>

                {/* Skills Section */}
                <div className='w-full'>
                    <h3 className='text-[var(--text-color)] text-2xl md:text-3xl lg:text-4xl font-bold mb-8'>
                        {skillsTitle}
                    </h3>

                    {categories.map((category, categoryIndex) => (
                        <div
                            key={category.title}
                            className={categoryIndex === categories.length - 1 ? 'mb-6' : 'mb-10'}
                        >
                            <h4 className='text-[var(--text-color)] text-xl md:text-2xl lg:text-3xl font-semibold mb-6'>
                                {category.title}
                            </h4>
                            <ul className='list-disc list-inside space-y-4 text-base md:text-lg lg:text-xl'>
                                {(category.rows ?? []).map((row, rowIndex) => (
                                    <li key={`${category.title}-${rowIndex}`} className='text-[var(--text-color)]'>
                                        <div className='inline-flex items-center flex-wrap gap-2 pl-3 font-medium'>
                                            {(row ?? []).map((item, itemIndex) => (
                                                <span key={`${item.text}-${itemIndex}`} className="inline-flex items-center gap-2">
                                                    {item.icon ? (
                                                        <Icon
                                                            icon={item.icon}
                                                            className="w-5 h-5 md:w-6 md:h-6"
                                                        />
                                                    ) : null}
                                                    <span>{item.text}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
