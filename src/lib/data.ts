import businessesData from './mock-db/businesses.json';
import postsData from './mock-db/posts.json';
import ideasData from './mock-db/ideas.json';
import transactionsData from './mock-db/transactions.json';
import inventoryData from './mock-db/inventory.json';
import decisionsData from './mock-db/decisions.json';
import vendorsData from './mock-db/vendors.json';

export type Business = {
    id: string;
    name: string;
    color: string;
    accentColor: string;
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

export const MOCK_BUSINESSES: Business[] = businessesData as Business[];

export type Post = {
    id: string;
    businessId: string;
    date: number;
    title: string;
    platform: string;
    time: string;
    status: 'scheduled' | 'draft' | 'published';
    platformColor: string;
    mediaUrl?: string | null;
};

export const MOCK_POSTS: Post[] = postsData as Post[];

export type Idea = {
    id: string;
    businessId: string;
    title: string;
    category: string;
    impact: number;
    confidence: number;
    ease: number;
    note: string;
};

export const MOCK_IDEAS: Idea[] = ideasData as Idea[];

export type Transaction = {
    id: string;
    businessId: string;
    type: 'SALE' | 'EXPENSE' | 'RETURN';
    description: string;
    amount: number;
    date: string;
    ref: string;
    channel: string;
};

export const MOCK_TRANSACTIONS: Transaction[] = transactionsData as Transaction[];

export type InventoryItem = {
    id: string;
    businessId: string;
    title: string;
    sku: string;
    category: string;
    status: 'AVAILABLE' | 'SOLD' | 'RESERVED' | 'DEFECTIVE';
    cost: number;
    price: number;
    vendor: string;
    payload: string;
};

export const MOCK_INVENTORY: InventoryItem[] = inventoryData as InventoryItem[];

export type Decision = {
    id: string;
    businessId: string;
    title: string;
    status: 'IN_DELIBERATION' | 'DECIDED' | 'IMPLEMENTED' | 'ARCHIVED';
    urgency: 'Immediate' | 'High' | 'Medium' | 'Low';
    impact: 'High' | 'Medium' | 'Low';
    context: string;
    chosen: string;
    deadline: string;
    kpi: string;
    outcomeRating: number | null;
    createdAt: string;
};

export const MOCK_DECISIONS: Decision[] = decisionsData as Decision[];

export type Vendor = {
    id: string;
    businessId: string;
    name: string;
    rating: number;
    whatsapp: string;
    telegram: string;
    notes: string;
};

export const MOCK_VENDORS: Vendor[] = vendorsData as Vendor[];
