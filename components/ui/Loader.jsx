import React from 'react';

export function Loader({ className }) {
  return (
    <div
      className={`animate-spin border-2 border-t-transparent rounded-full ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}