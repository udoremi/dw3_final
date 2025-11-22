'use client';

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';

export interface Cliente {
  id_cliente: number;
  nome_completo: string;
  email: string;
  cpf_cnpj: string;
  telefone: string;
  ativo: boolean;
}

interface ClientesTableProps {
  data: Cliente[];
  onDelete: (cliente: Cliente) => void;
}

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

export function ClientesTable({ data, onDelete }: ClientesTableProps) {
  return (
    <div className="w-full rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-left text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Cliente</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Documento</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Telefone</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Ações</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        Nenhum cliente encontrado.
                    </td>
                </tr>
            ) : (
                data.map((cliente) => (
                // CORREÇÃO: key={cliente.id_cliente}
                <tr key={cliente.id_cliente} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 align-middle">
                    <div className="flex flex-col">
                        {/* CORREÇÃO: cliente.nome_completo */}
                        <span className="font-medium text-foreground">{cliente.nome_completo}</span>
                        <span className="text-xs text-muted-foreground">{cliente.email}</span>
                    </div>
                    </td>
                    <td className="px-4 py-3 align-middle text-muted-foreground">{cliente.cpf_cnpj}</td>
                    <td className="px-4 py-3 align-middle text-muted-foreground">{cliente.telefone}</td>
                    <td className="px-4 py-3 align-middle">
                    <StatusBadge ativo={cliente.ativo} />
                    </td>
                    
                    <td className="px-4 py-3 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                        {/* CORREÇÃO: link editar com id_cliente */}
                        <Link
                        href={`/clientes/editar/${cliente.id_cliente}`}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
                        title="Editar"
                        >
                        <Pencil className="h-4 w-4" />
                        </Link>
                        
                        <button
                        onClick={() => onDelete(cliente)}
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