const User = require('../models/User');
const generateToken = require('../config/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, category, niche, engagementRate, followers, companyName, industry, description } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            category,
            niche,
            engagementRate,
            followers,
            companyName,
            industry,
            description
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all influencers
// @route   GET /api/auth/influencers
// @access  Private
const getInfluencers = async (req, res) => {
    try {
        console.log('--- GET INFLUENCERS REQUEST ---');
        let influencers = await User.find({ role: 'Influencer' }).select('-password');
        console.log(`Initial DB check: ${influencers.length} influencers found`);

        if (influencers.length === 0) {
            console.log('Database empty, seeding influencers...');
            const mockInfluencers = [
                { name: 'Alex Rivera', email: 'alex.rivera@example.com', password: 'password123', role: 'Influencer', category: 'Fashion', niche: 'Urban Streetwear', engagementRate: 5.2, followers: 125000 },
                { name: 'Sarah Chen', email: 'sarah.chen@example.com', password: 'password123', role: 'Influencer', category: 'Technology', niche: 'SaaS & Web Dev', engagementRate: 4.8, followers: 85200 },
                { name: 'Marcus Thorne', email: 'marcus.thorne@example.com', password: 'password123', role: 'Influencer', category: 'Fitness', niche: 'CrossFit & Nutrition', engagementRate: 6.1, followers: 210000 },
                { name: 'Elena Rodriguez', email: 'elena.rod@example.com', password: 'password123', role: 'Influencer', category: 'Beauty', niche: 'Clean Beauty', engagementRate: 3.9, followers: 158000 },
                { name: 'David Kim', email: 'david.kim@example.com', password: 'password123', role: 'Influencer', category: 'Lifestyle', niche: 'Minimalist Living', engagementRate: 4.5, followers: 95000 },
                { name: 'Sophie Bennett', email: 'sophie.b@example.com', password: 'password123', role: 'Influencer', category: 'Gaming', niche: 'Retro Gaming', engagementRate: 7.2, followers: 45000 },
                { name: 'James Wilson', email: 'james.w@example.com', password: 'password123', role: 'Influencer', category: 'Technology', niche: 'AI & Machine Learning', engagementRate: 5.5, followers: 112000 },
                { name: 'Aria Gupta', email: 'aria.gupta@example.com', password: 'password123', role: 'Influencer', category: 'Fashion', niche: 'Sustainable Luxury', engagementRate: 4.2, followers: 185000 },
                { name: 'Leo Maxwell', email: 'leo.max@example.com', password: 'password123', role: 'Influencer', category: 'Fitness', niche: 'Yoga & Mindfulness', engagementRate: 5.8, followers: 72000 },
                { name: 'Chloe Taylor', email: 'chloe.t@example.com', password: 'password123', role: 'Influencer', category: 'Beauty', niche: 'Skincare Science', engagementRate: 4.6, followers: 134000 },
                { name: 'Noah Brooks', email: 'noah.b@example.com', password: 'password123', role: 'Influencer', category: 'Lifestyle', niche: 'Digital Nomad', engagementRate: 5.1, followers: 108000 },
                { name: 'Maya Patel', email: 'maya.p@example.com', password: 'password123', role: 'Influencer', category: 'Gaming', niche: 'Indie Games', engagementRate: 6.5, followers: 58000 },
                { name: 'Oliver Scott', email: 'oliver.s@example.com', password: 'password123', role: 'Influencer', category: 'Technology', niche: 'Consumer Electronics', engagementRate: 4.9, followers: 256000 },
                { name: 'Ava Martinez', email: 'ava.m@example.com', password: 'password123', role: 'Influencer', category: 'Fashion', niche: 'Vintage Style', engagementRate: 3.7, followers: 89000 },
                { name: 'Ethan Hunt', email: 'ethan.h@example.com', password: 'password123', role: 'Influencer', category: 'Fitness', niche: 'Bodybuilding', engagementRate: 5.3, followers: 342000 },
                { name: 'Lily Evans', email: 'lily.e@example.com', password: 'password123', role: 'Influencer', category: 'Beauty', niche: 'No-Makeup Makeup', engagementRate: 4.1, followers: 121000 },
                { name: 'Lucas Gray', email: 'lucas.g@example.com', password: 'password123', role: 'Influencer', category: 'Lifestyle', niche: 'Interior Design', engagementRate: 5.9, followers: 167000 },
                { name: 'Zoe Campbell', email: 'zoe.c@example.com', password: 'password123', role: 'Influencer', category: 'Gaming', niche: 'Competitive FPS', engagementRate: 8.1, followers: 76000 },
                { name: 'Ryan Cooper', email: 'ryan.c@example.com', password: 'password123', role: 'Influencer', category: 'Technology', niche: 'Smart Home', engagementRate: 4.4, followers: 64000 },
                { name: 'Isabella Rossi', email: 'isabella.r@example.com', password: 'password123', role: 'Influencer', category: 'Fashion', niche: 'Couture & High Fashion', engagementRate: 5.0, followers: 420000 }
            ];

            for (const mock of mockInfluencers) {
                const userExists = await User.findOne({ email: mock.email });
                if (!userExists) {
                    await User.create(mock);
                    console.log(`Seeded: ${mock.name}`);
                }
            }
            influencers = await User.find({ role: 'Influencer' }).select('-password');
            console.log(`Seeding complete. New count: ${influencers.length}`);
        }

        res.json(influencers);
    } catch (error) {
        console.error('SERVER ERROR in getInfluencers:', error);
        res.status(500).json({ message: 'Internal Server Error: ' + error.message });
    }
};

// @desc    Get all brands
// @route   GET /api/auth/brands
// @access  Private
const getBrands = async (req, res) => {
    try {
        let brands = await User.find({ role: 'Brand' }).select('-password');

        if (brands.length === 0) {
            const mockBrands = [
                { companyName: 'Urban Outfitters', name: 'UO Style', email: 'uo@example.com', password: 'password123', role: 'Brand', industry: 'Fashion', description: 'Global lifestyle retailer' },
                { companyName: 'TechGear Pro', name: 'TG Admin', email: 'techgear@example.com', password: 'password123', role: 'Brand', industry: 'Technology', description: 'Premium tech accessories' },
                { companyName: 'Glow Beauty', name: 'Glow Support', email: 'glow@example.com', password: 'password123', role: 'Brand', industry: 'Cosmetics', description: 'Ethical skincare and beauty' },
                { companyName: 'FitLife Co', name: 'FL Fitness', email: 'fitlife@example.com', password: 'password123', role: 'Brand', industry: 'Health & Fitness', description: 'Advanced fitness nutrition' },
                { companyName: 'EcoWare', name: 'Eco Admin', email: 'ecoware@example.com', password: 'password123', role: 'Brand', industry: 'Sustainable Goods', description: 'Eco-friendly home essentials' }
            ];

            for (const mock of mockBrands) {
                const userExists = await User.findOne({ email: mock.email });
                if (!userExists) {
                    await User.create(mock);
                }
            }
            brands = await User.find({ role: 'Brand' }).select('-password');
        }

        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get brand by ID
// @route   GET /api/auth/brands/:id
// @access  Private
const getBrandById = async (req, res) => {
    try {
        const brand = await User.findById(req.params.id).select('-password');
        if (brand && brand.role === 'Brand') {
            res.json(brand);
        } else {
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get influencer by ID
// @route   GET /api/auth/influencers/:id
// @access  Private
const getInfluencerById = async (req, res) => {
    try {
        const influencer = await User.findById(req.params.id).select('-password');
        if (influencer && influencer.role === 'Influencer') {
            res.json(influencer);
        } else {
            res.status(404).json({ message: 'Influencer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile/update
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            console.log('Update Profile Error: No user in req');
            return res.status(401).json({ message: 'Not authorized, no user data' });
        }

        console.log('Updating profile for user:', req.user._id);
        console.log('Payload:', req.body);

        const user = await User.findById(req.user._id);

        if (user) {
            if (req.body.name !== undefined) user.name = req.body.name;
            if (req.body.email !== undefined) user.email = req.body.email;
            if (req.body.category !== undefined) user.category = req.body.category;
            if (req.body.niche !== undefined) user.niche = req.body.niche;
            if (req.body.followers !== undefined) user.followers = req.body.followers;
            if (req.body.engagementRate !== undefined) user.engagementRate = req.body.engagementRate;
            if (req.body.bio !== undefined) user.bio = req.body.bio;
            if (req.body.instagram !== undefined) user.instagram = req.body.instagram;
            if (req.body.twitter !== undefined) user.twitter = req.body.twitter;
            if (req.body.linkedin !== undefined) user.linkedin = req.body.linkedin;
            if (req.body.youtube !== undefined) user.youtube = req.body.youtube;
            if (req.body.tiktok !== undefined) user.tiktok = req.body.tiktok;
            if (req.body.facebook !== undefined) user.facebook = req.body.facebook;
            if (req.body.website !== undefined) user.website = req.body.website;
            if (req.body.companyName !== undefined) user.companyName = req.body.companyName;
            if (req.body.industry !== undefined) user.industry = req.body.industry;
            if (req.body.description !== undefined) user.description = req.body.description;

            if (req.body.password) {
                user.password = req.body.password;
            }

            try {
                const updatedUser = await user.save();
                res.json({
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    category: updatedUser.category,
                    niche: updatedUser.niche,
                    followers: updatedUser.followers,
                    engagementRate: updatedUser.engagementRate,
                    bio: updatedUser.bio,
                    instagram: updatedUser.instagram,
                    twitter: updatedUser.twitter,
                    linkedin: updatedUser.linkedin,
                    youtube: updatedUser.youtube,
                    tiktok: updatedUser.tiktok,
                    facebook: updatedUser.facebook,
                    website: updatedUser.website,
                    companyName: updatedUser.companyName,
                    industry: updatedUser.industry,
                    description: updatedUser.description,
                    token: generateToken(updatedUser._id),
                });
            } catch (saveError) {
                console.error('Mongoose Save Error:', saveError.message);
                res.status(400).json({ message: `Mongoose Save Error: ${saveError.message}` });
            }
        } else {
            console.log('Update Profile Error: User not found in DB');
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('General Update Profile Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, authUser, getUserProfile, getInfluencers, getInfluencerById, getBrands, getBrandById, updateUserProfile };
