import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();

    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      return NextResponse.json({ error: 'API base URL not configured' }, { status: 500 });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/medicine?${query}`;
    const res = await fetch(apiUrl, { cache: 'no-store' });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
