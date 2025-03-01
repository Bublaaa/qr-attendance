import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QrScanner = ({ onScanSuccess }) => {
  const scannerRef = useRef(null);
  const isScanning = useRef(false);

  useEffect(() => {
    const startScanner = async () => {
      if (isScanning.current) return;

      try {
        scannerRef.current = new Html5Qrcode("reader");
        const cameras = await Html5Qrcode.getCameras();

        if (cameras.length === 0) {
          console.error("No cameras found");
          return;
        }

        isScanning.current = true;

        await scannerRef.current.start(
          cameras[0].id,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            await stopScanner();
            onScanSuccess?.(decodedText);
          },
          (errorMessage) => console.warn("QR Scan Error:", errorMessage)
        );
      } catch (error) {
        console.error("Error starting scanner:", error);
      }
    };

    startScanner();

    return () => stopScanner();
  }, [onScanSuccess]);

  const stopScanner = async () => {
    if (scannerRef.current && isScanning.current) {
      await scannerRef.current.stop();
      await scannerRef.current.clear();
      scannerRef.current = null;
      isScanning.current = false;
    }
  };

  return <div id="reader"></div>;
};

export default QrScanner;
