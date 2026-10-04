'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Business = {
    id: string;
    name: string;
    color: string; // gradient classes
    accentColor: string; // hex for inline use
    metrics: {
        revenueMonth: number;
        itemsSold: number;
        postsWeek: number;
        targetPostsWeek: number;
        streak: number;
        neglectScore: number;
        lastActivity: string;
    };
};

const MOCK_BUSINESSES: Business[] = [
    {
        id: 'glow-skincare',
        name: 'Glow Skincare',
        color: 'from-pink-500 to-rose-500',
        accentColor: '#f43f5e',
        metrics: { revenueMonth: 12450, itemsSold: 142, postsWeek: 3, targetPostsWeek: 7, streak: 4, neglectScore: 72, lastActivity: '2 hours ago' },
    },
    {
        id: 'techgear',
        name: 'TechGear',
        color: 'from-blue-500 to-indigo-500',
        accentColor: '#6366f1',
        metrics: { revenueMonth: 3200, itemsSold: 12, postsWeek: 0, targetPostsWeek: 5, streak: 0, neglectScore: 28, lastActivity: '4 days ago' },
    },
    {
        id: 'fitness-pro',
        name: 'Fitness Pro',
        color: 'from-emerald-400 to-teal-500',
        accentColor: '#10b981',
        metrics: { revenueMonth: 8900, itemsSold: 89, postsWeek: 5, targetPostsWeek: 5, streak: 11, neglectScore: 94, lastActivity: '1 hour ago' },
    },
];

type AppContextType = {
    businesses: Business[];
    currentBusiness: Business | null;
    setCurrentBusiness: (b: Business | null) => void;
};

const AppContext = createContext<AppContextType>({
    businesses: MOCK_BUSINESSES,
    currentBusiness: null,
    setCurrentBusiness: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
    const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
    return (
        <AppContext.Provider value={{ businesses: MOCK_BUSINESSES, currentBusiness, setCurrentBusiness }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
export { MOCK_BUSINESSES };
