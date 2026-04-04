import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Shield, Instagram, Twitter, Globe, Camera,
    Zap, Users, TrendingUp, Star, Target, Briefcase,
    ChevronLeft, Settings, Share2, Verified, Edit3,
    Linkedin, Youtube, Facebook, Trash2, Save, XCircle, X as CloseIcon, Music
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (user && user.role === 'Brand') {
            navigate('/brand/profile');
            return;
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                // Fetch latest profile
                const profileRes = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/auth/profile', config);
                setUser(prev => ({ ...prev, ...profileRes.data }));

                // Fetch campaigns for stats
                const campRes = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/campaigns', config);
                setCampaigns(campRes.data);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching profile data:', err);
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [user.token, setUser]);

    useEffect(() => {
        if (user) {
            setEditData({
                name: user.name || '',
                bio: user.bio || '',
                category: user.category || '',
                niche: user.niche || '',
                instagram: user.instagram || '',
                twitter: user.twitter || '',
                linkedin: user.linkedin || '',
                youtube: user.youtube || '',
                tiktok: user.tiktok || '',
                facebook: user.facebook || '',
                website: user.website || '',
                followers: user.followers || 0,
                engagementRate: user.engagementRate || 0,
            });
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/auth/profile', editData, config);
            setUser(prev => ({ ...prev, ...data }));
            setIsEditModalOpen(false);
            // Optional: Show success toast
        } catch (err) {
            console.error('Error updating profile:', err);
            // Optional: Show error toast
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const stats = [
        { label: 'Total Reach', value: user.followers >= 1000 ? (user.followers / 1000).toFixed(1) + 'K' : user.followers || '0', icon: Users, color: 'text-white' },
        { label: 'Engagement', value: (user.engagementRate || '0.0') + '%', icon: TrendingUp, color: 'text-primary' },
        { label: 'Missions', value: campaigns.length, icon: Briefcase, color: 'text-secondary' },
        { label: 'Rating', value: '4.9/5', icon: Star, color: 'text-yellow-500' },
    ];

    const isBrand = user.role === 'Brand';

    return (
        <div className={`min-h-screen text-slate-100 pb-20 ${isBrand ? 'bg-brand-background brand-mesh-gradient' : 'bg-background-dark mesh-gradient'}`}>
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-24">
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex items-center gap-2 transition-all group ${isBrand ? 'text-slate-400 hover:text-brand-primary' : 'text-slate-400 hover:text-white'}`}
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Back</span>
                    </button>
                    <div className="flex gap-4">
                        <button className={`p-3 bg-white/5 rounded-2xl border border-white/5 text-slate-400 transition-all ${isBrand ? 'hover:text-brand-primary' : 'hover:text-primary'}`}>
                            <Share2 size={20} />
                        </button>
                        <button className={`p-3 bg-white/5 rounded-2xl border border-white/5 text-slate-400 transition-all ${isBrand ? 'hover:text-brand-secondary' : 'hover:text-secondary'}`}>
                            <Settings size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Left: Identity Card */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card rounded-[3rem] p-10 border border-white/5 bg-white/5 relative overflow-hidden text-center"
                        >
                            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/10 to-transparent" />

                            <div className="relative z-10">
                                <div className={`w-48 h-48 rounded-full border-4 border-white/5 mx-auto mb-8 flex items-center justify-center text-7xl font-black relative overflow-hidden group ${isBrand ? 'bg-brand-surface text-brand-primary' : 'bg-surface-dark text-primary'}`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                    {user.name?.[0]}
                                    <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <Camera size={32} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <h1 className="text-4xl font-black uppercase tracking-tighter">@{user.name?.replace(/\s+/g, '_')}</h1>
                                    <div className={`${isBrand ? 'bg-brand-accent' : 'bg-yellow-500'} text-black p-1 rounded-full border-2 ${isBrand ? 'border-brand-background' : 'border-background-dark'}`}>
                                        <Verified size={14} className="fill-black" />
                                    </div>
                                </div>
                                <p className={`${isBrand ? 'text-brand-primary' : 'text-primary'} font-black text-sm uppercase tracking-[0.2em] mb-8`}>{user.category || 'Professional'} Creator</p>

                                <div className="flex justify-center flex-wrap gap-4 mb-10">
                                    {user.instagram && (
                                        <a href={user.instagram.startsWith('http') ? user.instagram : `https://instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 transition-all cursor-pointer border border-white/5 ${isBrand ? 'hover:text-brand-primary' : 'hover:text-primary'}`}>
                                            <Instagram size={24} />
                                        </a>
                                    )}
                                    {user.twitter && (
                                        <a href={user.twitter.startsWith('http') ? user.twitter : `https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 transition-all cursor-pointer border border-white/5 ${isBrand ? 'hover:text-brand-secondary' : 'hover:text-secondary'}`}>
                                            <Twitter size={24} />
                                        </a>
                                    )}
                                    {user.linkedin && (
                                        <a href={user.linkedin.startsWith('http') ? user.linkedin : `https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 transition-all cursor-pointer border border-white/5 hover:text-blue-500`}>
                                            <Linkedin size={24} />
                                        </a>
                                    )}
                                    {user.youtube && (
                                        <a href={user.youtube.startsWith('http') ? user.youtube : `https://youtube.com/${user.youtube}`} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 transition-all cursor-pointer border border-white/5 hover:text-red-500`}>
                                            <Youtube size={24} />
                                        </a>
                                    )}
                                    {user.tiktok && (
                                        <a href={user.tiktok.startsWith('http') ? user.tiktok : `https://tiktok.com/@${user.tiktok}`} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 transition-all cursor-pointer border border-white/5 hover:text-pink-500`}>
                                            <Music size={24} />
                                        </a>
                                    )}
                                    {user.facebook && (
                                        <a href={user.facebook.startsWith('http') ? user.facebook : `https://facebook.com/${user.facebook}`} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 transition-all cursor-pointer border border-white/5 hover:text-blue-600`}>
                                            <Facebook size={24} />
                                        </a>
                                    )}
                                    {user.website && (
                                        <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer border border-white/5">
                                            <Globe size={24} />
                                        </a>
                                    )}
                                </div>

                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className={`w-full py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 ${isBrand ? 'bg-brand-primary text-black shadow-brand-primary/20' : 'bg-primary text-black shadow-primary/20'}`}
                                >
                                    <Edit3 size={18} /> Update Profile
                                </button>
                            </div>
                        </motion.div>

                        <div className="glass-card rounded-[3rem] p-10 border border-white/5 bg-white/5 space-y-8">
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-3">Verified Contact</p>
                                <div className="flex items-center gap-4 text-white font-black italic text-lg truncate">
                                    <Mail size={18} className={isBrand ? 'text-brand-primary' : 'text-primary'} />
                                    {user.email}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-3">Account Status</p>
                                <div className="flex items-center gap-4 text-white font-black italic text-lg">
                                    <Shield size={18} className={isBrand ? 'text-brand-secondary' : 'text-secondary'} />
                                    Premium Creator Plan
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats & Bio */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Stats Section */}
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card p-8 rounded-[3rem] border border-white/5 bg-white/5 text-center group hover:bg-white/10 transition-all border-dashed"
                                >
                                    <stat.icon size={28} className={`mx-auto mb-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                                    <p className="text-3xl font-black text-white leading-none">{stat.value}</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2">{stat.label}</p>
                                </motion.div>
                            ))}
                        </section>

                        {/* Bio Section */}
                        <section className="glass-card rounded-[4rem] p-12 border border-white/5 bg-white/5 relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent">
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none uppercase font-black text-9xl tracking-tighter">BIO</div>
                            <h2 className="text-4xl font-black uppercase tracking-tight mb-8">Professional <span className={isBrand ? 'text-brand-primary' : 'text-primary'}>Statement</span></h2>
                            <p className={`text-slate-300 text-xl font-black uppercase leading-relaxed max-w-4xl tracking-tight mb-12 italic border-l-4 pl-10 ${isBrand ? 'border-brand-primary' : 'border-primary'}`}>
                                {user.bio || `DIGITAL STORYTELLER FOCUSING ON ${user.niche || 'CREATIVE NARRATIVES'}. CRAFTING VISUAL STORIES THAT BRIDGE THE GAP BETWEEN AESTHETICS AND DAILY LIFE.`}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
                                {[
                                    user.category || 'Lifestyle',
                                    user.niche || 'Digital Art',
                                    'Verified Partner',
                                    'CollabConnect Pro'
                                ].map(tag => (
                                    <div key={tag} className="bg-white/5 border border-white/10 text-slate-300 py-4 rounded-2xl text-[10px] font-black uppercase text-center tracking-widest hover:border-primary/50 transition-colors">{tag}</div>
                                ))}
                            </div>
                        </section>

                        {/* Additional Info Section */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="glass-card rounded-[3rem] p-10 border border-white/5 bg-white/5">
                                <h3 className={`text-xl font-black uppercase tracking-widest mb-6 ${isBrand ? 'text-brand-secondary' : 'text-secondary'}`}>Niche Expertise</h3>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    Specialized in {user.niche || 'content creation'} with a focus on high-engagement visual storytelling and community building.
                                </p>
                            </div>
                            <div className="glass-card rounded-[3rem] p-10 border border-white/5 bg-white/5">
                                <h3 className={`text-xl font-black uppercase tracking-widest mb-6 ${isBrand ? 'text-brand-primary' : 'text-primary'}`}>Collaboration Style</h3>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    Open to long-term partnerships and high-impact brand campaigns that align with minimalist and sustainable values.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-background-dark/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-surface-dark border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">Edit <span className="text-primary">Profile</span></h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Update your creator identity</p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-3 hover:bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"
                                >
                                    <CloseIcon size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="p-8 overflow-y-auto custom-scrollbar">
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Basic Info */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary/50 mb-4">Core Identity</h3>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Display Name</label>
                                            <input
                                                type="text"
                                                value={editData.name}
                                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Professional Bio</label>
                                            <textarea
                                                value={editData.bio}
                                                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all h-32 resize-none"
                                                placeholder="Tell brands about your creative vision..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Category</label>
                                                <input
                                                    type="text"
                                                    value={editData.category}
                                                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all"
                                                    placeholder="e.g. Fashion"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Niche</label>
                                                <input
                                                    type="text"
                                                    value={editData.niche}
                                                    onChange={(e) => setEditData({ ...editData, niche: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all"
                                                    placeholder="e.g. Streetwear"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Followers</label>
                                                <input
                                                    type="number"
                                                    value={editData.followers}
                                                    onChange={(e) => setEditData({ ...editData, followers: parseInt(e.target.value) })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Engagement %</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={editData.engagementRate}
                                                    onChange={(e) => setEditData({ ...editData, engagementRate: parseFloat(e.target.value) })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-secondary/50 mb-4">Social Ecosystem</h3>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <Instagram size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="text"
                                                    value={editData.instagram}
                                                    onChange={(e) => setEditData({ ...editData, instagram: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white font-bold focus:border-secondary/50 outline-none transition-all"
                                                    placeholder="Instagram handle"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Twitter size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="text"
                                                    value={editData.twitter}
                                                    onChange={(e) => setEditData({ ...editData, twitter: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white font-bold focus:border-secondary/50 outline-none transition-all"
                                                    placeholder="Twitter handle"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Linkedin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="text"
                                                    value={editData.linkedin}
                                                    onChange={(e) => setEditData({ ...editData, linkedin: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white font-bold focus:border-secondary/50 outline-none transition-all"
                                                    placeholder="LinkedIn URL"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Youtube size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="text"
                                                    value={editData.youtube}
                                                    onChange={(e) => setEditData({ ...editData, youtube: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white font-bold focus:border-secondary/50 outline-none transition-all"
                                                    placeholder="YouTube Channel Link"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Music size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="text"
                                                    value={editData.tiktok}
                                                    onChange={(e) => setEditData({ ...editData, tiktok: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white font-bold focus:border-secondary/50 outline-none transition-all"
                                                    placeholder="TikTok handle"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Facebook size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="text"
                                                    value={editData.facebook}
                                                    onChange={(e) => setEditData({ ...editData, facebook: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white font-bold focus:border-secondary/50 outline-none transition-all"
                                                    placeholder="Facebook Link"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="text"
                                                    value={editData.website}
                                                    onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white font-bold focus:border-white/30 outline-none transition-all"
                                                    placeholder="Website URL"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 py-5 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="flex-[2] py-5 rounded-2xl bg-primary text-black font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isUpdating ? (
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Save size={18} /> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfilePage;
