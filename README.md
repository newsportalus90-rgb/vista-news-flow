# Vista News Flow

A modern, responsive news portal built with React, Vite, and Supabase. Features a clean, professional design with real-time news updates and an intuitive admin panel.

## 🚀 Live Demo

**Production URL**: https://vista-news-flow.vercel.app/

## ✨ Features

- **Modern Design**: Clean, professional UI with a beautiful blue-to-purple gradient color scheme
- **Fully Responsive**: Optimized for all devices (mobile, tablet, desktop)
- **Admin Panel**: Easy-to-use content management system (accessible at `/admin`)
- **Real-time Updates**: Powered by Supabase for live data synchronization
- **SEO Optimized**: Comprehensive meta tags and structured data
- **Fast Performance**: Built with Vite for lightning-fast development and builds
- **Accessible**: WCAG compliant design with proper contrast ratios

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (Database + Auth)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Fonts**: Inter + Playfair Display

## 🎨 Design System

Vista News Flow uses a modern, professional color palette:
- **Primary**: Blue (#3B82F6) to Purple (#8B5CF6) gradient
- **Typography**: Inter for body text, Playfair Display for headings
- **Components**: shadcn/ui for consistent, accessible UI elements

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for backend services)

### Installation

```bash
# Clone the repository
git clone https://github.com/newsportalus90-rgb/vista-news-flow.git

# Navigate to project directory
cd vista-news-flow

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

## 📱 Admin Panel

Access the admin panel at `/admin` to manage:
- Articles and news posts
- Categories and tags
- Media library
- User management
- System settings

No authentication required - simplified for easy access.

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Build the project
npm run build

# Deploy to Vercel
npx vercel --prod
```

### Other Platforms

The project can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 📁 Project Structure

```
vista-news-flow/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── integrations/   # External service integrations
├── supabase/           # Database migrations and config
└── ...config files
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- Powered by [Supabase](https://supabase.com/) for backend services
- Icons by [Lucide](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)
