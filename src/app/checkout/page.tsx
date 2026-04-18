'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fetchProductBySlug } from '@/lib/api/products-client';
import { getProductBySlug as getLocalProductBySlug, type Product } from '@/lib/products';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const productSlug = searchParams.get('product') || '';
  const travellersParam = searchParams.get('travellers') || '1';
  const dateParam = searchParams.get('date');

  const [product, setProduct] = useState<Product | null>(null);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [travellers, setTravellers] = useState(parseInt(travellersParam));
  const [travelDate, setTravelDate] = useState(dateParam ? new Date(dateParam) : undefined);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setIsProductLoading(true);

      const localProduct = getLocalProductBySlug(productSlug);
      if (localProduct) {
        if (isMounted) {
          setProduct(localProduct);
          setIsProductLoading(false);
        }
        return;
      }

      const fetchedProduct = await fetchProductBySlug(productSlug);
      if (isMounted) {
        setProduct(fetchedProduct);
        setIsProductLoading(false);
      }
    };

    void loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productSlug]);

  useEffect(() => {
    if (user) {
      setCustomerEmail(user.email || '');
      if (user.user_metadata?.full_name) {
        setCustomerName(user.user_metadata.full_name);
      }
    }
  }, [user]);

  const totalPrice = product ? product.price * travellers : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create booking
      const { data, error: dbError } = await supabase
        .from('bookings')
        .insert({
          user_id: user?.id,
          product_slug: productSlug,
          travel_date: travelDate?.toISOString().split('T')[0],
          travellers,
          total_price: totalPrice,
          status: 'confirmed',
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          special_requests: specialRequests,
        })
        .select()
        .maybeSingle();

      if (dbError) throw dbError;

      setBookingId(data?.id || '');
      setSuccess(true);
    } catch (err) {
      console.error('Booking error:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isProductLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 pb-12 pt-24 md:pt-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 pb-12 pt-24 md:pt-28">
        <div className="container mx-auto px-4">
          <Card className="max-w-xl mx-auto text-center">
            <CardContent className="pt-12 pb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
              <p className="text-slate-600 mb-4">
                Your trip to {product.title} has been confirmed.
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Booking ID: <span className="font-mono font-medium">{bookingId.slice(0, 8)}</span>
              </p>
              <p className="text-sm text-slate-600 mb-8">
                A confirmation email has been sent to <strong>{customerEmail}</strong>
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/account/bookings">
                  <Button>View My Bookings</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Explore More</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8 pt-24 md:pt-28">
      <div className="container mx-auto px-4">
        <Link href={`/products/${productSlug}`} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Package
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Travel Date *</Label>
                      <div className="h-10 px-3 py-2 rounded-md border border-input bg-white flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                        {travelDate ? format(travelDate, 'PPP') : 'Select a date'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <Input
                      id="requests"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any dietary requirements, accessibility needs, etc."
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay ₹${totalPrice.toLocaleString()}`
                      )}
                    </Button>
                    <p className="text-xs text-slate-500 text-center mt-3">
                      By completing this booking, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={product.heroImage}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{product.title}</h3>
                    <p className="text-sm text-slate-500">{product.location}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration</span>
                    <span className="font-medium">{product.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Travellers</span>
                    <span className="font-medium">{travellers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Travel Date</span>
                    <span className="font-medium">
                      {travelDate ? format(travelDate, 'PP') : 'Not selected'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Price per person</span>
                    <span>₹{product.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-blue-600">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
