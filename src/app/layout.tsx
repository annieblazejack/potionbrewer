import type { Metadata } from 'next';
import { Caudex } from 'next/font/google';
import './globals.css';

const caudex = Caudex({
  variable: '--font-caudex',
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
      <body className={caudex.variable}>{children}</body>
    </html>
  );
}


