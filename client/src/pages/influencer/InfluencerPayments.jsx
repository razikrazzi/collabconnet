import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign, Clock, CheckCircle2, AlertCircle,
    ChevronRight, Search, Filter, ArrowUpRight,
    Wallet, ShieldCheck, Download, ExternalLink,
    Briefcase, Building2, TrendingUp, ArrowDownLeft,
    Zap
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const InfluencerPayments = () => {
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchPayments = useCallback(async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/payments', config);
            setPayments(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching payments:', err);
            setLoading(false);
        }
    }, [user.token]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const totalEarned = payments.reduce((acc, p) => acc + (p.status === 'Released' ? p.amount : 0), 0);
    const pendingRelease = payments.reduce((acc, p) => acc + (p.status === 'Pending' ? p.amount : 0), 0);
    const availableBalance = totalEarned; // For demo/mvp, same as total earned for now

    const filteredPayments = payments.filter(p => {
        const brandName = p.brand?.companyName || p.brand?.name || 'Unknown Brand';
        const campaignTitle = p.campaign?.title || 'Unknown Campaign';
        const matchesSearch = brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaignTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = [
        { label: 'Total Earned', value: `$${totalEarned.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500' },
        { label: 'Pending Release', value: `$${pendingRelease.toLocaleString()}`, icon: Clock, color: 'text-amber-500' },
        { label: 'Available Balance', value: `$${availableBalance.toLocaleString()}`, icon: Wallet, color: 'text-primary' }
    ];

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 mesh-gradient pb-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-24 space-y-10">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                            <ShieldCheck size={14} /> Creator Wallet
                        </div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter">
                            My <span className="text-primary">Earnings</span>
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg font-medium">Track your collaboration income and settlement status.</p>
                    </div>

                    <div className="flex gap-4">
                        <button className="glass-card px-8 py-4 rounded-3xl border border-white/5 flex items-center gap-3 bg-primary text-black font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20">
                            <ArrowDownLeft size={18} /> Withdraw Funds
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-white/5 flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} border border-white/10`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                                <p className="text-3xl font-black italic">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto">
                        {['All', 'Pending', 'Released'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`flex-1 md:flex-none px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search brands or campaigns..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Payments List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="py-40 text-center">
                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
                            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Syncing Ledger...</p>
                        </div>
                    ) : (
                        <AnimatePresence mode='popLayout'>
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment, idx) => (
                                    <motion.div
                                        key={payment._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="glass-card group p-6 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all flex flex-col lg:flex-row items-center gap-8 bg-gradient-to-r from-white/[0.02] to-transparent"
                                    >
                                        {/* Brand Info */}
                                        <div className="flex items-center gap-5 min-w-[300px]">
                                            <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform">
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                {payment.brand?.profileImage ? (
                                                    <img src={payment.brand.profileImage} alt={payment.brand?.companyName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Building2 size={32} />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-tight text-white">{payment.brand?.companyName || payment.brand?.name || 'Brand Partner'}</h3>
                                                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] mt-1">
                                                    <Building2 size={12} className="text-primary" /> Verified Brand Partner
                                                </div>
                                            </div>
                                        </div>

                                        {/* Campaign Info */}
                                        <div className="flex-1 text-center lg:text-left space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center justify-center lg:justify-start gap-2">
                                                <Briefcase size={12} /> Collaborative Mission
                                            </p>
                                            <h4 className="text-lg font-black text-white italic">{payment.campaign?.title || 'Mission Record'}</h4>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center justify-center lg:justify-start gap-2">
                                                <Clock size={12} /> Logged On {new Date(payment.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {/* Financial Details */}
                                        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-10 lg:gap-1">
                                            <div className="text-center lg:text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Settlement Amount</p>
                                                <p className={`text-3xl font-black italic ${payment.status === 'Released' ? 'text-emerald-500' : 'text-primary'}`}>+${payment.amount?.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Status Button */}
                                        <div className="w-full lg:w-auto min-w-[220px]">
                                            {payment.status === 'Released' ? (
                                                <div className="w-full py-5 rounded-3xl border-2 border-emerald-500/20 text-emerald-500 font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 bg-emerald-500/5">
                                                    <CheckCircle2 size={18} /> In Wallet
                                                </div>
                                            ) : (
                                                <div className="w-full py-5 rounded-3xl border border-amber-500/20 text-amber-500 font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 bg-amber-500/5">
                                                    <Clock size={18} /> Awaiting Release
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-32 text-center glass-card rounded-[3rem] border border-white/5">
                                    <AlertCircle size={48} className="mx-auto text-slate-700 mb-6" />
                                    <h3 className="text-2xl font-black uppercase italic">No Income Data</h3>
                                    <p className="text-slate-500 mt-2 font-medium">Your financial history will appear here once missions are completed.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    )}
                </div>

                {/* Footer Notice */}
                <div className="flex items-center gap-4 bg-white/5 p-6 rounded-[2rem] border border-white/5 opacity-60 italic">
                    <Zap size={20} className="text-primary" />
                    <p className="text-xs font-medium text-slate-400 text-center mx-auto">
                        Settlements are processed automatically once the brand manager verifies deliverables.
                        Funds are held in secure escrow until the release protocol is initiated.
                        For support regarding specific missions, please use the campaign chat terminal.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default InfluencerPayments;
