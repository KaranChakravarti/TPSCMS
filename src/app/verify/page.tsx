
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Search, QrCode, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QRScanner } from '@/components/QRScanner';

export default function VerifyPage() {
  const router = useRouter();
  const [productId, setProductId] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (productId.trim()) {
      router.push(`/verify/${productId.trim()}`);
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    setIsScanning(false);
    router.push(`/verify/${decodedText.trim()}`);
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full text-emerald-600 mb-4">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Verify Your Product</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Scan the QR code or enter the Product ID to witness the verified journey through our secure blockchain ledger.
        </p>
      </div>

      <Card className="shadow-2xl border-2 overflow-hidden bg-white/80 backdrop-blur">
        <CardContent className="p-8">
          {isScanning ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <QrCode className="w-5 h-5" /> Camera Scanning Active
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setIsScanning(false)} className="text-muted-foreground">
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
              </div>
              <QRScanner onScanSuccess={handleScanSuccess} />
              <p className="text-center text-sm text-muted-foreground">Position the product's QR code within the frame.</p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input 
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Enter unique Product ID (e.g., SKU-12345)" 
                    className="h-16 pl-12 text-lg rounded-xl border-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="lg" className="h-16 px-10 text-lg font-bold rounded-xl bg-primary hover:bg-primary/90 flex-1 md:flex-none">
                    Check
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="lg" 
                    onClick={() => setIsScanning(true)}
                    className="h-16 px-6 border-2 border-primary text-primary hover:bg-primary/5 rounded-xl flex-1 md:flex-none"
                  >
                    <QrCode className="w-6 h-6" />
                  </Button>
                </div>
              </form>
              
              <div className="mt-12 grid md:grid-cols-3 gap-8">
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <QrCode className="w-5 h-5 text-slate-500" />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Scan QR</h3>
                  <p className="text-xs text-muted-foreground">Instantly access history by scanning the unique label.</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="w-5 h-5 text-slate-500" />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Verified</h3>
                  <p className="text-xs text-muted-foreground">Each step is signed with a cryptographic SHA-256 hash.</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-5 h-5 text-slate-500" />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Traceable</h3>
                  <p className="text-xs text-muted-foreground">Full transparency from factory to retail doorstep.</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
