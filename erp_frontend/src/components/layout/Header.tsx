'use client'; 

import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border bg-card px-6">

      <div /> 
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
             <User className="h-5 w-5" />
           </div>
        </div>

        <div className="h-6 w-px bg-border" />

        <button
          onClick={logout} // Chama a função que limpa o token e redireciona
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
          title="Sair do sistema"
          type="button"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}