export type KhqrCurrency = 'USD' | 'KHR';

export interface GenerateMerchantKhqrRequest {
  bakongAccountId: string;
  merchantId: string;
  acquiringBank: string;
  currency: KhqrCurrency;
  amount: number;
  merchantName: string;
  merchantCity: string;
  billNumber: string;
  mobileNumber: string;
  storeLabel: string;
  terminalLabel: string;
  upiAccountInformation: string;
  purposeOfTransaction: string;
  expirationTimestamp: number;
}

export type GenerateMerchantKhqrResponse =
  | { success: true; qr: string; md5: string }
  | { success: false; error: string };

export interface VerifyKhqrRequest {
  qrCode: string;
}

export type VerifyKhqrResponse =
  | { success: true; valid: boolean }
  | { success: false; error: string };

const API_V1_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface BakongCheckTransactionRequest {
  md5: string;
}

export interface BakongTransactionData {
  hash: string;
  fromAccountId: string;
  toAccountId: string;
  currency: string;
  amount: number;
  description: string;
  createdDateMs: number;
  acknowledgedDateMs: number;
}

export interface BakongCheckTransactionResponse {
  responseCode: number;
  responseMessage: string;
  errorCode: number | null;
  data: BakongTransactionData | null;
}

export async function generateMerchantKhqr(
  request: GenerateMerchantKhqrRequest
): Promise<GenerateMerchantKhqrResponse> {
  const res = await fetch(`${API_V1_BASE}/khqr/generate/merchant`, {
    method: 'POST',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  // Endpoint returns {success:true,...} or {success:false,error:...}
  const data = (await res.json()) as GenerateMerchantKhqrResponse;
  return data;
}

export async function verifyKhqr(
  request: VerifyKhqrRequest
): Promise<VerifyKhqrResponse> {
  const res = await fetch(`${API_V1_BASE}/khqr/verify`, {
    method: 'POST',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data = (await res.json()) as VerifyKhqrResponse;
  return data;
}

export async function checkTransactionByMd5(
  request: BakongCheckTransactionRequest
): Promise<BakongCheckTransactionResponse> {
  const res = await fetch(`${API_V1_BASE}/khqr/transactions/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ md5: request.md5 }),
  });

  const data = (await res.json()) as BakongCheckTransactionResponse;
  return data;
}
