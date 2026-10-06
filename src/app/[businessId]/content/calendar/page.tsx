'use client';

import { useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import {
    ChevronLeft, ChevronRight, Plus, X, Upload, Copy,
    Calendar, Clock, Tag, Image as ImageIcon, Video,
    Instagram, Twitter, Linkedin, CheckCircle2, Eye,
    FilePlus, AlignLeft, ChevronDown
} from 'lucide-react';
import { UniversalDashboardButton } from '@/components/UniversalDashboardButton';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PLATFORMS = [
    { name: 'Instagram', color: 'bg-pink-500', ring: 'ring-pink-500/50', text: 'text-pink-400' },
    { name: 'TikTok', color: 'bg-black', ring: 'ring-white/30', text: 'text-white' },
    { name: 'Twitter', color: 'bg-sky-500', ring: 'ring-sky-500/50', text: 'text-sky-400' },
    { name: 'Facebook', color: 'bg-blue-600', ring: 'ring-blue-500/50', text: 'text-blue-400' },
    { name: 'LinkedIn', color: 'bg-blue-700', ring: 'ring-blue-700/50', text: 'text-blue-500' },
    { name: 'YouTube', color: 'bg-red-600', ring: 'ring-red-500/50', text: 'text-red-400' },
];

type MediaFile = {
    file: File;
    preview: string;
    url: string | null;
    uploading: boolean;
    type: 'image' | 'video';
};

type DayViewState = {
    date: number;
    open: boolean;
};

function getMonthMatrix(year: number, month: number) {
    // Returns array of {date, isCurrentMonth} for a 6-row calendar grid
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const cells: { date: number; month: 'prev' | 'current' | 'next' }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
        cells.push({ date: daysInPrev - i, month: 'prev' });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ date: d, month: 'current' });
    }
    let next = 1;
    while (cells.length % 7 !== 0) {
        cells.push({ date: next++, month: 'next' });
    }
    return cells;
}

