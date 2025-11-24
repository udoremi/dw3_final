'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PedidosTable, Pedido } from '@/components/pedidos/PedidosTable';
import api from '../../../../services/api';
import { DeleteModal } from '@/components/ui/DeleteModal';

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modais
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [pedidoParaCancelar, setPedidoParaCancelar] = useState<Pedido | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  // MODAL CANCELAMENTO
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
          <PedidosTable data={pedidos} onCancel={handleOpenCancelModal} />
      )}
      
    </div>
  );
}