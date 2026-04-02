const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Campaign = require('./models/Campaign');
const User = require('./models/User');

dotenv.config();

const seedCampaigns = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seed...');

        // Find a brand to assign campaigns to
        const brand = await User.findOne({ role: 'Brand' });
        if (!brand) {
            console.log('No brand found. Please register a brand account first.');
            process.exit(1);
        }

        const mockCampaigns = [
            {
                brand: brand._id,
                title: 'Summer Fashion Launch 2026',
                description: 'Join us in promoting our new sustainable summer collection. We are looking for fashion-forward creators who value ethics and style.',
                budget: 2500,
                timeline: new Date('2026-06-01'),
                category: 'Fashion',
                platform: ['Instagram', 'TikTok'],
                goals: ['Brand Awareness', 'Social Engagement'],
                status: 'Active'
            },
            {
                brand: brand._id,
                title: 'Next-Gen Gaming Review',
                description: 'We are launching a new high-performance gaming laptop. We need tech enthusiasts to test and review the product on YouTube and Twitch.',
                budget: 8500,
                timeline: new Date('2026-04-15'),
                category: 'Technology',
                platform: ['YouTube', 'Twitch'],
                goals: ['Product Review', 'Direct Sales'],
                status: 'Pending'
            },
            {
                brand: brand._id,
                title: 'Urban Lifestyle Photography',
                description: 'Showcase our new urban accessories in daily life settings. Aim for a minimalist, premium aesthetic.',
                budget: 1200,
                timeline: new Date('2026-05-10'),
                category: 'Lifestyle',
                platform: ['Instagram'],
                goals: ['Content Creation'],
                status: 'Active'
            }
        ];

        await Campaign.deleteMany({ brand: brand._id }); // Clean up old seeds for this brand
        const created = await Campaign.insertMany(mockCampaigns);
        console.log(`✅ Successfully seeded ${created.length} campaigns for brand: ${brand.name}`);

        process.exit();
    } catch (err) {
        console.error('❌ Error seeding campaigns:', err);
        process.exit(1);
    }
};

seedCampaigns();
