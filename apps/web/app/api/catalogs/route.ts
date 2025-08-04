import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';

  try {
    const { catalogs, totalCatalogs } = await getCatalogs(search);

    return NextResponse.json(
      {
        catalogs,
        totalCatalogs
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

async function getCatalogs(search: string = ''): Promise<{
  catalogs: any[];
  totalCatalogs: number;
}> {
  const supabase = createClient();
  let query = supabase
    .from('catalogs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .not('presentation_id', 'is', null);

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  let { data: catalogs, error, count } = await query;

  if (error) {
    throw error;
  }

  const totalCatalogs = count || 0;

  return {
    catalogs: catalogs || [],
    totalCatalogs
  };
}
