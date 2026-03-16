import { MongoClient, ServerApiVersion } from 'mongodb';
import dns from 'dns';

// Force Google DNS (8.8.8.8 primary, 8.8.4.4 alternative) to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = "mongodb+srv://user123:user123@cluster0.64xfaci.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}
run().catch(console.dir);
