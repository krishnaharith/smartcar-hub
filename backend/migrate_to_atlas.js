import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Import models
import User from './models/user.js';
import Booking from './models/booking.js';
import Review from './models/review.js';

const LOCAL_URI = "mongodb://127.0.0.1:27017/smartcar";
const ATLAS_URI = process.env.MONGO_URI; // smartcar database on Atlas

async function migrate() {
  console.log("Connecting to local MongoDB...");
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();

  console.log("Connecting to MongoDB Atlas...");
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();

  // Migrate each collection
  const collections = ['users', 'bookings', 'reviews', 'services', 'vehicles'];

  for (const col of collections) {
    try {
      const localData = await localConn.db.collection(col).find({}).toArray();
      if (localData.length === 0) {
        console.log(`⟳ ${col}: empty, skipping.`);
        continue;
      }
      // Delete existing docs in Atlas for this collection to avoid duplicates
      await atlasConn.db.collection(col).deleteMany({});
      await atlasConn.db.collection(col).insertMany(localData);
      console.log(`✅ ${col}: migrated ${localData.length} documents.`);
    } catch (err) {
      console.error(`❌ ${col}: error - ${err.message}`);
    }
  }

  await localConn.close();
  await atlasConn.close();
  console.log("\n✅ Migration complete! Check your Atlas dashboard for 'smartcar' database.");
  process.exit(0);
}

migrate().catch(err => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
