import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';

  try {
    const { listings, totalListings } = await getListings(search);

    return NextResponse.json(
      {
        listings,
        totalListings
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function getListings(search: string = ''): Promise<{
  listings: any[];
  totalListings: number;
}> {
  const supabase = createClient();
  let query = supabase
    .from('inventory')
    .select('*, autopilot(inventory_id)', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  let { data: listings, error, count } = await query;

  if (error) {
    throw error;
  }

  const updatedData =
    listings?.map((item) => ({
      ...item,
      isAutomated: item.autopilot.length > 0
    })) ?? [];

  const totalListings = count || 0;

  return {
    listings: updatedData || [],
    totalListings
  };
}
