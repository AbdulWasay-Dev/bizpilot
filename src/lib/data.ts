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

export const MOCK_BUSINESSES: Business[] = [
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

export type Post = {
    id: string;
    businessId: string;
    date: number; // day of the month for mock
    title: string;
    platform: string;
    time: string;
    status: 'scheduled' | 'draft' | 'published';
    platformColor: string;
};

export const MOCK_POSTS: Post[] = [
    { id: 'p1', businessId: 'glow-skincare', date: 15, title: 'Summer Sale Promo', platform: 'Instagram', time: '10:00 AM', status: 'scheduled', platformColor: 'bg-pink-500' },
    { id: 'p2', businessId: 'glow-skincare', date: 18, title: 'New Product Teaser', platform: 'TikTok', time: '2:30 PM', status: 'draft', platformColor: 'bg-cyan-500' },
    { id: 'p3', businessId: 'techgear', date: 22, title: 'Founder Q&A', platform: 'Twitter', time: '1:00 PM', status: 'published', platformColor: 'bg-sky-500' },
    { id: 'p4', businessId: 'fitness-pro', date: 25, title: 'Weekly Roundup', platform: 'LinkedIn', time: '9:00 AM', status: 'scheduled', platformColor: 'bg-blue-600' },
];

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

export const MOCK_IDEAS: Idea[] = [
    { id: 'i1', businessId: 'techgear', title: 'Create TikTok "watch before buying" series for software keys', category: 'Content Hook', impact: 9, confidence: 8, ease: 7, note: 'Showcase value prop as short videos. Low edit time needed.' },
    { id: 'i2', businessId: 'techgear', title: 'Bundle Office + Windows keys for $99 deal', category: 'Revenue Stream', impact: 8, confidence: 7, ease: 9, note: 'Bundle pricing could improve AOV significantly.' },
    { id: 'i3', businessId: 'glow-skincare', title: 'Auto-send WhatsApp delivery message via template', category: 'Automation', impact: 7, confidence: 9, ease: 5, note: 'Use WA Business API to automate key delivery notification.' },
    { id: 'i4', businessId: 'fitness-pro', title: 'Partner with micro-influencers for affiliate deals', category: 'Marketing Angle', impact: 9, confidence: 5, ease: 4, note: 'Needs outreach. Could be very high ROI if done right.' },
];

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

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 't1', businessId: 'techgear', type: 'SALE', description: 'Windows 11 Pro Key', amount: 24.99, date: '2026-10-04', ref: 'ORD-2841', channel: 'Direct' },
    { id: 't2', businessId: 'techgear', type: 'EXPENSE', description: 'Vendor: Alpha Keys (Batch #47)', amount: -180.00, date: '2026-10-03', ref: 'INV-0391', channel: 'COGS' },
    { id: 't3', businessId: 'techgear', type: 'SALE', description: 'Office 2024 Home & Business', amount: 89.00, date: '2026-10-03', ref: 'ORD-2840', channel: 'Direct' },
    { id: 't4', businessId: 'glow-skincare', type: 'RETURN', description: 'Refund: Invalid Key — Customer #C219', amount: -24.99, date: '2026-10-02', ref: 'RET-0082', channel: 'Refund' },
    { id: 't5', businessId: 'fitness-pro', type: 'EXPENSE', description: 'Hostinger Hosting (Oct)', amount: -12.00, date: '2026-10-01', ref: 'SUB-HOST', channel: 'SaaS' },
    { id: 't6', businessId: 'techgear', type: 'SALE', description: 'Adobe CC Key (1yr)', amount: 45.00, date: '2026-10-01', ref: 'ORD-2839', channel: 'Direct' },
];

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

export const MOCK_INVENTORY: InventoryItem[] = [
    { id: 'inv1', businessId: 'techgear', title: 'Windows 11 Pro Key', sku: 'WIN11PRO-001', category: 'LICENSE', status: 'AVAILABLE', cost: 4.50, price: 24.99, vendor: 'Alpha Keys', payload: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX' },
    { id: 'inv2', businessId: 'techgear', title: 'Office 2024 Home & Business', sku: 'OFF24HB-002', category: 'LICENSE', status: 'AVAILABLE', cost: 18.00, price: 89.00, vendor: 'DevStudio Keys', payload: 'AAAAA-BBBBB-CCCCC-DDDDD-EEEEE' },
    { id: 'inv3', businessId: 'techgear', title: 'Adobe CC 1yr Key', sku: 'ADCC1Y-003', category: 'LICENSE', status: 'SOLD', cost: 22.00, price: 45.00, vendor: 'SoftVault', payload: '' },
    { id: 'inv4', businessId: 'glow-skincare', title: 'Canva Pro Account', sku: 'CANVAPRO-004', category: 'ACCOUNT', status: 'AVAILABLE', cost: 3.00, price: 15.00, vendor: 'AccSupplier', payload: 'user@example.com / P@ssw0rd' },
    { id: 'inv5', businessId: 'fitness-pro', title: 'Notion Template Pack', sku: 'NOTION-TPL-01', category: 'ASSET', status: 'AVAILABLE', cost: 0, price: 12.00, vendor: 'Self-made', payload: 'https://drive.google.com/file/xxx' },
];

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

export const MOCK_DECISIONS: Decision[] = [
    { id: 'd1', businessId: 'techgear', title: 'Switch to annual vendor contract with Alpha Keys', status: 'IN_DELIBERATION', urgency: 'High', impact: 'High', context: 'Alpha Keys is offering 20% discount on annual bulk contract. We currently buy monthly.', chosen: '', deadline: '2026-10-15', kpi: 'Reduce COGS by 15% within 60 days.', outcomeRating: null, createdAt: '2026-10-01' },
    { id: 'd2', businessId: 'techgear', title: 'Launch TikTok shop integration', status: 'DECIDED', urgency: 'Medium', impact: 'High', context: 'TikTok Shop now supports digital goods in our region. Could open new sales channel.', chosen: 'Proceed with TikTok Shop integration in Q4.', deadline: '2026-11-01', kpi: '50+ orders via TikTok Shop within 60 days of launch.', outcomeRating: null, createdAt: '2026-09-20' },
    { id: 'd3', businessId: 'glow-skincare', title: 'Hire part-time content editor', status: 'ARCHIVED', urgency: 'Low', impact: 'Medium', context: 'Content creation taking 3+ hours daily. Outsourcing considered.', chosen: 'Decided against — will use templates and batching instead.', deadline: '2026-09-01', kpi: 'Reduce content time to 1h/day.', outcomeRating: 4, createdAt: '2026-08-15' },
];

export type Vendor = {
    id: string;
    businessId: string;
    name: string;
    rating: number;
    whatsapp: string;
    telegram: string;
    notes: string;
};

export const MOCK_VENDORS: Vendor[] = [
    { id: 'v1', businessId: 'techgear', name: 'Alpha Keys', rating: 5, whatsapp: 'https://wa.me/123456', telegram: '@alphakeys', notes: '48h replacement warranty' },
    { id: 'v2', businessId: 'techgear', name: 'DevStudio Keys', rating: 4, whatsapp: 'https://wa.me/789012', telegram: '@devstudiokeys', notes: 'PayPal only' },
    { id: 'v3', businessId: 'techgear', name: 'SoftVault', rating: 3, whatsapp: 'https://wa.me/345678', telegram: '@softvault', notes: 'No warranty on Adobe keys' },
    { id: 'v4', businessId: 'glow-skincare', name: 'AccSupplier', rating: 4, whatsapp: 'https://wa.me/111111', telegram: '@accsupplier', notes: 'Premium accounts' },
];
