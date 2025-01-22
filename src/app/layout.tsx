import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import ThemeProvider from '~/components/providers/theme-provider';
import { TRPCReactProvider } from '~/trpc/react';

import '~/styles/globals.css';

const jakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 2,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(0, 0%, 100%)' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(240, 10%, 3.9%)' },
  ],
};

export const metadata: Metadata = {
  title: 'Rion',
  description:
    'Easy and efficient tool for copying and pasting files between Google Drive accounts',
  authors: [{ name: 'driback', url: 'https://github.com/driback' }],
  keywords: [
    'google drive',
    'file transfer',
    'copy paste',
    'cloud storage',
    'file management',
  ],
  applicationName: 'Rion',
  generator: 'Next.js',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakartaSans.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster pauseWhenPageIsHidden richColors theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}
