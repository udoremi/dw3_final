'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import api from '../../../../../services/api';

// Interface do Item no Carrinho
interface ItemCarrinho {
  id_produto: number;
  nome: string;
  preco_unitario: number;
  quantidade: number;
  subtotal: number;
}

export default function NovoPedidoPage() {
  const router = useRouter();
  
  // Dados API
  const [clientes, setClientes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  
  // Header Pedido
  const [clienteId, setClienteId] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [status, setStatus] = useState('Pendente');
  const [isSaving, setIsSaving] = useState(false);

  // Itens (Carrinho Local)
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  // Load Inicial
  useEffect(() => {
    const loadDados = async () => {
      try {
        const [resCli, resProd] = await Promise.all([
            api.get('/getAllClientes'),
            api.get('/getAllProdutos')
        ]);
        
        if(resCli.data.status === 'ok') setClientes(resCli.data.registro);
        if(resProd.data.status === 'ok') setProdutos(resProd.data.registro);
        
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    };
    loadDados();
  }, []);

  // Formatador
  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Lógica Carrinho
  const handleAddItem = () => {
    const prod = produtos.find(p => p.id_produto == produtoSelecionadoId);
    if(!prod) return;

    const novoItem: ItemCarrinho = {
        id_produto: prod.id_produto,
        nome: prod.nome,
        preco_unitario: Number(prod.preco),
        quantidade: Number(quantidade),
        subtotal: Number(prod.preco) * Number(quantidade)
    };
    setItens([...itens, novoItem]);
    setProdutoSelecionadoId('');
    setQuantidade(1);
  };

  const handleRemoveItem = (index: number) => {
    const novos = [...itens];
    novos.splice(index, 1);
    setItens(novos);
  };

  // Calcula Total Automaticamente
  const valorTotalCalculado = itens.reduce((acc, item) => acc + item.subtotal, 0);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
        id_cliente: Number(clienteId),
        data_pedido: new Date().toISOString(),
        status: status,
        valor_total: valorTotalCalculado,
        observacoes: observacoes,
        itens: itens 
    };

    try {
        const response = await api.post('/insertPedidos', payload);
        if(response.data.status === "ok") {
            alert("Pedido salvo com sucesso!");
            router.push('/pedidos');
        } else {
            alert("Erro: " + response.data.status);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao salvar.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Novo Pedido</h1>
            <p className="text-muted-foreground">Registrar venda e calcular total.</p>
        </div>
        <Link href="/pedidos">
            <Button type="button" className="bg-card border border-input text-foreground hover:bg-muted">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* CARRINHO DE COMPRAS */}
        <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Itens do Pedido</h2>
                </div>
                
                {/* Add Form */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end bg-muted/20 p-4 rounded-lg border border-border mb-6">
                    <div className="flex-1 space-y-2">
                        <Label>Produto</Label>
                        <Select value={produtoSelecionadoId} onChange={(e) => setProdutoSelecionadoId(e.target.value)}>
                            <option value="" disabled>Selecione...</option>
                            {produtos.map(p => (
                                <option key={p.id_produto} value={p.id_produto}>
                                    {p.nome} - {formatMoney(Number(p.preco))}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div className="w-24 space-y-2">
                        <Label>Qtd</Label>
                        <Input type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} />
                    </div>
                    <Button type="button" onClick={handleAddItem} disabled={!produtoSelecionadoId} className="h-10 px-4 !w-25">
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>

                {/* Lista */}
                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-muted/40">
                            <tr className="text-muted-foreground">
                                <th className="px-4 py-3">Produto</th>
                                <th className="px-4 py-3 text-center">Qtd</th>
                                <th className="px-4 py-3 text-right">Unitário</th>
                                <th className="px-4 py-3 text-right">Subtotal</th>
                                <th className="px-4 py-3 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {itens.length === 0 ? (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Carrinho vazio.</td></tr>
                            ) : (
                                itens.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-muted/5">
                                        <td className="px-4 py-3">{item.nome}</td>
                                        <td className="px-4 py-3 text-center">{item.quantidade}</td>
                                        <td className="px-4 py-3 text-right text-muted-foreground">{formatMoney(item.preco_unitario)}</td>
                                        <td className="px-4 py-3 text-right font-medium">{formatMoney(item.subtotal)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button onClick={() => handleRemoveItem(idx)} className="text-muted-foreground hover:text-red-500 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {/* Footer Total */}
                        <tfoot className="bg-muted/20 border-t border-border">
                            <tr>
                                <td colSpan={3} className="px-4 py-3 text-right font-semibold text-muted-foreground">Total Calculado:</td>
                                <td className="px-4 py-3 text-right font-bold text-lg text-primary">{formatMoney(valorTotalCalculado)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

        {/* DADOS DO PEDIDO */}
        <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Cliente</Label>
                        <Select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
                            <option value="" disabled>Selecione o cliente...</option>
                            {clientes.map(c => (
                                <option key={c.id_cliente} value={c.id_cliente}>{c.nome_completo}</option>
                            ))}
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Status Inicial</Label>
                        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Pendente">Pendente</option>
                            <option value="Concluído">Concluído</option>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Observações</Label>
                        <Textarea 
                            value={observacoes} 
                            onChange={(e) => setObservacoes(e.target.value)} 
                            placeholder="Detalhes da entrega..."
                            className="h-32 resize-none"
                        />
                    </div>
                    
                    <div className="border-t border-border pt-4 flex justify-between items-center">
                        <span className="font-bold text-foreground">Total Final</span>
                        <span className="font-bold text-2xl text-primary">{formatMoney(valorTotalCalculado)}</span>
                    </div>

                    <Button type="submit" className="w-full h-12 font-semibold text-base" disabled={isSaving || !clienteId}>
                        {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-5 w-5"/>} 
                        Salvar Pedido
                    </Button>
                </form>
            </div>
        </div>

      </div>
    </div>
  );
}