// Badge preset data for blog posts
// Stored in lowercase, displayed with friendly names

export type BadgeCategory = 'tech-frontend' | 'tech-backend' | 'life-fitness' | 'life-general';

export interface BadgeInfo {
    key: string;           // Stored value (lowercase)
    displayName: string;   // Friendly display name
    category: BadgeCategory;
}

// Preset badges grouped by category
export const PRESET_BADGES: BadgeInfo[] = [
    // Tech - Frontend
    { key: 'frontend', displayName: 'Frontend', category: 'tech-frontend' },
    { key: 'nextjs', displayName: 'Next.js', category: 'tech-frontend' },
    { key: 'react', displayName: 'React', category: 'tech-frontend' },
    { key: 'tailwind', displayName: 'Tailwind', category: 'tech-frontend' },
    { key: 'typescript', displayName: 'TypeScript', category: 'tech-frontend' },
    { key: 'css', displayName: 'CSS', category: 'tech-frontend' },
    { key: 'performance', displayName: 'Performance', category: 'tech-frontend' },
    { key: 'uiux', displayName: 'UI/UX', category: 'tech-frontend' },
    
    // Tech - Backend/Infra
    { key: 'aws', displayName: 'AWS', category: 'tech-backend' },
    { key: 'mongodb', displayName: 'MongoDB', category: 'tech-backend' },
    { key: 'nodejs', displayName: 'Node.js', category: 'tech-backend' },
    { key: 'api', displayName: 'API', category: 'tech-backend' },
    { key: 'database', displayName: 'Database', category: 'tech-backend' },
    { key: 'devops', displayName: 'DevOps', category: 'tech-backend' },
    
    // Life - Fitness/Sports
    { key: 'fitness', displayName: 'Fitness', category: 'life-fitness' },
    { key: 'sports', displayName: 'Sports', category: 'life-fitness' },
    { key: 'basketball', displayName: 'Basketball', category: 'life-fitness' },
    { key: 'running', displayName: 'Running', category: 'life-fitness' },
    { key: 'strength', displayName: 'Strength', category: 'life-fitness' },
    { key: 'mobility', displayName: 'Mobility', category: 'life-fitness' },
    
    // Life - General
    { key: 'life', displayName: 'Life', category: 'life-general' },
    { key: 'reflection', displayName: 'Reflection', category: 'life-general' },
    { key: 'travel', displayName: 'Travel', category: 'life-general' },
    { key: 'reading', displayName: 'Reading', category: 'life-general' },
];

// Get badges by category
export const getBadgesByCategory = (category: BadgeCategory): BadgeInfo[] => {
    return PRESET_BADGES.filter(badge => badge.category === category);
};

// Get tech badges
export const getTechBadges = (): BadgeInfo[] => {
    return PRESET_BADGES.filter(badge => 
        badge.category === 'tech-frontend' || badge.category === 'tech-backend'
    );
};

// Get life badges
export const getLifeBadges = (): BadgeInfo[] => {
    return PRESET_BADGES.filter(badge => 
        badge.category === 'life-fitness' || badge.category === 'life-general'
    );
};

// Badge display name lookup map
export const BADGE_DISPLAY_MAP: Record<string, string> = PRESET_BADGES.reduce(
    (acc, badge) => {
        acc[badge.key] = badge.displayName;
        return acc;
    },
    {} as Record<string, string>
);

// Get display name for a badge (fallback to capitalized key if not found)
export const getBadgeDisplayName = (key: string): string => {
    const normalizedKey = key.toLowerCase();
    return BADGE_DISPLAY_MAP[normalizedKey] || 
           key.charAt(0).toUpperCase() + key.slice(1);
};

// Category display names
export const CATEGORY_DISPLAY: Record<string, string> = {
    tech: 'Tech',
    life: 'Life',
};

// Get category display name
export const getCategoryDisplayName = (category: string): string => {
    return CATEGORY_DISPLAY[category.toLowerCase()] || category;
};

// Badge constraints
export const BADGE_CONSTRAINTS = {
    MAX_BADGES_PER_POST: 12,
    MAX_BADGE_LENGTH: 24,
};

// Validate and normalize badges
export const normalizeBadges = (badges: string[]): string[] => {
    return badges
        .map(badge => badge.toLowerCase().trim())
        .filter(badge => badge.length > 0 && badge.length <= BADGE_CONSTRAINTS.MAX_BADGE_LENGTH)
        .filter((badge, index, self) => self.indexOf(badge) === index) // Remove duplicates
        .slice(0, BADGE_CONSTRAINTS.MAX_BADGES_PER_POST);
};

