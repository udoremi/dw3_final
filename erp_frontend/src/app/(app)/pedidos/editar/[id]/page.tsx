'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

const produtosMock = [
  { id: 1, nome: 'Monitor Dell 24"', preco: 1200.00 },
  { id: 2, nome: 'Teclado Mecânico Logitech', preco: 450.00 },
  { id: 3, nome: 'Mouse Sem Fio', preco: 89.90 },
  { id: 4, nome: 'Cabo HDMI 2m', preco: 25.00 },
];

const clientesMock = [
  { id: 1, nome: 'Tech Solutions Ltda' },
  { id: 2, nome: 'João da Silva' },
  { id: 3, nome: 'Padaria do Zé' },
];

// Interface do Item no Pedido
interface ItemPedido {
  id_produto: number;
  nome: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export default function EditarPedidoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  // --- ESTADOS GERAIS ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- DADOS DO PEDIDO (HEADER) ---
  const [clienteId, setClienteId] = useState('');
  const [status, setStatus] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [dataPedido, setDataPedido] = useState('');

  // --- ITENS DO PEDIDO ---
  const [itens, setItens] = useState<ItemPedido[]>([]);

  // --- CONTROLE DE ADIÇÃO DE PRODUTOS ---
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState('');
  const [quantidadeAdd, setQuantidadeAdd] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const pedidoDB = {
          id: id,
          id_cliente: 1,
          status: 'Pendente',
          data_pedido: '2025-10-14T10:30:00',
          observacoes: 'Entregar na recepção do prédio comercial.',
          itens: [
            { id_produto: 1, nome: 'Monitor Dell 24"', quantidade: 2, preco_unitario: 1200.00, subtotal: 2400.00 },
            { id_produto: 4, nome: 'Cabo HDMI 2m', quantidade: 2, preco_unitario: 25.00, subtotal: 50.00 }
          ]
        };

        setClienteId(pedidoDB.id_cliente.toString());
        setStatus(pedidoDB.status);
        setObservacoes(pedidoDB.observacoes);
        setItens(pedidoDB.itens);
        setDataPedido(new Date(pedidoDB.data_pedido).toLocaleString('pt-BR'));

      } catch (error) {
        console.error("Erro ao carregar pedido", error);
        router.push('/pedidos');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) loadData();
  }, [id, router]);
  
  // Adicionar Produto
  const handleAdicionarProduto = () => {
    if (!produtoSelecionadoId) return;

    const produtoOriginal = produtosMock.find(p => p.id === Number(produtoSelecionadoId));
    if (!produtoOriginal) return;

    const novoItem: ItemPedido = {
      id_produto: produtoOriginal.id,
      nome: produtoOriginal.nome,
      quantidade: Number(quantidadeAdd),
      preco_unitario: produtoOriginal.preco,
      subtotal: produtoOriginal.preco * Number(quantidadeAdd)
    };

    setItens([...itens, novoItem]);
    
    // Reset inputs
    setProdutoSelecionadoId('');
    setQuantidadeAdd(1);
  };

  // Remover Item
  const handleRemoverItem = (index: number) => {
    const novosItens = [...itens];
    novosItens.splice(index, 1);
    setItens(novosItens);
  };

  // Cálculos
  const valorTotal = itens.reduce((acc, item) => acc + item.subtotal, 0);
  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // --- SUBMIT ---
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Pedido Atualizado!", { id, clienteId, status, itens });
    setIsSaving(false);
    router.push('/pedidos');
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando detalhes do pedido...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Editar Pedido <span className="text-primary">#{id}</span>
          </h1>
          <p className="text-muted-foreground">
            Criado em: {dataPedido}
          </p>
        </div>
        
        <Link href="/pedidos">
          <Button type="button" className="w-full md:w-auto bg-card border border-input text-foreground hover:bg-muted">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Itens do Pedido</h2>
              </div>

              {/* Inputs de Adição */}
              <div className="flex flex-col gap-4 md:flex-row md:items-end bg-muted/20 p-4 rounded-lg border border-border mb-6">
                <div className="flex-1 space-y-2">
                  <Label>Adicionar Produto</Label>
                  <Select 
                    value={produtoSelecionadoId} 
                    onChange={(e) => setProdutoSelecionadoId(e.target.value)}
                  >
                    <option value="" disabled>Selecione...</option>
                    {produtosMock.map(p => (
                      <option key={p.id} value={p.id}>{p.nome} - {formatMoney(p.preco)}</option>
                    ))}
                  </Select>
                </div>

                <div className="w-full md:w-32 space-y-2">
                  <Label>Qtd</Label>
                  <Input 
                    type="number" 
                    min={1} 
                    value={quantidadeAdd} 
                    onChange={(e) => setQuantidadeAdd(Number(e.target.value))}
                  />
                </div>

                <Button 
                  type="button" 
                  onClick={handleAdicionarProduto}
                  disabled={!produtoSelecionadoId}
                  className="w-full md:w-auto"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>

              {/* Tabela de Itens */}
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="min-w-full table-auto text-left text-sm">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-muted-foreground">Produto</th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Qtd</th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Unitário</th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Total</th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {itens.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                          Carrinho vazio.
                        </td>
                      </tr>
                    ) : (
                      itens.map((item, index) => (
                        <tr key={index} className="hover:bg-muted/30">
                          <td className="px-4 py-3 text-foreground">{item.nome}</td>
                          <td className="px-4 py-3 text-center text-foreground">{item.quantidade}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{formatMoney(item.preco_unitario)}</td>
                          <td className="px-4 py-3 text-right font-medium text-foreground">{formatMoney(item.subtotal)}</td>
                          <td className="px-4 py-3 text-center">
                            <button 
                              type="button"
                              onClick={() => handleRemoverItem(index)}
                              className="text-muted-foreground hover:text-danger transition-colors"
                              title="Remover item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot className="bg-muted/20 border-t border-border">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-semibold text-muted-foreground">Total do Pedido:</td>
                      <td className="px-4 py-3 text-right font-bold text-lg text-primary">{formatMoney(valorTotal)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status do Pedido</Label>
                <Select 
                  id="status" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className={
                    status === 'Pendente' ? 'border-yellow-500/50 text-yellow-500' :
                    status === 'Concluído' ? 'border-green-500/50 text-green-500' :
                    status === 'Cancelado' ? 'border-red-500/50 text-red-500' : ''
                  }
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Processando">Processando</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select 
                  id="cliente"
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                >
                  <option value="" disabled>Selecione...</option>
                  {clientesMock.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="obs">Observações</Label>
                <Textarea 
                  id="obs"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="h-32 resize-none"
                />
              </div>

              <div className="border-t border-border my-4" />
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full h-12 text-base font-semibold shadow-md"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Salvar Alterações
                    </>
                  )}
                </Button>

                <Button 
                    type="button" 
                    className="w-full bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border-transparent transition-all"
                    onClick={() => confirm("ATENÇÃO: Deseja realmente excluir este pedido permanentemente?") && console.log("Excluindo...")}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir Pedido
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 flex gap-3 items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-200/80">
                    Alterar o status para <strong>Concluído</strong> irá baixar o estoque dos produtos automaticamente.
                </p>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}