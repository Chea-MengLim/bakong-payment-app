import Navbar from '@/components/Navbar';
import { getAllSellers } from '@/lib/api';
import { Seller } from '@/lib/types';
import Link from 'next/link';

export default async function SellersPage() {
  let sellers: Seller[] = [];
  let error: string | null = null;

  try {
    sellers = await getAllSellers();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load sellers';
    console.error('Error loading sellers:', err);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            All Sellers
          </h1>
          <Link
            href="/register-seller"
            className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-4 py-2 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Register as Seller
          </Link>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">
              Error loading sellers: {error}
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              Make sure the API is running on http://localhost:8080
            </p>
          </div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-4">
              No sellers registered yet.
            </p>
            <Link
              href="/register-seller"
              className="inline-block bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Be the First Seller
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <div
                key={seller.id}
                className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                      {seller.storeLabel}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Seller ID: {seller.id}
                    </p>
                  </div>
                  <Link
                    href={`/create-product?sellerId=${seller.id}`}
                    className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Add Product
                  </Link>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Email:</span>
                    <p className="text-zinc-900 dark:text-zinc-50 font-medium">
                      {seller.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Mobile:</span>
                    <p className="text-zinc-900 dark:text-zinc-50 font-medium">
                      {seller.mobileNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Bakong Account:</span>
                    <p className="text-zinc-900 dark:text-zinc-50 font-medium">
                      {seller.bakongAccountId}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Bank:</span>
                    <p className="text-zinc-900 dark:text-zinc-50 font-medium">
                      {seller.acquiringBank}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Account:</span>
                    <p className="text-zinc-900 dark:text-zinc-50 font-medium">
                      {seller.bankAccountName} ({seller.bankAccountId})
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <Link
                    href={`/products/seller/${seller.id}`}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                  >
                    View Products →
                  </Link>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                    Joined {new Date(seller.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
