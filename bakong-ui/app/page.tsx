import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/api';
import { Product } from '@/lib/types';

export default async function Home() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    products = await getAllProducts();
    console.log(products);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load products';
    console.error('Error loading products:', err);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
          All Products
        </h1>
        
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">
              Error loading products: {error}
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              Make sure the API is running on http://localhost:8080
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              No products available at the moment.
            </p>
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
