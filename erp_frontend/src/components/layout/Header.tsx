'use client'; 

import Link from 'next/link';
import { User, LogOut } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border bg-card px-6">
      
      {/* Lado Esquerdo (Pode ser usado para Título da Página atual ou Busca futuramente) */}
      <div /> 

      {/* Lado Direito: Perfil e Ações */}
      <div className="flex items-center gap-4">
        
        {/* Indicador Visual de Usuário (Sem interação, apenas estético) */}
        <div className="flex items-center gap-3">
           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
             <User className="h-5 w-5" />
           </div>
        </div>

        {/* Separator Vertical */}
        <div className="h-6 w-px bg-border" />

        {/* Botão de Logout Direto */}
        <Link
          href="/login"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
          title="Sair do sistema"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sair</span>
        </Link>
      </div>
    </header>
  );
}