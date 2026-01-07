import React from 'react';
import { resourceCategories } from '@/data/resource-data';
import CategorySection from '@/components/UI/CategorySection';

const Resources: React.FC = () => {
    return (
        <div className="min-h-screen bg-[var(--background)] py-20 w-[70%] mx-auto">
            <div className="max-w-none px-6">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-[var(--main-color)] mb-6">
                        Resources
                    </h1>
                    <p className="text-xl text-[var(--text-color)] opacity-80 max-w-3xl mx-auto leading-relaxed">
                        A curated collection of tools, links, and resources that I find useful in my development journey and life journey.
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="text-center p-6 bg-gradient-to-br from-[var(--main-color)]/10 to-transparent rounded-xl border border-[var(--border-color)]">
                        <div className="text-3xl font-bold text-[var(--main-color)] mb-2">
                            {resourceCategories.reduce((total, cat) => total + cat.resources.length, 0)}
                        </div>
                        <p className="text-[var(--text-color)] opacity-70">Total Resources</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-[var(--main-color)]/10 to-transparent rounded-xl border border-[var(--border-color)]">
                        <div className="text-3xl font-bold text-[var(--main-color)] mb-2">
                            {resourceCategories.filter(cat => cat.resources.length > 0).length}
                        </div>
                        <p className="text-[var(--text-color)] opacity-70">Categories</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-[var(--main-color)]/10 to-transparent rounded-xl border border-[var(--border-color)]">
                        <div className="text-3xl mb-2">🚀</div>
                        <p className="text-[var(--text-color)] opacity-70">Always Growing</p>
                    </div>
                </div>

                {/* Resource Categories */}
                <div className="space-y-8">
                    {resourceCategories.map((category) => (
                        <CategorySection
                            key={category.id}
                            category={category}
                        />
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-br from-[var(--main-color)]/5 to-transparent rounded-2xl p-8 border border-[var(--border-color)]">
                        <h3 className="text-2xl font-semibold text-[var(--text-color)] mb-4">
                            Found something useful?
                        </h3>
                        <p className="text-[var(--text-color)] opacity-70 mb-6 max-w-2xl mx-auto">
                            These resources have been incredibly helpful in my journey. I hope they help you too!
                            This collection is continuously updated as I discover new amazing tools and resources.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center text-sm">
                            <span className="px-3 py-1 bg-[var(--main-color)]/10 text-[var(--main-color)] rounded-full border border-[var(--main-color)]/20">
                                ✨ Curated with care
                            </span>
                            <span className="px-3 py-1 bg-[var(--main-color)]/10 text-[var(--main-color)] rounded-full border border-[var(--main-color)]/20">
                                🔄 Regularly updated
                            </span>
                            <span className="px-3 py-1 bg-[var(--main-color)]/10 text-[var(--main-color)] rounded-full border border-[var(--main-color)]/20">
                                💡 Personally tested
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Resources;
