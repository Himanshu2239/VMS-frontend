"use client";
import { Button } from "@/components/ui/button";

export function FilterButtons({ view, setView }) {
  const statuses = ["pending", "accepted", "rejected"];
  return (
    <div className="flex gap-2">
      {statuses.map((status) => (
        <Button
          key={status}
          variant={view === status ? undefined : "outline"}
          onClick={() => setView(status)}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)} List
        </Button>
      ))}
    </div>
  );
}
