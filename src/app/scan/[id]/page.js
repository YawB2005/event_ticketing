"use client";

import { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Check, X, AlertTriangle, RefreshCw, ShieldCheck, QrCode } from 'lucide-react';
import styles from '@/app/organizer/events/[id]/scan/Scanner.module.css';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';

function TicketScannerInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params.id;
  const token = searchParams.get('token');
  
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  
  const scannerRef = useRef(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (!token) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        rememberLastUsedCamera: true
      },
      /* verbose= */ false
    );
    
    scannerRef.current = scanner;

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(console.error);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function onScanSuccess(decodedText) {
    if (isProcessingRef.current) return;
    
    try {
      if (scannerRef.current && scannerRef.current.pause) {
         scannerRef.current.pause(true);
      }
    } catch(e) {}

    isProcessingRef.current = true;
    await verifyTicket(decodedText);
  }

  function onScanFailure(error) {
    // Ignore frequent scan frame noise
  }

  async function verifyTicket(hash) {
    if (!hash || !token) return;
    
    setLoading(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/public/scan-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId, qr_hash: hash, token })
      });

      const data = await res.json();
      setScanResult(data);
    } catch (err) {
      console.error("Failed to verify ticket", err);
      setScanResult({
        success: false,
        status: 'error',
        message: 'Network Error: Could not reach verification server.'
      });
    } finally {
      setLoading(false);
    }
  }

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (isProcessingRef.current || !manualCode) return;
    isProcessingRef.current = true;
    verifyTicket(manualCode);
  };

  const resetScanner = () => {
    setScanResult(null);
    setManualCode('');
    isProcessingRef.current = false;
    
    try {
      if (scannerRef.current && scannerRef.current.resume) {
         scannerRef.current.resume();
      }
    } catch(e) {}
  };

  if (!token) {
    return (
      <div className={styles.page}>
        <div className={styles.scannerWrapper}>
          <div className={styles.header}>
            <h1 style={{ color: '#ef4444' }}>Unauthorized Gatekeeper Session</h1>
            <p className={styles.subText} style={{ color: '#fca5a5' }}>
              Missing or invalid scanner security token. Please request a valid gate scanning link from the event organizer dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.scannerWrapper}>
        <div className={styles.header}>
          <h1>Gatekeeper Ticket Validator</h1>
          <p className={styles.subText}>Point the camera at attendee's QR code pass for instant entry validation.</p>
        </div>

        <div style={{ display: (loading || scanResult) ? 'none' : 'block' }}>
          <div className={styles.scannerContainer}>
            <div id="qr-reader" className={styles.cameraViewport}></div>
            
            <div style={{ textAlign: 'center', margin: '2rem 0 1rem', color: 'rgba(252, 248, 242, 0.5)', fontWeight: 600 }}>
              — OR ENTER CODE MANUALLY —
            </div>
            
            <form onSubmit={handleManualSubmit} className={styles.manualEntry}>
              <input 
                type="text" 
                placeholder="Paste or type Ticket Verification Code / Hash..." 
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className={styles.manualInput}
              />
              <button type="submit" className={styles.verifyBtn} disabled={!manualCode}>
                Verify Code
              </button>
            </form>
          </div>
        </div>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <LoadingSpinner text="Authenticating Gate Pass..." />
          </div>
        )}
        
        {scanResult && !loading && (
          <div className={`${styles.resultCard} ${
            scanResult.status === 'valid' ? styles.resultSuccess : 
            scanResult.status === 'already_scanned' ? styles.resultWarning : 
            styles.resultError
          }`}>
            <div className={styles.resultIcon}>
              {scanResult.status === 'valid' ? <Check size={44} /> : 
               scanResult.status === 'already_scanned' ? <AlertTriangle size={44} /> : 
               <X size={44} />}
            </div>
            
            <h2 className={styles.resultTitle}>{scanResult.message}</h2>
            
            {scanResult.attendee && (
              <p className={styles.resultDetails}>{scanResult.attendee} • {scanResult.ticketType}</p>
            )}
            
            {scanResult.details && (
              <p className={styles.resultExtra}>{scanResult.details}</p>
            )}

            <button onClick={resetScanner} className={styles.scanAgainBtn}>
              <RefreshCw size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}/>
              Scan Next Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TicketScannerPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0c0502', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Loading Scanner..." />
      </div>
    }>
      <TicketScannerInner />
    </Suspense>
  );
}
