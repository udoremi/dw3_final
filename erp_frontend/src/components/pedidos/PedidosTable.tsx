'use client';

import Link from 'next/link';
import { Eye, Pencil, Ban } from 'lucide-react';

export interface Pedido {
  id_pedido: number;
  id_cliente: number;
  nome_completo: string;
  data_pedido: string;
  status: string;
  valor_total: string | number;
  observacoes: string;
}

interface PedidosTableProps {
  data: Pedido[];
  onCancel: (pedido: Pedido) => void;
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Pendente: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/20',
    Concluído: 'bg-green-500/15 text-green-500 border-green-500/20',
    Cancelado: 'bg-red-500/15 text-red-500 border-red-500/20',
    Processando: 'bg-blue-500/15 text-blue-500 border-blue-500/20',
  }[status] || 'bg-gray-500/15 text-gray-500 border-gray-500/20';

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
      {status}
    </span>
  );
}

export function PedidosTable({ data, onCancel }: PedidosTableProps) {
  const formatMoney = (val: number | string) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val));

  const formatDate = (dateString: string) => {
    if(!dateString) return "-";
    const [ano, mes, dia] = dateString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

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
            {data.length === 0 ? (
               <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Nenhum pedido encontrado.</td></tr>
            ) : (
                data.map((pedido) => {
                  const isFinalized = pedido.status === 'Concluído' || pedido.status === 'Cancelado';

                  return (
                    <tr key={pedido.id_pedido} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 align-middle font-mono text-xs text-muted-foreground">#{pedido.id_pedido}</td>
                        <td className="px-4 py-3 align-middle font-medium text-foreground">{pedido.nome_completo}</td>
                        <td className="px-4 py-3 align-middle text-muted-foreground">{formatDate(pedido.data_pedido)}</td>
                        <td className="px-4 py-3 align-middle font-medium text-foreground">{formatMoney(pedido.valor_total)}</td>
                        <td className="px-4 py-3 align-middle"><StatusBadge status={pedido.status} /></td>
                        
                        <td className="px-4 py-3 align-middle text-right">
                        <div className="flex items-center justify-end gap-4">
                            
                            <Link 
                              href={`/pedidos/ver/${pedido.id_pedido}`} 
                              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-blue-500/10 hover:text-blue-500 transition-all"
                              title="Ver Detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            
                            {!isFinalized && (
                                <Link 
                                  href={`/pedidos/editar/${pedido.id_pedido}`} 
                                  title="Editar Pedido" 
                                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-all"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Link>
                            )}

                            {!isFinalized && (
                                <button 
                                  onClick={() => onCancel(pedido)} 
                                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all"
                                  title="Cancelar Pedido"
                                >
                                  <Ban className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}