export default function ContentStudio() {
    const { businessId } = useParams() as { businessId: string };
    const { businesses, posts, addPost } = useApp();
    const business = businesses.find(b => b.id === businessId);

    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const monthMatrix = getMonthMatrix(currentYear, currentMonth);

    // Filter posts for this business only
    const businessPosts = posts.filter(p => p.businessId === businessId);

    // Creator panel state
    const [creatorOpen, setCreatorOpen] = useState(false);
    const [creatorDate, setCreatorDate] = useState<number>(today.getDate());
    const [postTitle, setPostTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [postTime, setPostTime] = useState('12:00');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram']);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [status, setStatus] = useState<'scheduled' | 'draft'>('scheduled');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Day detail panel state
    const [dayView, setDayView] = useState<DayViewState>({ date: 0, open: false });
    const [viewingPost, setViewingPost] = useState<any>(null);

    // Navigation
    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
    };

    // Creator helpers
    const openCreator = (date: number) => {
        setCreatorDate(date);
        setPostTitle('');
        setCaption('');
        setPostTime('12:00');
        setSelectedPlatforms(['Instagram']);
        setTags([]);
        setTagInput('');
        setMediaFiles([]);
        setStatus('scheduled');
        setCreatorOpen(true);
        setDayView({ date: 0, open: false });
    };

    const closeCreator = () => setCreatorOpen(false);

    const togglePlatform = (name: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
        );
    };

    const handleFiles = useCallback(async (files: FileList) => {
        const newFiles: MediaFile[] = Array.from(files).map(file => ({
            file,
            preview: URL.createObjectURL(file),
            url: null,
            uploading: true,
            type: file.type.startsWith('video') ? 'video' : 'image',
        }));

        setMediaFiles(prev => [...prev, ...newFiles]);

        for (const mf of newFiles) {
            const formData = new FormData();
            formData.append('file', mf.file);
            try {
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                const data = await res.json();
                setMediaFiles(prev => prev.map(f =>
                    f.preview === mf.preview ? { ...f, url: data.success ? data.url : null, uploading: false } : f
                ));
            } catch {
                setMediaFiles(prev => prev.map(f =>
                    f.preview === mf.preview ? { ...f, uploading: false } : f
                ));
            }
        }
    }, []);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
    };

    const removeMedia = (preview: string) => {
        setMediaFiles(prev => prev.filter(f => f.preview !== preview));
    };

    const addTagOnEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) setTags(t => [...t, tagInput.trim()]);
            setTagInput('');
        }
    };

    const submitPost = () => {
        if (!postTitle.trim()) return;
        const uploading = mediaFiles.some(f => f.uploading);
        if (uploading) return;

        const [h, m] = postTime.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const timeStr = `${displayHour}:${m} ${ampm}`;

        addPost({
            businessId,
            title: postTitle,
            caption,
            platform: selectedPlatforms.join(', ') || 'Instagram',
            time: timeStr,
            status,
            date: creatorDate,
            platformColor: 'bg-indigo-500',
            mediaUrl: mediaFiles[0]?.url || null,
            allMediaUrls: mediaFiles.filter(f => f.url).map(f => f.url as string),
            platforms: selectedPlatforms,
            tags,
        });

        closeCreator();
    };

    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });

    // Posts for a specific date in current month
    const postsForDate = (date: number) =>
        businessPosts.filter(p => p.date === date && (p as any).month === currentMonth && (p as any).year === currentYear)
        // fallback for posts without month/year (legacy)
        || businessPosts.filter(p => p.date === date);

    // Actually, since our posts don't store month/year yet, we show all posts for that date number
    const getPostsForDate = (date: number) => businessPosts.filter(p => p.date === date);

    const openDayView = (date: number) => {
        setCreatorOpen(false);
        setViewingPost(null);
        setDayView({ date, open: true });
    };

    const platformColor = (name: string) => PLATFORMS.find(p => p.name === name)?.color || 'bg-indigo-500';
    const platformText = (name: string) => PLATFORMS.find(p => p.name === name)?.text || 'text-indigo-400';

    const statusConfig = {
        scheduled: { color: 'bg-blue-400', label: 'Scheduled', text: 'text-blue-400' },
        draft: { color: 'bg-amber-400', label: 'Draft', text: 'text-amber-400' },
        published: { color: 'bg-emerald-500', label: 'Published', text: 'text-emerald-400' },
    };

    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">

            {/* ═══════════════════════════════════════════
                MAIN CALENDAR AREA
            ═══════════════════════════════════════════ */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${creatorOpen ? 'mr-[440px]' : ''}`}>

                {/* Header */}
                <header className="h-16 shrink-0 border-b border-white/10 px-6 flex items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-xl z-10">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-base font-semibold text-white tracking-tight">Content Studio</h1>
                            <p className="text-[10px] text-white/40">{business?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <UniversalDashboardButton />

                        {/* Month Navigation */}
                        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                            <button onClick={prevMonth} className="p-1.5 rounded text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-white font-medium text-sm min-w-[130px] text-center">{monthName} {currentYear}</span>
                            <button onClick={nextMonth} className="p-1.5 rounded text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <button onClick={() => openCreator(today.getDate())} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-indigo-500/25">
                            <Plus className="w-4 h-4" />
                            Create Post
                        </button>
                    </div>
                </header>

                {/* Calendar Grid */}
                <main className="flex-1 overflow-auto p-4">
                    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden h-full flex flex-col">
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 border-b border-white/5">
                            {DAYS_OF_WEEK.map(d => (
                                <div key={d} className="py-2.5 text-center text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Cells */}
                        <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: `repeat(${monthMatrix.length / 7}, minmax(0, 1fr))` }}>
                            {monthMatrix.map((cell, i) => {
                                const isCurrent = cell.month === 'current';
                                const isToday = isCurrent && cell.date === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                                const dayPosts = isCurrent ? getPostsForDate(cell.date) : [];

                                return (
                                    <div
                                        key={i}
                                        className={`border-b border-r border-white/5 flex flex-col min-h-[90px] group relative transition-colors
                                            ${!isCurrent ? 'opacity-25' : 'hover:bg-white/[0.015] cursor-pointer'}`}
                                        onClick={isCurrent ? () => openDayView(cell.date) : undefined}
                                    >
                                        {/* Date number + plus icon */}
                                        <div className="flex items-center justify-between px-2 pt-2 pb-1">
                                            <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full transition-colors
                                                ${isToday ? 'bg-indigo-500 text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                                                {cell.date}
                                            </span>
                                            {isCurrent && (
                                                <button
                                                    onClick={e => { e.stopPropagation(); openCreator(cell.date); }}
                                                    className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Posts chips */}
                                        <div className="px-1.5 pb-1.5 flex flex-col gap-1 flex-1 overflow-hidden">
                                            {dayPosts.slice(0, 3).map(post => {
                                                const firstPlatform = (post.platforms?.[0] || post.platform || '').split(',')[0].trim();
                                                const pColor = platformColor(firstPlatform);
                                                const sc = statusConfig[post.status as keyof typeof statusConfig] || statusConfig.draft;
                                                return (
                                                    <button
                                                        key={post.id}
                                                        onClick={e => { e.stopPropagation(); setViewingPost(post); setDayView({ date: cell.date, open: true }); }}
                                                        className="w-full text-left px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/8 transition-colors flex items-center gap-1.5"
                                                    >
                                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${sc.color}`} />
                                                        <span className="text-[10px] text-white/80 font-medium truncate flex-1">{post.title}</span>
                                                        <span className={`text-[9px] font-semibold uppercase ${platformText(firstPlatform)}`}>{firstPlatform.slice(0, 2)}</span>
                                                    </button>
                                                );
                                            })}
                                            {dayPosts.length > 3 && (
                                                <span className="text-[9px] text-white/30 pl-1">+{dayPosts.length - 3} more</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>

            {/* ═══════════════════════════════════════════
                POST CREATOR PANEL (right slide-over)
            ═══════════════════════════════════════════ */}
            <div className={`fixed inset-y-0 right-0 w-[440px] bg-[#111] border-l border-white/10 shadow-2xl flex flex-col z-40 transition-transform duration-300 ease-in-out ${creatorOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Creator Header */}
                <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-sm font-semibold text-white">New Post</h2>
                        <p className="text-[10px] text-white/40">{business?.name} &bull; {monthName} {creatorDate}</p>
                    </div>
                    <button onClick={closeCreator} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">

                    {/* Post Title */}
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">Post Name *</label>
                        <input
                            value={postTitle}
                            onChange={e => setPostTitle(e.target.value)}
                            placeholder="e.g. Summer Sale Campaign"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/60"
                        />
                    </div>

                    {/* Date Selector */}
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                            <Calendar className="w-3 h-3 inline mr-1" />Date
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min={1}
                                max={31}
                                value={creatorDate}
                                onChange={e => setCreatorDate(Number(e.target.value))}
                                className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/60"
                            />
                            <span className="text-xs text-white/40">of {monthName} {currentYear}</span>
                        </div>
                    </div>

                    {/* Time */}
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                            <Clock className="w-3 h-3 inline mr-1" />Scheduled Time
                        </label>
                        <input
                            type="time"
                            value={postTime}
                            onChange={e => setPostTime(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/60"
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>

                    {/* Media Upload */}
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                            <ImageIcon className="w-3 h-3 inline mr-1" />Media Attachments
                        </label>
                        <div
                            onDrop={handleDrop}
                            onDragOver={e => e.preventDefault()}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/10 hover:border-indigo-500/40 rounded-xl p-5 text-center cursor-pointer transition-colors bg-white/[0.01] hover:bg-indigo-500/5"
                        >
                            <Upload className="w-6 h-6 text-white/20 mx-auto mb-2" />
                            <p className="text-xs text-white/50 font-medium">Drag & drop or click to upload</p>
                            <p className="text-[10px] text-white/25 mt-0.5">PNG, JPG, GIF, MP4 — Multiple supported</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={e => e.target.files && handleFiles(e.target.files)}
                            />
                        </div>

                        {/* Media Previews */}
                        {mediaFiles.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                {mediaFiles.map((mf, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-black/40 border border-white/10 group">
                                        {mf.type === 'video' ? (
                                            <video src={mf.preview} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={mf.preview} alt="" className="w-full h-full object-cover" />
                                        )}
                                        {mf.uploading && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            </div>
                                        )}
                                        {!mf.uploading && mf.url && (
                                            <div className="absolute top-1 right-1">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => removeMedia(mf.preview)}
                                            className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent py-1 px-1">
                                            <span className="text-[8px] text-white/60">{mf.type === 'video' ? '▶' : '🖼'}</span>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-lg border-2 border-dashed border-white/10 hover:border-white/20 flex items-center justify-center text-white/30 hover:text-white/50 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Caption */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                                <AlignLeft className="w-3 h-3 inline mr-1" />Caption
                            </label>
                            <button
                                onClick={() => navigator.clipboard.writeText(caption)}
                                className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300"
                            >
                                <Copy className="w-3 h-3" /> Copy
                            </button>
                        </div>
                        <div className="relative">
                            <textarea
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                                placeholder="Write your caption here..."
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/60 resize-none"
                            />
                            <span className={`absolute bottom-2.5 right-3 text-[10px] ${caption.length > 2200 ? 'text-rose-400' : 'text-white/25'}`}>
                                {caption.length}/2200
                            </span>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                            <Tag className="w-3 h-3 inline mr-1" />Tags
                        </label>
                        <input
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={addTagOnEnter}
                            placeholder="Type tag + Enter"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/60 mb-2"
                        />
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-[11px] text-indigo-300">
                                        #{tag}
                                        <button onClick={() => setTags(t => t.filter(x => x !== tag))} className="hover:text-rose-300 text-indigo-400/60 ml-0.5">&times;</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Platforms */}
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">Platforms</label>
                        <div className="flex flex-wrap gap-2">
                            {PLATFORMS.map(p => {
                                const active = selectedPlatforms.includes(p.name);
                                return (
                                    <button
                                        key={p.name}
                                        onClick={() => togglePlatform(p.name)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                            active
                                                ? `${p.color} text-white border-transparent shadow-lg`
                                                : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {p.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">Status</label>
                        <div className="flex gap-2">
                            {(['scheduled', 'draft'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStatus(s)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors capitalize ${
                                        status === s
                                            ? s === 'scheduled' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                            : 'bg-white/5 text-white/40 border-white/10 hover:text-white/60'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Creator Footer */}
                <div className="p-4 border-t border-white/10 space-y-2 shrink-0">
                    {mediaFiles.some(f => f.uploading) && (
                        <p className="text-[10px] text-amber-400 text-center">Uploading media, please wait...</p>
                    )}
                    <button
                        onClick={submitPost}
                        disabled={!postTitle.trim() || mediaFiles.some(f => f.uploading)}
                        className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        {status === 'scheduled' ? 'Schedule Post' : 'Save Draft'}
                    </button>
                    <button onClick={closeCreator} className="w-full py-2 rounded-xl border border-white/10 text-white/50 text-xs hover:text-white hover:bg-white/5 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                DAY VIEW PANEL (full-screen modal-style)
            ═══════════════════════════════════════════ */}
            {dayView.open && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => { setDayView({ date: 0, open: false }); setViewingPost(null); }} />
                    <div className="w-[480px] bg-[#0f0f0f] border-l border-white/10 flex flex-col shadow-2xl">
                        {/* Day View Header */}
                        <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-sm font-semibold text-white">{monthName} {dayView.date}, {currentYear}</h2>
                                <p className="text-[10px] text-white/40">{getPostsForDate(dayView.date).length} post(s) scheduled</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => { openCreator(dayView.date); }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Post
                                </button>
                                <button onClick={() => { setDayView({ date: 0, open: false }); setViewingPost(null); }} className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {/* Viewing a specific post */}
                            {viewingPost ? (
                                <div className="space-y-4">
                                    <button onClick={() => setViewingPost(null)} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
                                        <ChevronLeft className="w-3.5 h-3.5" /> Back to day
                                    </button>

                                    {/* Post detail card */}
                                    <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
                                        {/* All Media Grid */}
                                        {(viewingPost.allMediaUrls?.length > 0 || viewingPost.mediaUrl) && (() => {
                                            const allMedia: string[] = viewingPost.allMediaUrls?.length > 0
                                                ? viewingPost.allMediaUrls
                                                : [viewingPost.mediaUrl];
                                            return (
                                                <div className={`grid gap-0.5 ${allMedia.length === 1 ? 'grid-cols-1' : allMedia.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                                    {allMedia.map((url: string, idx: number) => (
                                                        <div key={idx} className="aspect-square bg-black">
                                                            {url.match(/\.(mp4|webm|mov)$/i) ? (
                                                                <video src={url} controls className="w-full h-full object-cover" />
                                                            ) : (
                                                                <img src={url} alt="" className="w-full h-full object-cover" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}

                                        <div className="p-5 space-y-4">
                                            {/* Status + Time */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {(() => {
                                                        const sc = statusConfig[viewingPost.status as keyof typeof statusConfig] || statusConfig.draft;
                                                        return (
                                                            <>
                                                                <div className={`w-2 h-2 rounded-full ${sc.color}`} />
                                                                <span className={`text-xs font-semibold capitalize ${sc.text}`}>{sc.label}</span>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-white/40">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {viewingPost.time}
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-white font-semibold text-base">{viewingPost.title}</h3>

                                            {/* Platforms */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {(viewingPost.platforms || [viewingPost.platform]).map((plat: string) => {
                                                    const pConf = PLATFORMS.find(p => p.name === plat.trim());
                                                    return (
                                                        <span key={plat} className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white ${pConf?.color || 'bg-white/10'}`}>
                                                            {plat.trim()}
                                                        </span>
                                                    );
                                                })}
                                            </div>

                                            {/* Tags */}
                                            {viewingPost.tags && viewingPost.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {viewingPost.tags.map((t: string) => (
                                                        <span key={t} className="text-xs text-indigo-400 font-medium">#{t}</span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Caption */}
                                            {(viewingPost.caption || viewingPost.title) && (
                                                <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Caption</p>
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(viewingPost.caption || viewingPost.title)}
                                                            className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                                        >
                                                            <Copy className="w-3 h-3" /> Copy
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-white/80 whitespace-pre-wrap">{viewingPost.caption || viewingPost.title}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // List of posts for this day
                                <>
                                    {getPostsForDate(dayView.date).length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center pt-16">
                                            <Calendar className="w-10 h-10 text-white/10 mb-3" />
                                            <p className="text-white/40 text-sm">Nothing scheduled for this day</p>
                                            <button
                                                onClick={() => openCreator(dayView.date)}
                                                className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl text-xs border border-white/10 transition-colors"
                                            >
                                                + Add a post
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {getPostsForDate(dayView.date).map(post => {
                                                const firstPlatform = (post.platforms?.[0] || post.platform || '').split(',')[0].trim();
                                                const pConf = PLATFORMS.find(p => p.name === firstPlatform);
                                                const sc = statusConfig[post.status as keyof typeof statusConfig] || statusConfig.draft;

                                                return (
                                                    <button
                                                        key={post.id}
                                                        onClick={() => setViewingPost(post)}
                                                        className="w-full text-left bg-[#1a1a1a] hover:bg-[#1f1f1f] border border-white/8 rounded-xl p-4 transition-colors group"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            {/* Thumbnail */}
                                                            <div className={`w-12 h-12 rounded-lg shrink-0 flex items-center justify-center ${pConf?.color || 'bg-white/10'} bg-opacity-20`}>
                                                                {post.mediaUrl ? (
                                                                    post.mediaUrl.match(/\.(mp4|webm)$/i)
                                                                        ? <Video className="w-5 h-5 text-white/60" />
                                                                        : <img src={post.mediaUrl} className="w-full h-full object-cover rounded-lg" alt="" />
                                                                ) : (
                                                                    <ImageIcon className="w-5 h-5 text-white/30" />
                                                                )}
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <h4 className="text-sm font-medium text-white truncate pr-2">{post.title}</h4>
                                                                    <div className={`w-2 h-2 rounded-full shrink-0 ${sc.color}`} />
                                                                </div>
                                                                <div className="flex items-center gap-2 text-[10px] text-white/40">
                                                                    <span>{post.time}</span>
                                                                    <span>&bull;</span>
                                                                    <span>{(post.platforms || [post.platform]).join(', ')}</span>
                                                                </div>
                                                                {post.tags && post.tags.length > 0 && (
                                                                    <div className="flex gap-1 mt-1.5">
                                                                        {post.tags.slice(0, 3).map((t: string) => (
                                                                            <span key={t} className="text-[9px] text-indigo-400/80">#{t}</span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 shrink-0 mt-1 transition-colors" />
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
