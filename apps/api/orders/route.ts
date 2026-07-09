import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Setup DB connection (Ensure DATABASE_URL is in Vercel settings!)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://aymk1209.github.io',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 1. The Preflight check (Prevents CORS errors)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// 2. The Actual POST request
export async function POST(req: Request) {
  try {
    const { itemName, price } = await req.json();
    
    // Attempt database query
    await pool.query(
      'INSERT INTO orders (item_name, price, created_at) VALUES ($1, $2, NOW())',
      [itemName, price]
    );

    return NextResponse.json({ message: "Success" }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("DATABASE ERROR:", error.message); // Look for this in Vercel Logs
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
