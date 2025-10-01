'use client';

import { usePageTransition } from './usePageTransition';

export const useBarbaNavigation = () => {
  const { navigateWithTransition } = usePageTransition();

  const navigateToDashboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      // Try to use Barba.js first
      if (typeof window !== 'undefined') {
        const { barba } = await import('@barba/core');
        
        if (barba && barba.go) {
          // Use barba.go for smooth transition
          await barba.go('/dashboard');
          return;
        }
      }
    } catch (error) {
      console.warn('Barba navigation failed, using CSS transition fallback:', error);
    }
    
    // Fallback to CSS transition
    await navigateWithTransition('/dashboard');
  };

  return { navigateToDashboard };
};