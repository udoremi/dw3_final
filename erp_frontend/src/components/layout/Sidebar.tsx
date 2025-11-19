'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,        // Clientes
  ShoppingBag,  // Pedidos
  Package,      // Produtos
  Store
} from 'lucide-react';

// Links diretos na raiz
const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/clientes',
    label: 'Clientes',
    icon: Users,
  },
  {
    href: '/produtos',
    label: 'Produtos',
    icon: Package,
  },
  {
    href: '/pedidos',
    label: 'Pedidos',
    icon: ShoppingBag,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 flex-col border-r border-border bg-card lg:flex">
      {/* Logo */}
      <div className="flex h-16 w-full items-center gap-3 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Store className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">
          BGM<span className="text-primary">ERP</span>
        </span>
      </div>

      {/* Navegação */}
      <nav className="flex flex-1 flex-col gap-2 p-4">
        {navItems.map((link) => {
          // Se estiver na rota exata ou em uma sub-rota
          const isActive = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-primary/10 text-primary shadow-sm' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}