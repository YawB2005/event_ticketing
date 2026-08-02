"use client";

import { use, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import OrderSuccessPage from '@/app/orders/[id]/success/page';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref') || 'SUCCESS';
  
  return <OrderSuccessPage params={Promise.resolve({ id: reference })} />;
}

export default function CheckoutSuccessWrapper() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0c0502', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Loading tickets..." />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
