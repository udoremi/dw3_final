'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PedidosTable } from '@/components/pedidos/PedidosTable';
import { FilterModal } from '@/components/ui/FilterModal';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CancelModal } from '@/components/pedidos/CancelModal';

export default function PedidosPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [pedidoParaCancelar, setPedidoParaCancelar] = useState<any>(null);
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);

  const handleOpenCancelModal = (pedido: any) => {
    setPedidoParaCancelar(pedido);
    setIsCancelOpen(true);
  };

  const handleConfirmCancel = async (motivo: string) => {
    setIsLoadingCancel(true);
    console.log(`Cancelando pedido #${pedidoParaCancelar.id}. Motivo: ${motivo}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoadingCancel(false);
    setIsCancelOpen(false);
    setPedidoParaCancelar(null);
  };

  const handleApplyFilters = () => {
    console.log("Filtros de pedidos aplicados!");
    setIsFilterOpen(false);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        onClear={() => console.log("Limpar filtros")}
      >
        <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
                <Label>Status do Pedido</Label>
                <Select>
                    <option value="">Todos</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Processando">Processando</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Cancelado">Cancelado</option>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Cliente</Label>
                <Input placeholder="Nome da empresa ou cliente..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Data Inicial</Label>
                    <Input type="date" />
                </div>
                <div className="space-y-2">
                    <Label>Data Final</Label>
                    <Input type="date" />
                </div>
            </div>

        </div>
      </FilterModal>

      <CancelModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleConfirmCancel}
        pedidoId={pedidoParaCancelar?.id}
        isLoading={isLoadingCancel}
      />

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
          
          {/* Botão Filtros */}
          <Button 
            type="button"
            onClick={() => setIsFilterOpen(true)}
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
      <PedidosTable onCancel={handleOpenCancelModal} />
      
    </div>
  );
}