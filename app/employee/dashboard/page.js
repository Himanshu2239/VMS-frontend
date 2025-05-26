"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import EmployeeDashboard from "@/components/EmployeeDashboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [view, setView] = useState("pending");
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [loadingStates, setLoadingStates] = useState({});
  const limit = 20;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editFields, setEditFields] = useState({
    visitingDate: "",
    visitingTiming: "",
    fromDate: "",
    toDate: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // Fetch visitors list
  useEffect(() => {
    if (!token) {
      setError("Not authenticated");
      return;
    }
    const fetchList = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(
          `https://vms-backend-liart.vercel.app/employee/${view}-visitors`,
          {
            params: { page, limit },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setVisitors(data.visitors);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load visitors.");
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [view, page, token]);

  // Generic status update with optional fields
  const updateStatus = async (id, newStatus, fields = {}) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    const payload = { _id: id, permission: newStatus, ...fields };
    try {
      const resp = await axios.post(
        "https://vms-backend-liart.vercel.app/employee/employee-approval",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = resp.data.visitor;
      setVisitors((prev) => {
        // Remove from pending view
        if (view === "pending") {
          return prev.filter((v) => v._id !== id);
        }
        // Prepend to current view if matches
        if (view === newStatus) {
          return [updated, ...prev.filter((v) => v._id !== id)];
        }
        // Otherwise remove
        return prev.filter((v) => v._id !== id);
      });
    } catch (err) {
      console.error("Approval error:", err);
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Handle accept/reject clicks
  const handleStatusChange = (id, newStatus) => {
    if (newStatus === "accepted") {
      const v = visitors.find((x) => x._id === id);
      setSelectedId(id);
      setEditFields({
        visitingDate: v.visitingDate.slice(0, 10),
        visitingTiming: v.visitingTiming,
        fromDate: v.fromDate.slice(0, 10),
        toDate: v.toDate.slice(0, 10),
      });
      setModalOpen(true);
    } else {
      updateStatus(id, newStatus);
    }
  };

  // Confirm modal edits then accept
  const handleModalConfirm = () => {
    updateStatus(selectedId, "accepted", editFields);
    setModalOpen(false);
  };

  return (
    <>
      <EmployeeDashboard
        visitors={visitors}
        view={view}
        setView={setView}
        loading={loading}
        error={error}
        page={page}
        setPage={setPage}
        loadingStates={loadingStates}
        onStatusChange={handleStatusChange}
        onUpdate={(id, fields) => updateStatus(id, "accepted", fields)}
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Before Accepting</DialogTitle>
            <DialogDescription>
              Adjust date/time fields if needed
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="visitingDate">Visiting Date</Label>
              <Input
                id="visitingDate"
                type="date"
                value={editFields.visitingDate}
                onChange={(e) =>
                  setEditFields((prev) => ({
                    ...prev,
                    visitingDate: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="visitingTiming">Visiting Time</Label>
              <Input
                id="visitingTiming"
                type="time"
                value={editFields.visitingTiming}
                onChange={(e) =>
                  setEditFields((prev) => ({
                    ...prev,
                    visitingTiming: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={editFields.fromDate}
                onChange={(e) =>
                  setEditFields((prev) => ({
                    ...prev,
                    fromDate: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="toDate">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={editFields.toDate}
                onChange={(e) =>
                  setEditFields((prev) => ({
                    ...prev,
                    toDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleModalConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
