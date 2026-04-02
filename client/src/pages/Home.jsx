import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('Brand');

    const brandSteps = [
        { icon: 'add_circle', title: 'Create', desc: 'Post your campaign brief and set your budget.' },
        { icon: 'recommend', title: 'Recommend', desc: 'Review AI-matched influencer profiles.' },
        { icon: 'handshake', title: 'Collaborate', desc: 'Chat, negotiate, and approve creative assets.' },
        { icon: 'monitoring', title: 'Track', desc: 'Monitor live engagement and performance.' },
        { icon: 'payments', title: 'Pay', desc: 'Release payments automatically via escrow.' }
    ];

    const influencerSteps = [
        { icon: 'account_circle', title: 'Join', desc: 'Create your profile and showcase your reach.' },
        { icon: 'search', title: 'Discover', desc: 'Browse campaigns that align with your brand.' },
        { icon: 'send', title: 'Apply', desc: 'Pitch your ideas directly to top brands.' },
        { icon: 'edit_square', title: 'Create', desc: 'Deliver authentic content for your audience.' },
        { icon: 'account_balance_wallet', title: 'Earn', desc: 'Get paid instantly upon content approval.' }
    ];

    const currentSteps = role === 'Brand' ? brandSteps : influencerSteps;

    return (
        <div className="relative flex min-h-screen w-full flex-col font-display bg-background-dark text-slate-100 antialiased overflow-x-hidden">
            {/* Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-border-dark px-6 md:px-20 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary cursor-pointer" onClick={() => navigate('/')}>

                        <h2 className="text-xl font-bold tracking-tight">CollabConnect</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-sm font-medium hover:text-primary transition-colors cursor-pointer" href="#about">About</a>
                        <a className="text-sm font-medium hover:text-primary transition-colors cursor-pointer" href="#features">Features</a>
                        <a className="text-sm font-medium hover:text-primary transition-colors cursor-pointer" href="#how-it-works">How it Works</a>
                        <a className="text-sm font-medium hover:text-primary transition-colors cursor-pointer" href="#pricing">Pricing</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button
                            className="hidden sm:flex text-sm font-bold px-4 py-2 hover:text-primary transition-colors whitespace-nowrap"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                        <button
                            className="bg-primary text-background-dark px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-all whitespace-nowrap"
                            onClick={() => navigate('/login')}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 pt-20">
                {/* Hero Section */}
                <section className="mesh-gradient relative overflow-hidden py-24 md:py-32 px-6">
                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            NEW: DRIVEN MATCHING 2.0
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-8">
                            Connect. Collaborate.<br /><span className="text-primary">Create Impact.</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed">
                            The ultimate influencer-brand collaboration platform designed to drive authentic engagement and deliver measurable ROI through data-backed partnerships.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                className="w-full sm:w-auto px-8 py-4 bg-primary text-background-dark font-bold rounded-xl text-lg hover:shadow-[0_0_20px_rgba(19,200,236,0.4)] transition-all"
                                onClick={() => navigate('/login')}
                            >
                                Start
                            </button>
                            <button
                                className="w-full sm:w-auto px-8 py-4 bg-surface-dark border border-border-dark text-white font-bold rounded-xl text-lg hover:bg-border-dark transition-all"
                                onClick={() => navigate('/login')}
                            >
                                Explore Campaigns
                            </button>
                        </div>
                    </div>
                    {/* Abstract element */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full filter blur-[120px]"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full filter blur-[120px]"></div>
                    </div>
                </section>


                {/* Features Section */}
                <section className="py-24 bg-background-dark/50 px-6 border-b border-border-dark/30" id="features">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Powerful Features</h2>
                            <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to run high-performing campaigns at scale without the administrative headache.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Feature 1 */}

                            {/* Feature 2 */}
                            <div className="p-8 bg-surface-dark border border-border-dark rounded-2xl hover:border-primary transition-all group">
                                <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:scale-110 transition-transform">task_alt</span>
                                <h4 className="text-xl font-bold mb-3 text-white">Campaign Management</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">End-to-end workflow control from initial brief to final approval, all within a unified intuitive dashboard.</p>
                            </div>
                            {/* Feature 3 */}
                            <div className="p-8 bg-surface-dark border border-border-dark rounded-2xl hover:border-primary transition-all group">
                                <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:scale-110 transition-transform">forum</span>
                                <h4 className="text-xl font-bold mb-3 text-white">Real-Time Collaboration</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">Built-in messaging and asset sharing tools that eliminate the need for endless email threads.</p>
                            </div>
                            {/* Feature 4 */}
                            <div className="p-8 bg-surface-dark border border-border-dark rounded-2xl hover:border-primary transition-all group">
                                <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:scale-110 transition-transform">security</span>
                                <h4 className="text-xl font-bold mb-3 text-white">Secure Payments</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">Escrow-protected transactions ensure creators get paid and brands get quality deliverables on time.</p>
                            </div>
                            {/* Feature 5 */}
                            <div className="p-8 bg-surface-dark border border-border-dark rounded-2xl hover:border-primary transition-all group">
                                <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:scale-110 transition-transform">notifications_active</span>
                                <h4 className="text-xl font-bold mb-3 text-white">Instant Notifications</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">Stay updated on every milestone with cross-platform alerts for new messages, approvals, and payouts.</p>
                            </div>
                            {/* Feature 6 */}
                            <div className="p-8 bg-surface-dark border border-border-dark rounded-2xl hover:border-primary transition-all group">
                                <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:scale-110 transition-transform">analytics</span>
                                <h4 className="text-xl font-bold mb-3 text-white">Deep Analytics</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">Comprehensive tracking of reach, engagement, and conversion metrics to measure true campaign impact.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-24 px-6 bg-background-dark" id="how-it-works">
                    <div className="max-w-7xl mx-auto text-slate-100">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-8">How It Works</h2>
                            <div className="inline-flex p-1 bg-surface-dark border border-border-dark rounded-xl">
                                <button
                                    onClick={() => setRole('Brand')}
                                    className={`px-6 py-2 font-bold rounded-lg transition-all ${role === 'Brand' ? 'bg-primary text-background-dark' : 'text-slate-400 hover:text-white'}`}
                                >
                                    For Brands
                                </button>
                                <button
                                    onClick={() => setRole('Influencer')}
                                    className={`px-6 py-2 font-bold rounded-lg transition-all ${role === 'Influencer' ? 'bg-primary text-background-dark' : 'text-slate-400 hover:text-white'}`}
                                >
                                    For Influencers
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border-dark -translate-y-1/2 hidden lg:block"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
                                {currentSteps.map((step, index) => (
                                    <div key={index} className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-background-dark border-2 border-primary rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(19,200,236,0.2)]">
                                            <span className="material-symbols-outlined text-primary text-2xl">{step.icon}</span>
                                        </div>
                                        <h5 className="font-bold mb-2">{step.title}</h5>
                                        <p className="text-slate-500 text-sm">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Metrics */}
                <section className="bg-primary/5 py-16 border-y border-border-dark/30 px-6">
                    <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 md:gap-24">
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-3xl text-primary">verified</span>
                            <div>
                                <p className="text-2xl font-bold text-white">98%</p>
                                <p className="text-slate-500 text-xs uppercase tracking-widest">Brand Satisfaction</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-3xl text-primary">groups</span>
                            <div>
                                <p className="text-2xl font-bold text-white">50k+</p>
                                <p className="text-slate-500 text-xs uppercase tracking-widest">Active Creators</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-3xl text-primary">bolt</span>
                            <div>
                                <p className="text-2xl font-bold text-white">24hr</p>
                                <p className="text-slate-500 text-xs uppercase tracking-widest">Avg. Match Time</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-3xl text-primary">account_balance_wallet</span>
                            <div>
                                <p className="text-2xl font-bold text-white">$12M+</p>
                                <p className="text-slate-500 text-xs uppercase tracking-widest">Paid to Creators</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 px-6 relative bg-background-dark">
                    <div className="max-w-5xl mx-auto p-12 md:p-20 rounded-3xl bg-gradient-to-br from-primary via-secondary to-purple-600 relative overflow-hidden text-center text-background-dark">
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Ready to scale your influence?</h2>
                            <p className="text-lg md:text-xl font-medium mb-12 opacity-90 max-w-2xl mx-auto">
                                Join thousands of brands and influencers already building the future of marketing on CollabConnect.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <button className="group bg-background-dark text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-900 transition-all flex items-center gap-2" onClick={() => navigate('/login')}>
                                    Sign Up as Brand

                                </button>
                                <button className="bg-white/20 backdrop-blur-md border border-white/40 text-background-dark px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all" onClick={() => navigate('/login')}>
                                    Join as Influencer
                                </button>
                            </div>
                        </div>
                        {/* Grid Pattern */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <defs>
                                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
                                    </pattern>
                                </defs>
                                <rect width="100" height="100" fill="url(#grid)"></rect>
                            </svg>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-background-dark border-t border-border-dark py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 text-primary mb-6">

                            <h2 className="text-lg font-bold tracking-tight text-white">CollabConnect</h2>
                        </div>
                        <p className="text-slate-500 text-sm mb-6 max-w-xs">
                            The world's leading influencer marketing platform for authentic brand-creator partnerships.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-slate-500 hover:text-primary"><span className="material-symbols-outlined">share</span></a>
                            <a href="#" className="text-slate-500 hover:text-primary"><span className="material-symbols-outlined">public</span></a>
                            <a href="#" className="text-slate-500 hover:text-primary"><span className="material-symbols-outlined">mail</span></a>
                        </div>
                    </div>
                    <div>
                        <h6 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-100">Platform</h6>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-primary transition-colors">Find Influencers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Campaign Manager</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Analytics Engine</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-100">Company</h6>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Press Kit</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-100">Support</h6>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border-dark flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
                    <p>© 2024 CollabConnect Inc. All rights reserved.</p>
                    <span>Designed for the modern creator economy.</span>
                </div>
            </footer>
        </div>
    );
};

export default Home;
