import type { Metadata, Viewport } from 'next';
import { Newsreader, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/footer/Footer';
import { ToastProvider } from '@/components/ui/Toast';

const editorialSerif = Newsreader({
  subsets: ['latin'],
  variable: '--font-editorial',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
});

const modernSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const modernMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://wayfarer-travel.onrender.com'),
  title: {
    default: 'WAYFARER | Intentional Travel Planner & Curated Itineraries',
    template: '%s | WAYFARER',
  },
  description:
    'Turn destination ideas into structured, day-by-day itineraries. Curated travel guides, activity timelines, and trip planning without clutter.',
  keywords: [
    'travel planner',
    'itinerary planner',
    'curated travel',
    'day by day itinerary',
    'destination guides',
    'travel management',
  ],
  authors: [{ name: 'WAYFARER Studio' }],
  creator: 'WAYFARER Studio',
  publisher: 'WAYFARER Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wayfarer-travel.onrender.com',
    siteName: 'WAYFARER',
    title: 'WAYFARER | Intentional Travel Planner & Curated Itineraries',
    description:
      'Turn destination ideas into structured, day-by-day itineraries. Curated travel guides, activity timelines, and trip planning without clutter.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'WAYFARER Travel Planner Editorial Destination',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WAYFARER | Intentional Travel Planner',
    description:
      'Turn destination ideas into structured, day-by-day itineraries. Curated travel guides, activity timelines, and trip planning without clutter.',
    images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop'],
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#FBF9F5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${editorialSerif.variable} ${modernSans.variable} ${modernMono.variable}`}
    >
      <body className="font-sans bg-canvas text-ink min-h-screen flex flex-col antialiased selection:bg-terracotta-100 selection:text-ink">
        <ToastProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
