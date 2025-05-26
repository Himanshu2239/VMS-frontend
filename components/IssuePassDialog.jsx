import React, { useState, useEffect } from "react";
import axios from "axios";
import { FilterButtonsAdmin } from "./FilterButtonsAdmin";
import { VisitorCardAdmin } from "./VisitorCardAdmin";
import { IssuePassDialog } from "./IssuePassDialog";

export default function AdminDashboard() {
  const [view, setView] = useState("pending");
  const [visitors, setVisitors] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingStates, setLoadingStates] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentVisitor, setCurrentVisitor] = useState(null);

  // Placeholder effect: integrate backend later
  useEffect(() => {
    setVisitors([]); // clear or fetch real data
  }, [view, page]);

  const handleStatusChange = (id, status) => {
    setLoadingStates((s) => ({ ...s, [id]: true }));
    setTimeout(() => {
      setVisitors((vs) => vs.filter((v) => v.id !== id));
      setLoadingStates((s) => ({ ...s, [id]: false }));
      if (status === "accepted") {
        const v = visitors.find((v) => v.id === id);
        setCurrentVisitor(v);
        setDialogOpen(true);
      }
    }, 500);
  };

  const handleIssueConfirm = (id, expiry) => {
    setDialogOpen(false);
    setVisitors((vs) =>
      vs.map((v) =>
        v.id === id
          ? { ...v, passIssued: true, expiryDate: expiry, notified: true }
          : v
      )
    );
  };

  return (
    <div className="container mx-auto py-10 px-4 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </header>

      <FilterButtonsAdmin view={view} setView={setView} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visitors.map((v) => (
          <VisitorCardAdmin
            key={v.id}
            visitor={v}
            view={view}
            loadingStates={loadingStates}
            onStatusChange={handleStatusChange}
            onOpenDialog={(vis) => {
              setCurrentVisitor(vis);
              setDialogOpen(true);
            }}
          />
        ))}
      </div>

      <IssuePassDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        visitor={currentVisitor}
        onConfirm={handleIssueConfirm}
      />
    </div>
  );
}
