"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export function WhatsAppConfirmation({ onFinish }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="pt-6">
          <div className="bg-[#DCF8C6] rounded-lg p-4 mb-6">
            <div className="flex flex-col space-y-2">
              <p className="text-[#075E54]">
                Your visit has been registered. Please wait for approval from
                the employee.
              </p>
              <p className="text-[#075E54]">
                Once approved, you will receive a gate pass on this number.
              </p>
              <div className="flex justify-end">
                <span className="text-xs text-gray-500">12:30 PM</span>
                <CheckCircle className="h-4 w-4 ml-1 text-[#34B7F1]" />
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 mb-6">
            Visitor will receive meeting pass via WhatsApp once approved.
          </p>

          <Button onClick={onFinish} className="w-full">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
