const ORDER_KEY = 'checkout_order';
const RECEIPT_KEY = 'checkout_receipt';

export function saveOrder(order) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

export function getOrder() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveReceipt(receipt) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt));
}

export function getReceipt() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(RECEIPT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearCheckoutSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ORDER_KEY);
  sessionStorage.removeItem(RECEIPT_KEY);
}
