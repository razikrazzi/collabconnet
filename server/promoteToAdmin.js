const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const promote = async () => {
    const email = process.argv[2];
    if (!email) {
        console.log('Please provide an email: node promoteToAdmin.js user@example.com');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOneAndUpdate({ email }, { role: 'Admin' }, { new: true });
        if (user) {
            console.log(`✅ User ${user.email} promoted to ADMIN.`);
        } else {
            console.log('❌ User not found.');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

promote();
