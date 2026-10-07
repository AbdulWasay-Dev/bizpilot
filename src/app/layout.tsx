import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AppProvider } from "@/contexts/AppContext";
import { GlobalModals } from "@/components/GlobalModals";
import { prisma } from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "BizPilot — Multi-Business Command Center",
    description: "Unified workspace for entrepreneurs managing multiple businesses.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Fetch all initial data here to hydrate the client-side context
    const businesses = await prisma.business.findMany();
    const posts = await prisma.post.findMany();
    const ideas = await prisma.idea.findMany();
    
    // We parse Decimal fields to numbers for the client context to match the interface
    const rawTransactions = await prisma.transaction.findMany();
    const transactions = rawTransactions.map(t => ({
        ...t,
        amount: Number(t.amount),
    }));

    const rawInventory = await prisma.inventoryItem.findMany();
    const inventory = rawInventory.map(i => ({
        ...i,
        cost: Number(i.cost),
        price: Number(i.price),
    }));

    const decisions = await prisma.decision.findMany();
    const vendors = await prisma.vendor.findMany();
    const socialAccounts = await prisma.socialAccount.findMany();

    const initialData = {
        businesses: businesses.map(b => ({
            ...b,
            // Mock metrics since we haven't stored them yet
            metrics: { revenueMonth: 0, itemsSold: 0, postsWeek: 0, targetPostsWeek: 5, streak: 0, neglectScore: 100, lastActivity: 'Just now' }
        })),
        posts: posts.map(p => ({
            ...p,
            platforms: typeof p.platforms === 'string' ? JSON.parse(p.platforms) : p.platforms,
            tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
            allMediaUrls: typeof p.allMediaUrls === 'string' ? JSON.parse(p.allMediaUrls) : p.allMediaUrls,
        })),
        ideas,
        transactions,
        inventory: inventory.map(i => ({
            ...i,
            attributes: typeof i.attributes === 'string' ? JSON.parse(i.attributes) : i.attributes,
            digitalFields: typeof i.digitalFields === 'string' ? JSON.parse(i.digitalFields) : i.digitalFields,
            tags: typeof i.tags === 'string' ? JSON.parse(i.tags) : i.tags,
        })),
        decisions,
        vendors: vendors.map(v => ({
            ...v,
            tags: typeof v.tags === 'string' ? JSON.parse(v.tags) : v.tags,
        })),
        socialAccounts,
    };

    return (
        <html lang="en" className={`${inter.variable} antialiased`}>
            <body className="min-h-screen flex font-sans" style={{background:'var(--bg-base)',color:'var(--text-primary)'}}>
                <AppProvider initialData={initialData as any}>
                    <Sidebar />
                    <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                        <div className="flex-1 overflow-y-auto">
                            {children}
                        </div>
                    </main>
                    <GlobalModals />
                </AppProvider>
            </body>
        </html>
    );
}
