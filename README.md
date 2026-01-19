# News Monitoring Platform

A sophisticated intelligence briefing and news monitoring platform with real-time RSS feeds, Polymarket market data, and customizable column layouts.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
# V1 (Legacy): http://localhost:3000
# V2 (New): http://localhost:3000/v2
```

## ✨ Features

### V2 - Intelligence Terminal (New!)
**Access at: http://localhost:3000/v2**

- 🎨 **Beautiful Topic Selection**: Magazine-quality cards with elegant animations
- 🎯 **Draggable Column System**: Customize your layout with drag-and-drop
- 📰 **Real-time News Feeds**: RSS aggregation with keyword filtering
- 📊 **Polymarket Integration**: Live prediction market odds with trends
- 📖 **Article Reader**: Full content extraction with elegant typography
- 🌓 **Light/Dark Mode**: Seamless theme switching
- 💾 **Persistent Layouts**: Your arrangements save automatically

### V1 - Command Center (Legacy)
**Access at: http://localhost:3000**

- Terminal-style 4-quadrant dashboard
- Basic RSS feed monitoring
- Simple article reading

## 🎨 Design Philosophy - V2

**"Intelligence Terminal"** aesthetic:
- Custom Newsreader serif for headlines
- Clean DM Sans for body text
- Editorial-inspired layouts
- Subtle paper textures
- Sophisticated colors
- Premium shadows
- Smooth animations

## 📊 Available Topics

### Pre-defined Topics
- **Finance**: Markets, stocks, economy
- **Technology**: AI, startups, innovation
- **Cryptocurrency**: Bitcoin, Ethereum, blockchain

### Geopolitical Monitoring
- **Iran**: Middle East conflict
- **Ukraine**: War updates
- **China**: Geopolitical developments
- **Taiwan**: Cross-strait relations
- **Russia**: Political and military news
- **Israel/Palestine**: Conflict tracking
- **North Korea**: DPRK developments

### Custom Topics
Create your own with custom keywords!

## 🔧 Technology Stack

- Next.js 16.1.3 (App Router, Turbopack)
- React 19.2.3
- Tailwind CSS 4
- @dnd-kit (drag & drop)
- Recharts (charts)
- Lucide React (icons)
- date-fns (dates)

## 📁 Project Structure

```
news-deck/
├── app/
│   ├── v2/                    # New Intelligence Terminal
│   │   ├── api/polymarket/    # Market data API
│   │   ├── components/        # UI components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utils & config
│   │   └── globals.css        # Design system
│   ├── api/                   # Shared APIs
│   │   ├── proxy/             # RSS proxy
│   │   └── read/              # Article extraction
│   └── ...                    # V1 files
```

## 🎯 Key Features Detail

### News Feed Column
- Curated RSS sources per topic
- Keyword filtering with highlights
- Breaking news indicators (< 30 min)
- Auto-refresh every 60 seconds
- Relative timestamps

### Polymarket Column
- Real-time market odds
- Price change indicators
- Volume & liquidity
- Probability bars
- Auto-refresh every 15 seconds

### Article Reader
- Full content extraction
- Elegant typography
- Scroll-to-top button
- External link access

### Drag & Drop
- Reorder columns
- Remove columns
- Persistent layouts
- Smooth animations

## 🔐 Privacy

- No authentication required
- Local storage only
- No external tracking
- Server-side RSS proxy
- Cached Polymarket data

## 🚧 Roadmap

### Phase 2
- Twitter/X integration
- Telegram monitoring
- AI summaries
- Email alerts
- Column resizing

### Phase 3
- User accounts
- Cloud sync
- Team collaboration
- Custom data sources
- Advanced analytics

## 📝 Development

### Add RSS Sources

Edit `app/v2/lib/sources.ts`:

```typescript
export const RSS_SOURCES: Record<string, FeedSource[]> = {
  'your-topic': [
    {
      id: 'source-1',
      name: 'Source Name',
      url: 'https://...',
      type: 'rss',
      enabled: true
    },
  ],
};
```

### Add Topics

Edit `app/v2/lib/default-topics.ts`:

```typescript
{
  id: 'your-topic',
  name: 'Your Topic',
  type: 'predefined',
  keywords: ['keyword1', 'keyword2'],
  icon: 'Globe',
  color: '#hexcolor',
}
```

### Customize Design

Edit `app/v2/globals.css` for:
- Colors (CSS variables)
- Typography
- Animations
- Shadows

## 🐛 Known Issues

- Polymarket API rate limits possible
- Some RSS feeds may have CORS issues
- Article extraction depends on site structure

## 📄 License

MIT

## 🔗 Links

- **Repository**: https://github.com/Nicolas9732/news-deck
- **Version**: 2.0.0
- **Built with**: Next.js, React, Tailwind CSS

---

Built with ❤️ using distinctive design principles and modern web technologies
