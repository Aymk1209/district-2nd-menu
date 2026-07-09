import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Handle the preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://aymk1209.github.io',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: Request) {
  try {
    const { itemName, price } = await req.json();

    await pool.query(
      'INSERT INTO orders (item_name, price, created_at) VALUES ($1, $2, NOW())',
      [itemName, price]
    );

    return NextResponse.json({ message: "Order stored!" }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://aymk1209.github.io',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to store order" }, { status: 500 });
  }
}
