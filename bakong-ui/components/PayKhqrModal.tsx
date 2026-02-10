'use client';

import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  generateMerchantKhqr,
  verifyKhqr,
  checkTransactionByMd5,
  type GenerateMerchantKhqrRequest,
  type BakongTransactionData,
} from '@/lib/khqr';
import type { StoreInfo } from '@/lib/types';

const OFFSET_PHNOM_PENH = 7 * 60 * 60 * 1000;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency?: 'USD' | 'KHR';
  purpose?: string;
  store: StoreInfo;
  onPaid?: (tx: BakongTransactionData) => void;
};

type PaymentStatus = 'idle' | 'polling' | 'success' | 'failed';

export default function PayKhqrModal({
  isOpen,
  onClose,
  amount,
  currency = 'USD',
  purpose = 'E-commerce purchase',
  store,
  onPaid,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [qrString, setQrString] = useState<string | null>(null);
  const [md5, setMd5] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const [verifyValid, setVerifyValid] = useState<boolean | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [transaction, setTransaction] =
    useState<BakongTransactionData | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [expirationTimestamp, setExpirationTimestamp] =
    useState<number | null>(null);

  const reset = () => {
    setLoading(false);
    setError(null);
    setQrString(null);
    setMd5(null);
    setQrDataUrl(null);
    setVerifyValid(null);
    setVerifyError(null);
    setPaymentStatus('idle');
    setPaymentError(null);
    setTransaction(null);
    setRemainingSeconds(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const generateAndVerify = async () => {
    setLoading(true);
    setError(null);
    setQrString(null);
    setMd5(null);
    setQrDataUrl(null);
    setVerifyValid(null);
    setVerifyError(null);

    // Compute a fresh expiration timestamp for this QR (3 minutes from now, Phnom Penh time)
    const merchantCity =
      process.env.NEXT_PUBLIC_KHQR_MERCHANT_CITY || 'Phnom Penh';
    const terminalLabel =
      process.env.NEXT_PUBLIC_KHQR_TERMINAL_LABEL || 'Cashier_1';

      // 1 minute 50 seconds = 110 seconds
    const expTs = Date.now() + 110 * 1000 + OFFSET_PHNOM_PENH;
    setExpirationTimestamp(expTs);

    const request: GenerateMerchantKhqrRequest = {
      bakongAccountId: store.bakongAccountId,
      merchantId: store.bankAccountId,
      acquiringBank: store.acquiringBank,
      currency,
      amount: Number(amount.toFixed(2)),
      merchantName: store.bankAccountName,
      merchantCity,
      billNumber: `#${Date.now()}`,
      mobileNumber: store.mobileNumber,
      storeLabel: store.storeLabel,
      terminalLabel,
      upiAccountInformation: store.bankAccountId,
      purposeOfTransaction: purpose,
      expirationTimestamp: expTs,
    };

    try {
      const gen = await generateMerchantKhqr(request);
      if (!gen.success) {
        setError(gen.error);
        return;
      }

      setQrString(gen.qr);
      setMd5(gen.md5);

      const verify = await verifyKhqr({ qrCode: gen.qr });
      if (!verify.success) {
        setVerifyError(verify.error);
      } else {
        setVerifyValid(verify.valid);
      }

      const dataUrl = await QRCode.toDataURL(gen.qr, {
        margin: 1,
        width: 320,
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(dataUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate KHQR');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    generateAndVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Countdown until expiration based on the same expirationTimestamp we send
  useEffect(() => {
    if (!isOpen || expirationTimestamp == null) return;

    const updateRemaining = () => {
      const now = Date.now() + OFFSET_PHNOM_PENH; // phnom penh time
      const diffMs = expirationTimestamp - now;
      if (diffMs <= 0) {
        setRemainingSeconds(0);
        return false;
      }
      setRemainingSeconds(Math.floor(diffMs / 1000));
      return true;
    };

    // initial set
    if (!updateRemaining()) return;

    const intervalId = setInterval(() => {
      const shouldContinue = updateRemaining();
      if (!shouldContinue) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isOpen, expirationTimestamp]);

  // Poll Bakong to see if the transaction with this MD5 has been paid
  useEffect(() => {
    if (!isOpen || !md5) return;

    let cancelled = false;
    let attempts = 0;
    setPaymentStatus('polling');
    setPaymentError(null);
    setTransaction(null);

    const intervalId = setInterval(async () => {
      if (cancelled) return;

      attempts += 1;
      try {
        const res = await checkTransactionByMd5({ md5 });

        if (cancelled) return;

        if (res.responseCode === 0 && res.data) {
          setPaymentStatus('success');
          setTransaction(res.data);
          clearInterval(intervalId);
          return;
        }

        // If still not found or failed, keep polling up to a limit
        if (attempts >= 60) {
          setPaymentStatus('failed');
          setPaymentError(
            res.responseMessage || 'Timed out waiting for payment.'
          );
          clearInterval(intervalId);
        }
      } catch (e) {
        if (cancelled) return;
        setPaymentStatus('failed');
        setPaymentError(
          e instanceof Error
            ? e.message
            : 'Failed to check transaction status.'
        );
        clearInterval(intervalId);
      }
    }, 2000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [isOpen, md5]);

  // After payment success, wait ~3s showing the success alert, then notify parent
  useEffect(() => {
    if (paymentStatus !== 'success' || !transaction) return;

    const timeoutId = setTimeout(() => {
      if (typeof onPaid === 'function') {
        onPaid(transaction);
      } else {
        handleClose();
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [paymentStatus, transaction, onPaid]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Pay with KHQR
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Amount: {currency} {amount.toFixed(2)}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Store: {store.storeLabel}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="flex flex-col items-center gap-3">
            <div className="w-[320px] h-[320px] rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center">
              {loading ? (
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Generating QR...
                </div>
              ) : qrDataUrl ? (
                // Using <img> here because we're rendering a data URL.
                // Next/Image is not necessary for data URLs.
                <img
                  src={qrDataUrl}
                  alt="KHQR code"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  QR not available
                </div>
              )}
            </div>

            <div className="w-full space-y-2">
              {md5 && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  MD5: <span className="font-mono">{md5}</span>
                </p>
              )}

              {remainingSeconds !== null && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {remainingSeconds > 0 ? (
                    <>
                      Expires in{' '}
                      {Math.floor(remainingSeconds / 60)
                        .toString()
                        .padStart(2, '0')}
                      :
                      {(remainingSeconds % 60)
                        .toString()
                        .padStart(2, '0')}
                    </>
                  ) : (
                    <>QR expired</>
                  )}
                </p>
              )}

              {verifyValid !== null && (
                <p
                  className={`text-sm font-medium ${
                    verifyValid
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-amber-700 dark:text-amber-400'
                  }`}
                >
                  Verify: {verifyValid ? 'Valid QR' : 'Invalid QR'}
                </p>
              )}

              {verifyError && (
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Verify error: {verifyError}
                </p>
              )}

              {/* Payment status from Bakong */}
              {paymentStatus === 'polling' && !transaction && !paymentError && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Waiting for payment confirmation...
                </p>
              )}

              {paymentError && (
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Payment status: {paymentError}
                </p>
              )}

              {paymentStatus === 'success' && transaction && (
                <div className="mt-2 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-3 space-y-1">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                    Payment received!
                  </p>
                  <p className="text-xs text-green-800 dark:text-green-200">
                    From: {transaction.fromAccountId}
                  </p>
                  <p className="text-xs text-green-800 dark:text-green-200">
                    Amount: {transaction.currency} {transaction.amount}
                  </p>
                  <p className="text-xs text-green-800 dark:text-green-200">
                    Time:{' '}
                    {new Date(transaction.createdDateMs).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 py-2.5 rounded-lg font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
          <button
            onClick={generateAndVerify}
            disabled={loading}
            className="flex-1 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 py-2.5 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Regenerate'}
          </button>
        </div>
      </div>
    </div>
  );
}

