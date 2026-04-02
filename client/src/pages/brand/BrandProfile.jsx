import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2, Mail, ShieldCheck, Globe, Camera,
    Zap, Rocket, Briefcase, ChevronLeft, Settings,
    Share2, Edit3, Save, X as CloseIcon,
    MapPin, ExternalLink, Sparkles, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const BrandProfile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                // Fetch latest profile
                const profileRes = await axios.get('http://localhost:5001/api/auth/profile', config);
                setUser(prev => ({ ...prev, ...profileRes.data }));

                // Fetch campaigns for stats
                const campRes = await axios.get('http://localhost:5001/api/campaigns', config);
                setCampaigns(campRes.data);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching profile data:', err);
                setLoading(false);
            }
        };
        if (user?.token) {
            fetchProfileData();
        } else {
            setLoading(false);
        }
    }, [user?.token, setUser]);

    useEffect(() => {
        if (user) {
            setEditData({
                name: user.name || '',
                companyName: user.companyName || '',
                industry: user.industry || '',
                description: user.description || '',
                website: user.website || '',
                location: user.location || '',
            });
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put('http://localhost:5001/api/auth/profile', editData, config);
            setUser(prev => ({ ...prev, ...data }));
            setIsEditModalOpen(false);
        } catch (err) {
            console.error('Error updating profile:', err);
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const stats = [
        { label: 'Total Missions', value: campaigns.length, icon: Rocket, color: 'text-brand-primary' },
        { label: 'Active Collaborations', value: campaigns.filter(c => c.status === 'Active').length, icon: Zap, color: 'text-brand-secondary' },
        { label: 'Vetted Level', value: 'Elite', icon: ShieldCheck, color: 'text-emerald-400' },
        { label: 'Industry Rank', value: 'Top 5%', icon: CheckCircle2, color: 'text-brand-accent' },
    ];

    return (
        <div className="min-h-screen bg-brand-background text-slate-100 pb-20 brand-mesh-gradient font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-24">
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => navigate('/brand/dashboard')}
                        className="flex items-center gap-2 text-slate-400 hover:text-brand-primary transition-all group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Dashboard</span>
                    </button>
                    <div className="flex gap-4">
                        <button className="p-3 bg-white/5 rounded-2xl border border-white/5 text-slate-400 hover:text-brand-primary transition-all">
                            <Share2 size={20} />
                        </button>
                        <button className="p-3 bg-white/5 rounded-2xl border border-white/5 text-slate-400 hover:text-brand-secondary transition-all">
                            <Settings size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Left: Brand Identity Card */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card rounded-[3rem] p-10 border border-white/5 bg-white/5 relative overflow-hidden text-center"
                        >
                            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-brand-primary/10 to-transparent" />

                            <div className="relative z-10">
                                <div className="w-48 h-48 rounded-[3rem] border-4 border-white/5 mx-auto mb-8 flex items-center justify-center text-7xl font-black relative overflow-hidden group bg-brand-surface text-brand-primary">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                    {user.companyName?.[0] || user.name?.[0]}
                                    <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <Camera size={32} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <h1 className="text-4xl font-black uppercase tracking-tighter">{user.companyName || 'Elite Brand'}</h1>
                                    <div className="bg-brand-accent text-black p-1 rounded-full border-2 border-brand-background">
                                        <CheckCircle2 size={14} className="fill-black" />
                                    </div>
                                </div>
                                <p className="text-brand-primary font-black text-sm uppercase tracking-[0.2em] mb-8">{user.industry || 'Global'} Sector</p>

                                <div className="flex justify-center flex-wrap gap-4 mb-10">
                                    {user.website && (
                                        <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer border border-white/5">
                                            <Globe size={24} />
                                        </a>
                                    )}
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-brand-secondary transition-all cursor-pointer border border-white/5">
                                        <ExternalLink size={24} />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="w-full py-5 rounded-3xl bg-brand-primary text-black font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-brand-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                >
                                    <Edit3 size={18} /> Update Brand Profile
                                </button>
                            </div>
                        </motion.div>

                        <div className="glass-card rounded-[3rem] p-10 border border-white/5 bg-white/5 space-y-8">
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-3">Primary Contact</p>
                                <div className="flex items-center gap-4 text-white font-black italic text-lg truncate">
                                    <Mail size={18} className="text-brand-primary" />
                                    {user.email}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-3">Enterprise Status</p>
                                <div className="flex items-center gap-4 text-white font-black italic text-lg">
                                    <ShieldCheck size={18} className="text-brand-secondary" />
                                    Verified Organization
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Brand Stats & Story */}
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

                        {/* Brand Story Section */}
                        <section className="glass-card rounded-[4rem] p-12 border border-white/5 bg-white/5 relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent">
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none uppercase font-black text-9xl tracking-tighter">BRAND</div>
                            <h2 className="text-4xl font-black uppercase tracking-tight mb-8">Executive <span className="text-brand-primary">Summary</span></h2>
                            <p className="text-slate-300 text-xl font-black uppercase leading-relaxed max-w-4xl tracking-tight mb-12 italic border-l-4 border-brand-primary pl-10">
                                {user.description || `PIONEERING EXCELLENCE IN THE ${user.industry || 'GLOBAL'} MARKET. WE PARTNER WITH CREATIVE VISIONARIES TO REDEFINE MODERN BRAND NARRATIVES AND ENGAGEMENT.`}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
                                {[
                                    user.industry || 'Enterprise',
                                    'Global Ops',
                                    'Verified Brand',
                                    'Mission Controller'
                                ].map(tag => (
                                    <div key={tag} className="bg-white/5 border border-white/10 text-slate-300 py-4 rounded-2xl text-[10px] font-black uppercase text-center tracking-widest hover:border-brand-primary/50 transition-colors">{tag}</div>
                                ))}
                            </div>
                        </section>

                        {/* Additional Info Section */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="glass-card rounded-[3rem] p-10 border border-white/5 bg-white/5">
                                <h3 className="text-xl font-black uppercase tracking-widest mb-6 text-brand-secondary">Market Expertise</h3>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    Leading the way in {user.industry || 'high-impact markets'} with a focus on sustainable growth and creator-led marketing strategies.
                                </p>
                            </div>
                            <div className="glass-card rounded-[3rem] p-10 border border-white/5 bg-white/5">
                                <h3 className="text-xl font-black uppercase tracking-widest mb-6 text-brand-primary">Vetting Philosophy</h3>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    We prioritize authentic connections and high-engagement content that resonates with modern, conscious consumers.
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
                            className="relative w-full max-w-4xl bg-brand-surface border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">Edit <span className="text-brand-primary">Brand Profile</span></h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Update your corporate identity</p>
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
                                    {/* Company Info */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary/50 mb-4">Core Identity</h3>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Company Name</label>
                                            <input
                                                type="text"
                                                value={editData.companyName}
                                                onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-brand-primary/50 outline-none transition-all"
                                                placeholder="Business Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Executive Summary</label>
                                            <textarea
                                                value={editData.description}
                                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-brand-primary/50 outline-none transition-all h-32 resize-none uppercase"
                                                placeholder="Tell creators about your brand mission..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Industry</label>
                                                <input
                                                    type="text"
                                                    value={editData.industry}
                                                    onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-brand-primary/50 outline-none transition-all"
                                                    placeholder="e.g. Technology"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    value={editData.location}
                                                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-brand-primary/50 outline-none transition-all"
                                                    placeholder="e.g. London, UK"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact & Links */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-secondary/50 mb-4">Contact & Presence</h3>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Contact Person</label>
                                            <input
                                                type="text"
                                                value={editData.name}
                                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-brand-secondary/50 outline-none transition-all"
                                                placeholder="Full Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Official Website</label>
                                            <div className="relative">
                                                <Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="text"
                                                    value={editData.website}
                                                    onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white font-bold focus:border-brand-secondary/50 outline-none transition-all"
                                                    placeholder="www.brand.com"
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
                                        className="flex-[2] py-5 rounded-2xl bg-brand-primary text-black font-black uppercase text-xs tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isUpdating ? (
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Save size={18} /> Save Brand Profile
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

export default BrandProfile;
