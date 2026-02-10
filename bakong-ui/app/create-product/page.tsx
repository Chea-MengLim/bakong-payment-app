'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { createProduct } from '@/lib/api';
import { ProductRequest } from '@/lib/types';

function CreateProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sellerIdParam = searchParams.get('sellerId');

  const [sellerId, setSellerId] = useState<string>(sellerIdParam || '');
  const [formData, setFormData] = useState<ProductRequest>({
    name: '',
    price: 0,
    priceAfterDiscount: 0,
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (sellerIdParam) {
      setSellerId(sellerIdParam);
    }
  }, [sellerIdParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sellerId || isNaN(parseInt(sellerId))) {
      setError('Please enter a valid Seller ID');
      return;
    }

    if (formData.priceAfterDiscount >= formData.price) {
      setError('Price after discount must be less than original price');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createProduct(parseInt(sellerId), formData);
      setSuccess(true);
      // Clear form after successful creation
      setFormData({
        name: '',
        price: 0,
        priceAfterDiscount: 0,
        imageUrl: '',
      });
      // Redirect to products page after 4 seconds
      setTimeout(() => {
        router.push('/');
      }, 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
          Create Product
        </h1>

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <p className="text-green-800 dark:text-green-200">
              Product created successfully! Redirecting to products page...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
          <div className="space-y-4">
            <div>
              <label htmlFor="sellerId" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Seller ID *
              </label>
              <input
                type="number"
                id="sellerId"
                required
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="Enter your Seller ID"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                You received this ID when you registered as a seller
              </p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="Product Name"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Original Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0.01"
                step="0.01"
                value={formData.price || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="priceAfterDiscount" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Price After Discount ($) *
              </label>
              <input
                type="number"
                id="priceAfterDiscount"
                name="priceAfterDiscount"
                required
                min="0.01"
                step="0.01"
                value={formData.priceAfterDiscount || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="0.00"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Must be less than the original price
              </p>
            </div>

            {formData.price > 0 && formData.priceAfterDiscount > 0 && (
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Discount:</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {(((formData.price - formData.priceAfterDiscount) / formData.price) * 100).toFixed(0)}% off
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Savings: ${(formData.price - formData.priceAfterDiscount).toFixed(2)}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Enter a URL to an image for this product
              </p>
              {formData.imageUrl && (
                <div className="mt-2">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Preview:</p>
                  <div className="relative w-full h-48 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                    <img
                      src={formData.imageUrl}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 py-3 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Product...' : 'Create Product'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default function CreateProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    }>
      <CreateProductForm />
    </Suspense>
  );
}
