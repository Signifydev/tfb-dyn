'use client';

import { useState, useEffect } from 'react';
import { SAMPLE_PRODUCTS, CATEGORIES, type Product } from '@/lib/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Eye, Star, MapPin, Users } from 'lucide-react';

export default function AdminProductsPage() {
  const [products] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: products.length,
    featured: products.filter((p) => p.featured).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.reviews, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Products Management</h1>
        <p className="text-slate-600">View and manage all travel packages</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <p className="text-sm text-slate-600">Total Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">{stats.featured}</div>
            <p className="text-sm text-slate-600">Featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(stats.totalValue / 100000)}K+
            </div>
            <p className="text-sm text-slate-600">Total Reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.slug}>
                  <TableCell>
                    <div className="font-medium">{product.title}</div>
                    <div className="text-xs text-slate-500">/{product.slug}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {CATEGORIES.find((c) => c.id === product.category)?.name || product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="text-sm">{product.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{product.duration}</TableCell>
                  <TableCell className="font-medium">
                    ₹{product.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.featured ? (
                      <Badge className="bg-amber-100 text-amber-700">Featured</Badge>
                    ) : (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{selectedProduct?.title}</DialogTitle>
                          </DialogHeader>
                          {selectedProduct && (
                            <div className="space-y-4">
                              <div>
                                <img
                                  src={selectedProduct.heroImage}
                                  alt={selectedProduct.title}
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-slate-500">Category:</span>{' '}
                                  <span className="font-medium">{selectedProduct.category}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500">Location:</span>{' '}
                                  <span className="font-medium">{selectedProduct.location}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500">Duration:</span>{' '}
                                  <span className="font-medium">{selectedProduct.duration}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500">Group Size:</span>{' '}
                                  <span className="font-medium">{selectedProduct.groupSize}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500">Price:</span>{' '}
                                  <span className="font-medium text-blue-600">
                                    ₹{selectedProduct.price.toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-500">Rating:</span>{' '}
                                  <span className="font-medium">{selectedProduct.rating}/5</span>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className="text-sm text-slate-600">{selectedProduct.description}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Highlights</h4>
                                <ul className="text-sm text-slate-600 list-disc list-inside">
                                  {selectedProduct.highlights.map((h, i) => (
                                    <li key={i}>{h}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Inclusions</h4>
                                <ul className="text-sm text-slate-600 list-disc list-inside">
                                  {selectedProduct.inclusions.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <a
                                  href={`/products/${selectedProduct.slug}`}
                                  target="_blank"
                                  className="flex-1"
                                >
                                  <Button className="w-full" variant="outline">
                                    View on Website
                                  </Button>
                                </a>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
