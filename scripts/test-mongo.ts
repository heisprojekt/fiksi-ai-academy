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

const user = process.env.MONGODB_USERNAME || 'heisprojekt_db_user';
const pass = encodeURIComponent(process.env.MONGODB_PASSWORD || '');
const directUri = `mongodb://${user}:${pass}@ac-il1dscg-shard-00-00.yvlj7w3.mongodb.net:27017,ac-il1dscg-shard-00-01.yvlj7w3.mongodb.net:27017,ac-il1dscg-shard-00-02.yvlj7w3.mongodb.net:27017/fiksi_ai_academy?ssl=true&replicaSet=atlas-6kj9ds-shard-0&authSource=admin&retryWrites=true&w=majority`;

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

  console.log('\n--- Testing Prisma User Operations on MongoDB Atlas ---');
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // 1. Count
    const userCountBefore = await prisma.user.count();
    console.log(`✅ Prisma connected! Total Users in DB: ${userCountBefore}`);
    
    // 2. Simulate Google User Registration
    const testGoogleEmail = `kreator.google.test@gmail.com`;
    console.log(`\nSimulating Google Sign-In for: ${testGoogleEmail}`);
    const existing = await prisma.user.findUnique({ where: { email: testGoogleEmail } });
    
    let dbUser;
    if (existing) {
      dbUser = await prisma.user.update({
        where: { email: testGoogleEmail },
        data: {
          name: 'Kreator AI Google Verified',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          streakDays: existing.streakDays + 1
        }
      });
      console.log('✅ Google User updated in MongoDB Atlas:', { id: dbUser.id, email: dbUser.email, role: dbUser.role, streak: dbUser.streakDays });
    } else {
      dbUser = await prisma.user.create({
        data: {
          email: testGoogleEmail,
          name: 'Kreator AI Google Verified',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          role: 'Free Member',
          joinedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          validUntil: 'Free Tier',
          status: 'Active',
          coursesCompleted: 0,
          savedPrompts: 0,
          totalDownloads: 0,
          streakDays: 1,
          bookmarks: ['karakter-ai-1']
        }
      });
      console.log('🌟 NEW Google User created in MongoDB Atlas:', { id: dbUser.id, email: dbUser.email, role: dbUser.role });
    }

    const allUsers = await prisma.user.findMany({ take: 10, orderBy: { createdAt: 'desc' } });
    console.log('\n--- Current MongoDB Atlas Members List ---');
    console.table(allUsers.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, status: u.status })));

    await prisma.$disconnect();
    console.log('\n🎉 ALL GOOGLE USER TESTS ON MONGODB ATLAS PASSED SUCCESSFULLY!');
  } catch (err: any) {
    console.error('Prisma test error:', err.message);
  }
}

main();
