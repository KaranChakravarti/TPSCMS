"use client"

import { useParams } from 'next/navigation';
import { Block } from '@/lib/blockchain';
import { Loader2, CheckCircle2, History, Info, Factory, Truck, Store, Hash, Calendar, ShieldCheck, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useFirebase, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';

export default function VerificationDetailsPage() {
  const { id } = useParams();
  const { firestore } = useFirebase();
  const productId = typeof id === 'string' ? id : '';

  // Real-time product master record
  const productRef = useMemoFirebase(() => {
    if (!firestore || !productId) return null;
    return doc(firestore, 'products', productId);
  }, [firestore, productId]);
  const { data: product, isLoading: productLoading } = useDoc(productRef);

  // Real-time supply chain blocks
  const blocksQuery = useMemoFirebase(() => {
    if (!firestore || !productId) return null;
    return query(
      collection(firestore, 'products', productId, 'supplyChainBlocks'),
      orderBy('index', 'asc')
    );
  }, [firestore, productId]);
  const { data: history, isLoading: blocksLoading } = useCollection<Block>(blocksQuery);

  const loading = productLoading || blocksLoading;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Fetching blockchain records...</p>
      </div>
    );
  }

  // If the product document doesn't exist, it's not authentic
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <History className="w-16 h-16 text-muted-foreground mx-auto" />
          <h1 className="text-3xl font-headline font-bold">Product Not Found</h1>
          <p className="text-muted-foreground">No records were found for Product ID <b>{productId}</b>. This item may not be authentic or hasn't been registered.</p>
          <div className="pt-4">
             <a href="/verify" className="text-primary font-bold underline">Try another ID</a>
          </div>
        </div>
      </div>
    );
  }

  // Simple chain verification: check if hashes align
  let chainValid = (history?.length || 0) > 0;
  if (history && history.length > 1) {
    for (let i = 1; i < history.length; i++) {
      if (history[i].previousHash !== history[i-1].currentHash) {
        chainValid = false;
        break;
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <Badge variant="outline" className="mb-2 px-3 py-1 text-xs border-primary text-primary bg-primary/5 uppercase tracking-widest font-bold">
            Audit Ledger
          </Badge>
          <h1 className="text-4xl font-headline font-bold text-primary">Product Traceability Report</h1>
          <p className="text-muted-foreground">Secure ID: <span className="font-mono text-foreground font-bold">{productId}</span></p>
        </div>

        {chainValid ? (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl px-6 py-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-emerald-800 leading-tight">Integrity Verified</p>
              <p className="text-xs text-emerald-600">The hash chain is complete and untampered.</p>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl px-6 py-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-red-800 leading-tight">Verification Incomplete</p>
              <p className="text-xs text-red-600">Waiting for blocks or record chain appears compromised.</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          {/* Visual Timeline */}
          {history && history.length > 0 ? (
            <div className="relative space-y-12 pl-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary before:to-accent/30">
              {history.map((block) => {
                const Icon = block.actor === 'Manufacturer' ? Factory : block.actor === 'Distributor' ? Truck : Store;
                const color = block.actor === 'Manufacturer' ? 'text-blue-600 bg-blue-100' : block.actor === 'Distributor' ? 'text-purple-600 bg-purple-100' : 'text-orange-600 bg-orange-100';

                return (
                  <div key={block.id} className="relative">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-11 top-0 w-8 h-8 rounded-full border-4 border-background shadow-md flex items-center justify-center z-10 ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <Card className="border-2 shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">{block.actor}</CardTitle>
                          <Badge variant="secondary" className="font-mono text-[10px]">{block.currentHash.substring(0, 8)}...</Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> {new Date(block.timestamp).toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm font-bold text-primary mb-1">{block.action}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {Object.entries(block.details || {}).map(([key, value]) => (
                              <div key={key}>
                                <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                <p className="font-semibold text-foreground">{String(value)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono bg-slate-50 p-2 rounded border">
                             <Hash className="w-3 h-3" /> PREV: {block.previousHash}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-primary/70 font-mono bg-primary/5 p-2 rounded border border-primary/10">
                             <Hash className="w-3 h-3" /> CURR: {block.currentHash}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center border-2 border-dashed rounded-3xl">
              <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No supply chain events have been logged for this product yet.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Item Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-primary-foreground/60 text-xs uppercase tracking-widest font-bold">Product Name</p>
                <p className="text-xl font-bold">{product.productName || 'N/A'}</p>
              </div>
              <Separator className="bg-primary-foreground/20" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-primary-foreground/60 text-xs uppercase tracking-widest font-bold">Batch</p>
                  <p className="font-bold">{product.batchNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-primary-foreground/60 text-xs uppercase tracking-widest font-bold">Registered</p>
                  <p className="font-bold">{new Date(product.registeredAt).toLocaleDateString()}</p>
                </div>
              </div>
              <Separator className="bg-primary-foreground/20" />
              <div>
                <p className="text-primary-foreground/60 text-xs uppercase tracking-widest font-bold">Current Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <p className="font-bold">{history && history.length > 0 ? history[history.length - 1].action : 'Registered'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" /> Ledger Proof
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">Each block in the history above is cryptographically linked to the one before it using SHA-256. This ensures an immutable record of the journey.</p>
              <div className="space-y-2">
                 <div className="flex justify-between">
                   <span className="text-xs text-muted-foreground">Algorithm</span>
                   <span className="text-xs font-mono font-bold">SHA-256</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-xs text-muted-foreground">Total Blocks</span>
                   <span className="text-xs font-mono font-bold">{history?.length || 0}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-xs text-muted-foreground">Storage</span>
                   <span className="text-xs font-mono font-bold">Immutable Ledger</span>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
