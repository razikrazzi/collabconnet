import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrandDashboard from './pages/brand/BrandDashboard';
import CreateCampaign from './pages/brand/CreateCampaign';
import BrandPayments from './pages/brand/BrandPayments';
import WorkReview from './pages/brand/WorkReview';
import RecommendedInfluencers from './pages/brand/RecommendedInfluencers';
import BrandCampaignDetails from './pages/brand/BrandCampaignDetails';
import InfluencerDashboard from './pages/influencer/InfluencerDashboard';
import ChatPage from './pages/ChatPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import CampaignDetails from './pages/influencer/CampaignDetails';
import DiscoverInfluencers from './pages/brand/DiscoverInfluencers';
import CampaignManagement from './pages/brand/CampaignManagement';
import Applications from './pages/brand/Applications';
import InfluencerProfile from './pages/influencer/InfluencerProfile';
import DiscoverCampaigns from './pages/influencer/DiscoverCampaigns';
import MyApplications from './pages/influencer/MyApplications';
import BrandRequests from './pages/influencer/BrandRequests';
import InfluencerPayments from './pages/influencer/InfluencerPayments';
import CampaignWorkspace from './pages/influencer/CampaignWorkspace';
import BrandProfileView from './pages/influencer/BrandProfileView';
import BrandProfile from './pages/brand/BrandProfile';
import CampaignApply from './pages/influencer/CampaignApply';
import InfluencerWorkshop from './pages/influencer/InfluencerWorkshop';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-background-dark text-slate-100">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Brand Routes */}
                        <Route path="/brand/dashboard" element={
                            <ProtectedRoute role="Brand">
                                <BrandDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/brand/profile" element={
                            <ProtectedRoute role="Brand">
                                <BrandProfile />
                            </ProtectedRoute>
                        } />
                        <Route path="/brand/create-campaign" element={
                            <ProtectedRoute role="Brand">
                                <CreateCampaign />
                            </ProtectedRoute>
                        } />
                        <Route path="/brand/match/:id" element={
                            <ProtectedRoute role="Brand">
                                <RecommendedInfluencers />
                            </ProtectedRoute>
                        } />
                        <Route path="/brand/discover" element={
                            <ProtectedRoute role="Brand">
                                <DiscoverInfluencers />
                            </ProtectedRoute>
                        } />
                        <Route path="/brand/campaigns" element={
                            <ProtectedRoute role="Brand">
                                <CampaignManagement />
                            </ProtectedRoute>
                        } />
                        <Route path="/brand/applications" element={
                            <ProtectedRoute role="Brand">
                                <Applications />
                            </ProtectedRoute>
                        } />
                        <Route path="/brand/influencer/:id" element={
                            <ProtectedRoute role="Brand">
                                <InfluencerProfile />
                            </ProtectedRoute>
                        } />
                        <Route path="/brand/payments" element={
                            <ProtectedRoute role="Brand">
                                <BrandPayments />
                            </ProtectedRoute>
                        } />
                        <Route path="/brand/campaign/:id" element={
                            <ProtectedRoute role="Brand">
                                <BrandCampaignDetails />
                            </ProtectedRoute>
                        } />
                        <Route path="/brand/review/:id" element={
                            <ProtectedRoute role="Brand">
                                <WorkReview />
                            </ProtectedRoute>
                        } />

                        {/* Influencer Routes */}
                        <Route path="/influencer/dashboard" element={
                            <ProtectedRoute role="Influencer">
                                <InfluencerDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/influencer/campaign/:id" element={
                            <ProtectedRoute role="Influencer">
                                <CampaignDetails />
                            </ProtectedRoute>
                        } />

                        <Route path="/influencer/discover-campaigns" element={
                            <ProtectedRoute role="Influencer">
                                <DiscoverCampaigns />
                            </ProtectedRoute>
                        } />
                        <Route path="/influencer/myapplications" element={
                            <ProtectedRoute role="Influencer">
                                <MyApplications />
                            </ProtectedRoute>
                        } />
                        <Route path="/influencer/requests" element={
                            <ProtectedRoute role="Influencer">
                                <BrandRequests />
                            </ProtectedRoute>
                        } />
                        <Route path="/influencer/payments" element={
                            <ProtectedRoute role="Influencer">
                                <InfluencerPayments />
                            </ProtectedRoute>
                        } />
                        <Route path="/influencer/workspace/:id" element={
                            <ProtectedRoute role="Influencer">
                                <CampaignWorkspace />
                            </ProtectedRoute>
                        } />
                        <Route path="/influencer/workshop" element={
                            <ProtectedRoute role="Influencer">
                                <InfluencerWorkshop />
                            </ProtectedRoute>
                        } />
                        <Route path="/influencer/brand/:id" element={
                            <ProtectedRoute role="Influencer">
                                <BrandProfileView />
                            </ProtectedRoute>
                        } />
                        <Route path="/influencer/apply/:id" element={
                            <ProtectedRoute role="Influencer">
                                <CampaignApply />
                            </ProtectedRoute>
                        } />

                        {/* Shared Protected Routes */}
                        <Route path="/chat" element={
                            <ProtectedRoute>
                                <ChatPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/notifications" element={
                            <ProtectedRoute>
                                <NotificationsPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        } />

                        {/* Admin Routes */}
                        <Route path="/admin/dashboard" element={
                            <ProtectedRoute role="Admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
