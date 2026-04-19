'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  product_slug: string;
  travel_date: string;
  travellers: number;
  total_price: number;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: string;
  special_requests?: string;
}

export default function AdminBookingsPage() {
  const { session } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!session?.access_token) {
      return;
    }

    void fetchBookings();
  }, [session?.access_token]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings?admin=1', {
        headers: {
          Authorization: `Bearer ${session?.access_token || ''}`,
        },
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to fetch booking requests.');
      }

      setBookings(payload.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({ id, status }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to update booking request.');
      }

      setBookings((current) =>
        current.map((booking) =>
          booking.id === id ? { ...booking, status: payload.data?.status || status } : booking
        )
      );
      setSelectedBooking((current) =>
        current && current.id === id ? { ...current, status: payload.data?.status || status } : current
      );
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      booking.customer_name.toLowerCase().includes(query) ||
      booking.customer_email.toLowerCase().includes(query) ||
      booking.product_slug.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((booking) => booking.status === 'confirmed').length,
    pending: bookings.filter((booking) => booking.status === 'pending').length,
    revenue: bookings
      .filter((booking) => booking.status === 'confirmed')
      .reduce((sum, booking) => sum + booking.total_price, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bookings Management</h1>
        <p className="text-slate-600">View and manage all customer booking requests</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <p className="text-sm text-slate-600">Total Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <p className="text-sm text-slate-600">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <p className="text-sm text-slate-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              INR {stats.revenue.toLocaleString('en-IN')}
            </div>
            <p className="text-sm text-slate-600">Confirmed Value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by customer, email, or package..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-sm text-slate-500">Loading booking requests...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Travel Date</TableHead>
                  <TableHead>Travellers</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.customer_name}</div>
                        <div className="text-sm text-slate-500">{booking.customer_email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">{booking.product_slug}</TableCell>
                    <TableCell>{format(new Date(booking.travel_date), 'dd MMM yyyy')}</TableCell>
                    <TableCell>{booking.travellers}</TableCell>
                    <TableCell className="font-medium">
                      INR {booking.total_price.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                          </DialogHeader>
                          {selectedBooking && (
                            <div className="space-y-4">
                              <div>
                                <h4 className="mb-2 font-semibold">Customer Info</h4>
                                <div className="space-y-1 text-sm">
                                  <p>Name: {selectedBooking.customer_name}</p>
                                  <p>Email: {selectedBooking.customer_email}</p>
                                  <p>Phone: {selectedBooking.customer_phone}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="mb-2 font-semibold">Booking Info</h4>
                                <div className="space-y-1 text-sm">
                                  <p>Package: {selectedBooking.product_slug}</p>
                                  <p>Travel Date: {format(new Date(selectedBooking.travel_date), 'PPP')}</p>
                                  <p>Travellers: {selectedBooking.travellers}</p>
                                  <p>Total: INR {selectedBooking.total_price.toLocaleString('en-IN')}</p>
                                  <p>Booked On: {format(new Date(selectedBooking.created_at), 'PPP')}</p>
                                  {selectedBooking.special_requests ? (
                                    <p>Notes: {selectedBooking.special_requests}</p>
                                  ) : null}
                                </div>
                              </div>
                              <div className="flex gap-2 pt-4">
                                {selectedBooking.status === 'pending' ? (
                                  <>
                                    <Button size="sm" onClick={() => updateStatus(selectedBooking.id, 'confirmed')}>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Confirm
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => updateStatus(selectedBooking.id, 'cancelled')}
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Cancel
                                    </Button>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
