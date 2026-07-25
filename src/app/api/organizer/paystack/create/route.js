import { requireOrganizer } from '@/utils/api/auth'
import { jsonOk, jsonError } from '@/utils/api/responses'

export async function POST(request) {
  const ctx = await requireOrganizer()
  if (ctx.error) return ctx.error

  try {
    const { business_name, settlement_bank, account_number, account_name } = await request.json()

    if (!business_name || !settlement_bank || !account_number) {
      return jsonError('Missing required fields', 400)
    }

    // Call Paystack Subaccount API
    const paystackRes = await fetch('https://api.paystack.co/subaccount', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        business_name,
        settlement_bank,
        account_number,
        percentage_charge: 5 // Default platform fee of 5%
      })
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      console.error("❌ Paystack Create API Error:", JSON.stringify(paystackData, null, 2));
      return jsonError(paystackData.message || 'Failed to create subaccount', 400);
    }

    const subaccountCode = paystackData.data.subaccount_code;

    // Save to Database
    const { error: dbError } = await ctx.supabase
      .from('organizer_profiles')
      .update({
        paystack_subaccount_code: subaccountCode,
        settlement_bank: settlement_bank,
        account_name: account_name,
        payout_account_number: account_number
      })
      .eq('profile_id', ctx.profile.id);

    if (dbError) {
       console.error("❌ Supabase DB Update Error:", JSON.stringify(dbError, null, 2));
       throw dbError;
    }

    return jsonOk({ success: true, subaccount_code: subaccountCode, account_name });

  } catch (err) {
    console.error("❌ Unexpected Error in Paystack Create:", err);
    return jsonError('Internal Server Error: ' + err.message, 500);
  }
}
