'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ClientesTable, Cliente } from '@/components/clientes/ClientesTable';
import { FilterModal } from '@/components/ui/FilterModal';
import { DeleteModal } from '@/components/ui/DeleteModal';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function ClientesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [clienteParaDeletar, setClienteParaDeletar] = useState<Cliente | null>(null);

  const handleOpenDeleteModal = (cliente: Cliente) => {
    setClienteParaDeletar(cliente);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (clienteParaDeletar) {
        console.log(`Deletando cliente ID: ${clienteParaDeletar.id} - ${clienteParaDeletar.nome}`);
    }
    setIsDeleteOpen(false);
    setClienteParaDeletar(null);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={() => setIsFilterOpen(false)}
        onClear={() => console.log("Limpar")}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Status</Label>
                <Select>
                    <option value="">Todos</option>
                    <option value="true">Ativos</option>
                    <option value="false">Inativos</option>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Estado (UF)</Label>
                <Select>
                    <option value="">Todos</option>
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                </Select>
            </div>
        </div>
        <div className="space-y-2">
            <Label>Cidade</Label>
            <Input placeholder="Digite a cidade..." />
        </div>
      </FilterModal>

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={`Excluir ${clienteParaDeletar?.nome}?`}
        description={`Tem certeza que deseja remover o cliente "${clienteParaDeletar?.nome}"? Essa ação não pode ser desfeita.`}
      />

      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Clientes
          </h1>
          <p className="text-muted-foreground">
            Gerencie sua base de clientes.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="gap-2 !bg-transparent !text-white hover:!bg-transparent hover:opacity-70 border-0 shadow-none px-0 h-auto w-auto"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filtros</span>
          </Button>

          <Link href="/clientes/novo">
            <Button className="flex flex-row items-center gap-2 h-12 px-8 w-auto whitespace-nowrap text-base font-semibold">
              <Plus className="h-5 w-5" />
              Novo Cliente
            </Button>
          </Link>
        </div>
      </div>

      <ClientesTable onDelete={handleOpenDeleteModal} />
      
    </div>
  );
}