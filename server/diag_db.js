const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await User.countDocuments({ role: 'Influencer' });
        console.log(`STDOUT_FILE: Influencer Count: ${count}`);
        const samples = await User.find({ role: 'Influencer' }).limit(2);
        console.log(`STDOUT_FILE: Samples: ${JSON.stringify(samples)}`);
        process.exit(0);
    } catch (err) {
        console.error(`STDOUT_FILE: Error: ${err.message}`);
        process.exit(1);
    }
};

check();
