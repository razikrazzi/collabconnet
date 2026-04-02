import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Users, Target, Zap, Instagram, Twitter,
    Globe, TrendingUp, Sparkles, Rocket, ArrowRight,
    Star, ShieldCheck, Heart, Camera
} from 'lucide-react';
import Navbar from '../../components/Navbar';

const InfluencerOnboarding = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [serverStatus, setServerStatus] = useState('Checking...');

    const checkServer = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/ping');
            setServerStatus(`Online [${res.data.version || 'v2'}]`);
        } catch (err) {
            setServerStatus(`Offline: ${err.message}`);
        }
    };

    useEffect(() => {
        checkServer();
    }, []);

    const [formData, setFormData] = useState({
        category: '',
        niche: '',
        followers: '',
        bio: '',
        instagram: '',
        twitter: '',
        website: ''
    });

    const categories = ['Fashion', 'Technology', 'Beauty', 'Lifestyle', 'Gaming', 'Fitness', 'Food', 'Travel'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            // Convert numbers
            const submissionData = {
                ...formData,
                followers: Number(formData.followers) || 0
            };

            // Update user profile on backend
            // [v4-DEBUG] Switching to explicit onboarding endpoint
            const updateUrl = 'http://127.0.0.1:5000/api/auth/onboarding-update';
            console.log('🚀 [Turn 4] Sending Update to:', updateUrl);

            const { data } = await axios.put(updateUrl, submissionData, config);

            // Update local user context
            const updatedUser = { ...data, token: user.token }; // Keep existing token
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            if (setUser) setUser(updatedUser);

            navigate('/influencer/dashboard');
        } catch (err) {
            console.error('Update failed. Full Error Object:', err);
            let errorMsg = 'Failed to save details.';
            if (err.response) {
                console.log('Server Error Data:', err.response.data);
                errorMsg = `Server Error ${err.response.status}: ${err.response.data.message || 'Unknown'}`;
                if (err.response.data.hint) errorMsg += ` (Hint: ${err.response.data.hint})`;
            } else if (err.request) {
                errorMsg = 'No response from server. Check if backend is running on 5000.';
            } else {
                errorMsg = err.message;
            }
            alert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 mesh-gradient pb-20">
            <Navbar />

            {/* Debug Monitor */}
            <div className="max-w-4xl mx-auto mt-24 mb-6 px-6">
                <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${serverStatus.includes('Online') ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>Server Connection: <span className="text-slate-400">{serverStatus}</span></span>
                    </div>
                    <button onClick={checkServer} className="text-primary hover:underline">Re-check</button>
                    <span>Target URL: <span className="text-slate-400">127.0.0.1:5000</span></span>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 pt-32">
                {/* Progress Header */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4">
                                Setup Your <span className="text-primary">Identity</span>
                            </h1>
                            <p className="text-slate-400 font-medium text-lg">Help brands find you by completing your creator profile.</p>
                        </div>
                        <div className="text-right">
                            <span className="text-4xl font-black text-white/20 uppercase tracking-widest italic">Phase 0{step}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                className={`flex-1 transition-all duration-700 ${step >= i ? 'bg-primary' : 'bg-transparent'}`}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Niche & Category */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="glass-card p-10 rounded-[3rem] border border-white/5 bg-white/5">
                                <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                                    <Target className="text-primary" /> Core Focus
                                </h2>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Primary Category</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setFormData({ ...formData, category: cat })}
                                                    className={`py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${formData.category === cat
                                                        ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20'
                                                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Your Specific Niche</label>
                                        <div className="relative group">
                                            <Sparkles className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                                            <input
                                                name="niche"
                                                value={formData.niche}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-white placeholder:text-slate-500"
                                                placeholder="e.g. Minimalist Tech, Vegan Fitness"
                                            />
                                        </div>
                                        <p className="mt-4 text-[10px] text-slate-500 font-medium italic">Be specific. This helps our Smart Match AI find the best campaigns for you.</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleNext} disabled={!formData.category || !formData.niche} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-3 hover:bg-primary transition-all disabled:opacity-50">
                                Next Phase <ArrowRight size={20} />
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Stats */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="glass-card p-10 rounded-[3rem] border border-white/5 bg-white/5">
                                <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                                    <TrendingUp className="text-secondary" /> Audience Impact
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Instagram Followers</label>
                                        <div className="relative group">
                                            <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                            <input
                                                name="followers"
                                                type="number"
                                                value={formData.followers}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/5 focus:border-secondary/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-white uppercase"
                                                placeholder="e.g. 25000"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Instagram Profile Link</label>
                                        <div className="relative group">
                                            <Instagram className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                            <input
                                                name="instagram"
                                                type="url"
                                                value={formData.instagram}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/5 focus:border-secondary/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-white placeholder:text-slate-500"
                                                placeholder="https://instagram.com/your-username"
                                            />
                                        </div>
                                        <p className="mt-3 text-[10px] text-slate-500 font-medium italic">Provide the full URL for manual verification process.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={handleBack} className="flex-1 bg-white/5 text-white py-5 rounded-2xl font-black uppercase text-sm border border-white/5">Go Back</button>
                                <button onClick={handleNext} disabled={!formData.followers || !formData.instagram} className="flex-2 bg-white text-black py-5 px-12 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-3 hover:bg-secondary transition-all disabled:opacity-50">
                                    Next Phase <ArrowRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Socials & Mission Launch */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-10"
                        >
                            <div className="glass-card p-10 rounded-[3rem] border border-white/5 bg-white/5">
                                <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                                    <Rocket className="text-orange-500" /> Digital Presence
                                </h2>

                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="relative group">
                                            <Twitter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                name="twitter"
                                                value={formData.twitter}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white outline-none font-bold placeholder:text-slate-500"
                                                placeholder="Twitter/X Username"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white outline-none font-bold placeholder:text-slate-500"
                                                placeholder="Website URL (Optional)"
                                            />
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <Camera className="absolute left-5 top-5 text-slate-500" size={20} />
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-6 h-32 text-white outline-none font-bold placeholder:text-slate-500"
                                            placeholder="Write a short bio about your creative style..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={handleBack} className="flex-1 bg-white/5 text-white py-5 rounded-2xl font-black uppercase text-sm border border-white/5">Go Back</button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="flex-2 bg-primary text-black py-5 px-12 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? 'Encrypting Details...' : 'Launch Mission'} <Rocket size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default InfluencerOnboarding;
