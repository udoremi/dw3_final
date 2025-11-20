'use client';

import Link from 'next/link';
import { Pencil, Trash2, AlertCircle } from 'lucide-react';

// Tipagem baseada no seu SQL
interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  ativo: boolean;
}

// Dados Mock (Simulação)
const produtosMock: Produto[] = [
  {
    id: 1,
    nome: 'Teclado Mecânico RGB',
    descricao: 'Switch Blue, ABNT2, Anti-ghosting',
    preco: 259.90,
    estoque: 15,
    ativo: true,
  },
  {
    id: 2,
    nome: 'Mouse Wireless Pro',
    descricao: '16000 DPI, Bateria recarregável',
    preco: 189.50,
    estoque: 8,
    ativo: true,
  },
  {
    id: 3,
    nome: 'Monitor 24" IPS',
    descricao: 'Full HD, 75Hz, HDMI/VGA',
    preco: 899.00,
    estoque: 0, 
    ativo: true,
  },
  {
    id: 4,
    nome: 'Cadeira Ergonômica',
    descricao: 'Modelo Office Comfort, Preta',
    preco: 1200.00,
    estoque: 2,
    ativo: false, 
  },
];

// Função utilitária para formatar moeda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Badge de Status (Mesmo padrão)
function StatusBadge({ ativo }: { ativo: boolean }) {
  const styles = ativo
    ? 'bg-green-500/15 text-green-500 border-green-500/20'
    : 'bg-red-500/15 text-red-500 border-red-500/20';

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
      {ativo ? 'Ativo' : 'Inativo'}
    </span>
  );
}

export function ProdutosTable() {
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
            {produtosMock.map((produto) => (
              <tr key={produto.id} className="hover:bg-muted/50 transition-colors">
                {/* Coluna Produto + Descrição */}
                <td className="px-4 py-3 align-middle">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{produto.nome}</span>
                    <span className="truncate max-w-[200px] text-xs text-muted-foreground" title={produto.descricao}>
                      {produto.descricao}
                    </span>
                  </div>
                </td>

                {/* Coluna Preço */}
                <td className="px-4 py-3 align-middle text-foreground font-medium">
                  {formatCurrency(produto.preco)}
                </td>

                {/* Coluna Estoque */}
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-2">
                    <span className={produto.estoque === 0 ? 'text-red-500 font-medium' : 'text-muted-foreground'}>
                      {produto.estoque} un
                    </span>
                    {produto.estoque <= 3 && produto.estoque > 0 && (
                      <span title="Estoque Baixo" className="text-amber-500">
                        <AlertCircle className="h-3 w-3" />
                      </span>
                    )}
                    {produto.estoque === 0 && (
                      <span className="text-[10px] uppercase font-bold text-red-500 bg-red-500/10 px-1.5 rounded">Esgotado</span>
                    )}
                  </div>
                </td>

                {/* Coluna Status */}
                <td className="px-4 py-3 align-middle">
                  <StatusBadge ativo={produto.ativo} />
                </td>
                
                {/* Coluna Ações */}
                <td className="px-4 py-3 align-middle text-right">
                  <div className="flex items-center justify-end gap-2">
                    
                    {/* Botão Editar */}
                    <Link
                      href={`/produtos/editar/${produto.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    
                    {/* Botão Excluir */}
                    <button
                      onClick={() => console.log('Excluir produto', produto.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
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