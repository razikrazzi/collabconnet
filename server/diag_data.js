const mongoose = require('mongoose');
const Deliverable = require('./models/Deliverable');
const Payment = require('./models/Payment');
const Campaign = require('./models/Campaign');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connected');

        const deliverables = await Deliverable.find();
        console.log('Total Deliverables:', deliverables.length);
        if (deliverables.length > 0) {
            console.log('Deliverable Sample:', JSON.stringify(deliverables[0], null, 2));
        }

        const payments = await Payment.find();
        console.log('Total Payments:', payments.length);
        if (payments.length > 0) {
            console.log('Payment Sample:', JSON.stringify(payments[0], null, 2));
        }

        const brands = await User.find({ role: 'Brand' });
        console.log('Total Brands:', brands.length);

        const campaigns = await Campaign.find();
        console.log('Total Campaigns:', campaigns.length);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
