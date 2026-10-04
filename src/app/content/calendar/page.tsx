'use client';

import { useState } from 'react';
import { 
    Calendar as CalendarIcon, 
    ChevronLeft, 
    ChevronRight, 
    Plus, 
    Image as ImageIcon, 
    Copy, 
    MoreHorizontal,
    LayoutGrid,
    AlignLeft
} from 'lucide-react';

// Mock Data for the Calendar
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const mockPosts = [
    { id: 1, date: 15, title: 'Summer Sale Promo', platform: 'Instagram', time: '10:00 AM', status: 'scheduled' },
    { id: 2, date: 18, title: 'New Product Teaser', platform: 'TikTok', time: '2:30 PM', status: 'draft' },
    { id: 3, date: 22, title: 'Founder Q&A', platform: 'Twitter', time: '1:00 PM', status: 'published' },
];

export default function ContentStudio() {
    const [view, setView] = useState<'month' | 'week'>('month');
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);
    const [caption, setCaption] = useState('');

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
            {/* Main Calendar Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isCreatorOpen ? 'mr-[400px]' : ''}`}>
                {/* Header */}
                <header className="h-20 shrink-0 border-b border-white/10 px-8 flex items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-xl z-10">
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl font-semibold text-white tracking-tight">Content Studio</h1>
                        
                        {/* Segmented Control */}
                        <div className="bg-white/5 p-1 rounded-lg flex items-center">
                            <button 
                                onClick={() => setView('month')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'month' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
                            >
                                Month
                            </button>
                            <button 
                                onClick={() => setView('week')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'week' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
                            >
                                Week
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-white font-medium text-sm min-w-[120px] text-center">October 2026</span>
                            <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="w-px h-6 bg-white/10 mx-2"></div>
                        <button 
                            onClick={() => setIsCreatorOpen(true)}
                            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            Create Post
                        </button>
                    </div>
                </header>

                {/* Calendar Grid */}
                <main className="flex-1 overflow-auto p-8">
                    <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Days Header */}
                        <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.02]">
                            {daysOfWeek.map(day => (
                                <div key={day} className="py-3 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>
                        
                        {/* Grid Cells */}
                        <div className="grid grid-cols-7 auto-rows-[140px]">
                            {Array.from({ length: 35 }).map((_, i) => {
                                const date = i - 2; // Offset for starting day
                                const isCurrentMonth = date > 0 && date <= 31;
                                const isToday = date === 15;
                                const dayPosts = mockPosts.filter(p => p.date === date);

                                return (
                                    <div 
                                        key={i} 
                                        className={`border-b border-r border-white/5 p-2 transition-colors hover:bg-white/[0.02] ${!isCurrentMonth ? 'opacity-30 bg-black/20' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-500 text-white' : 'text-white/60'}`}>
                                                {isCurrentMonth ? date : (date <= 0 ? 30 + date : date - 31)}
                                            </span>
                                            {isCurrentMonth && (
                                                <button className="opacity-0 hover:opacity-100 text-white/40 hover:text-white transition-opacity p-1">
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            {dayPosts.map(post => (
                                                <div 
                                                    key={post.id} 
                                                    className="px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs flex flex-col gap-1 cursor-grab hover:border-white/20 transition-colors"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-white truncate pr-2">{post.title}</span>
                                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                                            post.status === 'published' ? 'bg-emerald-500' :
                                                            post.status === 'scheduled' ? 'bg-blue-400' : 'bg-amber-400'
                                                        }`} />
                                                    </div>
                                                    <div className="flex items-center justify-between text-white/40">
                                                        <span className="text-[10px]">{post.time}</span>
                                                        <span className="text-[10px] uppercase">{post.platform}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>

            {/* Slide-over Post Creator */}
            <div className={`fixed inset-y-0 right-0 w-[400px] bg-[#141414] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-in-out transform ${isCreatorOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col z-50`}>
                <div className="h-20 px-6 border-b border-white/10 flex items-center justify-between bg-black/20 backdrop-blur-md shrink-0">
                    <h2 className="text-lg font-semibold text-white">Post Creator</h2>
                    <button 
                        onClick={() => setIsCreatorOpen(false)}
                        className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Media Stager */}
                    <div>
                        <label className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2 mb-3">
                            <LayoutGrid className="w-4 h-4" /> Media Stager
                        </label>
                        <div className="border-2 border-dashed border-white/10 hover:border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-white/[0.01]">
                            <ImageIcon className="w-8 h-8 text-white/20 mb-3" />
                            <p className="text-sm font-medium text-white">Drag & drop media here</p>
                            <p className="text-xs text-white/40 mt-1">Supports PNG, JPG, MP4 up to 50MB</p>
                            <div className="mt-4 px-4 py-2 rounded-lg bg-white/5 text-white text-xs font-medium hover:bg-white/10 transition-colors">
                                Browse Files
                            </div>
                        </div>
                    </div>

                    {/* Caption Writer */}
                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2">
                                <AlignLeft className="w-4 h-4" /> Caption
                            </label>
                            <button className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                                <Copy className="w-3.5 h-3.5" /> Copy
                            </button>
                        </div>
                        <div className="relative">
                            <textarea 
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Write your caption here..."
                                className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none transition-all"
                            />
                            <div className="absolute bottom-3 right-3 text-xs font-medium">
                                <span className={caption.length > 2200 ? 'text-rose-500' : 'text-white/30'}>
                                    {caption.length} / 2200
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Platform Selection */}
                    <div>
                        <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block mb-3">Platforms</label>
                        <div className="flex gap-2">
                            {['IG', 'FB', 'X', 'TK'].map(plat => (
                                <button key={plat} className="flex-1 py-2 rounded-lg border border-white/10 text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                                    {plat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 bg-black/20 shrink-0 space-y-3">
                    <button className="w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20">
                        Schedule Post
                    </button>
                    <button className="w-full py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 text-sm font-medium transition-colors">
                        Save as Draft
                    </button>
                </div>
            </div>
        </div>
    );
}
