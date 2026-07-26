import { formatPurchaseDate, generateOrderNumber, generateTransactionId } from './formatters';

export const DEFAULT_ORDER = {
  eventId: '1',
  eventName: 'Neon Nights Music Festival 2026',
  ticketType: 'General Admission',
  quantity: 2,
  amountPaid: 95.5,
  paymentMethod: 'Credit/Debit Card',
};

export const FAILURE_REASONS = [
  'Insufficient funds in your account',
  'Network connection was interrupted',
  'Payment was cancelled before completion',
  'Our payment server encountered a temporary issue',
];

export function buildReceipt(order = DEFAULT_ORDER) {
  const now = new Date();
  return {
    ...order,
    transactionId: generateTransactionId(),
    orderNumber: generateOrderNumber(),
    purchaseDate: formatPurchaseDate(now),
  };
}
