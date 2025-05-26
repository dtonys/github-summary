'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Sidebar from '@/components/Sidebar';

export default function ProtectedPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotification, setShowNotification] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const isValid = searchParams.get('valid') === 'true';

  useEffect(() => {
    // Hide notification after 3 seconds
    const timer = setTimeout(() => {
      setShowNotification(false);
      // Redirect back to playground after notification
      router.push('/playground');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1">
        <div className="min-h-screen bg-gray-50 p-8">
          {showNotification && (
            <div className="max-w-md mx-auto mt-8">
              <div
                className={`${
                  isValid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                } rounded-lg p-4 flex items-center gap-3 shadow-sm`}
              >
                {isValid ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircleIcon className="w-6 h-6 text-red-500" />
                )}
                <span className="font-medium">
                  {isValid ? 'Valid API Key' : 'Invalid API Key'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 