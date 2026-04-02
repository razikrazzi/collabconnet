const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Invitation = require('./models/Invitation');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        
        const brandCount = await User.countDocuments({ role: 'Brand' });
        const campaignCount = await Campaign.countDocuments();
        const invitationCount = await Invitation.countDocuments();
        
        console.log('Brands:', brandCount);
        console.log('Campaigns:', campaignCount);
        console.log('Invitations:', invitationCount);
        
        if (brandCount > 0) {
            const brands = await User.find({ role: 'Brand' }).limit(1);
            console.log('Sample Brand ID:', brands[0]._id);
            const camps = await Campaign.find({ brand: brands[0]._id }).limit(1);
            console.log('Campaign for this brand:', camps.length > 0 ? camps[0]._id : 'None');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
