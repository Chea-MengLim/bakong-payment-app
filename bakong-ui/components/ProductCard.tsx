'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = ((product.price - product.priceAfterDiscount) / product.price) * 100;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <div className="relative h-64 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-24 h-24 text-zinc-300 dark:text-zinc-600"
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
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold z-10">
              -{discount.toFixed(0)}%
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            {product.store.storeLabel}
          </p>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                ${product.priceAfterDiscount.toFixed(2)}
              </span>
              {product.priceAfterDiscount < product.price && (
                <span className="text-sm text-zinc-500 dark:text-zinc-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 py-2 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
