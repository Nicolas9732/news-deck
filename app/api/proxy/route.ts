import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'NewsDeck/1.0 (Command Center)',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch feed: ${response.statusText}`);
        }

        const text = await response.text();

        // Return XML with correct content type
        return new NextResponse(text, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 's-maxage=60, stale-while-revalidate=300', // Cache for 1 min
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch RSS feed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
