import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Layout, BarChart3, Users, Clock, CheckCircle2,
    TrendingUp, TrendingDown, DollarSign, Target,
    Bell, Search, Filter, MoreHorizontal, Eye, Edit,
    Zap, Star, ShieldCheck, ChevronRight, Sparkles, Rocket,
    ArrowUpRight, Inbox
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Mock Data for Charts & Analytics
const performanceData = [
    { name: 'Mon', engagement: 4000, reach: 2400, clicks: 2400 },
    { name: 'Tue', engagement: 3000, reach: 1398, clicks: 2210 },
    { name: 'Wed', engagement: 2000, reach: 9800, clicks: 2290 },
    { name: 'Thu', engagement: 2780, reach: 3908, clicks: 2000 },
    { name: 'Fri', engagement: 1890, reach: 4800, clicks: 2181 },
    { name: 'Sat', engagement: 2390, reach: 3800, clicks: 2500 },
    { name: 'Sun', engagement: 3490, reach: 4300, clicks: 2100 },
];

const budgetData = [
    { name: 'Spent', value: 4500, color: '#8b5cf6' },
    { name: 'Active', value: 3000, color: '#d946ef' },
    { name: 'Remaining', value: 2500, color: '#1e293b' },
];

const mockActivities = [
    { id: 1, text: 'Nitin applied to "Tech Launch Campaign"', time: '2 mins ago', type: 'application', icon: <Users size={14} /> },
    { id: 2, text: 'Campaign "Summer Fest" moved to Active', time: '1 hour ago', type: 'status', icon: <Zap size={14} /> },
    { id: 3, text: 'Payment of $450 released to @sarah_c', time: '3 hours ago', type: 'payment', icon: <DollarSign size={14} /> },
    { id: 4, text: 'Draft content submitted by @creator_x', time: '5 hours ago', type: 'draft', icon: <Edit size={14} /> },
];

// recommendedInfluencers moved inside component to use real data

