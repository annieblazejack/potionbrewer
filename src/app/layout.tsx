import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import ViewportHeightHandler from '@/components/ViewportHeightHandler';
import { ToastProvider } from '@/contexts/ToastContext';

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Potion Brewer',
  description: 'A minimal approach to digital alchemy',
};        

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.variable}>
        <ToastProvider>
          <ViewportHeightHandler />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}


