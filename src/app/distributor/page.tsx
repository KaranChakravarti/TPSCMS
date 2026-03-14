"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Truck, Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createBlock, getProductHistory } from '@/lib/blockchain';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  productId: z.string().min(3, 'Product ID is required'),
  distributorName: z.string().min(2, 'Distributor Name is required'),
  location: z.string().min(2, 'Location is required'),
});

export default function DistributorPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: '',
      distributorName: '',
      location: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Check if product exists first
      const history = await getProductHistory(values.productId);
      if (history.length === 0) {
        toast({
          variant: "destructive",
          title: "Product Not Found",
          description: "This Product ID has not been registered by a manufacturer.",
        });
        return;
      }

      await createBlock(
        values.productId,
        'Distributor',
        'Package Received & Processed',
        {
          distributorName: values.distributorName,
          location: values.location,
          logisticsUpdate: 'Verified and scanned for onward distribution',
        }
      );
      
      toast({
        title: "Record Added",
        description: `Distribution event for ${values.productId} recorded in the chain.`,
      });
      router.push(`/verify/${values.productId}`);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add record. Please check the Product ID.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Distributor Module</h1>
          <p className="text-muted-foreground">Log logistics events and transition records.</p>
        </div>
      </div>

      <Card className="shadow-lg border-2">
        <CardHeader>
          <CardTitle>Log Distribution Event</CardTitle>
          <CardDescription>Verify the product ID and add your logistics data to the ledger.</CardDescription>
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
                    <div className="relative">
                      <FormControl>
                        <Input placeholder="Scan or enter SKU-XXXXX" {...field} />
                      </FormControl>
                      <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="distributorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distributor Entity Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Global Logistics Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Facility Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Warehouse A, Chicago Hub" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-12 text-lg font-semibold bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Committing to Chain...</>
                ) : (
                  'Confirm Shipment & Record'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
