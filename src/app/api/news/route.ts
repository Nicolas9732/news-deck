import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/news-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic') || 'Top';
  
  try {
    const news = await fetchNews(topic);
    return NextResponse.json(news);
  } catch (error) {
    console.error('News API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
