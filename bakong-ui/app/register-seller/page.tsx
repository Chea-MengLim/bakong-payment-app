'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { registerSeller } from '@/lib/api';
import { SellerRegistrationRequest } from '@/lib/types';

export default function RegisterSellerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SellerRegistrationRequest>({
    bakongAccountId: '',
    acquiringBank: '',
    bankAccountId: '',
    bankAccountName: '',
    mobileNumber: '',
    email: '',
    storeLabel: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ id: number; password: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await registerSeller(formData);
      setSuccess({
        id: response.id,
        password: response.generatedPassword,
      });
      // Clear form after successful registration
      setFormData({
        bakongAccountId: '',
        acquiringBank: '',
        bankAccountId: '',
        bankAccountName: '',
        mobileNumber: '',
        email: '',
        storeLabel: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register seller');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
          Register as Seller
        </h1>

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
              Registration Successful!
            </h2>
            <p className="text-green-700 dark:text-green-300 mb-4">
              Your seller account has been created. Please save your credentials:
            </p>
            <div className="bg-white dark:bg-zinc-800 rounded p-4 mb-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Seller ID:</p>
              <p className="font-mono font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                {success.id}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Generated Password:</p>
              <p className="font-mono font-semibold text-zinc-900 dark:text-zinc-50">
                {success.password}
              </p>
            </div>
            <button
              onClick={() => router.push(`/create-product?sellerId=${success.id}`)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Your First Product
            </button>
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
              <label htmlFor="storeLabel" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Store Label *
              </label>
              <input
                type="text"
                id="storeLabel"
                name="storeLabel"
                required
                value={formData.storeLabel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="My Store"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="seller@example.com"
              />
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="+855123456789"
              />
            </div>

            <div>
              <label htmlFor="bakongAccountId" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Bakong Account ID *
              </label>
              <input
                type="text"
                id="bakongAccountId"
                name="bakongAccountId"
                required
                value={formData.bakongAccountId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="Bakong Account ID"
              />
            </div>

            <div>
              <label htmlFor="acquiringBank" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Acquiring Bank *
              </label>
              <input
                type="text"
                id="acquiringBank"
                name="acquiringBank"
                required
                value={formData.acquiringBank}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="Bank Name"
              />
            </div>

            <div>
              <label htmlFor="bankAccountId" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Bank Account ID *
              </label>
              <input
                type="text"
                id="bankAccountId"
                name="bankAccountId"
                required
                value={formData.bankAccountId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="Account ID"
              />
            </div>

            <div>
              <label htmlFor="bankAccountName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Bank Account Name *
              </label>
              <input
                type="text"
                id="bankAccountName"
                name="bankAccountName"
                required
                value={formData.bankAccountName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="Account Holder Name"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 py-3 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register as Seller'}
          </button>
        </form>
      </main>
    </div>
  );
}
