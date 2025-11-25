'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, Loader2, Calendar, User, CreditCard, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import api from '../../../../../../services/api';

// Interface do Carrinho
interface ItemCarrinho {
  id_produto: number;
  nome: string;
  preco_unitario: number;
  quantidade: number;
  subtotal: number;
}

export default function EditarPedidoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Dados Auxiliares
  const [clientes, setClientes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);

  // Header do Pedido
  const [clienteId, setClienteId] = useState('');
  const [status, setStatus] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [dataPedido, setDataPedido] = useState('');
  
  // Itens
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  
  // Controle de Adição de Produto
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  // Utils de Formatação
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
      case 'Processando': return 'bg-blue-500/15 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/15 text-gray-500 border-gray-500/20';
    }
  };

  // LOAD INICIAL
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        // Carrega listas de apoio
        const [resCli, resProd] = await Promise.all([
            api.get('/getAllClientes'),
            api.get('/getAllProdutos')
        ]);
        if(resCli.data.status === 'ok') setClientes(resCli.data.registro);
        if(resProd.data.status === 'ok') setProdutos(resProd.data.registro);

        // Carrega o Pedido
        const resPed = await api.post('/getPedidoByID', { id_pedido: id });
        
        if(resPed.data.status === 'ok' && resPed.data.registro.length > 0) {
            const ped = resPed.data.registro[0];
            
            setClienteId(ped.id_cliente.toString());
            setStatus(ped.status);
            setObservacoes(ped.observacoes || '');
            setDataPedido(ped.data_pedido);

            // Carrega itens se existirem
            if (ped.itens && Array.isArray(ped.itens)) {
                const itensFormatados = ped.itens.map((item: any) => ({
                    id_produto: item.id_produto,
                    nome: item.nome,
                    preco_unitario: Number(item.preco_unitario),
                    quantidade: Number(item.quantidade),
                    subtotal: Number(item.preco_unitario) * Number(item.quantidade)
                }));
                setItens(itensFormatados);
            }
        } else {
            alert("Pedido não encontrado");
            router.push('/pedidos');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if(id) init();
  }, [id, router]);

  // --- LÓGICA DE ITENS ---
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

  // Calcula total
  const valorTotalCalculado = itens.reduce((acc, item) => acc + item.subtotal, 0);

  // --- SUBMIT (Salvar) ---
  const handleSubmit = async () => {
    setIsSaving(true);

    const payload = {
        id_pedido: id,
        id_cliente: Number(clienteId),
        data_pedido: dataPedido,
        status: status,
        valor_total: valorTotalCalculado,
        observacoes: observacoes,
        itens: itens
    };

    try {
        const response = await api.post('/updatePedidos', payload);
        if(response.data.status === "ok") {
            alert("Pedido Atualizado!");
            router.push('/pedidos');
        } else {
            alert("Erro: " + response.data.status);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao atualizar.");
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando pedido...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      
      {/* --- HEADER DA PÁGINA --- */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center border-b border-border pb-6">
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Editar Pedido #{id}
                </h1>
                <span className={`px-3 py-1 rounded-full border text-sm font-semibold ${getStatusColor(status)}`}>
                    {status}
                </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Criado em: {formatDate(dataPedido)}</span>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            {/* BOTÃO CANCELAR/VOLTAR */}
            <Link href="/pedidos">
                <Button 
                    type="button" 
                    className="bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white border-transparent transition-all"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cancelar
                </Button>
            </Link>
            
            <Button 
                onClick={handleSubmit} 
                disabled={isSaving} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md"
            >
                {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4" />} 
                Salvar Alterações
            </Button>
        </div>
      </div>

      {/* --- GRID DE CONTEÚDO --- */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="border-b border-border bg-muted/30 px-6 py-4 flex justify-between items-center">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Itens do Pedido
                    </h2>
                </div>

                {/* Área de Adicionar Produto */}
                <div className="p-4 bg-muted/10 border-b border-border flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="flex-1 space-y-1">
                        <Label className="text-xs">Adicionar Produto</Label>
                        <Select 
                            value={produtoSelecionadoId} 
                            onChange={(e) => setProdutoSelecionadoId(e.target.value)}
                            className="h-10"
                        >
                            <option value="" disabled>Selecione...</option>
                            {produtos.map(p => (
                                <option key={p.id_produto} value={p.id_produto}>
                                    {p.nome} - {formatMoney(Number(p.preco))}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div className="w-20 space-y-1">
                        <Label className="text-xs">Qtd</Label>
                        <Input 
                            type="number" 
                            min="1" 
                            value={quantidade} 
                            onChange={(e) => setQuantidade(Number(e.target.value))} 
                            className="h-10"
                        />
                    </div>
                    <Button 
                        type="button" 
                        onClick={handleAddItem} 
                        disabled={!produtoSelecionadoId}
                        className="h-10 px-4 !w-25"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>

                {/* Tabela */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/10 text-muted-foreground font-medium">
                            <tr>
                                <th className="px-6 py-3">Produto</th>
                                <th className="px-6 py-3 text-center">Qtd</th>
                                <th className="px-6 py-3 text-right">Unitário</th>
                                <th className="px-6 py-3 text-right">Total</th>
                                <th className="px-6 py-3 text-center w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {itens.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        Nenhum item listado. Adicione acima para calcular o total.
                                    </td>
                                </tr>
                            ) : (
                                itens.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-muted/5">
                                        <td className="px-6 py-4 font-medium text-foreground">{item.nome}</td>
                                        <td className="px-6 py-4 text-center text-muted-foreground">{item.quantidade}</td>
                                        <td className="px-6 py-4 text-right text-muted-foreground">{formatMoney(item.preco_unitario)}</td>
                                        <td className="px-6 py-4 text-right font-medium text-foreground">{formatMoney(item.subtotal)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleRemoveItem(idx)} 
                                                className="text-muted-foreground hover:text-red-500 transition-colors"
                                                title="Remover item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Totais Footer */}
                <div className="bg-muted/20 border-t border-border px-6 py-4">
                    <div className="flex justify-end items-center gap-12">
                        <span className="text-muted-foreground">Subtotal Calculado</span>
                        <span className="text-xl font-bold text-primary">{formatMoney(valorTotalCalculado)}</span>
                    </div>
                </div>
            </div>

            {/* Observações */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                 <h3 className="text-sm font-semibold text-foreground mb-2">Observações do Pedido</h3>
                 <Textarea 
                    value={observacoes} 
                    onChange={(e) => setObservacoes(e.target.value)} 
                    className="h-32 resize-none bg-muted/10 border-border focus:bg-background transition-colors"
                    placeholder="Digite observações internas..."
                 />
            </div>
        </div>

        <div className="space-y-6">
            
            {/* Card Cliente */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                    <User className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-foreground">Cliente & Status</h2>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Cliente</Label>
                        <Select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                            {clientes.map(c => (
                                <option key={c.id_cliente} value={c.id_cliente}>{c.nome_completo}</option>
                            ))}
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Status Atual</Label>
                        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Pendente">Pendente</option>
                            <option value="Processando">Processando</option>
                            <option value="Concluído">Concluído</option>
                            <option value="Cancelado">Cancelado</option>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Card Resumo Financeiro */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-foreground">Resumo Financeiro</h2>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total Itens</span>
                    <span className="text-foreground">{formatMoney(valorTotalCalculado)}</span>
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
                    <span className="font-bold text-xl text-primary">{formatMoney(valorTotalCalculado)}</span>
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
}