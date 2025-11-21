'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Ban, Calendar, User, FileText, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CancelModal } from '@/components/pedidos/CancelModal';

// --- UTILS ---
const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString('pt-BR');

// --- COMPONENTES VISUAIS ---
function StatusBadge({ status }: { status: string }) {
  const styles = {
    Pendente: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/20',
    Concluído: 'bg-green-500/15 text-green-500 border-green-500/20',
    Cancelado: 'bg-red-500/15 text-red-500 border-red-500/20',
    Processando: 'bg-blue-500/15 text-blue-500 border-blue-500/20',
  }[status] || 'bg-gray-500/15 text-gray-500 border-gray-500/20';

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${styles}`}>
      {status}
    </span>
  );
}

export default function VerPedidoPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const [pedido, setPedido] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simula API

      const mockDB = {
        id: id,
        cliente: {
            id: 1,
            nome: 'Tech Solutions Ltda',
            email: 'compras@techsolutions.com',
            documento: '12.345.678/0001-90',
            telefone: '(11) 98888-7777'
        },
        status: 'Pendente',
        data_pedido: '2025-10-14T10:30:00',
        observacoes: 'Entregar na recepção lateral. Procurar por Sr. Almeida.',
        itens: [
          { id: 1, nome: 'Monitor Dell 24"', quantidade: 2, preco_unitario: 1200.00, subtotal: 2400.00 },
          { id: 4, nome: 'Cabo HDMI 2m', quantidade: 2, preco_unitario: 25.00, subtotal: 50.00 },
          { id: 2, nome: 'Teclado Mecânico Logitech', quantidade: 1, preco_unitario: 450.00, subtotal: 450.00 }
        ],
        valor_total: 2900.00
      };
      
      setPedido(mockDB);
      setIsLoading(false);
    };
    loadData();
  }, [id]);

  const handleCancel = async (motivo: string) => {
    setIsCanceling(true);
    console.log(`Cancelando pedido ${id}. Motivo: ${motivo}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsCanceling(false);
    setShowCancelModal(false);
    alert("Pedido cancelado com sucesso!");
    router.refresh();
  };

  if (isLoading || !pedido) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando pedido...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      
      {/* --- MODAL --- */}
      <CancelModal 
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        pedidoId={String(id)}
        isLoading={isCanceling}
      />

      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center border-b border-border pb-6">
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Pedido #{pedido.id}
                </h1>
                <StatusBadge status={pedido.status} />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Criado em: {formatDate(pedido.data_pedido)}</span>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            <Link href="/pedidos">
                <Button className="bg-card border-input hover:bg-muted text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
            </Link>

            {pedido.status !== 'Cancelado' && pedido.status !== 'Concluído' && (
                <>
                    <Link href={`/pedidos/editar/${id}`}>
                        <Button className="bg-card border-input hover:bg-primary/10 hover:text-primary hover:border-primary/30">
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                    </Link>

                    <Button 
                        className="bg-red-600/10 text-red-500 border-transparent hover:bg-red-600 hover:text-white transition-all"
                        onClick={() => setShowCancelModal(true)}
                    >
                        <Ban className="mr-2 h-4 w-4" />
                        Cancelar
                    </Button>
                </>
            )}
        </div>
      </div>

      {/* --- CONTEÚDO PRINCIPAL (GRID) --- */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            {/* Tabela de Itens */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="border-b border-border bg-muted/30 px-6 py-4">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Itens do Pedido
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/10 text-muted-foreground font-medium">
                            <tr>
                                <th className="px-6 py-3">Produto</th>
                                <th className="px-6 py-3 text-center">Qtd</th>
                                <th className="px-6 py-3 text-right">Unitário</th>
                                <th className="px-6 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {pedido.itens.map((item: any, idx: number) => (
                                <tr key={idx} className="hover:bg-muted/5">
                                    <td className="px-6 py-4 font-medium text-foreground">{item.nome}</td>
                                    <td className="px-6 py-4 text-center text-muted-foreground">{item.quantidade}</td>
                                    <td className="px-6 py-4 text-right text-muted-foreground">{formatMoney(item.preco_unitario)}</td>
                                    <td className="px-6 py-4 text-right font-medium text-foreground">{formatMoney(item.subtotal)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Totais Footer */}
                <div className="bg-muted/20 border-t border-border px-6 py-4">
                    <div className="flex justify-end items-center gap-12">
                        <span className="text-muted-foreground">Valor Total</span>
                        <span className="text-xl font-bold text-primary">{formatMoney(pedido.valor_total)}</span>
                    </div>
                </div>
            </div>

            {/* Observações */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                 <h3 className="text-sm font-semibold text-muted-foreground mb-2">Observações do Pedido</h3>
                 <div className="p-4 rounded-lg bg-muted/10 border border-border text-sm text-foreground leading-relaxed">
                    {pedido.observacoes || "Nenhuma observação registrada."}
                 </div>
            </div>
        </div>

        <div className="space-y-6">
            {/* Card Cliente */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                    <User className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-foreground">Dados do Cliente</h2>
                </div>
                
                <div className="space-y-3">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Razão Social / Nome</p>
                        <p className="text-base font-medium text-foreground">{pedido.cliente.nome}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Documento</p>
                        <p className="text-sm text-foreground font-mono">{pedido.cliente.documento}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">E-mail</p>
                        <p className="text-sm text-foreground">{pedido.cliente.email}</p>
                    </div>
                     <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Telefone</p>
                        <p className="text-sm text-foreground">{pedido.cliente.telefone}</p>
                    </div>
                </div>
            </div>

            {/* Card Financeiro */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-foreground">Resumo</h2>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Subtotal Itens</span>
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
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-xl text-primary">{formatMoney(pedido.valor_total)}</span>
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
}