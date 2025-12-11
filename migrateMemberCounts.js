// Migration script to update membersCount for all existing clubs


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Club from './src/models/Club.js';
import Membership from './src/models/Membership.js';

dotenv.config();

const migrateClubMemberCounts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for migration');

        // Get all clubs
        const clubs = await Club.find({});
        console.log(`Found ${clubs.length} clubs to update`);

        for (const club of clubs) {
            // Count active memberships for this club
            const memberCount = await Membership.countDocuments({
                clubId: club._id,
                status: 'active'
            });

            // Update the club's membersCount field
            club.membersCount = memberCount;
            await club.save();

            console.log(`Updated ${club.clubName}: ${memberCount} members`);
        }

        console.log('✅ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrateClubMemberCounts();
