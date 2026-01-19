import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; NewsDeck/1.0; +http://localhost:3000)',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch article: ${response.statusText}`);
        }

        const html = await response.text();
        const doc = new JSDOM(html, { url });
        const document = doc.window.document;

        // Aggressive Pre-Cleaning: Remove known "noise" selectors that Readability might miss
        const noiseSelectors = [
            'aside',
            '.related-stories',
            '.related-content',
            '.more-on-this',
            '.read-more',
            '[role="complementary"]',
            '.recommended-list',
            'ul.cards', // Common for related article cards masquerading as lists
            '.embedded-content',
            '.advertisement'
        ];

        noiseSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });

        // Specific cleanup for text patterns in lists (like the user saw)
        // If a list directly follows a header saying "Recommended", kill it.
        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(header => {
            const text = header.textContent?.toLowerCase() || '';
            if (text.includes('recommended') || text.includes('read more') || text.includes('related')) {
                header.nextElementSibling?.tagName === 'UL' ? header.nextElementSibling?.remove() : null;
                header.remove();
            }
        });

        const reader = new Readability(document);
        const article = reader.parse();

        if (!article) {
            throw new Error('Failed to parse article content');
        }

        return NextResponse.json({
            title: article.title,
            content: article.content,
            textContent: article.textContent,
            siteName: article.siteName,
        });

    } catch (error) {
        console.error("Scraping error:", error);
        return NextResponse.json(
            { error: 'Failed to read article', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
