import Navbar from '@/components/Navbar';
import ProductDetail from '@/components/ProductDetail';
import { getProductById } from '@/lib/api';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) {
    notFound();
  }

  let product = null;
  let error = null;

  try {
    product = await getProductById(productId);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load product';
    console.error('Error loading product:', err);
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">
              {error || 'Product not found'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetail product={product} />
      </main>
    </div>
  );
}
