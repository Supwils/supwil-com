import { Icon } from '@iconify/react';

export default function AboutMeCard() {
    return (
        <div className='relative flex justify-center items-center px-[3%] pb-20'>
            <section
                id="about"
                className="container flex flex-col justify-center items-start text-left bg-[var(--background)] rounded-2xl relative z-10 max-md:py-16 max-md:mt-12 pb-10"
            >
                {/* About Me Text Section */}
                <div className='w-full mb-12'>
                    <h2 className='text-[var(--text-color)] text-2xl md:text-3xl lg:text-4xl font-bold font-mono mb-8'>
                        About Me
                    </h2>
                    <p className='text-[var(--text-color)] text-lg md:text-xl lg:text-2xl font-normal leading-relaxed '>
                        I am Wilson Shang. A full-stack developer. I graduated from Rice
                        University with Master of Computer Science degree.
                        <br />
                        I love Coding, Sports, Gaming, Basketball, Cooking...
                    </p>
                </div>

                {/* Skills Section */}
                <div className='w-full'>
                    <h3 className='text-[var(--text-color)] text-2xl md:text-3xl lg:text-4xl font-bold mb-8'>
                        My Skills
                    </h3>

                    {/* Frontend Skills */}
                    <div className='mb-10'>
                        <h4 className='text-[var(--text-color)] text-xl md:text-2xl lg:text-3xl font-semibold mb-6'>
                            Frontend
                        </h4>
                        <ul className='list-disc list-inside space-y-4 text-base md:text-lg lg:text-xl'>
                            <li className='text-[var(--text-color)]'>
                                <div className='inline-flex items-center flex-wrap gap-2 pl-3 font-medium'>
                                    <Icon
                                        icon="skill-icons:javascript"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>Javascript(ES6+), Proficient for develop +</span>
                                    <Icon
                                        icon="skill-icons:html"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>HTML5 +</span>
                                    <Icon
                                        icon="skill-icons:css"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>CSS3</span>
                                </div>
                            </li>
                            <li className='text-[var(--text-color)]'>
                                <div className='inline-flex items-center flex-wrap gap-2 pl-3 font-medium'>
                                    <Icon
                                        icon="skill-icons:react-dark"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>React +</span>
                                    <Icon
                                        icon="logos:nextjs-icon"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>Next.js +</span>
                                    <Icon
                                        icon="skill-icons:typescript"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>TypeScript</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Backend Skills */}
                    <div className='mb-10'>
                        <h4 className='text-[var(--text-color)] text-xl md:text-2xl lg:text-3xl font-semibold mb-6'>
                            Backend
                        </h4>
                        <ul className='list-disc list-inside space-y-4 text-base md:text-lg lg:text-xl'>
                            <li className='text-[var(--text-color)]'>
                                <div className='inline-flex items-center flex-wrap gap-2 pl-3 font-medium'>
                                    <Icon
                                        icon="skill-icons:nodejs-dark"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>Node.js (CRUD proficient)</span>
                                    <Icon
                                        icon="devicon:python"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>Python (general, Flask, ml/ds, leetcode)</span>
                                    <Icon
                                        icon="skill-icons:java-light"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>Java</span>
                                    <Icon
                                        icon="devicon:cplusplus"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>C++ (college oop, algo & graph)</span>
                                </div>
                            </li>
                            <li className='text-[var(--text-color)]'>
                                <div className='inline-flex items-center flex-wrap gap-2 pl-3 font-medium'>
                                    <Icon
                                        icon="skill-icons:mysql-light"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>MySQL</span>
                                    <Icon
                                        icon="skill-icons:postgresql-dark"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>PostgreSQL</span>
                                    <Icon
                                        icon="skill-icons:mongodb"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>MongoDB (Familiar with SQL & NoSQL concepts & develop)</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Other Skills */}
                    <div className='mb-6'>
                        <h4 className='text-[var(--text-color)] text-xl md:text-2xl lg:text-3xl font-semibold mb-6'>
                            Other
                        </h4>
                        <ul className='list-disc list-inside space-y-4 text-base md:text-lg lg:text-xl'>
                            <li className='text-[var(--text-color)]'>
                                <div className='inline-flex items-center flex-wrap gap-2 pl-3 font-medium'>
                                    <span>Zsh + iTerm2</span>
                                </div>
                            </li>
                            <li className='text-[var(--text-color)]'>
                                <div className='inline-flex items-center flex-wrap gap-2 pl-3 font-medium'>
                                    <Icon
                                        icon="skill-icons:aws-light"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>AWS(EC2, S3, Lambda,ECS, Amplify, RDS, 53) +</span>
                                    <Icon
                                        icon="skill-icons:azure-dark"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>AzureSQL +</span>
                                    <Icon
                                        icon="devicon:googlecloud"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>GCP</span>
                                </div>
                            </li>
                            <li className='text-[var(--text-color)]'>
                                <div className='inline-flex items-center flex-wrap gap-2 pl-3 font-medium'>
                                    <Icon
                                        icon="icomoon-free:git"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>Git +</span>
                                    <Icon
                                        icon="skill-icons:docker"
                                        className="w-5 h-5 md:w-6 md:h-6"
                                    />
                                    <span>Docker + CI/CD Linux</span>
                                </div>
                            </li>
                            <li className='text-[var(--text-color)]'>
                                <div className='inline-flex items-center flex-wrap gap-2 pl-3 font-medium'>
                                    <span>Powered with AI ChatGPT, Gemini, Claude + Cursor, Trae</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}