const BrandDashboard = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [stats, setStats] = useState({ active: 0, pending: 0, completed: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [activeChart, setActiveChart] = useState('engagement');
    const [isLoading, setIsLoading] = useState(true);
    const [recommendedInfluencers, setRecommendedInfluencers] = useState([]);
    const [applicationCount, setApplicationCount] = useState(0);
    const [totalApps, setTotalApps] = useState(0);
    const [pendingReviews, setPendingReviews] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                // Fetch Campaigns
                const campaignRes = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/campaigns', config);
                setCampaigns(campaignRes.data);

                const active = campaignRes.data.filter(c => c.status === 'Active').length;
                const pending = campaignRes.data.filter(c => c.status === 'Pending').length;
                const completed = campaignRes.data.filter(c => c.status === 'Completed').length;
                setStats({ active, pending, completed });

                const influencerRes = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/influencers', config);
                // Just take the first 3 for the dashboard
                setRecommendedInfluencers(influencerRes.data.slice(0, 3));

                // Fetch Applications for notification badge
                const appRes = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/applications/brand', config);
                const pendingApps = appRes.data.filter(a => a.status === 'Pending').length;
                setApplicationCount(pendingApps);
                setTotalApps(appRes.data.length);

                // Fetch Deliverables for review count
                const delivRes = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/deliverables/brand', config);
                const pendingD = delivRes.data.filter(d => ['Under Review', 'Pending', 'Draft Submitted', 'Revision Requested'].includes(d.status)).length;
                setPendingReviews(pendingD);

                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, [user.token]);

    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(c => {
            const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'All' || c.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [campaigns, searchTerm, filterStatus]);

    const StatCard = ({ title, value, trend, isPositive, icon: Icon }) => (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-6 rounded-3xl border border-brand-border/30 hover:border-brand-primary/50 transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand-surface rounded-2xl text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <Icon size={20} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {trend}%
                </div>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</p>
            <h3 className="text-3xl font-bold mt-1 tracking-tight">{value}</h3>
            <div className="mt-4 h-1 w-full bg-brand-surface rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary"
                />
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-brand-background text-slate-100 brand-mesh-gradient">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 pt-24 pb-10 space-y-10">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-brand-primary font-bold text-sm mb-1">
                            <ShieldCheck size={16} /> Verified Brand Dashboard
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight">Overview</h1>
                        <p className="text-slate-400 mt-2 text-lg">Managing <span className="text-white font-bold">{user.companyName}</span> active operations</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80 h-14">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                className="w-full bg-brand-surface border border-brand-border/50 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all font-bold text-sm tracking-tight"
                                placeholder="Search campaigns, influencers, or analytics..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="p-4 bg-brand-surface rounded-2xl border border-white/5 hover:bg-white/10 transition-all text-slate-400 relative">
                            <Bell size={24} />
                            <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-brand-surface"></span>
                        </button>
                    </div>
                </header>

                {/* Main Operations Grid - Premium Div Buttons */}
                <section className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
                    <Link to="/brand/discover" className="group">
                        <motion.div
                            whileHover={{ y: -8, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="glass-card p-8 rounded-[2.5rem] border border-white/5 hover:border-secondary/30 transition-all bg-gradient-to-br from-secondary/10 to-transparent relative overflow-hidden h-full flex flex-col justify-between min-h-[320px]"
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-[60px] group-hover:bg-secondary/20 transition-all" />
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-secondary/10">
                                    <Sparkles size={28} />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-white">Find Expert <span className="text-secondary">Creators</span></h3>
                                <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-sm">
                                    Browse our vetted network of elite influencers and find the perfect match.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center gap-4">
                                <span className="bg-secondary text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Explore <ArrowUpRight size={14} />
                                </span>
                            </div>
                        </motion.div>
                    </Link>

                    <Link to="/brand/applications" className="group">
                        <motion.div
                            whileHover={{ y: -8, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="glass-card p-8 rounded-[2.5rem] border border-white/5 hover:border-orange-500/30 transition-all bg-gradient-to-br from-orange-500/10 to-transparent relative overflow-hidden h-full flex flex-col justify-between min-h-[320px]"
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px] group-hover:bg-orange-500/20 transition-all" />
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20 mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-orange-500/10 relative">
                                    <Inbox size={28} />
                                    {applicationCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full border-4 border-background-dark flex items-center justify-center text-[8px] font-black text-white">{applicationCount}</span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-white">Review <span className="text-orange-400">Applications</span></h3>
                                <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-sm">
                                    Analyze inbound requests from creators who want to represent your brand.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center gap-4">
                                <span className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
                                    View Requests <ArrowUpRight size={14} />
                                </span>
                            </div>
                        </motion.div>
                    </Link>

                    <Link to="/brand/create-campaign" className="group">
                        <motion.div
                            whileHover={{ y: -8, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="glass-card p-8 rounded-[2.5rem] border border-white/5 hover:border-brand-primary/30 transition-all bg-gradient-to-br from-brand-primary/10 to-transparent relative overflow-hidden h-full flex flex-col justify-between min-h-[320px]"
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-[60px] group-hover:bg-brand-primary/20 transition-all" />
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-brand-primary/10">
                                    <Rocket size={28} />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-white">Launch New <span className="text-brand-primary">Campaign</span></h3>
                                <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-sm">
                                    Initiate a high-performance mission and reach your target demographics.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center gap-4">
                                <span className="bg-brand-primary text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Start Mission <ArrowUpRight size={14} />
                                </span>
                            </div>
                        </motion.div>
                    </Link>

                    <Link to="/brand/payments" className="group">
                        <motion.div
                            whileHover={{ y: -8, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="glass-card p-8 rounded-[2.5rem] border border-white/5 hover:border-brand-accent/30 transition-all bg-gradient-to-br from-brand-accent/10 to-transparent relative overflow-hidden h-full flex flex-col justify-between min-h-[320px]"
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-accent/10 rounded-full blur-[60px] group-hover:bg-brand-accent/20 transition-all" />
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent border border-brand-accent/20 mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-brand-accent/10 relative">
                                    <DollarSign size={28} />
                                    {pendingReviews > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent rounded-full border-4 border-background-dark flex items-center justify-center text-[8px] font-black text-black">{pendingReviews}</span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-white">Review & <span className="text-brand-accent">Payments</span></h3>
                                <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-sm">
                                    Verify submitted work and authorize payment releases for your collaborators.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center gap-4">
                                <span className="bg-brand-accent text-black px-5 py-2.5 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 group-hover:gap-3 transition-all shadow-xl shadow-brand-accent/30">
                                    Review & Pay <ArrowUpRight size={14} />
                                </span>
                            </div>
                        </motion.div>
                    </Link>
                </section>

                {/* 5. Campaign Management Gateway - MOVED TOP */}
                <section>
                    <Link to="/brand/campaigns" className="block group">
                        <motion.div
                            whileHover={{ y: -8, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="glass-card p-10 rounded-[3rem] border border-white/5 hover:border-brand-primary/40 transition-all bg-gradient-to-br from-brand-surface/40 to-brand-background/60 overflow-hidden relative shadow-2xl shadow-black/50"
                        >
                            {/* Decorative Elements */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] group-hover:bg-brand-primary/20 transition-all" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-secondary/10 rounded-full blur-[100px] group-hover:bg-brand-secondary/20 transition-all" />

                            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                                <div className="w-24 h-24 rounded-3xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-lg shadow-brand-primary/10 group-hover:rotate-6 transition-transform">
                                    <Layout size={40} />
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                        <span className="bg-brand-primary/20 text-brand-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-brand-primary/30">Admin Central</span>
                                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1"><Clock size={12} /> Updated Real-time</span>
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tight uppercase leading-none">
                                        Campaign <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Management</span> Center
                                    </h2>
                                    <p className="text-slate-400 mt-4 text-lg font-medium max-w-2xl leading-relaxed">
                                        Track, analyze, and optimize all your active brand collaborations from a single, high-performance interface.
                                    </p>
                                </div>

                                <div className="flex items-center justify-center gap-6">
                                    <div className="text-center">
                                        <p className="text-3xl font-black text-white">{campaigns.length}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Total</p>
                                    </div>
                                    <div className="w-[1px] h-12 bg-white/10" />
                                    <div className="text-center">
                                        <p className="text-3xl font-black text-brand-primary">{stats.active}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Active</p>
                                    </div>
                                    <div className="bg-brand-primary text-black p-4 rounded-2xl md:ml-6 group-hover:translate-x-2 transition-transform shadow-xl shadow-brand-primary/20">
                                        <ChevronRight size={24} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </section>

                {/* 1. Overview Analytics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Campaigns" value={campaigns.length} trend="12.5" isPositive={true} icon={Target} />
                    <StatCard title="Total Applications" value={totalApps} trend="8.2" isPositive={true} icon={Users} />
                    <StatCard title="Budget Spent" value={`$${(stats.active * 1200 + stats.completed * 2500).toLocaleString()}`} trend="4.1" isPositive={false} icon={BarChart3} />
                    <StatCard title="Conv. Rate" value="3.8%" trend="2.4" isPositive={true} icon={TrendingUp} />
                </section>

                {/* 2 & 3. Charts & Activity Row */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Performance Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 glass-card p-8 rounded-3xl"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-bold">Campaign Performance</h3>
                                <p className="text-sm text-slate-500">Real-time engagement metrics</p>
                            </div>
                            <div className="bg-brand-surface/50 p-1 rounded-xl flex gap-1">
                                {['engagement', 'reach', 'clicks'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setActiveChart(type)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${activeChart === type ? 'bg-brand-primary text-black' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val > 999 ? val / 1000 + 'k' : val}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                                        itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey={activeChart} stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorMetric)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* 6. Budget & Activity Panel */}
                    <div className="space-y-8">
                        {/* Budget Overview */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-8 rounded-3xl"
                        >
                            <h3 className="text-xl font-bold mb-6">Budget Allocation</h3>
                            <div className="h-48 w-full flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={budgetData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                                            {budgetData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <p className="text-2xl font-bold">$10k</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Total</p>
                                </div>
                            </div>
                            <div className="space-y-4 mt-6">
                                {budgetData.map((item) => (
                                    <div key={item.name} className="flex justify-between items-center bg-brand-surface/30 p-3 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-sm font-medium text-slate-400">{item.name}</span>
                                        </div>
                                        <span className="font-bold">${item.value.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </div>

                {/* 4. Smart Match Suggestions */}
                <section>
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-extrabold flex items-center gap-3">
                                <Sparkles className="text-yellow-400" />  Smart Matches
                            </h2>
                            <p className="text-slate-400 mt-1">Recommended influencers based on your brand persona</p>
                        </div>
                        <button className="text-sm font-bold text-primary hover:underline">Explore More Experts</button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {recommendedInfluencers.map((inf, idx) => (
                            <motion.div
                                key={inf.id}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="glass-card p-6 rounded-[2rem] border border-brand-border/30 hover:border-brand-primary/50 transition-all flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary p-0.5">
                                        <div className="w-full h-full bg-brand-surface rounded-2xl flex items-center justify-center text-3xl font-black text-brand-primary">
                                            {inf.name[0]}
                                        </div>
                                    </div>
                                    <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-black px-3 py-1 rounded-full border border-brand-primary/20 uppercase">
                                        {inf.followers > 100000 ? 'High Match' : 'Trending'}
                                    </span>
                                </div>
                                <h4 className="text-xl font-bold">{inf.name}</h4>
                                <p className="text-sm text-slate-500">{inf.category} Guru</p>
                                <div className="grid grid-cols-2 gap-3 my-6">
                                    <div className="bg-brand-surface/50 p-3 rounded-2xl text-center">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">Engagement</p>
                                        <p className="text-lg font-bold text-white">{inf.eng}%</p>
                                    </div>
                                    <div className="bg-brand-surface/50 p-3 rounded-2xl text-center">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">Match</p>
                                        <p className="text-lg font-bold text-brand-primary">{90 + (idx * 3)}%</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-white/5 py-3 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">View Profile</button>
                                    <button className="flex-1 bg-brand-primary text-black py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-brand-primary/20 transition-all">Invite</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

            </main>
        </div >
    );
};



export default BrandDashboard;
