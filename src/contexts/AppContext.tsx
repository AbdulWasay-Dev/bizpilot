'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
    Business, Post, Idea, Transaction, InventoryItem, Decision, Vendor, SocialAccount 
} from '@/lib/data';

// Import server actions
import {
    createBusiness, createPost, createIdea, createTransaction, 
    createInventoryItem, updateInventoryItemDB, createDecision, 
    createVendor, createSocialAccount
} from '@/app/db-actions';

export type { Business, Post, Idea, Transaction, InventoryItem, Decision, Vendor, SocialAccount };

export type ModalType = 'ADD_BUSINESS' | 'ADD_POST' | 'LOG_SALE' | 'ADD_EXPENSE' | 'ADD_STOCK' | 'NEW_DECISION' | 'ADD_VENDOR' | 'ADD_SOCIAL_ACCOUNT' | null;

type InitialData = {
    businesses: Business[];
    posts: Post[];
    ideas: Idea[];
    transactions: Transaction[];
    inventory: InventoryItem[];
    decisions: Decision[];
    vendors: Vendor[];
    socialAccounts: SocialAccount[];
};

type AppContextType = InitialData & {
    addBusiness: (b: Omit<Business, 'id' | 'metrics'>) => void;
    addPost: (p: Omit<Post, 'id'>) => void;
    addIdea: (i: Omit<Idea, 'id'>) => void;
    addTransaction: (t: Omit<Transaction, 'id'>) => void;
    addInventoryItem: (i: Omit<InventoryItem, 'id'>) => void;
    updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
    addDecision: (d: Omit<Decision, 'id'>) => void;
    addVendor: (v: Omit<Vendor, 'id'>) => void;
    addSocialAccount: (s: Omit<SocialAccount, 'id'>) => void;
    activeModal: ModalType;
    setActiveModal: (m: ModalType) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children, initialData }: { children: ReactNode, initialData: InitialData }) {
    const [businesses, setBusinesses] = useState<Business[]>(initialData.businesses);
    const [posts, setPosts] = useState<Post[]>(initialData.posts);
    const [ideas, setIdeas] = useState<Idea[]>(initialData.ideas);
    const [transactions, setTransactions] = useState<Transaction[]>(initialData.transactions);
    const [inventory, setInventory] = useState<InventoryItem[]>(initialData.inventory);
    const [decisions, setDecisions] = useState<Decision[]>(initialData.decisions);
    const [vendors, setVendors] = useState<Vendor[]>(initialData.vendors);
    const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(initialData.socialAccounts);
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    // Sync state if initialData changes (e.g. after a revalidation)
    useEffect(() => {
        setBusinesses(initialData.businesses);
        setPosts(initialData.posts);
        setIdeas(initialData.ideas);
        setTransactions(initialData.transactions);
        setInventory(initialData.inventory);
        setDecisions(initialData.decisions);
        setVendors(initialData.vendors);
        setSocialAccounts(initialData.socialAccounts);
    }, [initialData]);

    const addBusiness = async (b: Omit<Business, 'id' | 'metrics'>) => {
        // Optimistic UI update could be added, but for DB sync we just call the server action
        // which will revalidate and trigger a re-render with new initialData.
        await createBusiness(b);
    };

    const addPost = async (p: Omit<Post, 'id'>) => {
        await createPost(p);
    };

    const addIdea = async (i: Omit<Idea, 'id'>) => {
        await createIdea(i);
    };

    const addTransaction = async (t: Omit<Transaction, 'id'>) => {
        await createTransaction(t);
    };

    const addInventoryItem = async (i: Omit<InventoryItem, 'id'>) => {
        // Transform the object if needed, ensure DB types match
        // Payload might be missing or JSON
        await createInventoryItem(i);
    };

    const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
        await updateInventoryItemDB(id, updates);
    };

    const addDecision = async (d: Omit<Decision, 'id'>) => {
        await createDecision(d);
    };

    const addVendor = async (v: Omit<Vendor, 'id'>) => {
        await createVendor(v);
    };

    const addSocialAccount = async (s: Omit<SocialAccount, 'id'>) => {
        await createSocialAccount(s);
    };

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

export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
};
