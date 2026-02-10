import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { getProductsBySeller } from '@/lib/api';
import { Product } from '@/lib/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface SellerProductsPageProps {
  params: Promise<{ sellerId: string }>;
}

export default async function SellerProductsPage({ params }: SellerProductsPageProps) {
  const { sellerId } = await params;
  const sellerIdNum = parseInt(sellerId);

  if (isNaN(sellerIdNum)) {
    notFound();
  }

  let products: Product[] = [];
  let error: string | null = null;

  try {
    products = await getProductsBySeller(sellerIdNum);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load products';
    console.error('Error loading products:', err);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/sellers"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 mb-4 inline-block"
          >
            ← Back to Sellers
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Products by Seller #{sellerId}
          </h1>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">
              Error loading products: {error}
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-4">
              This seller hasn't added any products yet.
            </p>
            <Link
              href={`/create-product?sellerId=${sellerId}`}
              className="inline-block bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Create Product for This Seller
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
