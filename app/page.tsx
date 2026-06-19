'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSemsStore } from '@/lib/store';
import LandingPage from '@/components/LandingPage';
import AppShell from '@/components/AppShell';

export default function Home() {
  const { activeView, tickUptime } = useSemsStore();

  useEffect(() => {
    const interval = setInterval(tickUptime, 1000);
    return () => clearInterval(interval);
  }, [tickUptime]);

  return (
    <AnimatePresence mode="wait">
      {activeView === 'landing' ? (
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LandingPage />
        </motion.div>
      ) : (
        <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <AppShell />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
