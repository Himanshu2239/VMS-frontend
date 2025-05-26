'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FilterButtons } from './FilterButtons';
import { VisitorCard } from './VisitorCard';
import { Button } from '@/components/ui/button';

export default function EmployeeDashboard({
  visitors,
  view,
  setView,
  loading,
  error,
  page,
  setPage,
  loadingStates,
  onStatusChange,
  onUpdate,
}) {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        <Badge variant="outline" className="text-sm px-3 py-1">
          Employee
        </Badge>
      </div>

      <FilterButtons view={view} setView={setView} />

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && visitors.length === 0 && (
        <p className="text-gray-500">No {view} visitors found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visitors.map(v => (
          <VisitorCard
            key={v._id}
            visitor={v}
            view={view}
            loading={loadingStates[v._id]}
            onStatusChange={onStatusChange}
            onUpdate={onUpdate}
          />
        ))}
      </div>

      <div className="flex justify-center items-center mt-6 space-x-4">
        <Button onClick={() => setPage(page - 1)} disabled={page <= 1}>
          Previous
        </Button>
        <span className="text-sm">Page {page}</span>
        <Button onClick={() => setPage(page + 1)} disabled={visitors.length < 20}>
          Next
        </Button>
      </div>
    </div>
  );
}
