'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, CreditCard, FileText, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '../../../../../../services/api'

export default function VerPedidoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [pedido, setPedido] = useState<any>(null);

  // Utils
  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateStr: string) => {
      if(!dateStr) return '-';
      const [ano, mes, dia] = dateStr.split('-');
      return `${dia}/${mes}/${ano}`;
  };

  const getStatusColor = (st: string) => {
    switch (st) {
      case 'Pendente': return 'bg-yellow-500/15 text-yellow-500 border-yellow-500/20';
      case 'Concluído': return 'bg-green-500/15 text-green-500 border-green-500/20';
      case 'Cancelado': return 'bg-red-500/15 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/15 text-gray-500 border-gray-500/20';
    }
  };

  // CARREGAR DADOS
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await api.post('/getPedidoByID', { id_pedido: id });
        
        if (response.data.status === 'ok' && response.data.registro.length > 0) {
            const data = response.data.registro[0];
            
            if (!data.itens) data.itens = [];
            
            setPedido(data);
        } else {
            alert("Pedido não encontrado.");
            router.push('/pedidos');
        }
      } catch (error) {
        console.error("Erro ao carregar:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if(id) loadData();
  }, [id, router]);

  if (isLoading || !pedido) {
    return <div className="flex h-[50vh] justify-center items-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center border-b border-border pb-6">
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Pedido #{pedido.id_pedido}
                </h1>
                <span className={`px-3 py-1 rounded-full border text-sm font-semibold ${getStatusColor(pedido.status)}`}>
                    {pedido.status}
                </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Data do Pedido: {formatDate(pedido.data_pedido)}</span>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            <Link href="/pedidos">
                <Button className="bg-card border-input hover:bg-muted text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
            </Link>
        </div>
      </div>

      {/* --- GRID DE CONTEÚDO --- */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        <div className="lg:col-span-2 space-y-6">
            
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="border-b border-border bg-muted/30 px-6 py-4 flex justify-between items-center">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" /> Itens do Pedido
                    </h2>
                    <span className="text-xs text-muted-foreground">{pedido.itens.length} itens listados</span>
                </div>

                {/* Tabela de Itens */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/10 text-muted-foreground font-medium">
                            <tr>
                                <th className="px-6 py-3">Produto</th>
                                <th className="px-6 py-3 text-center">Qtd</th>
                                <th className="px-6 py-3 text-right">Unitário</th>
                                <th className="px-6 py-3 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {pedido.itens.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                        Nenhum item encontrado neste pedido.
                                    </td>
                                </tr>
                            ) : (
                                pedido.itens.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-muted/5">
                                        <td className="px-6 py-4 font-medium text-foreground">{item.nome}</td>
                                        <td className="px-6 py-4 text-center text-muted-foreground">{item.quantidade}</td>
                                        <td className="px-6 py-4 text-right text-muted-foreground">{formatMoney(item.preco_unitario)}</td>
                                        <td className="px-6 py-4 text-right font-medium text-foreground">
                                            {formatMoney(Number(item.preco_unitario) * Number(item.quantidade))}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Footer Total */}
                <div className="bg-muted/20 border-t border-border px-6 py-4">
                    <div className="flex justify-end items-center gap-12">
                        <span className="text-muted-foreground">Valor Total</span>
                        <span className="text-xl font-bold text-primary">{formatMoney(pedido.valor_total)}</span>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                 <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" /> Observações
                 </h3>
                 <div className="p-4 rounded-lg bg-muted/10 border border-border text-sm text-foreground leading-relaxed min-h-[100px]">
                    {pedido.observacoes || "Nenhuma observação registrada."}
                 </div>
            </div>
        </div>

        <div className="space-y-6">
            
            {/* Card Cliente */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                    <User className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-foreground">Cliente</h2>
                </div>
                
                <div className="space-y-4 text-sm">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Nome / Razão Social</p>
                        <p className="text-base font-medium text-foreground">{pedido.nome_completo}</p>
                    </div>
                </div>
            </div>

            {/* Card Resumo Fi */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-foreground">Resumo Financeiro</h2>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total Itens</span>
                    <span className="text-foreground">{formatMoney(pedido.valor_total)}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-foreground">R$ 0,00</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="text-green-500">- R$ 0,00</span>
                 </div>
                 <div className="border-t border-border pt-3 flex justify-between items-center">
                    <span className="font-bold text-foreground">Total Final</span>
                    <span className="font-bold text-xl text-primary">{formatMoney(pedido.valor_total)}</span>
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
}