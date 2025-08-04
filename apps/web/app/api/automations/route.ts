import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';

  try {
    const { automations, totalAutomations } = await getAutomations(search);

    return NextResponse.json(
      {
        automations,
        totalAutomations
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

async function getAutomations(search: string = ''): Promise<{
  automations: any[];
  totalAutomations: number;
}> {
  const supabase = createClient();
  let query = supabase
    .from('autopilot')
    .select('*, inventory(title, image_url)', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  let { data: automations, error, count } = await query;

  if (error) {
    throw error;
  }

  const totalAutomations = count || 0;

  return {
    automations: automations || [],
    totalAutomations
  };
}
