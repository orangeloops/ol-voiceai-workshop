# RetailCo - Modern Retail Catalog

A production-ready Next.js retail catalog with advanced filtering, search, and ElevenLabs Voice Agent integration.

## Features

- **Product Catalog**: Browse hoodies, shirts, jeans, jackets, and pants
- **Advanced Filtering**: Category, color, sleeve, style, size, and price range filters
- **Search**: Full-text product search with URL-based state management
- **Sorting**: Sort by relevance, price (low/high), or stock availability
- **Pagination**: Client-side pagination with 24 products per page
- **Quick View**: Modal for quick product preview
- **Product Pages**: Detailed product pages with full descriptions
- **Voice Agent**: ElevenLabs voice widget integration for voice-based queries
- **Responsive**: Mobile-first design with collapsible filters
- **Accessible**: Keyboard navigation, ARIA labels, and screen reader support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: URL-based with React hooks

## Getting Started

### Prerequisites

- Node.js 20+
- Backend API running (see API Configuration below)

### Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Create `.env.local` file:

\`\`\`env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Optional: ElevenLabs Voice Agent (use ONE of the following)
# NEXT_PUBLIC_ELEVENLABS_WIDGET_SRC=https://<official-script-url>
# NEXT_PUBLIC_ELEVENLABS_WIDGET_IFRAME=https://<official-iframe-url>
\`\`\`

4. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## API Configuration

The application expects the following API endpoints:

### GET `/categories`
Returns array of category strings:
\`\`\`json
["hoodies", "shirts", "jeans", "jackets", "pants"]
\`\`\`

### GET `/attributes?category=hoodies`
Returns available filter attributes:
\`\`\`json
{
  "colors": ["black", "blue", "red"],
  "sleeve": ["long", "short", "sleeveless"],
  "style": ["plain", "printed", "embroidered"],
  "size": ["XS", "S", "M", "L", "XL", "XXL"]
}
\`\`\`

### GET `/products?category=hoodies&color=blue&size=M`
Returns array of products:
\`\`\`json
[
  {
    "product_id": "123",
    "slug": "blue-hoodie-m",
    "name": "Blue Hoodie",
    "category": "hoodies",
    "description": "Comfortable blue hoodie",
    "sku": "HOO-BLU-M",
    "color": "blue",
    "sleeve": "long",
    "style": "plain",
    "size": "M",
    "price": "49.99",
    "stock": 15,
    "image_url": "https://example.com/image.jpg"
  }
]
\`\`\`

## Voice Agent Integration

The application supports ElevenLabs Voice Agent integration through two methods:

1. **Script injection**: Set `NEXT_PUBLIC_ELEVENLABS_WIDGET_SRC` to the widget script URL
2. **Iframe embed**: Set `NEXT_PUBLIC_ELEVENLABS_WIDGET_IFRAME` to the widget iframe URL

The widget receives context events when users interact with products:

\`\`\`javascript
window.dispatchEvent(new CustomEvent('voiceAgent:suggest', {
  detail: {
    context: {
      sku: 'HOO-BLU-M',
      name: 'Blue Hoodie',
      category: 'hoodies',
      color: 'blue',
      size: 'M',
      price: '49.99',
      stock: 15
    }
  }
}));
\`\`\`

## Project Structure

\`\`\`
src/
├── app/
│   ├── layout.tsx          # Root layout with header and voice widget
│   ├── page.tsx            # Home page with catalog
│   └── product/[slug]/     # Product detail pages
├── components/
│   ├── Header.tsx          # Navigation header with search
│   ├── FiltersPanel.tsx    # Filter sidebar/sheet
│   ├── ProductCard.tsx     # Product card component
│   ├── ProductGrid.tsx     # Grid layout with loading states
│   ├── QuickViewModal.tsx  # Product quick view modal
│   ├── VoiceAgentWidget.tsx # ElevenLabs widget integration
│   └── ui/                 # shadcn/ui components
├── hooks/
│   ├── useCatalogFilters.ts # URL-based filter state
│   └── useProducts.ts       # Product fetching and pagination
└── lib/
    ├── api.ts              # API wrapper functions
    ├── config.ts           # Environment configuration
    ├── types.ts            # TypeScript types
    └── utils.ts            # Utility functions
\`\`\`

## Development

- **Filters**: All filters are synced with URL query parameters for shareable links
- **Pagination**: Client-side pagination with 24 items per page
- **Sorting**: Client-side sorting (relevance, price, stock)
- **Loading States**: Skeleton loaders for better UX
- **Error Handling**: Error states with retry functionality

## Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## License

MIT
