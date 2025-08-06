export const resourceCategories = [
    {
        id: 'web-development',
        name: 'Web Development',
        icon: '🌐',
        description: 'Libraries, frameworks, and tools for web development',
        resources: [
            {
                name: 'Three.js',
                description: 'A powerful JavaScript library for creating stunning 3D graphics in the browser, A powerful JavaScript library for creating stunning 3D graphics in the browser',
                link: 'https://threejs.org/',
                tags: ['3D', 'Graphics', 'JavaScript']
            },
            {
                name: 'MDN Web Docs',
                description: 'The most comprehensive and authoritative documentation for web technologies',
                link: 'https://developer.mozilla.org/en-US/',
                tags: ['Documentation', 'Reference', 'Learning']
            },
            {
                name: 'JSON Formatter',
                description: 'Clean, format, and validate JSON data with this essential web tool',
                link: 'https://jsonformatter.org/',
                tags: ['Tools', 'JSON', 'Validation']
            },
            {
                name: "React Bits",
                description: "A collection of React bits and pieces",
                link: "https://www.reactbits.dev/",
                tags: ['React', 'Bits', 'Learning']
            }
        ]
    },
    {
        id: 'design-ui',
        name: 'Design & UI',
        icon: '🎨',
        description: 'Design tools, icons, and UI resources',
        resources: [
            {
                name: 'Iconify Design',
                description: 'Massive collection of high-quality icons for any project',
                link: 'https://iconify.design/',
                tags: ['Icons', 'Design', 'UI']
            },
            {
                name: 'Hero Patterns',
                description: 'Beautiful SVG background patterns for your designs',
                link: 'https://heropatterns.com/',
                tags: ['Patterns', 'SVG', 'Background']
            }
        ]
    },
    {
        id: 'ai-tools',
        name: 'AI & Productivity',
        icon: '🤖',
        description: 'AI-powered tools and productivity enhancers',
        resources: [
            {
                name: 'ChatGPT',
                description: 'Revolutionary AI chatbot for conversations, coding help, and creative tasks',
                link: 'https://chatgpt.com/',
                tags: ['AI', 'Chatbot', 'Productivity']
            },
            {
                name: 'Prompts Collection',
                description: 'Curated collection of effective prompts for AI interactions',
                link: 'https://prompts.chat/',
                tags: ['AI', 'Prompts', 'Templates']
            }
        ]
    },
    {
        id: 'media-tools',
        name: 'Media & Content',
        icon: '📱',
        description: 'Tools for downloading, editing, and managing media content',
        resources: [
            {
                name: 'yt-dlp',
                description: 'The most powerful YouTube video downloader with extensive format support',
                link: 'https://github.com/yt-dlp/yt-dlp',
                tags: ['Video', 'Download', 'Terminal', 'Python']
            }
        ]
    },
    {
        id: 'learning',
        name: 'Learning & Growth',
        icon: '📚',
        description: 'Educational resources and personal development tools',
        resources: [
            // Can add more learning resources here
        ]
    },
    {
        id: 'fun-stuff',
        name: 'Fun & Experimental',
        icon: '🎉',
        description: 'Interesting projects, games, and experimental tools',
        resources: [
            // Can add fun resources here
            {
                name: 'PngDirs',
                description: 'Free PNG images for your projects',
                link: 'https://www.pngdirs.com/',
                tags: ['Images', 'PNG', 'Free']
            }
        ]
    }
];

// Helper function to get all resources
export const getAllResources = () =>
{
    return resourceCategories.reduce((all, category) =>
    {
        return [...all, ...category.resources];
    }, []);
};

// Helper function to get resources by category
export const getResourcesByCategory = (categoryId) =>
{
    const category = resourceCategories.find(cat => cat.id === categoryId);
    return category ? category.resources : [];
};

// Legacy export for backward compatibility
export const resourceData = getAllResources();