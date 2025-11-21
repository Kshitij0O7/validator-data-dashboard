import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { HubspotProvider } from "next-hubspot";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Get Validator Data - Ethereum Validator Rewards Tracker",
    template: "%s | Get Staking Data",
  },
  description: "Track Ethereum validator rewards and staking rewards in real-time. Monitor validator performance, analyze historical rewards data, and export transaction data for staking pools and validator operators.",
  keywords: [
    "staking",
    "validators",
    "validator rewards",
    "staking rewards",
    "ethereum",
    "ethereum validators",
    "ethereum staking",
    "blockchain analytics",
    "defi",
    "staking pools",
    "validator performance",
    "rewards tracking",
    "ethereum staking rewards",
    "validator balance tracker",
    "bitquery",
    "blockchain",
    "cryptocurrency",
    "web3",
  ],
  authors: [{ name: "Get Staking Data" }],
  creator: "Get Staking Data",
  publisher: "Get Staking Data",
  applicationName: "Get Staking Data",
  category: "Blockchain Analytics",
  classification: "Web Application",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://get-staking-data.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Get Staking Data - Ethereum Validator Rewards Tracker",
    description: "Track Ethereum validator rewards and staking rewards in real-time. Monitor validator performance and analyze historical rewards data.",
    siteName: "Get Staking Data",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Get Staking Data - Ethereum Validator Rewards Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Staking Data - Ethereum Validator Rewards Tracker",
    description: "Track Ethereum validator rewards and staking rewards in real-time. Monitor validator performance and analyze historical rewards data.",
    images: ["/og-image.png"],
    creator: "@getstakingdata",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Get Staking Data",
    "description": "Track Ethereum validator rewards and staking rewards in real-time. Monitor validator performance and analyze historical rewards data.",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://get-staking-data.vercel.app",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1"
    },
    "featureList": [
      "Ethereum Validator Rewards Tracking",
      "Real-time Staking Rewards Monitoring",
      "Historical Data Analysis",
      "CSV Export Functionality",
      "Validator Performance Metrics"
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HubspotProvider>
          {children}
        </HubspotProvider>
      </body>
    </html>
  );
}
