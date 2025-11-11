import { MongoClient } from "mongodb";

let uri = process.env.MONGODB_URI;
let dbName = "jia-db";

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in Vercel or .env.local"
  );
}

if (!dbName) {
  throw new Error("Please define the database name");
}

export default async function connectMongoDB() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    // TLS is required for Atlas
    tls: true,
    // Optional: only use for testing if SSL certificate is invalid
    // tlsAllowInvalidCertificates: true,
    // Retry writes in case of transient errors
    retryWrites: true,
    w: "majority",
  });

  await client.connect();

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function disconnectFromDatabase() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}
