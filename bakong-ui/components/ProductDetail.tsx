'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCart();
  const discount = ((product.price - product.priceAfterDiscount) / product.price) * 100;

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <div className="md:flex">
        <div className="md:w-1/2 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-8">
          <div className="relative w-full h-96">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-48 h-48 text-zinc-300 dark:text-zinc-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            {discount > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded text-lg font-semibold z-10">
                -{discount.toFixed(0)}% OFF
              </div>
            )}
          </div>
        </div>
        <div className="md:w-1/2 p-8">
          <Link
            href="/"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 mb-4 inline-block"
          >
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            {product.name}
          </h1>
          <div className="mb-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Store</p>
            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
              {product.store.storeLabel}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              {product.store.email}
            </p>
          </div>
          <div className="mb-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Price</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                ${product.priceAfterDiscount.toFixed(2)}
              </span>
              {product.priceAfterDiscount < product.price && (
                <span className="text-xl text-zinc-500 dark:text-zinc-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            {discount > 0 && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                You save ${(product.price - product.priceAfterDiscount).toFixed(2)}!
              </p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 py-3 rounded-lg font-semibold text-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors mb-4"
          >
            Add to Cart
          </button>
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Added on {new Date(product.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
