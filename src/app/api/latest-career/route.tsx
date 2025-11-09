import { NextResponse } from 'next/server';
import connectMongoDB from "@/lib/mongoDB/mongoDB";

export async function GET() {
  try {
    const { db } = await connectMongoDB();
    const latestCareer = await db
      .collection('careers')
      .find()
      .sort({ _id: -1 })  // Sort by _id in descending order to get the most recent
      .limit(1)
      .toArray();
    
    return NextResponse.json(latestCareer[0] || null);
  } catch (error) {
    console.error('Error fetching latest career:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest career' },
      { status: 500 }
    );
  }
}