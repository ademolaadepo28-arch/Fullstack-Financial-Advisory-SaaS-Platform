import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Aura Wealth | Fullstack Financial Advisory & SaaS Platform',
  description:
    'Modern Lead Engine, Interactive Calculators, Paid 30-Min Advisory Intake ($150) & Recurring Model Portfolios ($49-$149/mo). Institutional quantitative wealth management.',
  keywords: [
    'Financial Advisory',
    'Model Portfolios',
    'Compound Wealth Calculator',
    'FIRE Runway Calculator',
    'Tax Drag',
    'Stripe Checkout',
    'Cal.com Scheduling',
    'CFP Advisory',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#080C14] text-slate-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
