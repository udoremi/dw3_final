'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProdutosTable, Produto } from '@/components/produtos/ProdutosTable';
import api from '../../../../services/api';
import { DeleteModal } from '@/components/ui/DeleteModal';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modais
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [produtoParaDeletar, setProdutoParaDeletar] = useState<Produto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // BUSCAR PRODUTOS
  const fetchProdutos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/getAllProdutos');
      if (response.data.status === "ok") {
        setProdutos(response.data.registro);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // DELETAR
  const handleOpenDeleteModal = (produto: Produto) => {
    setProdutoParaDeletar(produto);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!produtoParaDeletar) return;
    setIsDeleting(true);
    try {
        const response = await api.post('/deleteProdutos', { id_produto: produtoParaDeletar.id_produto });
        
        if(response.data.status === "ok") {
            setProdutos((prev) => prev.filter(p => p.id_produto !== produtoParaDeletar.id_produto));
            setIsDeleteOpen(false);
            setProdutoParaDeletar(null);
        } else {
            alert("Erro ao excluir: " + response.data.status);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao excluir produto.");
    } finally {
        setIsDeleting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      
      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Produto?"
        description={`Tem certeza que deseja remover "${produtoParaDeletar?.nome}"?`}
        isLoading={isDeleting}
      />

      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seu catálogo.</p>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/produtos/novo">
            <Button className="flex flex-row items-center gap-2 h-12 px-8 w-auto whitespace-nowrap text-base font-semibold">
              <Plus className="h-5 w-5" />
              Novo Produto
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
      ) : (
          <ProdutosTable data={produtos} onDelete={handleOpenDeleteModal} />
      )}
      
    </div>
  );
}