const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Campaign = require('./models/Campaign');

dotenv.config();

// ─────────────────────────────────────────────
// 10 Real-world-inspired Brand accounts
// ─────────────────────────────────────────────
const brandData = [
  {
    name: 'Zara Collective',
    email: 'brand@zaracollective.com',
    password: 'Brand@1234',
    role: 'Brand',
    companyName: 'Zara Collective Pvt. Ltd.',
    industry: 'Fashion',
    description: 'A forward-thinking fashion label blending sustainable fabrics with contemporary streetwear aesthetics.',
    profileImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop',
    website: 'https://zaracollective.com',
  },
  {
    name: 'TechVerse',
    email: 'brand@techverse.io',
    password: 'Brand@1234',
    role: 'Brand',
    companyName: 'TechVerse Inc.',
    industry: 'Technology',
    description: 'Innovative consumer electronics brand pushing the boundaries of AI-powered gadgets and smart home devices.',
    profileImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    website: 'https://techverse.io',
  },
  {
    name: 'Glow & Bloom',
    email: 'brand@glowandbloom.co',
    password: 'Brand@1234',
    role: 'Brand',
    companyName: 'Glow & Bloom Cosmetics',
    industry: 'Beauty',
    description: 'Clean beauty brand formulated with botanical extracts and cruelty-free ingredients for radiant skin.',
    profileImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
    website: 'https://glowandbloom.co',
  },
  {
    name: 'Peak Performance',
    email: 'brand@peakperformance.fit',
    password: 'Brand@1234',
    role: 'Brand',
    companyName: 'Peak Performance Athletics',
    industry: 'Fitness',
    description: 'Premium sports nutrition and activewear brand designed for serious athletes and fitness enthusiasts.',
    profileImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop',
    website: 'https://peakperformance.fit',
  },
  {
    name: 'Wanderlust Stays',
    email: 'brand@wanderluststays.com',
    password: 'Brand@1234',
    role: 'Brand',
    companyName: 'Wanderlust Hospitality Group',
    industry: 'Travel',
    description: 'Curated boutique travel experiences and luxury stays connecting adventurers to hidden gems worldwide.',
    profileImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop',
    website: 'https://wanderluststays.com',
  },
  {
    name: 'ForkStory',
    email: 'brand@forkstory.in',
    password: 'Brand@1234',
    role: 'Brand',
    companyName: 'ForkStory Foods Pvt. Ltd.',
    industry: 'Food',
    description: 'Artisan food brand celebrating regional flavors with ready-to-eat gourmet meals and cooking kits.',
    profileImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
    website: 'https://forkstory.in',
  },
  {
    name: 'UrbanNest',
    email: 'brand@urbannest.design',
    password: 'Brand@1234',
    role: 'Brand',
    companyName: 'UrbanNest Lifestyle',
    industry: 'Lifestyle',
    description: 'Minimalist home décor and lifestyle brand bringing Scandinavian design sensibilities to modern urban living.',
    profileImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    website: 'https://urbannest.design',
  },
  {
    name: 'PixelRush Gaming',
    email: 'brand@pixelrush.gg',
    password: 'Brand@1234',
    role: 'Brand',
    companyName: 'PixelRush Entertainment',
    industry: 'Gaming',
    description: 'Next-generation gaming peripherals and accessories engineered for competitive esports and casual gamers alike.',
    profileImage: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop',
    website: 'https://pixelrush.gg',
  },
  {
    name: 'SolarStride',
    email: 'brand@solarstride.eco',
    password: 'Brand@1234',
    role: 'Brand',
    companyName: 'SolarStride Sustainable Co.',
    industry: 'Lifestyle',
    description: 'Eco-conscious footwear brand crafting stylish shoes from upcycled ocean plastics and natural rubber.',
    profileImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    website: 'https://solarstride.eco',
  },
  {
    name: 'MindfulMate',
    email: 'brand@mindfulmate.app',
    password: 'Brand@1234',
    role: 'Brand',
    companyName: 'MindfulMate Wellness Tech',
    industry: 'Fitness',
    description: 'AI-powered mental wellness app and wearable platform helping users track stress, sleep, and mindfulness daily.',
    profileImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=400&fit=crop',
    website: 'https://mindfulmate.app',
  },
];

