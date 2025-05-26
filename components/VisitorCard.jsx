import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Calendar, User, Building, FileText } from "lucide-react";
import { Loader } from "@/components/ui/Loader";

const statusBorder = {
  pending: "border-amber-500",
  accepted: "border-green-500",
  rejected: "border-red-500",
};

export function VisitorCard({
  visitor,
  view,
  loading,
  onStatusChange,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState({
    visitingDate: visitor.visitingDate.slice(0, 10),
    visitingTiming: visitor.visitingTiming,
    fromDate: visitor.fromDate.slice(0, 10),
    toDate: visitor.toDate.slice(0, 10),
  });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(visitor._id, fields);
    setIsEditing(false);
  };

  return (
    <Card className={`shadow rounded-lg border ${statusBorder[view]}`}>
      <CardHeader className="pb-2 flex justify-between items-center">
        <CardTitle className="text-lg">Ticket #{visitor.ticketNo}</CardTitle>
        <Badge
          className="text-white"
          style={{
            backgroundColor:
              view === "pending"
                ? "#d97706"
                : view === "accepted"
                ? "#16a34a"
                : "#dc2626",
          }}
        >
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        {visitor.photoOfVisitor && (
          <img
            src={visitor.photoOfVisitor}
            alt={visitor.name}
            className="w-full h-40 object-cover rounded"
          />
        )}
        <div>
          <User className="inline-block mr-1" />
          <span className="font-medium">Name:</span> {visitor.name}
        </div>
        <div>
          <Building className="inline-block mr-1" />
          <span className="font-medium">Organization:</span>{" "}
          {visitor.organization}
        </div>
        <div className="flex items-center">
          <Calendar className="inline-block mr-1" />
          <span className="font-medium">Visiting Date:</span>{" "}
          {isEditing ? (
            <Input
              type="date"
              name="visitingDate"
              value={fields.visitingDate}
              onChange={handleFieldChange}
              className="ml-2"
            />
          ) : (
            new Date(visitor.visitingDate).toLocaleDateString()
          )}
        </div>
        <div>
          <span className="font-medium">Visiting Time:</span>{" "}
          {isEditing ? (
            <Input
              type="time"
              name="visitingTiming"
              value={fields.visitingTiming}
              onChange={handleFieldChange}
              className="ml-2"
            />
          ) : (
            visitor.visitingTiming
          )}
        </div>
        <div>
          <span className="font-medium">From:</span>{" "}
          {isEditing ? (
            <Input
              type="date"
              name="fromDate"
              value={fields.fromDate}
              onChange={handleFieldChange}
              className="ml-2"
            />
          ) : (
            new Date(visitor.fromDate).toLocaleDateString()
          )}
        </div>
        <div>
          <span className="font-medium">To:</span>{" "}
          {isEditing ? (
            <Input
              type="date"
              name="toDate"
              value={fields.toDate}
              onChange={handleFieldChange}
              className="ml-2"
            />
          ) : (
            new Date(visitor.toDate).toLocaleDateString()
          )}
        </div>
        <div>
          <FileText className="inline-block mr-1" />
          <span className="font-medium">Purpose:</span>{" "}
          {visitor.purposeOfMeeting}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            Edit
          </Button>
        )}

        {view === "pending" && (
          <div className="flex gap-2">
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => onStatusChange(visitor._id, "accepted")}
              disabled={loading}
            >
              {loading ? (
                <Loader className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => onStatusChange(visitor._id, "rejected")}
              disabled={loading}
            >
              {loading ? (
                <Loader className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
