'use client';

import Navbar from '@/components/Navbar';
import CartItem from '@/components/CartItem';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import PayKhqrModal from '@/components/PayKhqrModal';
import type { StoreInfo } from '@/lib/types';

type SellerGroup = {
  store: StoreInfo;
  total: number;
  itemCount: number;
};

export default function CartPage() {
  const { cartItems, getTotalPrice, clearCart, clearItemsByStoreId } =
    useCart();
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);
  const [selectedAmount, setSelectedAmount] = useState(0);

  const sellerGroups = useMemo<SellerGroup[]>(() => {
    const map = new Map<number, SellerGroup>();

    for (const item of cartItems) {
      const id = item.product.store.id;
      const existing = map.get(id);
      const lineTotal = item.product.priceAfterDiscount * item.quantity;

      if (existing) {
        existing.total += lineTotal;
        existing.itemCount += item.quantity;
      } else {
        map.set(id, {
          store: item.product.store,
          total: lineTotal,
          itemCount: item.quantity,
        });
      }
    }

    return Array.from(map.values());
  }, [cartItems]);

  const handlePayForSeller = (group: SellerGroup) => {
    setSelectedStore(group.store);
    setSelectedAmount(group.total);
    setIsPayOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-12 text-center border border-zinc-200 dark:border-zinc-800">
            <svg
              className="w-24 h-24 mx-auto text-zinc-300 dark:text-zinc-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-4">
              Your cart is empty
            </p>
            <Link
              href="/"
              className="inline-block bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
              {cartItems.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Total:
                </span>
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={clearCart}
                  className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 py-3 rounded-lg font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {sellerGroups.length > 0 && (
                <div className="mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    Pay by seller
                  </p>
                  <div className="space-y-2">
                    {sellerGroups.map((group) => (
                      <div
                        key={group.store.id}
                        className="flex items-center justify-between rounded-lg bg-zinc-100 dark:bg-zinc-800 px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                            {group.store.storeLabel}
                          </p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">
                            {group.itemCount} item{group.itemCount > 1 ? 's' : ''} • $
                            {group.total.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => handlePayForSeller(group)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-md bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                        >
                          Pay this seller
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {selectedStore && (
        <PayKhqrModal
          isOpen={isPayOpen}
          onClose={() => setIsPayOpen(false)}
          amount={selectedAmount}
          currency="USD"
          purpose={`Pay order to ${selectedStore.storeLabel}`}
          store={selectedStore}
          onPaid={() => {
            clearItemsByStoreId(selectedStore.id);
            setIsPayOpen(false);
            setSelectedStore(null);
            setSelectedAmount(0);
          }}
        />
      )}
    </div>
  );
}
