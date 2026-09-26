/**
 * BizPilot Design Tokens
 * Apple HIG-inspired dark mode design system
 *
 * Usage: import { colors, typography } from '@/lib/design';
 */

export const colors = {
    // Base backgrounds
    bg: {
        primary: '#0D1117',
        secondary: '#161B22',
        elevated: '#1C2128',
        overlay: 'rgba(255,255,255,0.04)',
    },

    // Module accent colors
    accent: {
        decisions: '#6366F1',   // Royal Indigo
        content:   '#EC4899',   // Magenta
        inventory: '#06B6D4',   // Electric Cyan
        finance:   '#10B981',   // Emerald Green
        returns:   '#EF4444',   // Crimson Coral
        ideas:     '#F59E0B',   // Radiant Amber
    },

    // Text
    text: {
        primary:   '#F0F6FC',
        secondary: '#8B949E',
        muted:     '#484F58',
    },

    // Border
    border: {
        subtle: 'rgba(255,255,255,0.06)',
        medium: 'rgba(255,255,255,0.10)',
        strong: 'rgba(255,255,255,0.18)',
    },
};

export const typography = {
    fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
};

// Platform brand colors for content calendar
export const platformColors = {
    instagram: '#E1306C',
    tiktok:    '#69C9D0',
    youtube:   '#FF0000',
    linkedin:  '#0A66C2',
    twitter:   '#1D9BF0',
    facebook:  '#1877F2',
    pinterest: '#E60023',
    snapchat:  '#FFFC00',
    threads:   '#101010',
};