// ─────────────────────────────────────────────
// 10 Campaigns – one per brand
// ─────────────────────────────────────────────
const campaignTemplates = [
  {
    title: 'Summer Solstice Collection Drop',
    description: 'We are launching our boldest sustainable summer collection yet. Looking for style-forward creators who can shoot editorial content in outdoor urban settings, capturing the essence of freedom and ethical fashion.',
    budget: 3500,
    timeline: new Date('2026-06-30'),
    category: 'Fashion',
    platform: ['Instagram', 'TikTok'],
    goals: ['Brand Awareness', 'Content Creation', 'Social Engagement'],
    targetAudience: '18–35, fashion enthusiasts, sustainability advocates',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=450&fit=crop',
  },
  {
    title: 'AI Gadget Unboxing & Review Series',
    description: 'TechVerse is launching the X1 AI Smart Hub. We need tech YouTubers and TikTokers to do honest unboxing, setup walkthroughs, and 30-day review videos. Budget includes product samples.',
    budget: 12000,
    timeline: new Date('2026-05-01'),
    category: 'Technology',
    platform: ['YouTube', 'TikTok'],
    goals: ['Product Review', 'Direct Sales', 'Brand Awareness'],
    targetAudience: 'Tech enthusiasts, early adopters, 22–45',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=450&fit=crop',
  },
  {
    title: 'Clean Beauty Morning Routine',
    description: 'Partner with Glow & Bloom to showcase our new botanical serum range inside authentic morning skincare routines. We want real, unfiltered skin results — no heavy editing.',
    budget: 5000,
    timeline: new Date('2026-04-20'),
    category: 'Beauty',
    platform: ['Instagram', 'YouTube'],
    goals: ['Brand Awareness', 'Content Creation'],
    targetAudience: 'Women 20–40, skincare-conscious, wellness lifestyle',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=450&fit=crop',
  },
  {
    title: '30-Day Fitness Transformation Challenge',
    description: 'Join the Peak Performance 30-Day Challenge campaign. Document your fitness journey using our PRO protein line and compression gear. Weekly posts required, full supply kit included.',
    budget: 7500,
    timeline: new Date('2026-07-15'),
    category: 'Fitness',
    platform: ['Instagram', 'TikTok', 'YouTube'],
    goals: ['Social Engagement', 'Brand Awareness', 'Direct Sales'],
    targetAudience: 'Gym-goers, health conscious, 18–40',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
  },
  {
    title: 'Hidden Gems Travel Vlog Series',
    description: 'Travel creators! Partner with Wanderlust Stays to document 3-day stays at our curated boutique properties in Goa, Coorg, and Udaipur. Fully sponsored trip + creator fee.',
    budget: 18000,
    timeline: new Date('2026-08-01'),
    category: 'Travel',
    platform: ['YouTube', 'Instagram'],
    goals: ['Brand Awareness', 'Content Creation'],
    targetAudience: 'Travel enthusiasts, experience seekers, 25–45',
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=450&fit=crop',
  },
  {
    title: 'Gourmet At Home – Recipe Creator Hunt',
    description: 'ForkStory is looking for food creators to craft original recipes using our premium meal-kit ingredients. Instagram reels and YouTube shorts showing quick, delicious meals under 30 minutes.',
    budget: 4000,
    timeline: new Date('2026-05-25'),
    category: 'Food',
    platform: ['Instagram', 'YouTube'],
    goals: ['Content Creation', 'Social Engagement', 'Brand Awareness'],
    targetAudience: 'Home cooks, food lovers, 22–45',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=450&fit=crop',
  },
  {
    title: 'Minimal Home Makeover Series',
    description: 'Transform a room using UrbanNest pieces. We want before-and-after transformation content showing how minimalist design elevates everyday living. Full product gifting provided.',
    budget: 6000,
    timeline: new Date('2026-06-10'),
    category: 'Lifestyle',
    platform: ['Instagram', 'YouTube', 'Pinterest'],
    goals: ['Content Creation', 'Brand Awareness'],
    targetAudience: 'Homeowners, interior design enthusiasts, 28–50',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=450&fit=crop',
  },
  {
    title: 'Esports Setup Reveal & Gaming Marathon',
    description: 'PixelRush is building the ultimate battle station with our new RGB peripherals lineup. Looking for gaming creators to do a live setup tour and a 12-hour sponsored gaming marathon stream.',
    budget: 9500,
    timeline: new Date('2026-04-30'),
    category: 'Gaming',
    platform: ['Twitch', 'YouTube', 'TikTok'],
    goals: ['Brand Awareness', 'Social Engagement', 'Direct Sales'],
    targetAudience: 'Gamers, esports fans, 16–35',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1593640408182-31c228b55b0e?w=800&h=450&fit=crop',
  },
  {
    title: 'Walk the Planet – Eco Footwear Campaign',
    description: 'SolarStride wants creators who walk the talk. Showcase our ocean-plastic sneakers in your daily commute, hikes, or travel adventures. Authenticity over perfection is the brief.',
    budget: 4500,
    timeline: new Date('2026-07-01'),
    category: 'Lifestyle',
    platform: ['Instagram', 'TikTok'],
    goals: ['Brand Awareness', 'Social Engagement', 'Content Creation'],
    targetAudience: 'Eco-conscious millennials, outdoor enthusiasts, 20–38',
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=450&fit=crop',
  },
  {
    title: 'Mindful Month – Wellness Challenge',
    description: 'Partner with MindfulMate to document a 30-day mindfulness journey using our app and wearable. Share daily check-ins, sleep scores, and stress-relief routines with your audience.',
    budget: 5500,
    timeline: new Date('2026-05-31'),
    category: 'Fitness',
    platform: ['Instagram', 'YouTube'],
    goals: ['Brand Awareness', 'Social Engagement', 'Direct Sales'],
    targetAudience: 'Wellness seekers, professionals, 24–45',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=450&fit=crop',
  },
];

