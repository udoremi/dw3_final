'use client';

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react'; 

// Tipagem
interface Cliente {
  id: number;
  nome: string;
  email: string;
  documento: string;
  telefone: string;
  ativo: boolean;
}

// Dados Mock
const clientesMock: Cliente[] = [
  {
    id: 1,
    nome: 'Tech Solutions Ltda',
    email: 'contato@techsolutions.com.br',
    documento: '12.345.678/0001-90',
    telefone: '(11) 98888-7777',
    ativo: true,
  },
  {
    id: 2,
    nome: 'João da Silva',
    email: 'joao.silva@gmail.com',
    documento: '123.456.789-00',
    telefone: '(17) 99999-8888',
    ativo: true,
  },
  {
    id: 3,
    nome: 'Padaria do Zé',
    email: 'financeiro@padariaze.com',
    documento: '98.765.432/0001-11',
    telefone: '(21) 3333-4444',
    ativo: false,
  },
];

// Badge de Status
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

export function ClientesTable() {
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
            {clientesMock.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 align-middle">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{cliente.nome}</span>
                    <span className="text-xs text-muted-foreground">{cliente.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3 align-middle text-muted-foreground">{cliente.documento}</td>
                <td className="px-4 py-3 align-middle text-muted-foreground">{cliente.telefone}</td>
                <td className="px-4 py-3 align-middle">
                  <StatusBadge ativo={cliente.ativo} />
                </td>
                
                {/* AÇÕES */}
                <td className="px-4 py-3 align-middle text-right">
                  <div className="flex items-center justify-end gap-2">
                    
                    {/* Botão Editar */}
                    <Link
                      href={`/clientes/editar/${cliente.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    
                    {/* Botão Excluir */}
                    <button
                      onClick={() => console.log('Excluir', cliente.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-all"
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