'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Package, Tag, FileText, DollarSign, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import api from '../../../../../../services/api';

export default function EditarProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [ativo, setAtivo] = useState('true');

  const formatarMoedaInicial = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    const numericValue = Number(value) / 100;
    setPreco(numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
  };

  // LOAD
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Seu backend pede POST e id_produto no body
        const response = await api.post('/getProdutoByID', { id_produto: id });
        
        if (response.data.status === "ok" && response.data.registro.length > 0) {
            const prod = response.data.registro[0];
            setNome(prod.nome);
            setDescricao(prod.descricao);
            setEstoque(prod.estoque_atual.toString()); // estoque_atual
            setAtivo(prod.ativo ? 'true' : 'false');
            setPreco(formatarMoedaInicial(Number(prod.preco))); // Garantir conversão para number
        } else {
            alert("Produto não encontrado");
            router.push('/produtos');
        }
      } catch (error) {
        console.error("Erro", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) loadData();
  }, [id, router]);

  // SUBMIT
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    // Converter preço
    const precoFormatado = Number(preco.replace(/[^0-9,-]+/g, "").replace(",", "."));

    const payload = {
        id_produto: id,
        nome,
        descricao,
        preco: precoFormatado,
        estoque_atual: Number(estoque),
        ativo: ativo === 'true'
    };

    try {
        const response = await api.post('/updateProdutos', payload);
        if(response.data.status === "ok") {
            alert("Salvo com sucesso!");
            router.push('/produtos');
        } else {
            alert("Erro: " + response.data.status);
        }
    } catch(e) {
        console.error(e);
        alert("Erro ao atualizar.");
    } finally {
        setIsSaving(false);
    }
  }

  // DELETE
  const handleDelete = async () => {
    if(!confirm("Apagar produto?")) return;
    try {
        const response = await api.post('/deleteProdutos', { id_produto: id });
        if(response.data.status === "ok") {
            router.push('/produtos');
        } else {
            alert("Erro: " + response.data.status);
        }
    } catch(e) { console.error(e); alert("Erro ao deletar"); }
  };

  if (isLoading) {
    return <div className="flex h-[50vh] justify-center items-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Editar Produto</h1>
          <p className="text-muted-foreground">Alterar informações do produto #{id}.</p>
        </div>
        <Link href="/produtos"><Button type="button" className="bg-card border border-input text-foreground hover:bg-muted"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button></Link>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Mesmos inputs da criação... */}
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
                <Input id="estoque" type="number" value={estoque} onChange={(e) => setEstoque(e.target.value)} />
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

          {/* AÇÕES REFORMULADAS */}
          <div className="flex flex-col-reverse items-center justify-between gap-4 pt-6 border-t border-border mt-8 md:flex-row">
             
             {/* ESQUERDA: Botão Excluir */}
             <Button 
                type="button" 
                className="w-full md:w-auto bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border-transparent transition-all font-medium"
                onClick={handleDelete}
             >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Produto
             </Button>

             {/* DIREITA: Grupo Cancelar + Salvar */}
             <div className="flex flex-col-reverse w-full gap-4 md:w-auto md:flex-row md:items-center">
                <Link href="/produtos" className="w-full md:w-auto">
                    <Button type="button" className="w-full md:w-auto bg-background border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium">
                        Cancelar
                    </Button>
                </Link>
                
                <Button type="submit" disabled={isSaving} className="w-full md:min-w-[180px] font-semibold shadow-sm">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Salvar Alterações
                </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}