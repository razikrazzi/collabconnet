import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, Instagram, Twitter, Globe, Star,
    Zap, Users, TrendingUp, ShieldCheck, Mail,
    MessageCircle, Calendar, Target, Award, ArrowRight,
    Search, CheckCircle2, Bookmark, Plus, Rocket
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const InfluencerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [influencer, setInfluencer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [inviting, setInviting] = useState(false);
    const [invitedSuccess, setInvitedSuccess] = useState(false);

    useEffect(() => {
        const fetchInfluencer = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/influencers/${id}`, config);
                setInfluencer(data);

                // Fetch brand's campaigns for invitation
                const campRes = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/campaigns', config);
                setCampaigns(campRes.data);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching influencer:', err);
                setError(err.response?.data?.message || 'Failed to fetch profile details');
                setLoading(false);
            }
        };
        fetchInfluencer();
    }, [id, user.token]);

    const handleInvite = async (campaignId) => {
        setInviting(true);
        try {
            // In a real app, this would call a backend endpoint
            // For now, we'll simulate a 1-second delay and show success
            await new Promise(resolve => setTimeout(resolve, 1000));
            setInvitedSuccess(true);
            setTimeout(() => {
                setShowInviteModal(false);
                setInvitedSuccess(false);
            }, 2000);
        } catch (err) {
            alert("Failed to send invitation.");
        } finally {
            setInviting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-background-dark text-white flex flex-col items-center justify-center">
            <h2 className="text-3xl font-black mb-4">PROFILE NOT FOUND</h2>
            <p className="text-slate-400 mb-8">{error}</p>
            <button onClick={() => navigate(-1)} className="px-8 py-3 bg-primary text-black font-black rounded-xl uppercase tracking-widest text-xs">Go Back</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 mesh-gradient pb-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-24">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Back to Discover</span>
                </button>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Left Panel: Profile Detail */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card rounded-[3rem] p-8 border border-white/5 bg-white/5 backdrop-blur-3xl relative overflow-hidden text-center"
                        >
                            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/10 to-transparent" />

                            <div className="relative z-10">
                                <div className="w-40 h-40 rounded-full bg-surface-dark border-4 border-white/5 mx-auto mb-6 flex items-center justify-center text-6xl font-black text-primary relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                    {influencer.name[0]}
                                </div>

                                <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-1">@{influencer.name.replace(' ', '').toLowerCase()}</h1>
                                <p className="text-slate-500 font-black text-xs uppercase tracking-[0.2em] mb-6">{influencer.category} Specialist</p>

                                <div className="flex justify-center gap-4 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary transition-colors cursor-pointer border border-white/5"><Instagram size={18} /></div>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-secondary transition-colors cursor-pointer border border-white/5"><Twitter size={18} /></div>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/5"><Globe size={18} /></div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowInviteModal(true)}
                                        className="w-full bg-primary text-black py-4 rounded-2xl font-black uppercase text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Award size={18} /> Invite to Mission
                                    </button>
                                    <button className="w-full bg-white/5 text-white py-4 rounded-2xl font-black uppercase text-sm border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 transition-all">
                                        <MessageCircle size={18} /> Send Message
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        <div className="glass-card rounded-[3rem] p-8 border border-white/5 bg-white/5 text-sm space-y-6 px-10">
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">Location</p>
                                <p className="font-bold text-white flex items-center gap-2 italic text-lg">Los Angeles, California</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">Member Since</p>
                                <p className="font-bold text-white italic text-lg">{new Date(influencer.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Stats & Portfolio */}
                    <div className="lg:col-span-8 space-y-10 focus:outline-none">
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Active Reach', value: (influencer.followers / 1000).toFixed(1) + 'K', icon: Users, color: 'text-white' },
                                { label: 'Engagement Rate', value: (influencer.engagementRate || '4.2') + '%', icon: TrendingUp, color: 'text-secondary' },
                                { label: 'Rating', value: '4.9/5', icon: Star, color: 'text-yellow-500' },
                                { label: 'Growth', value: '+12%', icon: Target, color: 'text-primary' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="glass-card p-6 rounded-[2.5rem] border border-white/5 bg-white/5 text-center group hover:bg-white/10 transition-all border-dashed"
                                >
                                    <stat.icon size={24} className={`mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform`} />
                                    <p className="text-2xl font-black text-white">{stat.value}</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1">{stat.label}</p>
                                </motion.div>
                            ))}
                        </section>

                        <section className="glass-card rounded-[3rem] p-10 border border-white/5 bg-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none uppercase font-black text-8xl">BIO</div>
                            <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Artist <span className="text-primary">Statement</span></h2>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-4xl tracking-tight">
                                Specialized in creating immersive digital experiences through minimalist storytelling. I focus on brands that prioritize sustainability and avant-garde aesthetics. With over 5 years of industry experience, I help bridge the gap between premium heritage and modern digital culture.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                                {['Urban Wear', 'SaaS Tech', 'Minimalism', 'Creative Direction'].map(tag => (
                                    <div key={tag} className="bg-white/5 border border-white/5 text-slate-300 py-3 rounded-2xl text-[10px] font-black uppercase text-center tracking-widest">{tag}</div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-3xl font-black uppercase tracking-tight">Recent <span className="text-secondary hover:text-primary transition-colors cursor-pointer">Impact</span></h2>
                                <button className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2">View Full Portfolio <ArrowRight size={14} /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5 }}
                                        className="aspect-square glass-card rounded-[2.5rem] border border-white/5 bg-surface-dark overflow-hidden relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <p className="text-[10px] font-black uppercase text-secondary mb-1">Brand Campaign</p>
                                            <h4 className="text-xl font-black text-white leading-tight">Neo-Minimalism {i}</h4>
                                        </div>
                                        <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Search size={16} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Invite Modal */}
            <AnimatePresence>
                {showInviteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background-dark/90 backdrop-blur-3xl"
                            onClick={() => !inviting && setShowInviteModal(false)}
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-surface-dark border border-white/10 w-full max-w-2xl rounded-[3rem] p-10 relative z-10 shadow-2xl overflow-hidden"
                        >
                            {!invitedSuccess ? (
                                <>
                                    <div className="flex justify-between items-start mb-10">
                                        <div>
                                            <h2 className="text-4xl font-black uppercase tracking-tight">Send <span className="text-primary">Invitation</span></h2>
                                            <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Select target mission for {influencer.name}</p>
                                        </div>
                                        <button
                                            onClick={() => setShowInviteModal(false)}
                                            className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all text-2xl font-black"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2 mb-10">
                                        {campaigns.length === 0 ? (
                                            <div className="text-center py-10 opacity-50 italic">No active campaigns found.</div>
                                        ) : (
                                            campaigns.map(camp => (
                                                <button
                                                    key={camp._id}
                                                    onClick={() => handleInvite(camp._id)}
                                                    disabled={inviting}
                                                    className="w-full glass-card p-6 rounded-[2rem] border border-white/5 hover:border-primary/50 text-left transition-all flex items-center justify-between group active:scale-95"
                                                >
                                                    <div className="space-y-1">
                                                        <h4 className="text-xl font-black text-white group-hover:text-primary transition-colors">{camp.title}</h4>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{camp.category} • ${camp.budget.toLocaleString()}</p>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-black transition-all">
                                                        <ArrowRight size={20} />
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => navigate('/brand/create-campaign')}
                                            className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} /> New Campaign
                                        </button>
                                        <button className="flex-1 py-4 bg-primary text-black rounded-2xl font-black uppercase text-xs hover:shadow-xl hover:shadow-primary/20 transition-all">
                                            Manage Pool
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-black mb-8 shadow-2xl shadow-green-500/20"
                                    >
                                        <CheckCircle2 size={48} />
                                    </motion.div>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter text-white mb-2 italic underline underline-offset-8">Mission Transferred</h3>
                                    <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-sm">
                                        Your invitation has been delivered to {influencer.name}. Status will be updated in your dashboard.
                                    </p>
                                </div>
                            )}

                            {inviting && (
                                <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-md flex items-center justify-center transition-all">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <p className="font-black text-primary uppercase text-xs tracking-widest animate-pulse italic">Encrypting Invitation...</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InfluencerProfile;
