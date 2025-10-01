'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export const usePageTransition = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateWithTransition = async (href: string) => {
    setIsTransitioning(true);
    
    // Add slide-out animation
    document.body.style.transform = 'translateX(-5%)';
    document.body.style.opacity = '0.9';
    document.body.style.transition = 'all 0.3s ease-out';
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Navigate
    startTransition(() => {
      router.push(href);
    });
    
    // Reset styles after navigation
    setTimeout(() => {
      document.body.style.transform = '';
      document.body.style.opacity = '';
      document.body.style.transition = '';
      setIsTransitioning(false);
    }, 100);
  };

  return {
    navigateWithTransition,
    isTransitioning: isTransitioning || isPending
  };
};