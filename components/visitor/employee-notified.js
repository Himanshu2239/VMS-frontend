"use client";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function EmployeeNotified({ onSendWhatsApp, loading }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-24 w-24 text-[hsl(var(--green))]" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Employee Notified</h2>
        <p className="text-lg mb-8">
          The employee has been notified about your visit request.
        </p>

        <Button
          onClick={onSendWhatsApp}
          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="loader h-5 w-5 mr-2 border-white"></div>
              Sending...
            </>
          ) : (
            "Send WhatsApp confirmation to visitor"
          )}
        </Button>
      </div>
    </div>
  );
}
