import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Sparkles, Star, Users, ArrowLeft, MessageSquare } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const RecommendedInfluencers = () => {
    const { id } = useParams();
    const [influencers, setInfluencers] = useState([]);
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const campaignRes = await axios.get(${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/campaigns/${id}`, config);
                setCampaign(campaignRes.data);

                const matchRes = await axios.get(${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/campaigns/${id}/match`, config);
                setInfluencers(matchRes.data);
            } catch (err) {
                console.error('Error matching:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user.token]);

    return (
        <div className="min-h-screen bg-brand-background text-slate-100 brand-mesh-gradient">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={18} />
                    Back to Campaign
                </button>

                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-yellow-400" size={24} />
                        <h1 className="text-4xl font-bold">Smart Recommendations</h1>
                    </div>
                    <p className="text-slate-400">Based on your {campaign?.category} campaign requirements</p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="glass h-80 animate-pulse rounded-3xl"></div>)
                    ) : influencers.length === 0 ? (
                        <p className="col-span-full text-center text-slate-500 py-20">No matching influencers found for this category.</p>
                    ) : (
                        influencers.map((inf, idx) => (
                            <motion.div
                                key={inf._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card p-8 rounded-3xl relative overflow-hidden group"
                            >
                                <div className="absolute top-4 right-4 bg-brand-primary/20 text-brand-primary text-xs font-bold px-3 py-1 rounded-full border border-brand-primary/20">
                                    {inf.matchScore}% Match
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary p-1">
                                        <div className="w-full h-full rounded-full bg-brand-surface flex items-center justify-center text-2xl">
                                            {inf.name[0]}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{inf.name}</h3>
                                        <p className="text-sm text-slate-400">{inf.niche || inf.category}</p>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <p className="text-sm text-slate-400 line-clamp-2">
                                        Professional creator focused on delivering high-quality content and authentic audience engagement.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button className="flex-1 bg-brand-primary text-black py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                        Hire Now
                                    </button>
                                    <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                        <MessageSquare size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default RecommendedInfluencers;
