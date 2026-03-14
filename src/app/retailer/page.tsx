"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Store, Loader2, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createBlock, checkProductExists } from '@/lib/blockchain';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  productId: z.string().min(3, 'Product ID is required'),
  retailerName: z.string().min(2, 'Retailer Name is required'),
  storeLocation: z.string().min(2, 'Store Location is required'),
});

export default function RetailerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: '',
      retailerName: '',
      storeLocation: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const exists = await checkProductExists(values.productId);
      if (!exists) {
        toast({
          variant: "destructive",
          title: "Invalid Product ID",
          description: "This item cannot be found in the supply chain record.",
        });
        return;
      }

      await createBlock(
        values.productId,
        'Retailer',
        'Received in Stock',
        {
          retailerName: values.retailerName,
          location: values.storeLocation,
          status: 'Shelf-Ready',
        }
      );
      
      toast({
        title: "Final Block Created",
        description: `Retail handover for ${values.productId} is now permanent.`,
      });
      router.push(`/verify/${values.productId}`);
    } catch (error) {
      // Errors are handled centrally
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
          <Store className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Retailer Module</h1>
          <p className="text-muted-foreground">Log the final delivery to store shelves.</p>
        </div>
      </div>

      <Card className="shadow-lg border-2">
        <CardHeader>
          <CardTitle>Retail Entry</CardTitle>
          <CardDescription>Append the final retail record to the immutable history.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SKU-XXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="retailerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retail Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Green Groceries Marketplace" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storeLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Physical Store Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 5th Avenue, New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-12 text-lg font-semibold bg-orange-600 hover:bg-orange-700 gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizing Chain...</>
                ) : (
                  <><ShieldCheck className="w-5 h-5" /> Confirm Retail Arrival</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
