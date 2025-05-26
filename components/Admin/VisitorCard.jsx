"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  FileText,
  Calendar,
  Clock,
  X,
  QrCode,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const statusColor = {
  pending: "bg-amber-500 text-white",
  accepted: "bg-green-500 text-white",
  rejected: "bg-red-500 text-white",
};

export function VisitorCard({ visitor, loading, onIssuePassClick, onReject }) {
  const {
    status,
    name,
    photoOfVisitor,
    ticketNo,
    organization,
    date,
    time,
    fromDate,
    toDate,
    purpose,
    employeePermission,
  } = visitor;

  // Format the approval date/time if present
  const approvedBy = employeePermission?.approvedBy?.fullName;
  const approvedAt = employeePermission?.approvedAt
    ? new Date(employeePermission.approvedAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : null;

  return (
    <Card
      className={`shadow-lg rounded-lg border ${
        status === "accepted"
          ? "border-green-500"
          : status === "rejected"
          ? "border-red-500"
          : "border-gray-200"
      }`}
    >
      {photoOfVisitor && (
        <img
          src={photoOfVisitor}
          alt={`${name} photo`}
          className="w-full h-32 object-cover rounded-t-lg"
        />
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{name}</CardTitle>
          <Badge className={statusColor[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">Ticket #{ticketNo}</p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {organization && (
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-2 text-gray-500" />
            {organization}
          </div>
        )}
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          {date} at {time}
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          From {fromDate} to {toDate}
        </div>
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2 text-gray-500" />
          {purpose}
        </div>
        {approvedBy && (
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              Employee Approved: <strong>{approvedBy}</strong>
            </span>
          </div>
        )}
        {approvedAt && (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              Approved At: <strong>{approvedAt}</strong>
            </span>
          </div>
        )}
      </CardContent>
      {status === "pending" ? (
        <CardFooter className="pt-0 flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => onIssuePassClick(visitor)}
              disabled={loading}
            >
              {loading ? (
                <div className="loader h-4 w-4 border-white" />
              ) : (
                <QrCode className="h-4 w-4 mr-2" />
              )}{" "}
              Issue Pass
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              onClick={() => onReject(visitor.id)}
              disabled={loading}
            >
              {loading ? (
                <div className="loader h-4 w-4 border-white" />
              ) : (
                <X className="h-4 w-4 mr-2" />
              )}{" "}
              Reject
            </Button>
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
}
