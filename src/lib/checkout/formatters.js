export function formatCurrency(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

export function formatPurchaseDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
}

export function generateTransactionId() {
  return `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function generateOrderNumber() {
  return `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}${Date.now().toString().slice(-4)}`;
}
