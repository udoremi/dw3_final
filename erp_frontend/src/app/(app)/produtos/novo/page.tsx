'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Package, Tag, FileText, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';

export default function NovoProdutoPage() {
  // --- ESTADOS DO FORMULÁRIO ---
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');

  // --- MÁSCARAS ---
  
  // Formata para moeda BRL 
  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); 
    
    // visualização de moeda
    const numericValue = Number(value) / 100;
    const formatted = numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    setPreco(formatted);
  };

  // Garante apenas números inteiros no estoque
  const handleEstoqueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setEstoque(value);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Enviando formulário de produto...");
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Novo Produto
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados para cadastrar um novo item ao estoque.
          </p>
        </div>
        
        <Link href="/produtos" className="w-full md:w-auto">
          <Button type="button" className="w-full md:w-auto bg-card border border-input text-foreground hover:bg-muted hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      {/* Container do Formulário */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* --- DADOS PRINCIPAIS --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Dados do Produto</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto *</Label>
                <Input 
                  id="nome" 
                  name="nome" 
                  placeholder="Ex: Teclado Mecânico RGB" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ativo">Status</Label>
                <Select id="ativo" name="ativo" defaultValue="true">
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </Select>
              </div>
            </div>
          </div>

          {/* --- PREÇO E ESTOQUE --- */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
              <Tag className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Valores e Estoque</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="preco">Preço de Venda *</Label>
                <div className="relative">
                    
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                    id="preco" 
                    name="preco" 
                    value={preco}
                    onChange={handlePrecoChange}
                    placeholder="R$ 0,00" 
                    className="pl-9" 
                    required 
                    />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estoque_atual">Estoque Atual</Label>
                <Input 
                  id="estoque_atual" 
                  name="estoque_atual" 
                  value={estoque}
                  onChange={handleEstoqueChange}
                  placeholder="0" 
                  type="text" 
                />
              </div>
            </div>
          </div>

          {/* --- DESCRIÇÃO --- */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Detalhes</h2>
            </div>

            <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input 
                  id="descricao" 
                  name="descricao" 
                  placeholder="Detalhes técnicos do produto..." 
                  className="h-20" 
                />
            </div>
          </div>

          {/* --- AÇÕES --- */}
          <div className="flex flex-col-reverse justify-end gap-4 pt-4 md:flex-row">
            <Link href="/produtos" className="w-full md:w-auto">
                <Button 
                  type="button" 
                  className="w-full md:w-auto !bg-red-600 hover:!bg-red-700 !text-white !border-transparent"
                >
                  Cancelar
                </Button>
            </Link>
            
            <Button type="submit" className="w-full md:w-40">
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}