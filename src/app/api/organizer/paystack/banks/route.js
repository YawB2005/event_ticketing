import { requireOrganizer } from '@/utils/api/auth';
import { jsonOk, jsonError } from '@/utils/api/responses';

export async function GET(request) {
  const ctx = await requireOrganizer();
  if (ctx.error) return ctx.error;

  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || 'ghana';

  try {
    const response = await fetch(`https://api.paystack.co/bank?country=${country}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    const data = await response.json();

    if (!data.status) {
      console.error("❌ Paystack Bank API Error:", JSON.stringify(data, null, 2));
      return jsonError(data.message || 'Could not fetch banks', 400);
    }

    return jsonOk({ banks: data.data });
  } catch (err) {
    console.error("❌ Unexpected Error in Paystack Banks:", err);
    return jsonError('Failed to fetch banks: ' + err.message, 500);
  }
}
