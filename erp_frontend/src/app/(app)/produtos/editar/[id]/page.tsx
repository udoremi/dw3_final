'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Package, Tag, FileText, DollarSign, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';

export default function EditarProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  // --- ESTADOS ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [ativo, setAtivo] = useState('true');

  // --- CARREGAMENTO DE DADOS ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        
        // Dados simulados
        const produtoDoBanco = {
          id: id,
          nome: 'Teclado Mecânico RGB',
          descricao: 'Switch Blue, ABNT2, Anti-ghosting',
          preco: 259.90,
          estoque: 15,
          ativo: true
        };

        setNome(produtoDoBanco.nome);
        setDescricao(produtoDoBanco.descricao);
        setEstoque(produtoDoBanco.estoque.toString());
        setAtivo(produtoDoBanco.ativo ? 'true' : 'false');
        setPreco(formatarMoedaInicial(produtoDoBanco.preco));
        
      } catch (error) {
        console.error("Erro", error);
        router.push('/produtos');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) loadData();
  }, [id, router]);

  // --- UTILS ---
  const formatarMoedaInicial = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    const numericValue = Number(value) / 100;
    setPreco(numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
  };

  const handleEstoqueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEstoque(e.target.value.replace(/\D/g, ''));
  };

  // --- SUBMIT ---
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Salvo!");
    setIsSaving(false);
    router.push('/produtos');
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Editar Produto
          </h1>
          <p className="text-muted-foreground">
            Alterar informações do produto #{id}.
          </p>
        </div>
        
        <Link href="/produtos" className="w-full md:w-auto">
          <Button type="button" className="w-full md:w-auto bg-card border border-input text-foreground hover:bg-muted">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      {/* Formulário */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Campos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Dados Gerais</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto</Label>
                <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ativo">Status</Label>
                <Select id="ativo" value={ativo} onChange={(e) => setAtivo(e.target.value)}>
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
              <Tag className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Valores</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="preco">Preço</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="preco" value={preco} onChange={handlePrecoChange} className="pl-9" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estoque">Estoque</Label>
                <Input id="estoque" value={estoque} onChange={handleEstoqueChange} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
               <FileText className="h-5 w-5 text-primary" />
               <h2 className="text-lg font-semibold text-foreground">Descrição</h2>
            </div>
            <Input id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="h-20" />
          </div>

          {/* --- AÇÕES (BOTÕES REORGANIZADOS) --- */}
          <div className="flex flex-col items-center justify-between gap-4 pt-6 border-t border-border mt-8 md:flex-row">
                {/* Botão Salvar*/}
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full md:min-w-[200px] font-semibold shadow-md"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
             
             

             {/* DIREITA: Cancelar e deletar*/}
             <div className="flex flex-col w-full gap-4 md:w-auto md:flex-row md:items-center">
                <Link href="/produtos" className="w-full md:w-auto">
                    <Button 
                        type="button" 
                        className="
                        w-full md:w-auto 
                        bg-transparent          /* Fundo transparente */
                        border border-transparent 
                        text-slate-600          /* Texto cinza escuro */
                        hover:bg-slate-100      /* Fundo cinza claro ao passar o mouse */
                        hover:text-slate-900
                        "
                    >
                        Cancelar
                    </Button>
                </Link>
                
            </div>
             <Button 
                type="button" 
                className="w-full md:w-auto bg-red-600 text-white hover:bg-red-700 border-transparent"
                onClick={() => confirm("Tem certeza que deseja apagar este registro?") && console.log("Excluindo...")}
             >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Produto
             </Button>
          </div>

        </form>
      </div>
    </div>
  );
}