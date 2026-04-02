const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'admin';

        // Check if admin already exists
        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            console.log('Admin already exists. Updating password and role...');
            admin.password = adminPassword;
            admin.role = 'Admin';
            await admin.save();
        } else {
            console.log('Creating new admin user...');
            admin = await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'Admin'
            });
        }

        console.log(`✅ Admin user ${admin.role === 'Admin' ? 'created/updated' : 'failed'}: ${admin.email}`);
        process.exit();
    } catch (err) {
        console.error('❌ Error creating admin:', err);
        process.exit(1);
    }
};

createAdmin();