// ─────────────────────────────────────────────
// Main Seed Function
// ─────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    const saltRounds = 10;

    const createdBrands = [];

    for (let i = 0; i < brandData.length; i++) {
      const bd = brandData[i];

      // Check if brand already exists
      let existingBrand = await User.findOne({ email: bd.email });
      if (existingBrand) {
        console.log(`⚠️  Brand already exists: ${bd.email} — skipping user creation`);
        createdBrands.push(existingBrand);
      } else {
        const hashedPassword = await bcrypt.hash(bd.password, saltRounds);
        const brand = await User.create({
          name: bd.name,
          email: bd.email,
          password: hashedPassword,
          role: bd.role,
          companyName: bd.companyName,
          industry: bd.industry,
          description: bd.description,
          profileImage: bd.profileImage,
          website: bd.website,
        });
        createdBrands.push(brand);
        console.log(`✅ Created brand: ${brand.name} (${brand.email})`);
      }
    }

    // Delete old seeded campaigns for these brands
    const brandIds = createdBrands.map((b) => b._id);
    const deleted = await Campaign.deleteMany({ brand: { $in: brandIds } });
    console.log(`🗑️  Removed ${deleted.deletedCount} old campaign(s) for these brands`);

    // Create 10 campaigns tied to the 10 brands
    const campaignsToInsert = campaignTemplates.map((ct, i) => ({
      brand: createdBrands[i]._id,
      title: ct.title,
      description: ct.description,
      budget: ct.budget,
      timeline: ct.timeline,
      category: ct.category,
      platform: ct.platform,
      goals: ct.goals,
      targetAudience: ct.targetAudience,
      status: ct.status,
      image: ct.image,
    }));

    const created = await Campaign.insertMany(campaignsToInsert);
    console.log(`\n🎉 Successfully seeded ${created.length} campaigns:\n`);
    created.forEach((c, i) => {
      console.log(`  [${i + 1}] ${c.title}  →  Brand: ${createdBrands[i].name}  |  Budget: ₹${c.budget.toLocaleString()}  |  Status: ${c.status}`);
    });

    console.log('\n📋 Brand Login Credentials:');
    brandData.forEach((b) => {
      console.log(`  ${b.name.padEnd(20)} | ${b.email.padEnd(35)} | ${b.password}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
