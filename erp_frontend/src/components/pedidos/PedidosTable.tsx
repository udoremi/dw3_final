'use client';

import Link from 'next/link';
import { Eye, Pencil, Ban } from 'lucide-react';

interface Pedido {
  id: number;
  cliente: string;
  data: string;
  status: 'Pendente' | 'Concluído' | 'Cancelado' | 'Processando';
  total: number;
  itens: number;
}

const pedidosMock: Pedido[] = [
  { id: 1023, cliente: 'Tech Solutions Ltda', data: '2025-10-14T10:30:00', status: 'Pendente', total: 4500.00, itens: 3 },
  { id: 1022, cliente: 'João da Silva', data: '2025-10-13T16:45:00', status: 'Concluído', total: 125.90, itens: 1 },
  { id: 1021, cliente: 'Padaria do Zé', data: '2025-10-12T09:15:00', status: 'Cancelado', total: 890.50, itens: 12 },
  { id: 1020, cliente: 'Empresa X', data: '2025-10-11T14:20:00', status: 'Processando', total: 2350.00, itens: 5 },
];

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Pendente: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/20',
    Processando: 'bg-blue-500/15 text-blue-500 border-blue-500/20',
    Concluído: 'bg-green-500/15 text-green-500 border-green-500/20',
    Cancelado: 'bg-red-500/15 text-red-500 border-red-500/20',
  }[status] || 'bg-gray-500/15 text-gray-500 border-gray-500/20';

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
      {status}
    </span>
  );
}

export function PedidosTable() {
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="w-full rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-left text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-semibold text-muted-foreground"># ID</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Cliente</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Data</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Valor Total</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pedidosMock.map((pedido) => (
              <tr key={pedido.id} className="group transition-colors hover:bg-muted/50">
                <td className="px-4 py-3 align-middle font-mono text-xs text-muted-foreground">#{pedido.id}</td>
                <td className="px-4 py-3 align-middle font-medium text-foreground">{pedido.cliente}</td>
                <td className="px-4 py-3 align-middle text-muted-foreground">{formatDate(pedido.data)}</td>
                <td className="px-4 py-3 align-middle font-medium text-foreground">{formatCurrency(pedido.total)}</td>
                <td className="px-4 py-3 align-middle"><StatusBadge status={pedido.status} /></td>
                
                {/* NOVAS AÇÕES */}
                <td className="px-4 py-3 align-middle text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/pedidos/${pedido.id}`} title="Ver Detalhes" className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all">
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link href={`/pedidos/editar/${pedido.id}`} title="Editar Pedido" className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-all">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => alert('Cancelar pedido?')} title="Cancelar Pedido" className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-all">
                      <Ban className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}