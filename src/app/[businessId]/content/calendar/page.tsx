'use client';

import { useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import {
    ChevronLeft, ChevronRight, Plus, X, Upload, Copy,
    Calendar, Clock, Tag, Image as ImageIcon, Video,
    CheckCircle2, AlignLeft, Download
} from 'lucide-react';
import { UniversalDashboardButton } from '@/components/UniversalDashboardButton';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PLATFORMS = [
    { name: 'Instagram', color: '#E1306C', bg: 'rgba(225, 48, 108, 0.1)' },
    { name: 'TikTok', color: '#000000', bg: 'rgba(0, 0, 0, 0.05)' },
    { name: 'Twitter', color: '#1DA1F2', bg: 'rgba(29, 161, 242, 0.1)' },
    { name: 'Facebook', color: '#1877F2', bg: 'rgba(24, 119, 242, 0.1)' },
    { name: 'LinkedIn', color: '#0A66C2', bg: 'rgba(10, 102, 194, 0.1)' },
    { name: 'YouTube', color: '#FF0000', bg: 'rgba(255, 0, 0, 0.1)' },
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
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const cells: { date: number; month: 'prev' | 'current' | 'next' }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) cells.push({ date: daysInPrev - i, month: 'prev' });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ date: d, month: 'current' });
    let next = 1;
    while (cells.length % 7 !== 0) cells.push({ date: next++, month: 'next' });
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

    const businessPosts = posts.filter(p => p.businessId === businessId);

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

    const [dayView, setDayView] = useState<DayViewState>({ date: 0, open: false });
    const [viewingPost, setViewingPost] = useState<any>(null);

    const prevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); };
    const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); };

    const openCreator = (date: number) => {
        setCreatorDate(date); setPostTitle(''); setCaption(''); setPostTime('12:00');
        setSelectedPlatforms(['Instagram']); setTags([]); setTagInput(''); setMediaFiles([]);
        setStatus('scheduled'); setCreatorOpen(true); setDayView({ date: 0, open: false });
    };

    const closeCreator = () => setCreatorOpen(false);
    const togglePlatform = (name: string) => setSelectedPlatforms(prev => prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]);

    const handleFiles = useCallback((files: FileList) => {
        const newFiles: MediaFile[] = Array.from(files).map(file => ({
            file, preview: URL.createObjectURL(file), url: null, uploading: true, type: file.type.startsWith('video') ? 'video' : 'image',
        }));
        setMediaFiles(prev => [...prev, ...newFiles]);

        newFiles.forEach(mf => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setMediaFiles(prev => prev.map(f => f.preview === mf.preview ? { ...f, url: e.target?.result as string, uploading: false } : f));
            };
            reader.onerror = () => {
                setMediaFiles(prev => prev.map(f => f.preview === mf.preview ? { ...f, uploading: false } : f));
            };
            reader.readAsDataURL(mf.file);
        });
    }, []);

    const handleDrop = (e: React.DragEvent) => { e.preventDefault(); if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files); };
    const removeMedia = (preview: string) => setMediaFiles(prev => prev.filter(f => f.preview !== preview));

    const addTagOnEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) setTags(t => [...t, tagInput.trim()]);
            setTagInput('');
        }
    };

    const submitPost = () => {
        if (!postTitle.trim()) return;
        if (mediaFiles.some(f => f.uploading)) return;

        const [h, m] = postTime.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const timeStr = `${displayHour}:${m} ${ampm}`;

        addPost({
            businessId, title: postTitle, caption, platform: selectedPlatforms.join(', ') || 'Instagram',
            time: timeStr, status, date: creatorDate, mediaUrl: mediaFiles[0]?.url || null,
            allMediaUrls: mediaFiles.filter(f => f.url).map(f => f.url as string), platforms: selectedPlatforms, tags,
        });
        closeCreator();
    };

    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
    const getPostsForDate = (date: number) => businessPosts.filter(p => p.date === date);

    const openDayView = (date: number) => { setCreatorOpen(false); setViewingPost(null); setDayView({ date, open: true }); };

    const statusConfig = {
        scheduled: { badge: 'pill-primary', label: 'Scheduled' },
        draft: { badge: 'pill-warning', label: 'Draft' },
        published: { badge: 'pill-success', label: 'Published' },
    };

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
            <div className={`flex-1 flex flex-col transition-all duration-300 ${creatorOpen ? 'mr-[440px]' : ''}`}>
                <header className="h-16 shrink-0 px-8 flex items-center justify-between border-b glass" style={{ borderColor: 'var(--border)' }}>
                    <div>
                        <h1 className="text-base font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>Content Studio</h1>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{business?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <UniversalDashboardButton />
                        <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: 'var(--fill-1)' }}>
                            <button onClick={prevMonth} className="p-1.5 rounded transition-colors" style={{ color: 'var(--text-secondary)' }}><ChevronLeft className="w-4 h-4" /></button>
                            <span className="font-semibold text-sm min-w-[130px] text-center" style={{ color: 'var(--text-primary)' }}>{monthName} {currentYear}</span>
                            <button onClick={nextMonth} className="p-1.5 rounded transition-colors" style={{ color: 'var(--text-secondary)' }}><ChevronRight className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => openCreator(today.getDate())} className="btn-primary flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Create Post
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-8 max-w-6xl mx-auto w-full">
                    <div className="card h-full flex flex-col">
                        <div className="grid grid-cols-7 border-b" style={{ borderColor: 'var(--border)' }}>
                            {DAYS_OF_WEEK.map(d => (
                                <div key={d} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: `repeat(${monthMatrix.length / 7}, minmax(0, 1fr))` }}>
                            {monthMatrix.map((cell, i) => {
                                const isCurrent = cell.month === 'current';
                                const isToday = isCurrent && cell.date === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                                const dayPosts = isCurrent ? getPostsForDate(cell.date) : [];

                                return (
                                    <div key={i} className={`border-b border-r flex flex-col min-h-[100px] group relative transition-colors ${!isCurrent ? 'opacity-30' : 'hover:bg-black/5 cursor-pointer'}`}
                                         style={{ borderColor: 'var(--border)' }} onClick={isCurrent ? () => openDayView(cell.date) : undefined}>
                                        <div className="flex items-center justify-between px-3 pt-2 pb-1">
                                            <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full transition-colors ${isToday ? 'bg-black text-white' : ''}`} style={{ color: !isToday ? 'var(--text-primary)' : '' }}>
                                                {cell.date}
                                            </span>
                                            {isCurrent && (
                                                <button onClick={e => { e.stopPropagation(); openCreator(cell.date); }} className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center transition-all hover:bg-black/10" style={{ color: 'var(--text-secondary)' }}>
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="px-2 pb-2 flex flex-col gap-1.5 flex-1 overflow-hidden">
                                            {dayPosts.slice(0, 3).map(post => {
                                                const firstPlatform = (post.platforms?.[0] || post.platform || '').split(',')[0].trim();
                                                const platCfg = PLATFORMS.find(p => p.name === firstPlatform);
                                                return (
                                                    <button key={post.id} onClick={e => { e.stopPropagation(); setViewingPost(post); setDayView({ date: cell.date, open: true }); }}
                                                            className="w-full text-left px-2 py-1.5 rounded-md border transition-colors flex items-center gap-1.5"
                                                            style={{ background: 'var(--fill-1)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                                                        <span className="text-[10px] font-semibold truncate flex-1">{post.title}</span>
                                                        <span className="text-[9px] font-bold uppercase" style={{ color: platCfg?.color }}>{firstPlatform.slice(0, 2)}</span>
                                                    </button>
                                                );
                                            })}
                                            {dayPosts.length > 3 && (
                                                <span className="text-[10px] pl-1 font-medium" style={{ color: 'var(--text-muted)' }}>+{dayPosts.length - 3} more</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>

            {/* CREATOR PANEL */}
            <div className={`fixed inset-y-0 right-0 w-[440px] border-l shadow-2xl flex flex-col z-40 transition-transform duration-300 ease-in-out ${creatorOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ background: 'var(--bg-base)', borderColor: 'var(--border)' }}>
                <div className="h-16 px-6 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border)' }}>
                    <div>
                        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>New Post</h2>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{business?.name} &bull; {monthName} {creatorDate}</p>
                    </div>
                    <button onClick={closeCreator} className="p-1.5 rounded-lg transition-colors hover:bg-black/5" style={{ color: 'var(--text-secondary)' }}><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Post Name *</label>
                        <input value={postTitle} onChange={e => setPostTitle(e.target.value)} className="input" placeholder="e.g. Summer Sale Campaign" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}><Calendar className="w-3 h-3 inline mr-1" />Date</label>
                            <input type="number" min={1} max={31} value={creatorDate} onChange={e => setCreatorDate(Number(e.target.value))} className="input" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}><Clock className="w-3 h-3 inline mr-1" />Time</label>
                            <input type="time" value={postTime} onChange={e => setPostTime(e.target.value)} className="input" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}><ImageIcon className="w-3 h-3 inline mr-1" />Media Attachments</label>
                        <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileInputRef.current?.click()}
                             className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors"
                             style={{ borderColor: 'var(--border)', background: 'var(--fill-1)' }}>
                            <Upload className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                            <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Drag & drop or click</p>
                            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Multiple files supported</p>
                            <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
                        </div>
                        {mediaFiles.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                {mediaFiles.map((mf, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border group" style={{ borderColor: 'var(--border)', background: 'var(--fill-2)' }}>
                                        {mf.type === 'video' ? <video src={mf.preview} className="w-full h-full object-cover" /> : <img src={mf.preview} alt="" className="w-full h-full object-cover" />}
                                        {mf.uploading && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><div className="w-4 h-4 border-2 border-t-black rounded-full animate-spin" /></div>}
                                        {!mf.uploading && mf.url && <div className="absolute top-1 right-1"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#34C759' }} /></div>}
                                        <button onClick={() => removeMedia(mf.preview)} className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 w-5 h-5 bg-white/80 rounded-full flex items-center justify-center text-black transition-opacity shadow-sm"><X className="w-3 h-3" /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}><AlignLeft className="w-3 h-3 inline mr-1" />Caption</label>
                        </div>
                        <textarea value={caption} onChange={e => setCaption(e.target.value)} rows={4} className="input resize-none" placeholder="Write your caption here..." />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}><Tag className="w-3 h-3 inline mr-1" />Tags</label>
                        <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTagOnEnter} className="input mb-2" placeholder="Type tag + Enter" />
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border" style={{ background: 'var(--fill-1)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                                        #{tag}
                                        <button onClick={() => setTags(t => t.filter(x => x !== tag))} className="opacity-50 hover:opacity-100">&times;</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Platforms</label>
                        <div className="flex flex-wrap gap-2">
                            {PLATFORMS.map(p => {
                                const active = selectedPlatforms.includes(p.name);
                                return (
                                    <button key={p.name} onClick={() => togglePlatform(p.name)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                                        style={{ background: active ? p.color : 'var(--fill-1)', borderColor: active ? p.color : 'var(--border)', color: active ? '#fff' : 'var(--text-secondary)' }}>
                                        {p.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Status</label>
                        <div className="flex gap-2">
                            {(['scheduled', 'draft'] as const).map(s => (
                                <button key={s} onClick={() => setStatus(s)} className="flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors capitalize"
                                    style={{ background: status === s ? 'var(--text-primary)' : 'var(--fill-1)', color: status === s ? 'var(--bg-base)' : 'var(--text-secondary)', borderColor: status === s ? 'var(--text-primary)' : 'var(--border)' }}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-5 border-t shrink-0 space-y-2" style={{ borderColor: 'var(--border)', background: 'var(--fill-1)' }}>
                    {mediaFiles.some(f => f.uploading) && <p className="text-[10px] text-center" style={{ color: '#FF9500' }}>Converting media, please wait...</p>}
                    <button onClick={submitPost} disabled={!postTitle.trim() || mediaFiles.some(f => f.uploading)} className="btn-primary w-full py-3">
                        {status === 'scheduled' ? 'Schedule Post' : 'Save Draft'}
                    </button>
                    <button onClick={closeCreator} className="btn-secondary w-full py-2 border-0 bg-transparent shadow-none" style={{ color: 'var(--text-muted)' }}>Cancel</button>
                </div>
            </div>

            {/* DAY VIEW PANEL */}
            {dayView.open && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="flex-1 panel-backdrop" onClick={() => { setDayView({ date: 0, open: false }); setViewingPost(null); }} />
                    <div className="w-[480px] border-l flex flex-col shadow-2xl animate-fade-up" style={{ background: 'var(--bg-base)', borderColor: 'var(--border)' }}>
                        <div className="h-16 px-6 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border)' }}>
                            <div>
                                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{monthName} {dayView.date}, {currentYear}</h2>
                                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{getPostsForDate(dayView.date).length} post(s) scheduled</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { openCreator(dayView.date); }} className="btn-primary px-3 py-1.5 flex items-center gap-1.5 text-xs"><Plus className="w-3.5 h-3.5" /> Add</button>
                                <button onClick={() => { setDayView({ date: 0, open: false }); setViewingPost(null); }} className="p-1.5 rounded-lg transition-colors hover:bg-black/5" style={{ color: 'var(--text-secondary)' }}><X className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {viewingPost ? (
                                <div className="space-y-4 animate-fade-up">
                                    <button onClick={() => setViewingPost(null)} className="flex items-center gap-1.5 text-xs font-semibold hover:underline" style={{ color: 'var(--text-secondary)' }}><ChevronLeft className="w-3.5 h-3.5" /> Back</button>
                                    <div className="card overflow-hidden">
                                        {(viewingPost.allMediaUrls?.length > 0 || viewingPost.mediaUrl) && (() => {
                                            const allMedia: string[] = viewingPost.allMediaUrls?.length > 0 ? viewingPost.allMediaUrls : [viewingPost.mediaUrl];
                                            return (
                                                <div className={`grid gap-0.5 border-b ${allMedia.length === 1 ? 'grid-cols-1' : allMedia.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`} style={{ borderColor: 'var(--border)' }}>
                                                    {allMedia.map((url: string, idx: number) => (
                                                        <div key={idx} className="aspect-square relative group" style={{ background: 'var(--fill-2)' }}>
                                                            {url.match(/\.(mp4|webm|mov)$/i) ? <video src={url} controls className="w-full h-full object-cover" /> : <img src={url} alt="" className="w-full h-full object-cover" />}
                                                            <a href={url} download={`media-${idx}`} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 flex items-center justify-center shadow-lg z-10" title="Download Media">
                                                                <Download className="w-4 h-4" />
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                        <div className="p-6 space-y-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {(() => { const sc = statusConfig[viewingPost.status as keyof typeof statusConfig] || statusConfig.draft; return <span className={`pill ${sc.badge}`}>{sc.label}</span>; })()}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--text-muted)' }}><Clock className="w-3.5 h-3.5" /> {viewingPost.time}</div>
                                            </div>
                                            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{viewingPost.title}</h3>
                                            <div className="flex flex-wrap gap-1.5">
                                                {(viewingPost.platforms || [viewingPost.platform]).map((plat: string) => {
                                                    const pConf = PLATFORMS.find(p => p.name === plat.trim());
                                                    return <span key={plat} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border" style={{ background: pConf?.bg, borderColor: pConf?.color, color: pConf?.color }}>{plat.trim()}</span>;
                                                })}
                                            </div>
                                            {viewingPost.tags && viewingPost.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {viewingPost.tags.map((t: string) => <span key={t} className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>#{t}</span>)}
                                                </div>
                                            )}
                                            {(viewingPost.caption || viewingPost.title) && (
                                                <div className="rounded-xl p-4 border" style={{ background: 'var(--fill-1)', borderColor: 'var(--border)' }}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Caption</p>
                                                    </div>
                                                    <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>{viewingPost.caption || viewingPost.title}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {getPostsForDate(dayView.date).length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center pt-16">
                                            <Calendar className="w-10 h-10 mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
                                            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Nothing scheduled</p>
                                            <button onClick={() => openCreator(dayView.date)} className="mt-4 btn-secondary text-xs">Add a post</button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {getPostsForDate(dayView.date).map(post => {
                                                const firstPlatform = (post.platforms?.[0] || post.platform || '').split(',')[0].trim();
                                                const pConf = PLATFORMS.find(p => p.name === firstPlatform);
                                                const sc = statusConfig[post.status as keyof typeof statusConfig] || statusConfig.draft;

                                                return (
                                                    <button key={post.id} onClick={() => setViewingPost(post)} className="w-full text-left card card-hover p-4 group">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center border" style={{ background: pConf?.bg || 'var(--fill-2)', borderColor: pConf?.color || 'var(--border)' }}>
                                                                {post.mediaUrl ? (post.mediaUrl.match(/\.(mp4|webm)$/i) ? <Video className="w-5 h-5" style={{ color: pConf?.color }} /> : <img src={post.mediaUrl} className="w-full h-full object-cover rounded-lg" alt="" />) : <ImageIcon className="w-5 h-5" style={{ color: pConf?.color }} />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <h4 className="text-sm font-bold truncate pr-2" style={{ color: 'var(--text-primary)' }}>{post.title}</h4>
                                                                    <span className={`pill ${sc.badge}`}>{sc.label}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                                                    <span>{post.time}</span><span>&bull;</span><span>{(post.platforms || [post.platform]).join(', ')}</span>
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 shrink-0 mt-1 transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }} />
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
