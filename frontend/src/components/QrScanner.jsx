import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QrScanner = ({ onScanSuccess }) => {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });

    scanner.render(
      (result) => {
        setScanResult(result);
        onScanSuccess?.(result);
        scanner.clear();
      },
      (err) => {
        console.warn("QR Scan Error:", err);
      }
    );

    return () => {
      scanner.clear();
      // scanner.stop();
    };
  }, []);

  return scanResult ? (
    <div>
      Success:{" "}
      <a href={scanResult} target="_blank" rel="noopener noreferrer">
        {scanResult}
      </a>
    </div>
  ) : (
    <div id="reader"></div>
  );
};

export default QrScanner;
