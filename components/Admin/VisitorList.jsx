// components/admin/VisitorList.jsx
"use client";

import { VisitorCard } from "./VisitorCard";

export function VisitorList({
  visitors,
  view,
  loadingStates = {},
  onIssuePassClick,
  onReject,
}) {
  // only show visitors that have been accepted by employee and match the current view
  const filtered = visitors.filter(
    (v) => v.employeeApproved && v.status === view
  );

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">
        {view.charAt(0).toUpperCase() + view.slice(1)} Visitors
      </h2>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No {view} visitors found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((visitor) => (
            <VisitorCard
              key={visitor.id}
              visitor={visitor}
              loading={loadingStates[visitor.id]}
              onIssuePassClick={() => onIssuePassClick(visitor)}
              onReject={() => onReject(visitor.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
