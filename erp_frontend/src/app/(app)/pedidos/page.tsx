'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PedidosTable, Pedido } from '@/components/pedidos/PedidosTable';
import api from '../../../../services/api';

import { FilterModal } from '@/components/ui/FilterModal';
import { DeleteModal } from '@/components/ui/DeleteModal';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modais
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [pedidoParaCancelar, setPedidoParaCancelar] = useState<Pedido | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtros
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  // BUSCAR PEDIDOS
  const fetchPedidos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/getAllPedidos');
      if (response.data.status === "ok") {
        setPedidos(response.data.registro);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // FILTRAR
  const filteredPedidos = pedidos.filter(p => {
    const matchesCliente = p.nome_completo.toLowerCase().includes(filtroCliente.toLowerCase());
    const matchesStatus = filtroStatus === '' ? true : p.status === filtroStatus;
    return matchesCliente && matchesStatus;
  });

  // MODAL
  const handleOpenCancelModal = (pedido: Pedido) => {
    setPedidoParaCancelar(pedido);
    setIsCancelOpen(true);
  };

  // CANCELAR PEDIDO
  const confirmCancel = async () => {
    if (!pedidoParaCancelar) return;
    setIsProcessing(true);
    try {
        const response = await api.post('/deletePedidos', { id_pedido: pedidoParaCancelar.id_pedido });
        
        if(response.data.status === "ok") {
            setPedidos((prev) => prev.filter(p => p.id_pedido !== pedidoParaCancelar.id_pedido));
            setIsCancelOpen(false);
            setPedidoParaCancelar(null);
        } else {
            alert("Erro: " + response.data.status);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao cancelar pedido.");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      
      {/* Filtros */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={() => setIsFilterOpen(false)}
        onClear={() => { setFiltroCliente(''); setFiltroStatus(''); }}
      >
        <div className="space-y-2">
            <Label>Nome do Cliente</Label>
            <Input value={filtroCliente} onChange={(e) => setFiltroCliente(e.target.value)} placeholder="Filtrar por cliente..." />
        </div>
        <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                <option value="">Todos</option>
                <option value="Pendente">Pendente</option>
                <option value="Processando">Processando</option>
                <option value="Concluído">Concluído</option>
            </Select>
        </div>
      </FilterModal>

      {/* Modal Cancelamento */}
      <DeleteModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={confirmCancel}
        title="Cancelar Pedido?"
        description={`Deseja cancelar o pedido #${pedidoParaCancelar?.id_pedido} de ${pedidoParaCancelar?.nome_completo}?`}
        isLoading={isProcessing}
      />

      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Pedidos</h1>
          <p className="text-muted-foreground">Gerencie suas vendas.</p>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="gap-2 !bg-transparent !text-white hover:!bg-transparent hover:opacity-70 border-0 shadow-none px-0 h-auto w-auto"
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

      {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
      ) : (
          <PedidosTable data={filteredPedidos} onCancel={handleOpenCancelModal} />
      )}
      
    </div>
  );
}