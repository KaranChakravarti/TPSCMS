
"use client"

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Factory, Download, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createBlock } from '@/lib/blockchain';
import { QRCodeCanvas } from 'qrcode.react';

const formSchema = z.object({
  productId: z.string().min(3, 'Product ID must be at least 3 characters'),
  productName: z.string().min(2, 'Product Name is required'),
  batchNumber: z.string().min(1, 'Batch Number is required'),
  manufacturingDate: z.string().min(1, 'Manufacturing Date is required'),
});

export default function ManufacturerPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredProduct, setRegisteredProduct] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: '',
      productName: '',
      batchNumber: '',
      manufacturingDate: new Date().toISOString().split('T')[0],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await createBlock(
        values.productId,
        'Manufacturer',
        'Production Completed',
        {
          productName: values.productName,
          batchNumber: values.batchNumber,
          manufacturingDate: values.manufacturingDate,
        }
      );
      
      setRegisteredProduct(values.productId);
      toast({
        title: "Product Registered",
        description: `Product ${values.productId} has been added to the blockchain.`,
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to register product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const downloadQR = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `QR-${registeredProduct}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
          <Factory className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Manufacturer Module</h1>
          <p className="text-muted-foreground">Register products and initiate origin records.</p>
        </div>
      </div>

      {!registeredProduct ? (
        <Card className="shadow-lg border-2">
          <CardHeader>
            <CardTitle>Product Registration</CardTitle>
            <CardDescription>Enter product details to create the first block in the supply chain.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product ID (Unique Identifier)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. SKU-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Organic Coffee Beans" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="batchNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. B-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="manufacturingDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacturing Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                  ) : (
                    'Register & Generate Block'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-xl border-2 border-accent/50 text-center py-12">
          <CardContent className="space-y-6">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Product Securely Registered</h2>
              <p className="text-muted-foreground">The first block for <b>{registeredProduct}</b> has been mined and added to the ledger.</p>
            </div>
            
            <div className="bg-card border-2 border-dashed rounded-2xl p-8 max-w-[250px] mx-auto">
               <div ref={qrRef} className="aspect-square bg-white flex items-center justify-center rounded-lg border p-4">
                  <QRCodeCanvas 
                    value={registeredProduct} 
                    size={180}
                    level="H"
                    includeMargin={false}
                  />
               </div>
               <p className="mt-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">Product ID: {registeredProduct}</p>
            </div>

            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <Button onClick={downloadQR} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                <Download className="w-4 h-4" /> Download QR Code
              </Button>
              <Button variant="outline" onClick={() => setRegisteredProduct(null)}>
                Register Another Product
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a href={`/verify/${registeredProduct}`}>View Ledger Record</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
