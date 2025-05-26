"use client";

import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, CheckCircle, XCircle } from "lucide-react";

export default function SecurityScan() {
  const [scanning, setScanning] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [visitor, setVisitor] = useState(null);
  const [pass, setPass] = useState(null);
  const [allowedMessage, setAllowedMessage] = useState("");

  const validateCode = async (code) => {
    setScanning(true);
    setVisitor(null);
    setPass(null);
    setAllowedMessage("");

    const token = localStorage.getItem("accessToken") || "";

    try {
      const { data } = await axios.get(
        "http://127.0.0.1:8000/gate/validateGatePass",
        {
          params: { qrCode: code },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.valid) {
        setVisitor(data.visitor);
        setPass(data.pass);
        toast.success("Gate pass valid!");
      } else {
        toast.error("Invalid gate pass");
      }
    } catch (err) {
      console.error(err);
      toast.error("Scan failed. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  const onScanClick = async () => {
    const code = window.prompt("Enter or paste scanned QR code:");
    if (code) {
      setQrCodeInput(code);
      await validateCode(code);
    }
  };

  const onManualSubmit = async (e) => {
    e.preventDefault();
    if (!qrCodeInput.trim()) {
      toast.error("Please enter a QR code");
      return;
    }
    await validateCode(qrCodeInput.trim());
  };

  const reset = () => {
    setVisitor(null);
    setPass(null);
    setQrCodeInput("");
    setAllowedMessage("");
  };

  const onAllowEntry = () => {
    if (visitor) {
      const msg = `${visitor.name} is now allowed to move into RML6.`;
      setAllowedMessage(msg);
      toast.success(msg);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Security Gate</h1>
        <Badge variant="outline" className="text-sm px-3 py-1">
          Security Guard
        </Badge>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Scan or Enter QR Code
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!visitor && !pass ? (
            <>
              <div
                onClick={onScanClick}
                className={`
                  border-2 border-dashed rounded-lg p-6 mb-4 w-full max-w-xs mx-auto
                  cursor-pointer
                  ${
                    scanning
                      ? "border-blue-500 animate-pulse"
                      : "border-gray-300"
                  }
                `}
              >
                <div className="flex justify-center">
                  <QrCode
                    className={`
                      h-28 w-28
                      ${
                        scanning
                          ? "text-blue-500 animate-spin"
                          : "text-gray-400"
                      }
                    `}
                  />
                </div>
                <p className="text-center mt-2 text-sm text-gray-600">
                  {scanning ? "Scanning…" : "Tap to Scan"}
                </p>
              </div>

              <form
                onSubmit={onManualSubmit}
                className="flex space-x-2 justify-center mb-2"
              >
                <input
                  type="text"
                  placeholder="Enter QR code"
                  value={qrCodeInput}
                  onChange={(e) => setQrCodeInput(e.target.value)}
                  className="border rounded px-3 py-2 flex-1 max-w-xs"
                  disabled={scanning}
                />
                <Button type="submit" disabled={scanning}>
                  Validate
                </Button>
              </form>
            </>
          ) : (
            <div
              className={`
                transition-opacity duration-500 ease-in-out
                ${scanning ? "opacity-0" : "opacity-100"}
              `}
            >
              <div className="flex justify-center mb-4">
                {pass ? (
                  <CheckCircle className="h-16 w-16 text-green-600" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-600" />
                )}
              </div>

              {visitor && (
                <div className="flex justify-center mb-4">
                  <img
                    src={visitor.photoOfVisitor}
                    alt={visitor.name}
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                  />
                </div>
              )}

              {visitor && (
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-semibold">{visitor.name}</h2>
                  <p className="text-md text-gray-600">
                    Ticket#: {visitor.ticketNo}
                  </p>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-bold">
                  {pass ? "Valid Pass" : "Invalid Pass"}
                </h3>
                <p className={pass ? "text-green-600" : "text-red-600"}>
                  {pass ? "Visitor may enter" : "Access Denied"}
                </p>
              </div>
            </div>
          )}
        </CardContent>

        {(visitor || pass) && (
          <CardFooter className="flex flex-col space-y-2">
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={reset}>
                Scan Again
              </Button>
              {pass && (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={onAllowEntry}
                >
                  Allow Entry
                </Button>
              )}
            </div>
            {allowedMessage && (
              <p className="mt-2 text-center text-green-700 font-medium">
                {allowedMessage}
              </p>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
