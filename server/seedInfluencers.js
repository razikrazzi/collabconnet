const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

console.log('--- SCRIPT STARTING ---');
dotenv.config();

const influencers = [
    {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Fashion',
        niche: 'Urban Streetwear',
        engagementRate: 5.2,
        followers: 125000,
        description: 'Street style enthusiast and urban photographer.'
    },
    {
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Technology',
        niche: 'SaaS & Web Dev',
        engagementRate: 4.8,
        followers: 85200,
        description: 'Tech reviewer and software engineer sharing the latest in Web3.'
    },
    {
        name: 'Marcus Thorne',
        email: 'marcus.thorne@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Fitness',
        niche: 'CrossFit & Nutrition',
        engagementRate: 6.1,
        followers: 210000,
        description: 'Professional athlete helping you reach your peak performance.'
    },
    {
        name: 'Elena Rodriguez',
        email: 'elena.rod@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Beauty',
        niche: 'Clean Beauty',
        engagementRate: 3.9,
        followers: 158000,
        description: 'Eco-conscious beauty expert and makeup artist.'
    },
    {
        name: 'David Kim',
        email: 'david.kim@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Lifestyle',
        niche: 'Minimalist Living',
        engagementRate: 4.5,
        followers: 95000,
        description: 'Curating a life of simplicity and intentionality.'
    },
    {
        name: 'Sophie Bennett',
        email: 'sophie.b@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Gaming',
        niche: 'Retro Gaming',
        engagementRate: 7.2,
        followers: 45000,
        description: 'Twitch partner and retro gaming collector.'
    },
    {
        name: 'James Wilson',
        email: 'james.w@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Technology',
        niche: 'AI & Machine Learning',
        engagementRate: 5.5,
        followers: 112000,
        description: 'Decoding the future of artificial intelligence.'
    },
    {
        name: 'Aria Gupta',
        email: 'aria.gupta@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Fashion',
        niche: 'Sustainable Luxury',
        engagementRate: 4.2,
        followers: 185000,
        description: 'Bridging the gap between high fashion and sustainability.'
    },
    {
        name: 'Leo Maxwell',
        email: 'leo.max@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Fitness',
        niche: 'Yoga & Mindfulness',
        engagementRate: 5.8,
        followers: 72000,
        description: 'Holistic health coach and yoga instructor.'
    },
    {
        name: 'Chloe Taylor',
        email: 'chloe.t@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Beauty',
        niche: 'Skincare Science',
        engagementRate: 4.6,
        followers: 134000,
        description: 'Product formulation expert and skincare educator.'
    },
    {
        name: 'Noah Brooks',
        email: 'noah.b@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Lifestyle',
        niche: 'Digital Nomad',
        engagementRate: 5.1,
        followers: 108000,
        description: 'Working from anywhere and sharing the journey.'
    },
    {
        name: 'Maya Patel',
        email: 'maya.p@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Gaming',
        niche: 'Indie Games',
        engagementRate: 6.5,
        followers: 58000,
        description: 'Spotlighting hidden gems in the indie gaming scene.'
    },
    {
        name: 'Oliver Scott',
        email: 'oliver.s@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Technology',
        niche: 'Consumer Electronics',
        engagementRate: 4.9,
        followers: 256000,
        description: 'Honest reviews of the latest gadgets and gear.'
    },
    {
        name: 'Ava Martinez',
        email: 'ava.m@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Fashion',
        niche: 'Vintage Style',
        engagementRate: 3.7,
        followers: 89000,
        description: 'Reviving the best looks from the 70s and 80s.'
    },
    {
        name: 'Ethan Hunt',
        email: 'ethan.h@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Fitness',
        niche: 'Bodybuilding',
        engagementRate: 5.3,
        followers: 342000,
        description: 'Competitive bodybuilder and fitness entrepreneur.'
    },
    {
        name: 'Lily Evans',
        email: 'lily.e@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Beauty',
        niche: 'No-Makeup Makeup',
        engagementRate: 4.1,
        followers: 121000,
        description: 'Mastering the art of natural beauty.'
    },
    {
        name: 'Lucas Gray',
        email: 'lucas.g@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Lifestyle',
        niche: 'Interior Design',
        engagementRate: 5.9,
        followers: 167000,
        description: 'Transforming spaces with modern aesthetics.'
    },
    {
        name: 'Zoe Campbell',
        email: 'zoe.c@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Gaming',
        niche: 'Competitive FPS',
        engagementRate: 8.1,
        followers: 76000,
        description: 'Pro gamer and esports commentator.'
    },
    {
        name: 'Ryan Cooper',
        email: 'ryan.c@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Technology',
        niche: 'Smart Home',
        engagementRate: 4.4,
        followers: 64000,
        description: 'Building the ultimate connected home experience.'
    },
    {
        name: 'Isabella Rossi',
        email: 'isabella.r@example.com',
        password: 'password123',
        role: 'Influencer',
        category: 'Fashion',
        niche: 'Couture & High Fashion',
        engagementRate: 5.0,
        followers: 420000,
        description: 'Runway model and fashion consultant.'
    }
];

const seedDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4,
        });
        console.log('MongoDB Connected...');

        for (const influencer of influencers) {
            const userExists = await User.findOne({ email: influencer.email });
            if (!userExists) {
                await User.create(influencer);
                console.log(`Created: ${influencer.name}`);
            } else {
                console.log(`Exists: ${influencer.name}`);
            }
        }

        console.log('Seeding complete!');
    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Connection closed.');
    }
};

seedDB();
