'use client';

import Link from 'next/link';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PedidosTable } from '@/components/pedidos/PedidosTable';

export default function PedidosPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Pedidos
          </h1>
          <p className="text-muted-foreground">
            Acompanhe vendas, status e faturamento.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            type="button"
            className="
              gap-2 
              !bg-transparent 
              !text-white 
              hover:!bg-transparent 
              hover:opacity-70 
              border-0 
              shadow-none
              px-0
              h-auto
              w-auto
            "
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filtros</span>
          </Button>

          <Link href="/pedidos/novo">
            <Button className="flex flex-row items-center gap-2 h-12 px-8 w-auto whitespace-nowrap text-base font-semibold">
              <Plus className="h-5 w-5" />
              Novo Pedido
            </Button>
          </Link>
        </div>

      </div>

      {/* Tabela */}
      <PedidosTable />
      
    </div>
  );
}