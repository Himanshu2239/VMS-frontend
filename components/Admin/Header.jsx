"use client";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <Badge variant="outline" className="text-sm px-3 py-1">
        Admin
      </Badge>
    </header>
  );
}