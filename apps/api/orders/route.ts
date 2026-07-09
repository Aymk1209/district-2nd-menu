import { NextResponse } from 'next/server';
import { Pool } from 'pg'; // Ensure 'pg' is installed

// Use your existing DATABASE_URL
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: Request) {
  try {
    const { itemName, price } = await req.json();

    // Store the order in your database
    await pool.query(
      'INSERT INTO orders (item_name, price, created_at) VALUES ($1, $2, NOW())', 
      [itemName, price]
    );

    return NextResponse.json({ message: "Order stored!" }, {
      status: 200}),
      headers: {
        'Access-Control-Allow-Origin': 'https://aymk1209.github.io', // Allow your site
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { itemName, price } = await req.json();

    // Insert the order into the 'orders' table we just created
    await sql`INSERT INTO orders (item_name, price) VALUES (${itemName}, ${price});`;

    return NextResponse.json({ message: "Order recorded successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to record order" }, { status: 500 });
  }
}
// Crucial: Handle CORS pre-flight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://aymk1209.github.io',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
