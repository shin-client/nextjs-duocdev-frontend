"use client";
import { getTableLink } from "@/lib/utils";
import Image from "next/image";
import QRCode from "qrcode";
import { useState, useEffect } from "react";

interface QRCodeTableProps {
  token: string;
  tableNumber: number;
  width?: number;
  height?: number;
}

const QRCodeTable = ({
  token,
  tableNumber,
  width,
  height,
}: QRCodeTableProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateQR = async () => {
      const url = getTableLink({ token, tableNumber });

      try {
        setLoading(true);
        const result = await QRCode.toDataURL(url, {
          width: width ?? 100,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        setQrCodeUrl(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    generateQR();
  }, [token, tableNumber, width]);

  if (loading) {
    return (
      <div
        className={`h-[${height}px] w-[${width}px] animate-pulse rounded bg-gray-100`}
      ></div>
    );
  }

  return (
    <>
      {qrCodeUrl && (
        <Image
          src={qrCodeUrl}
          alt="QR Code"
          width={width ?? 100}
          height={height ?? 100}
          className="rounded border"
        />
      )}
      {!qrCodeUrl && !loading && (
        <div
          className={`flex h-[${height}px] w-[${width}px] items-center justify-center rounded bg-gray-100`}
        >
          <span className="text-gray-500">No QR Code</span>
        </div>
      )}
    </>
  );
};

export default QRCodeTable;
