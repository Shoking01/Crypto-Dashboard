# Crypto Dashboard

A professional-grade cryptocurrency tracking dashboard with real-time market data, interactive visualizations, and an elegant user interface. Built with modern web technologies following industry best practices for performance, accessibility, and user experience.

## Objective

This project serves as a demonstration of building a production-ready financial dashboard application. It showcases:

- **Real-time data integration** with external APIs
- **Modern React patterns** including hooks, memoization, and code splitting
- **Responsive design** that adapts seamlessly across devices
- **Performance optimization** techniques for smooth user experience
- **Accessibility standards** following WCAG guidelines
- **Clean architecture** with separation of concerns

## Technologies

### Core Framework
- **[React 19](https://react.dev/)** - Latest version with improved rendering performance and concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Static typing for robust, maintainable code
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling with instant HMR

### State Management & Data Fetching
- **[TanStack Query v5](https://tanstack.com/query/)** - Powerful asynchronous state management with automatic caching, deduplication, and background updates

### Visualization
- **[Recharts](https://recharts.org/)** - Composable charting library built on React components for responsive, interactive charts

### Styling
- **CSS Custom Properties** - Dynamic theming system without CSS-in-JS runtime overhead
- **Glassmorphism** - Modern UI aesthetic with backdrop blur effects

### Icons
- **[Lucide React](https://lucide.dev/)** - Beautiful, consistent icon set

### Utilities
- **[date-fns](https://date-fns.org/)** - Modern date utility library
- **[axios](https://axios-http.com/)** - Promise-based HTTP client

## Features

### Market Overview
- Real-time price tracking for 50+ cryptocurrencies
- Market cap, 24h volume, and price change percentages
- Sortable data table with multiple columns

### Interactive Charts
- Area charts with gradient fills
- Multiple timeframes: 1H, 24H, 7D, 30D, 1Y
- Hover tooltips with precise values
- Trend indicators (positive/negative coloring)

### Smart Filtering
- **All** - Complete market view
- **Winners** - Top 10 price increases
- **Losers** - Top 10 price decreases
- **Volume** - Highest 24h trading volume

### Search
- Instant search with 300ms debounce
- Autocomplete dropdown with coin thumbnails
- Market cap rank badges

### Theme System
- Dark mode (default) with deep blue palette
- Light mode with clean white design
- System preference detection
- Smooth transition animations

### Responsive Design
- Desktop: Two-column layout with table view
- Tablet: Adapted layout with responsive controls
- Mobile: Single column with card-based list
- Touch-optimized with 44px minimum tap targets

## Project Structure

```
portfolio-project-one/
├── public/                  # Static assets
├── src/
│   ├── components/          # UI components
│   │   ├── CryptoCard/      # Mobile card view for individual crypto
│   │   ├── CryptoControls/  # Timeframe & filter control bar
│   │   ├── CryptoList/      # Main list (table + cards)
│   │   ├── CryptoFilterControl/
│   │   ├── Layout/          # Header component
│   │   ├── LoadingState/    # Skeletons, spinners, error states
│   │   ├── PriceChart/      # Interactive price chart
│   │   ├── SearchBar/       # Search with autocomplete
│   │   └── ThemeToggle/     # Dark/light mode switch
│   │
│   ├── context/             # React Context providers
│   │   └── ThemeContext.tsx # Theme state management
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAutoRefresh.ts
│   │   ├── useChartData.ts
│   │   ├── useCryptoData.ts
│   │   └── useCryptoFiltering.ts
│   │
│   ├── services/            # API layer
│   │   ├── api.ts           # Axios instance & endpoints
│   │   └── cryptoService.ts # Crypto-specific API calls
│   │
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # All type interfaces
│   │
│   ├── utils/               # Utility functions
│   │   ├── formatters.ts    # Price, percentage, date formatting
│   │   └── constants.ts     # App-wide constants
│   │
│   ├── App.tsx              # Root component
│   ├── App.css              # Component-specific styles
│   ├── index.css            # Global design system
│   └── main.tsx             # Application entry point
│
├── index.html               # HTML template with critical CSS
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Architecture

### Data Flow
```
CoinGecko API
     │
     ▼
  Services Layer (axios)
     │
     ▼
  TanStack Query (caching, deduplication)
     │
     ▼
  Custom Hooks (useCryptoData, useChartData)
     │
     ▼
  Components (presentational)
```

### Component Hierarchy
```
App
├── Header
│   ├── Logo & Title
│   ├── Stats (Last Update, Countdown)
│   └── ThemeToggle
│
├── Main Content
│   ├── Left Column
│   │   ├── SearchBar
│   │   └── PriceChart (lazy loaded)
│   │
│   └── Right Column
│       ├── Section Header
│       ├── CryptoControls
│       └── CryptoList
│           ├── Desktop: Table View
│           └── Mobile: Card View
│
└── Footer
```

## Design System

### Color Palette
| Token | Dark Theme | Light Theme |
|-------|------------|-------------|
| `--bg-primary` | #0a0f1a | #ffffff |
| `--text-primary` | #f9fafb | #111827 |
| `--accent-primary` | #6366f1 | #4f46e5 |
| `--accent-secondary` | #06b6d4 | #0891b2 |

### Typography Scale
| Token | Size | Usage |
|-------|------|-------|
| `--font-xs` | 0.75rem | Badges, labels |
| `--font-sm` | 0.875rem | Body small |
| `--font-base` | 1rem | Body text |
| `--font-lg` | 1.125rem | Emphasis |
| `--font-xl` | 1.25rem | Subheadings |
| `--font-2xl` | 1.5rem | Section titles |

### Spacing (8pt Grid)
| Token | Size |
|-------|------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-4` | 16px |
| `--space-6` | 24px |
| `--space-8` | 32px |

## Performance Optimizations

### Bundle Optimization
- **Code Splitting**: Recharts lazy-loaded with React.lazy()
- **Tree Shaking**: Direct imports from lucide-react
- **Vendor Chunks**: Separate bundles for React, Query, Recharts

### Runtime Performance
- **Memoization**: All list items and controls memoized
- **Virtual Scrolling**: CSS content-visibility for long lists
- **Debounced Search**: 300ms delay to reduce API calls
- **Query Deduplication**: TanStack Query prevents duplicate requests

### Loading Performance
- **Preconnect**: Early connections to API and font origins
- **Font Display Swap**: Prevents FOIT (Flash of Invisible Text)
- **Critical CSS Inline**: Above-fold styles in HTML head
- **Lazy Images**: Native lazy loading for crypto icons

## Getting Started

### Requirements
- Node.js 20.19+ or 22.12+
- npm 10+ or yarn 1.22+

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/crypto-dashboard.git
cd crypto-dashboard/portfolio-project-one

# Install dependencies
npm install

# Start development server
npm run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## API

This project uses the **CoinGecko Public API** - no authentication required.

### Endpoints Used
- `/coins/markets` - List of coins with market data
- `/coins/{id}/market_chart` - Historical price data
- `/search` - Search for coins

### Rate Limits
- Free tier: 10-30 calls/minute
- Data auto-refreshes every 60 seconds

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## License

MIT License - See [LICENSE](LICENSE) for details.

---

Built with care following modern web development best practices.
