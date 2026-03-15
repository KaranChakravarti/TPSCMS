import type {Metadata} from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'TPSCMS | Tamper-Proof Supply Chain Management System',
  description: 'A secure, blockchain-simulated supply chain tracking system by Sangeetha, PremSagar, Prashanth, and Karan Kumar. Verify product authenticity using immutable SHA-256 hash chaining.',
  keywords: ['supply chain', 'blockchain simulation', 'tamper-proof', 'product verification', 'SHA-256', 'TPSCMS', 'logistics tracking'],
  authors: [{ name: 'Sangeetha' }, { name: 'PremSagar' }, { name: 'Prashanth' }, { name: 'Karan Kumar' }],
  openGraph: {
    title: 'TPSCMS | Tamper-Proof Supply Chain',
    description: 'Immutable supply chain management system powered by blockchain simulation.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TPSCMS | Tamper-Proof Supply Chain',
    description: 'Verify your product journey from factory to retail with blockchain-grade security.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-border py-8 bg-card mt-12">
            <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
              <p>© {new Date().getFullYear()} TPSCMS - Tamper-Proof Supply Chain Management System. All rights reserved.</p>
              <p className="mt-2 text-xs">Developed by Sangeetha, PremSagar, Prashanth, and Karan Kumar.</p>
            </div>
          </footer>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
