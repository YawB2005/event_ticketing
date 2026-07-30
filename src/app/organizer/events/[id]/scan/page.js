"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Check, X, AlertTriangle, RefreshCw } from 'lucide-react';
import styles from './Scanner.module.css';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';

export default function TicketScannerPage() {
  const params = useParams();
  const eventId = params.id;
  
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  
  const scannerRef = useRef(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
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
  }, []);

  async function onScanSuccess(decodedText) {
    // Prevent multiple scans of the same code or scanning while loading
    if (isProcessingRef.current) return;
    
    // Pause scanner if it supports it (some versions of html5-qrcode do)
    try {
      if (scannerRef.current && scannerRef.current.pause) {
         scannerRef.current.pause(true);
      }
    } catch(e) {}

    isProcessingRef.current = true;
    await verifyTicket(decodedText);
  }

  function onScanFailure(error) {
    // Ignore frequent scan failures (e.g. no code in view yet)
  }

  async function verifyTicket(hash) {
    if (!hash) return;
    
    setLoading(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/organizer/scan-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId, qr_hash: hash })
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
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    verifyTicket(manualCode);
  };

  const resetScanner = () => {
    setScanResult(null);
    setManualCode('');
    isProcessingRef.current = false;
    
    // Resume scanner
    try {
      if (scannerRef.current && scannerRef.current.resume) {
         scannerRef.current.resume();
      }
    } catch(e) {}
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Scan Tickets</h1>
        <p className={styles.subText}>Point the camera at the attendee's QR code pass.</p>
      </div>

      <div style={{ display: (loading || scanResult) ? 'none' : 'block' }}>
        <div className={styles.scannerContainer}>
          <div id="qr-reader" className={styles.cameraViewport}></div>
          
          <div style={{ textAlign: 'center', margin: '2rem 0 1rem', color: '#64748b' }}>
            OR
          </div>
          
          <form onSubmit={handleManualSubmit} className={styles.manualEntry}>
            <input 
              type="text" 
              placeholder="Enter Ticket Hash manually..." 
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className={styles.manualInput}
            />
            <button type="submit" className="btn btn-outline" disabled={!manualCode}>
              Verify Code
            </button>
          </form>
        </div>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <LoadingSpinner text="Verifying Ticket..." />
        </div>
      )}
      
      {scanResult && !loading && (
        <div className={`${styles.resultCard} ${
          scanResult.status === 'valid' ? styles.resultSuccess : 
          scanResult.status === 'already_scanned' ? styles.resultWarning : 
          styles.resultError
        }`}>
          <div className={styles.resultIcon}>
            {scanResult.status === 'valid' ? <Check size={40} /> : 
             scanResult.status === 'already_scanned' ? <AlertTriangle size={40} /> : 
             <X size={40} />}
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
  );
}
