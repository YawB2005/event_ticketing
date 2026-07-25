import { requireOrganizer } from '@/utils/api/auth'
import { jsonOk, jsonError } from '@/utils/api/responses'

export async function GET(request) {
  const ctx = await requireOrganizer()
  if (ctx.error) return ctx.error

  const { searchParams } = new URL(request.url)
  const accountNumber = searchParams.get('account_number')
  const bankCode = searchParams.get('bank_code')

  if (!accountNumber || !bankCode) {
    return jsonError('Missing account number or bank code', 400)
  }

  try {
    const response = await fetch(`https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    const data = await response.json();

    if (!data.status) {
      console.error("❌ Paystack Resolve API Error:", JSON.stringify(data, null, 2));
      return jsonError(data.message || 'Could not resolve account name', 400);
    }

    return jsonOk({ account_name: data.data.account_name });
  } catch (err) {
    console.error("❌ Unexpected Error in Paystack Resolve:", err);
    return jsonError('Failed to resolve account name: ' + err.message, 500);
  }
}
