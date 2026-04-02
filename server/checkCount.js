const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const fs = require('fs');

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await User.countDocuments({ role: 'Influencer' });
        fs.writeFileSync('count_result.txt', `Current influencer count: ${count}`);
        process.exit();
    } catch (error) {
        fs.writeFileSync('count_result.txt', `Error: ${error.message}`);
        process.exit(1);
    }
};

checkDB();
