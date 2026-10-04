'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Business, MOCK_BUSINESSES } from '@/lib/data';

export type { Business };
export { MOCK_BUSINESSES };

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
