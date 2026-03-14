
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Factory, Truck, Store, ShieldCheck, Home, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/manufacturer', label: 'Manufacturer', icon: Factory },
  { href: '/distributor', label: 'Distributor', icon: Truck },
  { href: '/retailer', label: 'Retailer', icon: Store },
  { href: '/verify', label: 'Verify', icon: ShieldCheck },
  { href: '/project-details', label: 'Details', icon: Info },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">CT</div>
            <span className="font-headline font-bold text-xl text-primary tracking-tight">TPSCMS</span>
          </Link>
          <div className="hidden md:flex gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                  pathname === link.href 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
