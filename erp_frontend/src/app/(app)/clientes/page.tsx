'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ClientesTable, Cliente } from '@/components/clientes/ClientesTable';
import api from '../../../../services/api';
import { FilterModal } from '@/components/ui/FilterModal';
import { DeleteModal } from '@/components/ui/DeleteModal';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modais
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [clienteParaDeletar, setClienteParaDeletar] = useState<Cliente | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados de Filtro
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  // --- BUSCAR CLIENTES ---
  const fetchClientes = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/getAllClientes');
      if (response.data.status === "ok") {
        setClientes(response.data.registro);
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // --- FILTRAR ---
  const filteredClientes = clientes.filter(cliente => {
    const matchesNome = cliente.nome_completo.toLowerCase().includes(filtroNome.toLowerCase());
    const matchesStatus = filtroStatus === '' ? true : String(cliente.ativo) === filtroStatus;
    return matchesNome && matchesStatus;
  });

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };

  // --- EXCLUIR ---
  const handleOpenDeleteModal = (cliente: Cliente) => {
    setClienteParaDeletar(cliente);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!clienteParaDeletar) return;
    setIsDeleting(true);
    try {
        const response = await api.post('/deleteClientes', { id_cliente: clienteParaDeletar.id_cliente });
        
        if(response.data.status === "ok") {
            setClientes((prev) => prev.filter(c => c.id_cliente !== clienteParaDeletar.id_cliente));
            setIsDeleteOpen(false);
            setClienteParaDeletar(null);
        } else {
            alert("Erro ao excluir: " + response.data.status);
        }
    } catch (error: any) {
        console.error(error);
        alert("Erro de conexão ao excluir cliente.");
    } finally {
        setIsDeleting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      
      {/* Filtros */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        onClear={() => { setFiltroNome(''); setFiltroStatus(''); }}
      >
        <div className="space-y-2">
            <Label>Nome ou Documento</Label>
            <Input 
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                placeholder="Digite para filtrar..." 
            />
        </div>
        <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                <option value="">Todos</option>
                <option value="true">Ativos</option>
                <option value="false">Inativos</option>
            </Select>
        </div>
      </FilterModal>

      {/* Delete */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={`Excluir ${clienteParaDeletar?.nome_completo}?`} 
        description="Essa ação removerá o cliente da listagem (Inativação)."
        isLoading={isDeleting}
      />

      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie sua base de clientes.</p>
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

      {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
      ) : (
          <ClientesTable data={filteredClientes} onDelete={handleOpenDeleteModal} />
      )}
      
    </div>
  );
}