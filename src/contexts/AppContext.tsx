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
        const optimistic = { ...b, id: 'temp-' + Date.now(), metrics: { revenueMonth: 0, itemsSold: 0, postsWeek: 0, targetPostsWeek: 5, streak: 0, neglectScore: 100, lastActivity: 'Just now' } } as Business;
        setBusinesses(prev => [...prev, optimistic]);
        try { await createBusiness(b); } catch (e) { console.error(e); setBusinesses(prev => prev.filter(x => x.id !== optimistic.id)); }
    };

    const addPost = async (p: Omit<Post, 'id'>) => {
        const optimistic = { ...p, id: 'temp-' + Date.now() } as Post;
        setPosts(prev => [...prev, optimistic]);
        try { await createPost(p); } catch (e) { console.error(e); setPosts(prev => prev.filter(x => x.id !== optimistic.id)); }
    };

    const addIdea = async (i: Omit<Idea, 'id'>) => {
        const optimistic = { ...i, id: 'temp-' + Date.now() } as Idea;
        setIdeas(prev => [...prev, optimistic]);
        try { await createIdea(i); } catch (e) { console.error(e); setIdeas(prev => prev.filter(x => x.id !== optimistic.id)); }
    };

    const addTransaction = async (t: Omit<Transaction, 'id'>) => {
        const optimistic = { ...t, id: 'temp-' + Date.now() } as Transaction;
        setTransactions(prev => [...prev, optimistic]);
        try { await createTransaction(t); } catch (e) { console.error(e); setTransactions(prev => prev.filter(x => x.id !== optimistic.id)); }
    };

    const addInventoryItem = async (i: Omit<InventoryItem, 'id'>) => {
        const optimistic = { ...i, id: 'temp-' + Date.now() } as InventoryItem;
        setInventory(prev => [...prev, optimistic]);
        try { await createInventoryItem(i); } catch (e) { console.error(e); setInventory(prev => prev.filter(x => x.id !== optimistic.id)); }
    };

    const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
        setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
        try { await updateInventoryItemDB(id, updates); } catch (e) { console.error(e); }
    };

    const addDecision = async (d: Omit<Decision, 'id'>) => {
        const optimistic = { ...d, id: 'temp-' + Date.now() } as Decision;
        setDecisions(prev => [...prev, optimistic]);
        try { await createDecision(d); } catch (e) { console.error(e); setDecisions(prev => prev.filter(x => x.id !== optimistic.id)); }
    };

    const addVendor = async (v: Omit<Vendor, 'id'>) => {
        const optimistic = { ...v, id: 'temp-' + Date.now() } as Vendor;
        setVendors(prev => [...prev, optimistic]);
        try { await createVendor(v); } catch (e) { console.error(e); setVendors(prev => prev.filter(x => x.id !== optimistic.id)); }
    };

    const addSocialAccount = async (s: Omit<SocialAccount, 'id'>) => {
        const optimistic = { ...s, id: 'temp-' + Date.now() } as SocialAccount;
        setSocialAccounts(prev => [...prev, optimistic]);
        try { await createSocialAccount(s); } catch (e) { console.error(e); setSocialAccounts(prev => prev.filter(x => x.id !== optimistic.id)); }
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
