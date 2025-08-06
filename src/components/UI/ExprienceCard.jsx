import Image from "next/image";

export default function ExprienceItem({ company, role, time, description, imageUrl })
{
    return (
        <div className="flex flex-row items-center justify-start bg-[var(--background)] text-[var(--text-color)] rounded-xl p-6 shadow-md border border-[var(--border-color)] hover:shadow-lg transition-shadow duration-300 w-[50%]">
            <Image src={imageUrl} alt={company} width={50} height={50} className="rounded-full justify-center items-center object-cover mr-2 w-[50px] h-[50px]"/>
            <div className="flex flex-col items-start justify-center">
                <h3 className="text-[var(--text-color)] text-[2rem] font-bold max-md:text-[1.2rem]">{role}</h3>
                <div className="flex flex-row items-center justify-start gap-2">
                    <p className="text-[var(--text-color)] text-[2rem] font-bold max-md:text-[1rem]">{company} </p> <span className="text-[var(--text-color)] text-[2rem] font-normal max-md:text-[1rem]">{time}</span>
                </div>
                <p className="text-[var(--text-color)] text-[2rem] font-normal max-md:text-[1rem]">{description}</p>
            </div>
        </div>
    )
}