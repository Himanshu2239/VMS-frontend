import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Calendar,
  Building,
  FileText,
  QrCode,
  Clock,
} from "lucide-react";

const statusStyles = {
  pending: { border: "border-amber-500", badge: "bg-amber-500 text-white" },
  accepted: { border: "border-green-500", badge: "bg-green-500 text-white" },
  rejected: { border: "border-red-500", badge: "bg-red-500 text-white" },
};

export function VisitorCardAdmin({
  visitor,
  view,
  loadingStates,
  onStatusChange,
  onOpenDialog,
}) {
  const styles = statusStyles[visitor.status] || {};

  return (
    <Card
      className={`shadow-lg rounded-lg border ${
        styles.border || "border-gray-200"
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{visitor.name}</CardTitle>
          <Badge className={styles.badge}>
            {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center">
          <Building className="h-4 w-4 mr-2 text-gray-500" />
          {visitor.organization}
        </div>
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2 text-gray-500" />
          {visitor.purpose}
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          {visitor.date} at {visitor.time}
        </div>
        {visitor.passIssued && (
          <>
            <div className="flex items-center">
              <QrCode className="h-4 w-4 mr-2 text-gray-500" />
              Pass: {visitor.passNumber}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              Expires: {visitor.expiryDate}
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {view === "pending" && (
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              onClick={() => onStatusChange(visitor.id, "accepted")}
              disabled={loadingStates[visitor.id]}
            >
              <Check className="h-4 w-4 mr-2" /> Accept
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              onClick={() => onStatusChange(visitor.id, "rejected")}
              disabled={loadingStates[visitor.id]}
            >
              <X className="h-4 w-4 mr-2" /> Reject
            </Button>
          </div>
        )}

        {view === "accepted" && !visitor.notified && (
          <Button
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            onClick={() => onOpenDialog(visitor)}
            disabled={loadingStates[visitor.id]}
          >
            Issue Pass
          </Button>
        )}

        {visitor.notified && (
          <p className="text-center text-sm text-green-600">Visitor notified</p>
        )}
      </CardFooter>
    </Card>
  );
}
