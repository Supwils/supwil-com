

export default function Projects()
{
    return (
        <div className="min-h-screen bg-[var(--background)] py-20 w-[70%] mx-auto">
            <div className="max-w-none mx-auto px-6">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-[var(--main-color)] mb-6">
                        Projects
                    </h1>
                    <p className="text-xl text-[var(--text-color)] opacity-80 max-w-3xl mx-auto leading-relaxed">
                        A showcase of my work, experiments, and side projects. From web applications to creative coding adventures.
                    </p>
                </div>

                {/* Coming Soon Section */}
                <div className="text-center">
                    <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-2xl p-12 shadow-lg">
                        <div className="text-6xl mb-6">🚀</div>
                        <h2 className="text-3xl font-semibold text-[var(--text-color)] mb-4">
                            Portfolio Coming Soon
                        </h2>
                        <p className="text-lg text-[var(--text-color)] opacity-70 mb-8 max-w-2xl mx-auto">
                            I'm currently working on showcasing my best projects here. Each project will include
                            detailed descriptions, tech stacks, and live demos.
                        </p>

                        {/* Preview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                            <div className="p-6 bg-gradient-to-br from-[var(--main-color)]/10 to-transparent rounded-xl border border-[var(--border-color)]">
                                <div className="text-3xl mb-3">🌐</div>
                                <h3 className="text-lg font-semibold text-[var(--text-color)] mb-2">Web Applications</h3>
                                <p className="text-sm text-[var(--text-color)] opacity-70">Full-stack web apps with modern frameworks</p>
                            </div>

                            <div className="p-6 bg-gradient-to-br from-[var(--main-color)]/10 to-transparent rounded-xl border border-[var(--border-color)]">
                                <div className="text-3xl mb-3">📱</div>
                                <h3 className="text-lg font-semibold text-[var(--text-color)] mb-2">Mobile Apps</h3>
                                <p className="text-sm text-[var(--text-color)] opacity-70">Cross-platform mobile applications</p>
                            </div>

                            <div className="p-6 bg-gradient-to-br from-[var(--main-color)]/10 to-transparent rounded-xl border border-[var(--border-color)]">
                                <div className="text-3xl mb-3">⚡</div>
                                <h3 className="text-lg font-semibold text-[var(--text-color)] mb-2">Open Source</h3>
                                <p className="text-sm text-[var(--text-color)] opacity-70">Contributions to the developer community</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}