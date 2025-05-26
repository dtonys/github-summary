'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ValidationResult from '@/components/ValidationResult';

export default function ProtectedPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1">
        <div className="min-h-screen bg-gray-50 p-8">
          <Suspense fallback={<div>Loading...</div>}>
            <ValidationResult />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 