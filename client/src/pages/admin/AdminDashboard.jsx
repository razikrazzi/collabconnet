import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Briefcase, TrendingUp,
    Shield, Search, Filter, Trash2, CheckCircle,
    XCircle, AlertCircle, DollarSign, BarChart3,
    LogOut, Settings, Bell, ChevronRight, Mail, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                const [statsRes, usersRes, campaignsRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/admin/stats', config),
                    axios.get('http://localhost:5001/api/admin/users', config),
                    axios.get('http://localhost:5001/api/admin/campaigns', config)
                ]);

                setStats(statsRes.data);
                setUsers(usersRes.data);
                setCampaigns(campaignsRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching admin data:', err);
                setLoading(false);
            }
        };

        if (user && user.role === 'Admin') {
            fetchAdminData();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5001/api/admin/users/${id}`, config);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const handleDeleteCampaign = async (id) => {
        if (!window.confirm('Are you sure you want to delete this campaign?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5001/api/admin/campaigns/${id}`, config);
            setCampaigns(campaigns.filter(c => c._id !== id));
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const handleUpdateCampaignStatus = async (id, status) => {
        setActionLoading(id);
        console.log(`Attempting to update campaign ${id} to ${status}`);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Use localhost consistently
            const { data } = await axios.put(`http://localhost:5001/api/campaigns/${id}/status`, { status }, config);

            console.log('Update success:', data);

            // Update local state using functional update to avoid stale data issues
            setCampaigns(prevCampaigns =>
                prevCampaigns.map(c => c._id === id ? { ...c, status: data.status } : c)
            );

            // Optional: Success feedback could be added here if needed, but the UI updates anyway
        } catch (err) {
            console.error('Update status error:', err);
            const errMsg = err.response?.data?.message || err.message;
            alert(`Failed to update status: ${errMsg}`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCampaigns = campaigns.filter(c => {
        const matchesSearch = c.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 flex overflow-hidden">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-surface-dark border-r border-border-dark flex flex-col fixed h-screen z-50">
                <div className="p-8 border-b border-border-dark">
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <Shield size={28} />
                        <h1 className="text-xl font-black uppercase tracking-tighter">Admin <span className="text-white">Panel</span></h1>
                    </div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Global Management</p>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    {[
                        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                        { id: 'users', label: 'Users', icon: Users },
                        { id: 'campaigns', label: 'Campaigns', icon: Briefcase },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all group ${activeTab === item.id
                                ? 'bg-primary text-black shadow-lg shadow-primary/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={18} className={activeTab === item.id ? 'stroke-[2.5px]' : 'group-hover:scale-110 transition-transform'} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6 mt-auto border-t border-border-dark">
                    <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all group">
                        <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12 overflow-y-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">
                            {activeTab === 'overview' ? 'Network Overview' :
                                activeTab === 'users' ? 'User Directory' :
                                    activeTab === 'campaigns' ? 'Mission Control' : 'Settings'}
                        </h2>
                        <p className="text-slate-400 font-medium italic">Managing CollabConnect ecosystem v3.1</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-primary/50 transition-all w-64"
                                placeholder="Search everything..."
                            />
                        </div>
                        <button className="bg-white/5 p-4 rounded-2xl border border-white/10 text-slate-400 hover:text-white transition-all transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full" />
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                                {[
                                    { label: 'Total Members', value: stats.totalUsers, icon: Users, color: 'text-blue-400' },
                                    { label: 'Total Missions', value: stats.totalCampaigns, icon: Briefcase, color: 'text-purple-400' },
                                    { label: 'Active Economy', value: `$${stats.totalBudget?.toLocaleString()}`, icon: DollarSign, color: 'text-green-400' },
                                    { label: 'Live Systems', value: '100%', icon: TrendingUp, color: 'text-primary' },
                                ].map((stat, i) => (
                                    <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
                                        <stat.icon className={`mb-6 ${stat.color}`} size={24} />
                                        <p className="text-4xl font-black text-white leading-none mb-2">{stat.value}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="glass p-10 rounded-[3rem] border border-white/5">
                                    <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                                        <Users className="text-primary" /> Recent Registrations
                                    </h3>
                                    <div className="space-y-6">
                                        {users.slice(0, 5).map(u => (
                                            <div key={u._id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-surface-dark flex items-center justify-center font-black text-primary border border-white/5">
                                                        {u.name?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">{u.name}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase font-black">{u.role}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => navigate('/admin/users')} className="text-slate-400 hover:text-white"><ChevronRight size={18} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass p-10 rounded-[3rem] border border-white/5">
                                    <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                                        <Briefcase className="text-secondary" /> Latest Campaigns
                                    </h3>
                                    <div className="space-y-6">
                                        {campaigns.slice(0, 5).map(c => (
                                            <div key={c._id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-surface-dark flex items-center justify-center font-black text-secondary border border-white/5">
                                                        {c.title?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm truncate w-32">{c.title}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase font-black">${c.budget?.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${c.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                                                        c.status === 'Rejected' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-500'
                                                        }`}>
                                                        {c.status}
                                                    </span>
                                                    {c.status === 'Pending' && (
                                                        <div className="flex gap-2.5 mt-2">
                                                            <button
                                                                disabled={actionLoading === c._id}
                                                                onClick={() => handleUpdateCampaignStatus(c._id, 'Active')}
                                                                className={`text-green-500 hover:text-green-400 transition-all ${actionLoading === c._id ? 'opacity-30 cursor-wait' : 'hover:scale-125'}`}
                                                                title="Activate"
                                                            >
                                                                {actionLoading === c._id ? <div className="w-3 h-3 border border-green-500 border-t-transparent rounded-full animate-spin" /> : <CheckCircle size={14} />}
                                                            </button>
                                                            <button
                                                                disabled={actionLoading === c._id}
                                                                onClick={() => handleUpdateCampaignStatus(c._id, 'Rejected')}
                                                                className={`text-red-500 hover:text-red-400 transition-all ${actionLoading === c._id ? 'opacity-30 cursor-wait' : 'hover:scale-125'}`}
                                                                title="Reject"
                                                            >
                                                                {actionLoading === c._id ? <div className="w-3 h-3 border border-red-500 border-t-transparent rounded-full animate-spin" /> : <XCircle size={14} />}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'users' && (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass rounded-[3rem] border border-white/5 overflow-hidden"
                        >
                            <table className="w-full text-left">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Name</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Email</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Role</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Date Joined</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredUsers.map(u => (
                                        <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-surface-dark flex items-center justify-center text-xs font-black text-primary border border-white/5 capitalize">
                                                        {u.name?.[0]}
                                                    </div>
                                                    <span className="font-bold text-sm">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm text-slate-400">{u.email}</td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'Brand' ? 'text-secondary' : 'text-primary'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-sm text-slate-400">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all"><Mail size={16} /></button>
                                                    <button onClick={() => handleDeleteUser(u._id)} className="p-2 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}

                    {activeTab === 'campaigns' && (
                        <motion.div
                            key="campaigns"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            {/* Status Filter Buttons */}
                            <div className="flex gap-3 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
                                {['All', 'Pending', 'Active', 'Rejected'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status
                                                ? 'bg-primary text-black shadow-lg shadow-primary/20'
                                                : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredCampaigns.map(c => (
                                    <div key={c._id} className="glass rounded-[3rem] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden flex flex-col h-full bg-gradient-to-br from-white/[0.02] to-transparent">
                                        {/* Campaign Image Header */}
                                        <div className="relative h-40 overflow-hidden">
                                            {c.image ? (
                                                <img
                                                    src={c.image}
                                                    alt={c.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-80"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
                                            
                                            <button 
                                                onClick={() => handleDeleteCampaign(c._id)} 
                                                className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-xl text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 z-20"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-surface-dark border border-white/5 flex items-center justify-center font-black text-secondary text-xl overflow-hidden shadow-xl">
                                                    {c.brand?.profileImage ? (
                                                        <img src={c.brand.profileImage} alt={c.brand.companyName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        c.brand?.companyName?.[0] || c.title[0]
                                                    )}
                                                </div>
                                                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${c.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                                                    c.status === 'Rejected' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-500'
                                                    }`}>
                                                    {c.status}
                                                </span>
                                            </div>
                                            
                                            <h4 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-primary transition-colors">{c.title}</h4>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6 px-1">By {c.brand?.companyName || 'Unknown Brand'}</p>

                                            <div className="mt-auto border-t border-white/5 pt-6">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Budget</p>
                                                        <p className="text-xl font-black text-white">${c.budget?.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {c.status === 'Pending' && (
                                            <div className="p-8 pt-0 grid grid-cols-2 gap-4">
                                                <button
                                                    disabled={actionLoading === c._id}
                                                    onClick={() => handleUpdateCampaignStatus(c._id, 'Active')}
                                                    className={`flex items-center justify-center gap-2 py-4 bg-primary text-black rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 ${actionLoading === c._id ? 'opacity-50 cursor-wait' : ''}`}
                                                >
                                                    {actionLoading === c._id ? (
                                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <>
                                                            <CheckCircle size={16} />
                                                            Activate
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    disabled={actionLoading === c._id}
                                                    onClick={() => handleUpdateCampaignStatus(c._id, 'Rejected')}
                                                    className={`flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95 transition-all ${actionLoading === c._id ? 'opacity-50 cursor-wait' : ''}`}
                                                >
                                                    {actionLoading === c._id ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <>
                                                            <XCircle size={16} />
                                                            Reject
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminDashboard;
