import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "BizPilot — Multi-Business Command Center",
    description: "Unified workspace for entrepreneurs managing multiple businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} antialiased`}>
            <body className="min-h-screen bg-[#0a0a0a] flex font-sans text-white">
                <Sidebar />
                <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                </main>
            </body>
        </html>
    );
}
