import React from 'react';
import { Button } from '@/components/ui/button';

export function FilterButtons({ view, setView }) {
  return (
    <div className="flex gap-2 mb-8">
      <Button
        variant={view === 'pending' ? undefined : 'outline'}
        onClick={() => setView('pending')}
      >
        Pending List
      </Button>
      <Button
        variant={view === 'accepted' ? undefined : 'outline'}
        onClick={() => setView('accepted')}
      >
        Accepted List
      </Button>
      <Button
        variant={view === 'rejected' ? undefined : 'outline'}
        onClick={() => setView('rejected')}
      >
        Rejected List
      </Button>
    </div>
  );
}
