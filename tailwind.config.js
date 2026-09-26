/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.js',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Base surfaces
                surface: {
                    primary:   '#0D1117',
                    secondary: '#161B22',
                    elevated:  '#1C2128',
                },
                // Module accent colours
                accent: {
                    decisions: '#6366F1',
                    content:   '#EC4899',
                    inventory: '#06B6D4',
                    finance:   '#10B981',
                    danger:    '#EF4444',
                    ideas:     '#F59E0B',
                },
            },
            fontFamily: {
                sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            },
            borderColor: {
                subtle: 'rgba(255,255,255,0.06)',
                medium: 'rgba(255,255,255,0.10)',
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out',
                'slide-up': 'slideUp 0.25s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};
