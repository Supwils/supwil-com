'use client';

import Link from 'next/link';

const NotFound = () =>
{

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center relative overflow-hidden">


            {/* Main content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                {/* 404 Number with glitch effect */}
                <div className="mb-8">
                        {/* <GlitchText
                            speed={1}
                            enableShadows={true}
                            enableOnHover={true}
                            className='text-[12rem] md:text-[16rem] font-bold text-[var(--text-color)] leading-none select-none relative max-md:text-[8rem]'
                        >
                            404
                        </GlitchText> */}
                    <h1 className='text-[12rem] md:text-[16rem] font-bold text-[var(--text-color)] leading-none select-none relative max-md:text-[8rem]'>
                        404
                    </h1>
                </div>

                {/* Error message */}
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-semibold text-[var(--text-color)] mb-4 max-md:text-3xl">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-lg md:text-xl text-[var(--text-color)] opacity-70 max-w-2xl mx-auto leading-relaxed max-md:text-base">
                        Check up next time!
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <Link
                        href="/"
                        className="group relative px-8 py-4 bg-[var(--main-color)] text-white rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-[var(--main-color)]/25 hover:-translate-y-1 min-w-[200px]"
                    >
                        <span className="relative z-10">🏠 Go Home</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--main-color)] to-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="group relative px-8 py-4 border-2 border-[var(--main-color)] text-[var(--main-color)] rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-[var(--main-color)] hover:text-white hover:-translate-y-1 min-w-[200px]"
                    >
                        <span className="relative z-10">↩️ Go Back</span>
                    </button>
                </div>

                {/* Helpful links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    <Link
                        href="/blog"
                        className="group p-6 bg-[var(--background)] border border-[var(--border-color)] rounded-xl transition-all duration-300 hover:border-[var(--main-color)] hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="text-3xl mb-3">📚</div>
                        <h3 className="text-lg font-semibold text-[var(--text-color)] mb-2">Blog</h3>
                        <p className="text-sm text-[var(--text-color)] opacity-70">
                            Check out my latest posts and thoughts
                        </p>
                    </Link>

                    <Link
                        href="/#about"
                        className="group p-6 bg-[var(--background)] border border-[var(--border-color)] rounded-xl transition-all duration-300 hover:border-[var(--main-color)] hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="text-3xl mb-3">👨‍💻</div>
                        <h3 className="text-lg font-semibold text-[var(--text-color)] mb-2">About Me</h3>
                        <p className="text-sm text-[var(--text-color)] opacity-70">
                            Learn more about my skills and experience
                        </p>
                    </Link>

                    <Link
                        href="/#contact"
                        className="group p-6 bg-[var(--background)] border border-[var(--border-color)] rounded-xl transition-all duration-300 hover:border-[var(--main-color)] hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className="text-3xl mb-3">📧</div>
                        <h3 className="text-lg font-semibold text-[var(--text-color)] mb-2">Contact</h3>
                        <p className="text-sm text-[var(--text-color)] opacity-70">
                            Get in touch for collaborations
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

