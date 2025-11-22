'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Package, Tag, FileText, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import api from '../../../../../services/api';

export default function NovoProdutoPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [ativo, setAtivo] = useState('true');

  // Formatação do preço
  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    const numericValue = Number(value) / 100;
    setPreco(numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Converter preço "R$ 1.200,00" para 1200.00
    const precoFormatado = Number(preco.replace(/[^0-9,-]+/g, "").replace(",", "."));

    const payload = {
        nome,
        descricao,
        preco: precoFormatado,
        estoque_atual: Number(estoque),
        ativo: ativo === 'true'
    };

    try {
        const response = await api.post('/insertProdutos', payload);
        if (response.data.status === "ok") {
            router.push('/produtos');
        } else {
            alert("Erro: " + response.data.status);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao salvar produto.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Novo Produto</h1>
          <p className="text-muted-foreground">Cadastrar item no catálogo.</p>
        </div>
        <Link href="/produtos"><Button type="button" className="bg-card border border-input text-foreground hover:bg-muted"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button></Link>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
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
                  <Input id="preco" value={preco} onChange={handlePrecoChange} className="pl-9" required placeholder="0,00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estoque">Estoque Inicial</Label>
                <Input id="estoque" type="number" value={estoque} onChange={(e) => setEstoque(e.target.value)} required />
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

          {/* AÇÕES */}
          <div className="flex flex-col-reverse justify-end gap-4 pt-4 md:flex-row">
            <Link href="/produtos"><Button type="button" className="bg-transparent border border-transparent text-slate-600 hover:bg-slate-100">Cancelar</Button></Link>
            <Button type="submit" disabled={isSaving} className="min-w-[150px]">{isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />} Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}