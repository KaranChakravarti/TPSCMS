
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Code, ShieldCheck, Database, Layers, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

/**
 * @fileOverview Project Details Page
 * Mentions group members and explains the technical implementation of the 
 * Tamper-Proof Supply Chain Management System.
 */

export default function ProjectDetailsPage() {
  const members = ["Sangeetha", "PremSagar", "Prashanth", "Karan Kumar"];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full text-primary mb-4">
          <Info className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Project Details</h1>
        <p className="text-xl text-muted-foreground">Tamper-Proof Supply Chain Management System</p>
      </div>

      <div className="grid gap-8">
        {/* Group Members Section */}
        <Card className="shadow-md border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" /> Group Members
            </CardTitle>
            <CardDescription>The team behind the development of TPSCMS.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {members.map(member => (
                <div key={member} className="bg-secondary/50 border border-border p-4 rounded-xl text-center font-bold text-primary shadow-sm">
                  {member}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Goal */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" /> Project Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              The primary objective is to simulate <strong>blockchain-like immutable records</strong> for supply chain tracking. 
              By utilizing cryptographic SHA-256 hashing, the system ensures that every step of a product's journey—from 
              manufacturing to retail—is recorded in a permanent ledger that cannot be altered without breaking the chain of trust.
            </p>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-6 h-6 text-primary" /> Technology Stack
            </CardTitle>
            <CardDescription>Modern Serverless Infrastructure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-primary mb-3">Frontend</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Next.js 15 (React Framework)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Tailwind CSS (Styling)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> ShadCN UI & Lucide Icons
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-primary mb-3">Backend & Storage</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Firebase Firestore (Real-time DB)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Firebase Auth (Secure Access)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Web Crypto API (SHA-256 Logic)
                  </li>
                </ul>
              </div>
            </div>
            <Separator />
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                <strong>Stack Note:</strong> This implementation leverages a high-performance serverless environment 
                (Next.js & Firebase) to provide real-time synchronization and a responsive user interface, 
                adhering to the blockchain simulation requirements with modern industry standards.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Core Modules */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-6 h-6 text-primary" /> Functional Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { 
                  title: "Manufacturer Module", 
                  desc: "Register products with metadata (ID, Name, Batch, Date). Generates unique QR code and creates the genesis block.",
                  color: "bg-blue-100 text-blue-600"
                },
                { 
                  title: "Distributor Module", 
                  desc: "Appends logistical data (Distributor Name, Location, Timestamp) to the chain using the previous block's hash.",
                  color: "bg-purple-100 text-purple-600"
                },
                { 
                  title: "Retailer Module", 
                  desc: "Logs final handover records into the retail environment, completing the verifiable journey.",
                  color: "bg-orange-100 text-orange-600"
                },
                { 
                  title: "Verification Module", 
                  desc: "Public-facing tool to scan/enter IDs and visualize the entire tamper-proof history in a timeline format.",
                  color: "bg-emerald-100 text-emerald-600"
                },
              ].map((module, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold transition-transform group-hover:scale-110 ${module.color}`}>
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{module.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{module.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security / Blockchain Simulation */}
        <Card className="border-accent bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6 text-accent" /> Blockchain Simulation Logic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Every supply chain event is stored as an immutable "block" in Firestore with the following structure:
            </p>
            <div className="bg-card border p-4 rounded-lg font-mono text-xs overflow-x-auto shadow-inner">
              <pre className="text-primary">
{`{
  index: number,
  timestamp: string,
  productId: string,
  actor: 'Manufacturer' | 'Distributor' | 'Retailer',
  action: string,
  previousHash: string,
  currentHash: string (SHA-256)
}`}
              </pre>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The <strong>previousHash</strong> field links each record to the one before it. 
              Any attempt to tamper with past data would result in a hash mismatch, 
              instantly invalidating the entire subsequent chain and exposing the modification.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
