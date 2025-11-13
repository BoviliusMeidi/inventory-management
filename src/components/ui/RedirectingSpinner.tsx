"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function RedirectingSpinner({ text }: { text: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex h-screen items-center justify-center flex-col bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
      <p className="text-gray-700 text-lg font-medium">
        {text}
      </p>
    </div>,
    document.body 
  );
}