import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/layout/AppShell";
import { GlobalTimer } from "@/components/focus/GlobalTimer";
import { SearchCommand } from "@/components/SearchCommand";
import { LanguageProvider } from "@/contexts/LanguageContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://studysync.ca'),
  title: {
    default: 'StudySync | The Student Planner That Actually Works',
    template: '%s | StudySync'
  },
  description: 'Manage courses, track assignments, and boost your GPA with our all-in-one student planner. Features include flashcards, Pomodoro timer, habit tracking, and more.',
  keywords: ['student planner', 'study app', 'academic planner', 'flashcards', 'pomodoro timer', 'GPA tracker', 'task management', 'student productivity'],
  authors: [{ name: 'StudySync' }],
  creator: 'StudySync',
  publisher: 'StudySync',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://studysync.ca',
    title: 'StudySync | The Student Planner That Actually Works',
    description: 'Manage courses, track assignments, and boost your GPA with our all-in-one student planner.',
    siteName: 'StudySync',
    images: [{
      url: '/opengraph-image.png',
      width: 1200,
      height: 630,
      alt: 'StudySync - Your Academic Life, Perfectly Organized'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudySync | The Student Planner That Actually Works',
    description: 'Manage courses, track assignments, and boost your GPA with our all-in-one student planner.',
    images: ['/opengraph-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  verification: {
    google: 'EI5OaM_5ulaISlRbQhgww9kSEg9vyOKeQzE2sTxc2mo',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <GoogleAnalytics GA_MEASUREMENT_ID="G-VZ5FHNMP1M" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <GlobalTimer />
            <SearchCommand />
            <AppShell>
              {children}
            </AppShell>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
