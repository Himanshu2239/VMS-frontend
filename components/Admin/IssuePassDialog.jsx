"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export function IssuePassDialog({
  issuingPass,
  setIssuingPass,
  currentVisitor,
  visitingDate,
  setVisitingDate,
  visitingTime,
  setVisitingTime,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  expiryDate,
  setExpiryDate,
  handleIssuePass,
}) {
  return (
    <Dialog open={issuingPass} onOpenChange={setIssuingPass}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Issue Visitor Pass</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Visitor</Label>
            <p className="font-medium">{currentVisitor?.name}</p>
          </div>
          <div>
            <Label htmlFor="visitingDate">Visiting Date</Label>
            <Input
              id="visitingDate"
              type="date"
              value={visitingDate}
              onChange={(e) => setVisitingDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="visitingTime">Visiting Time</Label>
            <Input
              id="visitingTime"
              type="time"
              value={visitingTime}
              onChange={(e) => setVisitingTime(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fromDate">From Date</Label>
            <Input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="toDate">To Date</Label>
            <Input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-center mb-4">
              <QrCode className="h-24 w-24 text-gray-500" />
            </div>
            <p className="text-center text-sm text-gray-500">
              QR code will be generated and sent to visitor
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIssuingPass(false)}>
            Cancel
          </Button>
          <Button onClick={handleIssuePass}>Issue Pass & Notify Visitor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
