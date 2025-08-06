import ExprienceItem from "@/components/UI/ExprienceCard";

export default function ExprienceCard()
{

    const experience = [
        {
            company: "Agentiq Capital",
            role: "Software Engineer",
            time: "2025",
            description: "Developed a web application for Agentiq Capital to manage their portfolio and investments.",
            imageUrl: "/images/agentiq.jpg"
        },
        {
            company: "Learfield",
            role: "Software Engineer Intern",
            time: "Summer 2024",
            description: "Developed steaming data analytics tool integrated with the company main service to provide real-time data analysis and insights for their clients.",
            imageUrl: "/images/learfield.jpg"
        },
        {
            company: "Sidearm Sports",
            role: "Web Developer & Data Imports",
            time: " Summer 2022 and 2023",
            description: "Providing web solutions for collegiate clients such as OSU, FSU, for their athletic websites, including build up web components, data imports, validation for smooth project delivery.",
            imageUrl: "/images/sidearm.png"
        },
        {
            company: "Rice University",
            role: "Master of Computer Science",
            time: "2023-2024",
            description: "Coursework focused on Machine Learning, Web Development, Programming Principles with hands on projects and group works",
            imageUrl: "/images/riceu.png"
        },
        {
            company: "Syracuse University",
            role: "Bachelor of Science in Computer Science",
            time: "2019-2022",
            description: "General Computer Science study including Data Structures, Programming Languages, Database, Software Engineering",
            imageUrl: "/images/su.jpg"
        }
    ]
    return (
        <div className='relative flex justify-center items-center px-[3%] pb-0'>
            <section id="experience" className="flex flex-col justify-center items-start text-left w-[70%] bg-[var(--background)] rounded-2xl px-[3%] py-[5rem] relative z-10 max-lg:w-[90%] max-md:px-[4%] max-md:py-12 max-md:mt-12">
                <h2 className="text-[var(--text-color)] text-[3rem] max-md:text-[2rem] font-bold mb-12">Experience</h2>
                <div className="flex flex-col gap-4">
                    {experience.map((item, index) => (
                        <ExprienceItem key={index} {...item} />
                    ))}
                </div>
            </section>
        </div>
    )
}