'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { 
    Business, MOCK_BUSINESSES,
    Post, MOCK_POSTS,
    Idea, MOCK_IDEAS,
    Transaction, MOCK_TRANSACTIONS,
    InventoryItem, MOCK_INVENTORY,
    Decision, MOCK_DECISIONS,
    Vendor, MOCK_VENDORS,
    SocialAccount, MOCK_SOCIAL_ACCOUNTS
} from '@/lib/data';

export type { Business, Post, Idea, Transaction, InventoryItem, Decision, Vendor, SocialAccount };

export type ModalType = 'ADD_BUSINESS' | 'ADD_POST' | 'LOG_SALE' | 'ADD_EXPENSE' | 'ADD_STOCK' | 'NEW_DECISION' | 'ADD_VENDOR' | 'ADD_SOCIAL_ACCOUNT' | null;

type AppContextType = {
    businesses: Business[];
    addBusiness: (b: Omit<Business, 'id' | 'metrics'>) => void;
    
    posts: Post[];
    addPost: (p: Omit<Post, 'id'>) => void;
    
    ideas: Idea[];
    addIdea: (i: Omit<Idea, 'id'>) => void;
    
    transactions: Transaction[];
    addTransaction: (t: Omit<Transaction, 'id'>) => void;
    
    inventory: InventoryItem[];
    addInventoryItem: (i: Omit<InventoryItem, 'id'>) => void;
    updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
    
    decisions: Decision[];
    addDecision: (d: Omit<Decision, 'id'>) => void;

    vendors: Vendor[];
    addVendor: (v: Omit<Vendor, 'id'>) => void;

    socialAccounts: SocialAccount[];
    addSocialAccount: (s: Omit<SocialAccount, 'id'>) => void;

    activeModal: ModalType;
    setActiveModal: (m: ModalType) => void;
};

const AppContext = createContext<AppContextType>({
    businesses: MOCK_BUSINESSES,
    addBusiness: () => {},
    
    posts: MOCK_POSTS,
    addPost: () => {},
    
    ideas: MOCK_IDEAS,
    addIdea: () => {},
    
    transactions: MOCK_TRANSACTIONS,
    addTransaction: () => {},
    
    inventory: MOCK_INVENTORY,
    addInventoryItem: () => {},
    updateInventoryItem: () => {},
    
    decisions: MOCK_DECISIONS,
    addDecision: () => {},

    vendors: MOCK_VENDORS,
    addVendor: () => {},

    socialAccounts: MOCK_SOCIAL_ACCOUNTS,
    addSocialAccount: () => {},

    activeModal: null,
    setActiveModal: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
    const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
    const [ideas, setIdeas] = useState<Idea[]>(MOCK_IDEAS);
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
    const [decisions, setDecisions] = useState<Decision[]>(MOCK_DECISIONS);
    const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
    const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(MOCK_SOCIAL_ACCOUNTS);
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const addBusiness = (b: Omit<Business, 'id' | 'metrics'>) => {
        setBusinesses([...businesses, { 
            ...b, 
            id: generateId(),
            metrics: { revenueMonth: 0, itemsSold: 0, postsWeek: 0, targetPostsWeek: 5, streak: 0, neglectScore: 100, lastActivity: 'Just now' }
        }]);
    };

    const addPost = (p: Omit<Post, 'id'>) => setPosts([...posts, { ...p, id: generateId() }]);
    const addIdea = (i: Omit<Idea, 'id'>) => setIdeas([...ideas, { ...i, id: generateId() }]);
    const addTransaction = (t: Omit<Transaction, 'id'>) => setTransactions([...transactions, { ...t, id: generateId() }]);
    const addInventoryItem = (i: Omit<InventoryItem, 'id'>) => setInventory([...inventory, { ...i, id: generateId() }]);
    const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
        setInventory(inventory.map(item => item.id === id ? { ...item, ...updates } : item));
    };
    const addDecision = (d: Omit<Decision, 'id'>) => setDecisions([...decisions, { ...d, id: generateId() }]);
    const addVendor = (v: Omit<Vendor, 'id'>) => setVendors([...vendors, { ...v, id: generateId() }]);
    const addSocialAccount = (s: Omit<SocialAccount, 'id'>) => setSocialAccounts([...socialAccounts, { ...s, id: generateId() }]);

    return (
        <AppContext.Provider value={{ 
            businesses, addBusiness,
            posts, addPost,
            ideas, addIdea,
            transactions, addTransaction,
            inventory, addInventoryItem, updateInventoryItem,
            decisions, addDecision,
            vendors, addVendor,
            socialAccounts, addSocialAccount,
            activeModal, setActiveModal
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
