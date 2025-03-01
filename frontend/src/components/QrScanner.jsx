import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QrScanner = ({ onScanSuccess }) => {
  const [scanResult, setScanResult] = useState(null);
  const scannerRef = useRef(null);
  const isScanning = useRef(false); // Prevent multiple instances

  useEffect(() => {
    const startScanner = async () => {
      if (isScanning.current) return; // Prevent multiple starts

      try {
        scannerRef.current = new Html5Qrcode("reader");
        const cameras = await Html5Qrcode.getCameras();

        if (cameras.length === 0) {
          console.error("No cameras found");
          return;
        }

        isScanning.current = true; // Mark as scanning

        await scannerRef.current.start(
          cameras[0].id, // Use the first available camera
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            setScanResult(decodedText);
            onScanSuccess?.(decodedText);
            stopScanner(); // Stop after successful scan
          },
          (errorMessage) => {
            console.warn("QR Scan Error:", errorMessage);
          }
        );
      } catch (error) {
        console.error("Error starting scanner:", error);
      }
    };

    startScanner();

    return () => stopScanner(); // Cleanup on unmount
  }, [onScanSuccess]);

  const stopScanner = async () => {
    if (scannerRef.current && isScanning.current) {
      await scannerRef.current.stop();
      await scannerRef.current.clear();
      scannerRef.current = null;
      isScanning.current = false; // Mark as stopped
    }
  };

  return scanResult ? (
    <div>
      ✅ Success:{" "}
      <a href={scanResult} target="_blank" rel="noopener noreferrer">
        {scanResult}
      </a>
    </div>
  ) : (
    <div id="reader"></div>
  );
};

export default QrScanner;
