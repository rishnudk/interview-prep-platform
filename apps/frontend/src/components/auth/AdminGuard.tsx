'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers';
import { Loader2, ShieldAlert } from 'lucide-react';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  // Show premium loading indicator while fetching auth status
  if (loading) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 animate-pulse">
            <Loader2 className="animate-spin text-white" size={24} />
          </div>
          <p className="text-sm font-semibold tracking-wide text-muted-foreground animate-pulse">
            Authenticating Administrator...
          </p>
        </div>
      </div>
    );
  }

  // If unauthorized, return null while routing redirects in useEffect
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center gap-4 max-w-md text-center px-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-md">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-sm text-muted-foreground">
            You do not have permission to view the administration panel. Redirecting to your
            dashboard...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
