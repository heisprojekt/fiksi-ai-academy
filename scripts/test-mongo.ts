import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import dns from 'dns';

// Fix for Windows Node querySrv DNS issue
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  console.log('Set DNS servers to 8.8.8.8, 1.1.1.1');
} catch (e) {
  console.log('Could not set DNS servers:', e);
}

dotenv.config();

const directUri = `mongodb://heisprojekt_db_user:SuhPduKrX1067sQz@ac-il1dscg-shard-00-00.yvlj7w3.mongodb.net:27017,ac-il1dscg-shard-00-01.yvlj7w3.mongodb.net:27017,ac-il1dscg-shard-00-02.yvlj7w3.mongodb.net:27017/fiksi_ai_academy?ssl=true&replicaSet=atlas-6kj9ds-shard-0&authSource=admin&retryWrites=true&w=majority`;

console.log('Testing SRV connection...');
async function testSrv() {
  const srvUri = process.env.DATABASE_URL || '';
  const client = new MongoClient(srvUri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    console.log('✅ SRV Connection Successful!');
    await client.close();
    return true;
  } catch (err: any) {
    console.log('❌ SRV failed:', err.message);
    return false;
  }
}

async function testDirect() {
  console.log('Testing Direct ReplicaSet Connection...');
  const client = new MongoClient(directUri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    console.log('✅ Direct ReplicaSet Connection Successful!');
    const db = client.db('fiksi_ai_academy');
    const collections = await db.listCollections().toArray();
    console.log('Existing collections:', collections.map(c => c.name));
    await client.close();
    return true;
  } catch (err: any) {
    console.log('❌ Direct failed:', err.message);
    return false;
  }
}

async function main() {
  const okSrv = await testSrv();
  if (!okSrv) {
    await testDirect();
  }
}

main();
