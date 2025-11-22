'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // Rotas públicas que não precisam de login
      const publicRoutes = ['/login'];
      const isPublicRoute = publicRoutes.includes(pathname);

      // Se não estiver logado e tentar acessar rota privada -> Login
      if (!isAuthenticated && !isPublicRoute) {
        router.push('/login');
      }

      // Se já estiver logado e tentar acessar login -> Dashboard
      if (isAuthenticated && isPublicRoute) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#0d1117] text-white">Carregando...</div>;
  }

  return <>{children}</>;
};