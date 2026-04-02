import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, BarChart3, Mail, CreditCard,
    LogOut, Bell, Search, Verified, Edit3, Settings, Share2,
    Users, TrendingUp, Briefcase, Zap, MessageSquare, PlusCircle,
    Heart, MessageCircle, ChevronRight, CheckCircle2, DollarSign, Building2, User, ArrowUpRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const InfluencerDashboard = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [campaignFilter, setCampaignFilter] = useState('All');
    const [campaigns, setCampaigns] = useState([]);
    const [brands, setBrands] = useState([]);
    const [brandsLoading, setBrandsLoading] = useState(true);
    const [invitationCount, setInvitationCount] = useState(0);
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                // Fetch full profile to check for onboarding
                const profileRes = await axios.get('http://localhost:5001/api/auth/profile', config);
                const fullUser = profileRes.data;



                // Update local user context
                setUser(prev => ({ ...prev, ...fullUser }));

                const { data } = await axios.get('http://localhost:5001/api/campaigns', config);
                setCampaigns(data);

                const brandsRes = await axios.get('http://localhost:5001/api/auth/brands', config);
                setBrands(brandsRes.data);
                setBrandsLoading(false);

                const inviteRes = await axios.get('http://localhost:5001/api/invitations/my', config);
                setInvitationCount(inviteRes.data.filter(i => i.status === 'New').length);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, [user.token, navigate, setUser]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarLinks = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'brands', label: 'View Brands', icon: Building2 },
        { id: 'payments', label: 'Earnings', icon: CreditCard },
    ];

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 selection:bg-primary selection:text-black mesh-gradient">


            {/* Main Content Area */}
            <div className="flex-1 min-h-screen relative">
                {/* Header Overlay */}
                <header className="sticky top-0 z-40 bg-background-dark/80 backdrop-blur-md border-b border-border-dark/30 px-8 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Link to="/influencer/dashboard" className="flex items-center gap-2 text-primary">
                                <Zap className="fill-primary" size={24} />
                                <h1 className="text-lg font-black tracking-tight uppercase">CollabConnect</h1>
                            </Link>
                            <nav className="hidden md:flex items-center gap-6">
                                {sidebarLinks.filter(l => l.id !== 'dashboard').map((link) => (
                                    <button
                                        key={link.id}
                                        onClick={() => {
                                            if (link.id === 'messages') navigate('/chat');
                                            else if (link.id === 'profile') navigate('/profile');
                                            else if (link.id === 'payments') navigate('/influencer/payments');
                                            else setActiveView(link.id);
                                        }}
                                        className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeView === link.id ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        {link.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4 border-r border-white/10 pr-6 mr-6 hidden sm:flex">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-white uppercase leading-none mb-1">{user.name}</p>
                                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none">Pro Creator</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-black uppercase shadow-lg shadow-primary/10">
                                    {user.name?.[0]}
                                </div>
                            </div>
                            <button onClick={() => navigate('/influencer/requests')} className="text-slate-400 hover:text-white transition-colors relative">
                                <Bell size={20} />
                                {invitationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background-dark flex items-center justify-center text-[7px] font-black text-black">{invitationCount}</span>
                                )}
                            </button>
                            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="pt-12 pb-20 px-8 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        {activeView === 'dashboard' ? (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >


                                {/* 2. Mission Workshop Long Banner */}
                                <section className="mb-12">
                                    <Link to="/influencer/workshop" className="group block">
                                        <motion.div
                                            whileHover={{ y: -4, scale: 1.005 }}
                                            whileTap={{ scale: 0.995 }}
                                            className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group-hover:border-primary/30 transition-all shadow-2xl shadow-primary/5"
                                        >
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(19,200,236,0.15),transparent)] pointer-events-none" />

                                            <div className="flex items-center gap-8 relative z-10">
                                                <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform">
                                                    <Zap size={40} className="fill-primary" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">Active Operations</p>
                                                    </div>
                                                    <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Mission <span className="text-primary italic">Workshop</span></h3>
                                                    <p className="text-slate-400 font-medium max-w-md">
                                                        Access your private workspace to manage all your ongoing collaborations, track progress, and finalize active contracts.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-3 relative z-10">
                                                <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group-hover:bg-primary group-hover:text-black transition-all">
                                                    <span className="text-xs font-black uppercase tracking-widest">Enter Command Center</span>
                                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-400 transition-colors">Manage {campaigns.filter(c => c.influencersParticipating?.includes(user?._id) && c.status !== 'Completed').length} Missions In Progress</p>
                                            </div>

                                            {/* Decorative Background Elements */}
                                            <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
                                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                                        </motion.div>
                                    </Link>
                                </section>

                                {/* 3. Main Operations Grid - Premium Div Buttons */}
                                <section className="grid xl:grid-cols-4 lg:grid-cols-2 gap-6 mb-12">
                                    <Link to="/influencer/discover-campaigns" className="group">
                                        <motion.div
                                            whileHover={{ y: -8, scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="glass-card p-7 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden h-full flex flex-col justify-between min-h-[280px]"
                                        >
                                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all" />
                                            <div>
                                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-primary/10">
                                                    <Building2 size={32} />
                                                </div>
                                                <h3 className="text-2xl font-black uppercase tracking-tight mb-3 text-white">Explore <span className="text-primary">Campaigns</span></h3>
                                                <p className="text-slate-400 font-medium leading-relaxed">
                                                    Browse active campaigns from top companies and find your next big collaboration.
                                                </p>
                                            </div>
                                            <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                                                View Live Opportunities <ChevronRight size={14} />
                                            </div>
                                        </motion.div>
                                    </Link>

                                    <div onClick={() => setActiveView('brands')} className="group cursor-pointer">
                                        <motion.div
                                            whileHover={{ y: -8, scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="glass-card p-7 rounded-[2.5rem] border border-white/5 hover:border-secondary/30 transition-all bg-gradient-to-br from-secondary/10 to-transparent relative overflow-hidden h-full flex flex-col justify-between min-h-[280px]"
                                        >
                                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-[60px] group-hover:bg-secondary/20 transition-all" />
                                            <div>
                                                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-secondary/10">
                                                    <Building2 size={32} />
                                                </div>
                                                <h3 className="text-2xl font-black uppercase tracking-tight mb-3 text-white">Explore <span className="text-secondary">Brands</span></h3>
                                                <p className="text-slate-400 font-medium leading-relaxed">
                                                    Connect with industry leaders and discover top companies looking for creators like you.
                                                </p>
                                            </div>
                                            <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-secondary group-hover:gap-4 transition-all">
                                                View All Brands <ChevronRight size={14} />
                                            </div>
                                        </motion.div>
                                    </div>

                                    <Link to="/influencer/myapplications" className="group">
                                        <motion.div
                                            whileHover={{ y: -8, scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="glass-card p-7 rounded-[2.5rem] border border-white/5 hover:border-purple-500/30 transition-all bg-gradient-to-br from-purple-500/10 to-transparent relative overflow-hidden h-full flex flex-col justify-between min-h-[280px]"
                                        >
                                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-[60px] group-hover:bg-purple-500/20 transition-all" />
                                            <div>
                                                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-purple-500/10">
                                                    <Briefcase size={32} />
                                                </div>
                                                <h3 className="text-2xl font-black uppercase tracking-tight mb-3 text-white"> <span className="text-purple-400">Applications</span></h3>
                                                <p className="text-slate-400 font-medium leading-relaxed">
                                                    Track the status of your campaign applications and follow up with brand owners.
                                                </p>
                                            </div>
                                            <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-purple-400 group-hover:gap-4 transition-all">
                                                Track All Applications <ChevronRight size={14} />
                                            </div>
                                        </motion.div>
                                    </Link>

                                    <Link to="/influencer/payments" className="group">
                                        <motion.div
                                            whileHover={{ y: -8, scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="glass-card p-7 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all bg-gradient-to-br from-emerald-500/10 to-transparent relative overflow-hidden h-full flex flex-col justify-between min-h-[280px]"
                                        >
                                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-500/20 transition-all" />
                                            <div>
                                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-emerald-500/10">
                                                    <DollarSign size={32} />
                                                </div>
                                                <h3 className="text-2xl font-black uppercase tracking-tight mb-3 text-white">Financial <span className="text-emerald-400">Terminal</span></h3>
                                                <p className="text-slate-400 font-medium leading-relaxed">
                                                    Review your collaboration earnings, pending settlements, and withdraw your balance.
                                                </p>
                                            </div>
                                            <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400 group-hover:gap-4 transition-all">
                                                Access Wallet & Payments <ChevronRight size={14} />
                                            </div>
                                        </motion.div>
                                    </Link>


                                </section>



                                {/* Real Incoming Offers Section - Filtering from campaigns state */}
                                <section className="grid lg:grid-cols-1 gap-8 mb-12">
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-2xl font-black uppercase tracking-tighter">New Campaign Offers</h3>
                                            <span className="bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                                {campaigns.filter(c => c.status === 'Active').length} Available
                                            </span>
                                        </div>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {campaigns
                                                .filter(c => c.status === 'Active')
                                                .slice(0, 3) // Show top 3 recent
                                                .map((camp) => (
                                                    <motion.div
                                                        key={camp._id}
                                                        whileHover={{ y: -10 }}
                                                        className="flex flex-col rounded-[2.5rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group overflow-hidden relative glass-card"
                                                    >
                                                        {/* Top Image Section */}
                                                        <div className="h-48 w-full overflow-hidden relative">
                                                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent z-10" />
                                                            {camp.image ? (
                                                                <img src={camp.image} alt={camp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                                                    <Zap size={40} className="text-primary/30" />
                                                                </div>
                                                            )}
                                                            <div className="absolute top-4 left-4 z-20">
                                                                <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest border border-white/10">
                                                                    {camp.brand?.companyName || 'Verified Brand'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Content Section */}
                                                        <div className="p-6 pt-2">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div>
                                                                    <h4 className="font-black text-lg uppercase tracking-tight text-white line-clamp-1">{camp.title}</h4>
                                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Collaboration</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between mt-6">
                                                                <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl">
                                                                    <p className="text-[8px] text-primary font-black uppercase tracking-widest leading-none mb-1">Budget</p>
                                                                    <p className="text-lg font-black text-white">${camp.budget?.toLocaleString()}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => navigate(`/influencer/campaign/${camp._id}`)}
                                                                    className="px-6 py-3 rounded-2xl bg-white text-black text-[10px] font-black uppercase hover:bg-primary transition-all shadow-xl shadow-white/5 group-hover:shadow-primary/20"
                                                                >
                                                                    Secure Mission
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            {campaigns.filter(c => c.status === 'Active').length === 0 && (
                                                <div className="col-span-full p-12 text-center border border-white/5 border-dashed rounded-[2.5rem] bg-white/[0.01]">
                                                    <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No new offers currently available</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>


                            </motion.div>
                        ) : activeView === 'campaigns' ? (
                            <motion.div
                                key="campaigns"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-4xl font-black mb-2">My Campaigns</h2>
                                        <p className="text-slate-400 font-medium">Manage and track your active collaborations</p>
                                    </div>
                                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 self-start">
                                        {['All', 'Active', 'Pending', 'Completed'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setCampaignFilter(tab)}
                                                className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${campaignFilter === tab ? 'bg-primary text-background-dark shadow-lg' : 'text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {campaigns
                                        .filter(c => campaignFilter === 'All' || c.status === campaignFilter)
                                        .map((camp) => (
                                            <div key={camp._id} className="glass-card rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all flex flex-col group overflow-hidden bg-white/[0.02]">
                                                {/* Card Image Area */}
                                                <div className="h-40 w-full relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 to-transparent z-10" />
                                                    {camp.image ? (
                                                        <img src={camp.image} alt={camp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary font-black text-xl border border-white/10">
                                                                {camp.title[0]}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="absolute top-4 right-4 z-20">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-md border ${camp.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                            camp.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                                'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                            }`}>
                                                            {camp.status || 'Active'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-6">
                                                    <h3 className="text-xl font-black uppercase tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">{camp.title}</h3>
                                                    <p className="text-slate-400 text-sm line-clamp-2 mb-6 font-medium">
                                                        {camp.description || 'Exclusive collaboration for brand awareness and urban lifestyle showcase.'}
                                                    </p>

                                                    <div className="space-y-4 mb-6">
                                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                            <span>Campaign Progress</span>
                                                            <span className="text-primary">75%</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: '75%' }}
                                                                className="h-full bg-primary shadow-[0_0_10px_rgba(19,200,236,0.5)]"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 mt-auto">
                                                        <div>
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Budget</p>
                                                            <p className="text-lg font-black text-white">${camp.budget?.toLocaleString() || '2,400'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Deadline</p>
                                                            <p className="text-lg font-black text-white">{new Date(camp.timeline).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => navigate(`/influencer/campaign/${camp._id}`)}
                                                        className="w-full mt-6 bg-white/5 hover:bg-white hover:text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border border-white/5 group-hover:border-white/20"
                                                    >
                                                        Manage Mission
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                    {campaigns.length === 0 && (
                                        <div className="col-span-full py-20 text-center glass-card rounded-3xl border border-white/5">
                                            <Briefcase size={48} className="mx-auto text-slate-700 mb-4" />
                                            <h3 className="text-xl font-bold text-slate-400">No campaigns found</h3>
                                            <p className="text-slate-500">You don't have any campaigns in this category yet.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : activeView === 'brands' ? (
                            <motion.div
                                key="brands"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-4xl font-black mb-2">View Brands</h2>
                                    <p className="text-slate-400 font-medium">Discover and connect with top brands on CollabConnect</p>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {brandsLoading ? (
                                        <div className="col-span-full py-20 text-center">
                                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Scanning for Brands...</p>
                                        </div>
                                    ) : brands.map((brand) => (
                                        <div key={brand._id} className="glass-card rounded-3xl p-6 border border-white/5 hover:border-primary/20 transition-all group">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-black text-2xl border border-white/10 group-hover:border-primary/50 transition-colors">
                                                    {brand.companyName?.[0] || brand.name?.[0]}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{brand.companyName || brand.name}</h3>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{brand.industry || 'Exclusive Brand'}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/5">
                                                <div>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Status</p>
                                                    <p className="text-sm font-black text-white uppercase tracking-tight">Verified</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Rating</p>
                                                    <p className="text-lg font-black text-primary">★ 5.0</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/influencer/brand/${brand._id}`)}
                                                className="w-full mt-6 bg-white/5 hover:bg-primary hover:text-background-dark py-3 rounded-xl font-black uppercase text-xs transition-all border border-white/5"
                                            >
                                                View Brand Profile
                                            </button>
                                        </div>
                                    ))}
                                    {!brandsLoading && brands.length === 0 && (
                                        <div className="col-span-full py-20 text-center glass-card rounded-3xl border border-white/5">
                                            <Building2 size={48} className="mx-auto text-slate-700 mb-4" />
                                            <h3 className="text-xl font-bold text-slate-400">No brands found</h3>
                                            <p className="text-slate-500">Check back later for new brand connections.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-20 text-center"
                            >
                                <h2 className="text-2xl font-black text-slate-600 uppercase tracking-widest">Coming Soon</h2>
                                <p className="text-slate-500 mt-2 font-bold">This section is currently under development.</p>
                                <button
                                    onClick={() => setActiveView('dashboard')}
                                    className="mt-8 px-8 py-3 bg-primary text-background-dark rounded-xl font-black uppercase text-xs hover:scale-105 transition-transform"
                                >
                                    Back to Dashboard
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                <footer className="border-t border-border-dark py-12 px-8">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2 text-primary opacity-50 grayscale hover:grayscale-0 transition-all cursor-crosshair">
                            <Zap size={24} />
                            <h2 className="text-sm font-black tracking-tight uppercase">CollabConnect</h2>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">© 2024 CollabConnect Creator Dashboard. All rights reserved.</p>
                        <div className="flex gap-6">
                            <button className="text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Privacy</button>
                            <button className="text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Support</button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default InfluencerDashboard;
