import { NextResponse } from 'next/server';
import { getSystemInfo } from '@/lib/systemInfo';


export async function GET() {
  const systemInfo = await getSystemInfo();
  return NextResponse.json(systemInfo);
}