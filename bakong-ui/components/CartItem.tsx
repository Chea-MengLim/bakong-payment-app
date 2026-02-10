'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  return (
    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 last:border-b-0">
      <div className="flex gap-4">
        <Link href={`/products/${product.id}`} className="shrink-0">
          <div className="relative w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-zinc-300 dark:text-zinc-600"
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
          </div>
        </Link>
        <div className="flex-1">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 mb-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
            {product.store.storeLabel}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border border-zinc-300 dark:border-zinc-700 rounded">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="px-3 py-1 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  −
                </button>
                <span className="px-4 py-1 text-zinc-900 dark:text-zinc-50 font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="px-3 py-1 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(product.id)}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
              >
                Remove
              </button>
            </div>
            <div className="text-right">
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                ${(product.priceAfterDiscount * quantity).toFixed(2)}
              </p>
              {quantity > 1 && (
                <p className="text-sm text-zinc-500 dark:text-zinc-500">
                  ${product.priceAfterDiscount.toFixed(2)} each
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
