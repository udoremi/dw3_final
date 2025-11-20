'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, ShoppingCart } from 'lucide-react';
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

interface ItemCarrinho {
  id_produto: number;
  nome: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export default function NovoPedidoPage() {
  const [clienteId, setClienteId] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  const handleAdicionarProduto = () => {
    if (!produtoSelecionadoId) return;

    const produtoOriginal = produtosMock.find(p => p.id === Number(produtoSelecionadoId));
    if (!produtoOriginal) return;

    const novoItem: ItemCarrinho = {
      id_produto: produtoOriginal.id,
      nome: produtoOriginal.nome,
      quantidade: Number(quantidade),
      preco_unitario: produtoOriginal.preco,
      subtotal: produtoOriginal.preco * Number(quantidade)
    };

    setItens([...itens, novoItem]);
    
    setProdutoSelecionadoId('');
    setQuantidade(1);
  };

  const handleRemoverItem = (index: number) => {
    const novosItens = [...itens];
    novosItens.splice(index, 1);
    setItens(novosItens);
  };

  const valorTotal = itens.reduce((acc, item) => acc + item.subtotal, 0);

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Novo Pedido
          </h1>
          <p className="text-muted-foreground">
            Crie um novo pedido de venda.
          </p>
        </div>
        
        <Link href="/pedidos">
          <Button className="gap-2 border-border bg-card hover:bg-muted text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Adicionar Produtos</h2>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1 space-y-2">
                <Label>Produto</Label>
                <Select 
                  value={produtoSelecionadoId} 
                  onChange={(e) => setProdutoSelecionadoId(e.target.value)}
                >
                  <option value="" disabled>Selecione um produto...</option>
                  {produtosMock.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} - {formatMoney(p.preco)}</option>
                  ))}
                </Select>
              </div>

              <div className="w-full md:w-32 space-y-2">
                <Label>Quantidade</Label>
                <Input 
                  type="number" 
                  min={1} 
                  value={quantidade} 
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                />
              </div>

              <Button 
                type="button" 
                onClick={handleAdicionarProduto}
                disabled={!produtoSelecionadoId}
                className="w-full md:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <table className="min-w-full table-auto text-left text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Produto</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Qtd</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Unitário</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Subtotal</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {itens.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      Nenhum item adicionado ainda.
                    </td>
                  </tr>
                ) : (
                  itens.map((item, index) => (
                    <tr key={index} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-foreground">{item.nome}</td>
                      <td className="px-4 py-3 text-center text-foreground">{item.quantidade}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{formatMoney(item.preco_unitario)}</td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">{formatMoney(item.subtotal)}</td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => handleRemoverItem(index)}
                          className="text-muted-foreground hover:text-danger transition-colors"
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
        </div>

        <div className="space-y-6">     
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select 
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
              >
                <option value="" disabled>Selecione o cliente...</option>
                {clientesMock.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea 
                placeholder="Ex: Entregar na portaria..." 
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="h-24 resize-none"
              />
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Itens</span>
                <span>{itens.length}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-foreground pt-2">
                <span>Total</span>
                <span>{formatMoney(valorTotal)}</span>
              </div>
            </div>

            <Button className="w-full h-12 text-base" disabled={itens.length === 0 || !clienteId}>
              <Save className="mr-2 h-5 w-5" />
              Finalizar Pedido
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}