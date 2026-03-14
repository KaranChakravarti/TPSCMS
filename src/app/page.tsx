
"use client"

import Link from 'next/link';
import { Factory, Truck, Store, ShieldCheck, ChevronRight, Lock, Database, Search, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { firestore } = useFirebase();

  // Real-time query for the 5 most recently registered products
  const recentProductsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'products'), 
      orderBy('registeredAt', 'desc'), 
      limit(5)
    );
  }, [firestore]);

  const { data: recentProducts, isLoading } = useCollection(recentProductsQuery);

  const modules = [
    {
      title: 'Manufacturer',
      description: 'Register new products and initiate the supply chain blockchain.',
      icon: Factory,
      href: '/manufacturer',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Distributor',
      description: 'Record distribution handovers and logistical transitions.',
      icon: Truck,
      href: '/distributor',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Retailer',
      description: 'Finalize the journey by logging products into the retail space.',
      icon: Store,
      href: '/retailer',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Verify Product',
      description: 'Transparently view the entire history of any registered item.',
      icon: ShieldCheck,
      href: '/verify',
      color: 'bg-emerald-100 text-emerald-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-headline font-extrabold text-primary tracking-tight">
          Trust Every Step of the Journey
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
          TPSCMS uses SHA-256 hash chaining to create an immutable, tamper-proof record of your product's lifecycle from factory to customer.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link href="/verify">
            <Button size="lg" className="rounded-full px-8 gap-2 w-full sm:w-auto">
              Start Verification <Search className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/project-details">
            <Button variant="outline" size="lg" className="rounded-full px-8 gap-2 w-full sm:w-auto">
              Project Details <Users className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {modules.map((module) => (
          <Link key={module.title} href={module.href} className="group transition-transform hover:-translate-y-1">
            <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-all">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${module.color}`}>
                  <module.icon className="w-6 h-6" />
                </div>
                <CardTitle className="font-headline font-bold text-xl">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-primary font-semibold text-sm">
                  Access Module <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <section className="md:col-span-2 bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-headline font-bold text-primary">Immutable Logic</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Hashing Integrity</h3>
                    <p className="text-muted-foreground text-sm">Every block contains the hash of the previous record. Altering past data breaks the chain.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <Database className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Distributed Ledger</h3>
                    <p className="text-muted-foreground text-sm">Records are stored permanently in Firestore, accessible globally for public verification.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-card rounded-2xl shadow-xl border border-border p-6 flex flex-col justify-center">
                <div className="space-y-3 font-code text-[10px] text-muted-foreground overflow-hidden">
                  <p className="text-primary font-bold">{"// Block integrity check"}</p>
                  <p>{"{"}</p>
                  <p className="ml-4">"id": "blk_99a2",</p>
                  <p className="ml-4">"prev": "3f9c...a21e",</p>
                  <p className="ml-4 text-accent font-bold">"hash": "9b1e...f7d4"</p>
                  <p>{"}"}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Global Activity
          </h2>
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
                ))}
              </div>
            ) : recentProducts && recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <Link key={product.id} href={`/verify/${product.id}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer group mb-3">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="overflow-hidden">
                        <p className="font-bold text-sm truncate">{product.productName}</p>
                        <p className="text-xs text-muted-foreground font-mono">ID: {product.id}</p>
                      </div>
                      <Badge variant="secondary" className="group-hover:bg-primary group-hover:text-white transition-colors">
                        View
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-xl">
                No recent activity recorded yet.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
