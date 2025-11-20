'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProdutosTable, Produto } from '@/components/produtos/ProdutosTable';
import { FilterModal } from '@/components/ui/FilterModal';
import { DeleteModal } from '@/components/ui/DeleteModal';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function ProdutosPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [produtoParaDeletar, setProdutoParaDeletar] = useState<Produto | null>(null);

  const handleOpenDeleteModal = (produto: Produto) => {
    setProdutoParaDeletar(produto);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (produtoParaDeletar) {
        console.log(`Excluindo produto ID: ${produtoParaDeletar.id} - ${produtoParaDeletar.nome}`);
    }
    setIsDeleteOpen(false);
    setProdutoParaDeletar(null);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={() => setIsFilterOpen(false)}
        onClear={() => console.log("Limpar filtros")}
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
                <Label>Estoque</Label>
                <Select>
                    <option value="">Todos</option>
                    <option value="baixo">Estoque Baixo (&lt; 5)</option>
                    <option value="zerado">Sem Estoque (0)</option>
                </Select>
            </div>
        </div>

        <div className="space-y-2">
            <Label>Faixa de Preço (R$)</Label>
            <div className="flex items-center gap-2">
                <Input type="number" placeholder="Min" />
                <span className="text-muted-foreground">-</span>
                <Input type="number" placeholder="Max" />
            </div>
        </div>
      </FilterModal>

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={`Excluir Produto?`}
        description={`Tem certeza que deseja remover o produto "${produtoParaDeletar?.nome}" do catálogo?`}
      />

      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Produtos
          </h1>
          <p className="text-muted-foreground">
            Gerencie seu catálogo, preços e estoque.
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

          <Link href="/produtos/novo">
            <Button className="flex flex-row items-center gap-2 h-12 px-8 w-auto whitespace-nowrap text-base font-semibold">
              <Plus className="h-5 w-5" />
              Novo Produto
            </Button>
          </Link>
        </div>
      </div>

      <ProdutosTable onDelete={handleOpenDeleteModal} />
      
    </div>
  );
}