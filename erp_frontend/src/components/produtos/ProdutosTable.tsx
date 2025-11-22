'use client';

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';

export interface Produto {
  id_produto: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque_atual: number;
  ativo: boolean;
}

interface ProdutosTableProps {
  data: Produto[];
  onDelete: (produto: Produto) => void;
}

function EstoqueBadge({ qtd }: { qtd: number }) {
  if (qtd === 0) {
    return <span className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full">Sem Estoque</span>;
  }
  if (qtd < 5) {
    return <span className="text-xs font-medium text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">Baixo ({qtd})</span>;
  }
  return <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">{qtd} unid.</span>;
}

function StatusBadge({ ativo }: { ativo: boolean }) {
  const styles = ativo
    ? 'bg-green-500/15 text-green-500 border-green-500/20'
    : 'bg-gray-500/15 text-gray-500 border-gray-500/20';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
      {ativo ? 'Ativo' : 'Inativo'}
    </span>
  );
}

export function ProdutosTable({ data, onDelete }: ProdutosTableProps) {
  
  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="w-full rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-left text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Produto</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Preço</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Estoque</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Ações</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
               <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhum produto encontrado.</td></tr>
            ) : (
                data.map((produto) => (
                <tr key={produto.id_produto} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 align-middle">
                    <div className="flex flex-col">
                        <span className="font-medium text-foreground">{produto.nome}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{produto.descricao}</span>
                    </div>
                    </td>
                    <td className="px-4 py-3 align-middle font-medium text-muted-foreground">
                    {formatMoney(produto.preco)}
                    </td>
                    <td className="px-4 py-3 align-middle">
                    <EstoqueBadge qtd={produto.estoque_atual} />
                    </td>
                    <td className="px-4 py-3 align-middle">
                    <StatusBadge ativo={produto.ativo} />
                    </td>
                    
                    <td className="px-4 py-3 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link
                        href={`/produtos/editar/${produto.id_produto}`}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
                        title="Editar"
                        >
                        <Pencil className="h-4 w-4" />
                        </Link>
                        
                        <button
                        onClick={() => onDelete(produto)}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-all"
                        title="Excluir"
                        >
                        <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}