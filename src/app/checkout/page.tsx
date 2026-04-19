'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
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
  const { user, session } = useAuth();

  const productSlug = searchParams.get('product') || '';
  const travellersParam = searchParams.get('travellers') || '1';
  const dateParam = searchParams.get('date');

  const [product, setProduct] = useState<Product | null>(null);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [travellers] = useState(parseInt(travellersParam, 10));
  const [travelDate] = useState(dateParam ? new Date(dateParam) : undefined);
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
    if (!user) {
      return;
    }

    setCustomerEmail(user.email || '');
    if (user.user_metadata?.full_name) {
      setCustomerName(user.user_metadata.full_name);
    }
  }, [user]);

  const totalPrice = product ? product.price * travellers : 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({
          product_slug: productSlug,
          travel_date: travelDate?.toISOString() || new Date().toISOString(),
          travellers,
          total_price: totalPrice,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          special_requests: specialRequests || null,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to create booking request.');
      }

      setBookingId(payload.data?.id || '');
      setSuccess(true);
    } catch (submitError) {
      console.error('Booking error:', submitError);
      setError('Failed to create booking request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isProductLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 pb-12 pt-24 md:pt-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-2xl font-bold text-slate-900">Product not found</h1>
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
          <Card className="mx-auto max-w-xl text-center">
            <CardContent className="pb-8 pt-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-slate-900">Booking Request Submitted!</h1>
              <p className="mb-4 text-slate-600">Your request for {product.title} has been received.</p>
              <p className="mb-6 text-sm text-slate-500">
                Booking ID: <span className="font-mono font-medium">{bookingId.slice(0, 8)}</span>
              </p>
              <p className="mb-8 text-sm text-slate-600">
                Our team will connect with you within 24 hours at <strong>{customerEmail}</strong>
              </p>
              <div className="flex justify-center gap-3">
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
        <Link
          href={`/products/${productSlug}`}
          className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Package
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : null}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={customerName}
                        onChange={(event) => setCustomerName(event.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerEmail}
                        onChange={(event) => setCustomerEmail(event.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerPhone}
                        onChange={(event) => setCustomerPhone(event.target.value)}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Travel Date *</Label>
                      <div className="flex h-10 items-center rounded-md border border-input bg-white px-3 py-2">
                        <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                        {travelDate ? format(travelDate, 'PPP') : 'Select a date'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <Input
                      id="requests"
                      value={specialRequests}
                      onChange={(event) => setSpecialRequests(event.target.value)}
                      placeholder="Any dietary requirements, accessibility needs, etc."
                    />
                  </div>

                  <div className="border-t pt-4">
                    <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting request...
                        </>
                      ) : (
                        `Submit Request - INR ${totalPrice.toLocaleString('en-IN')}`
                      )}
                    </Button>
                    <p className="mt-3 text-center text-xs text-slate-500">
                      Your request goes to our team for review and confirmation within 24 hours.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
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

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Price per person</span>
                    <span>INR {product.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">INR {totalPrice.toLocaleString('en-IN')}</span>
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
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
