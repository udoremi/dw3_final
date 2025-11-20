'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, User, MapPin, Contact, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';

// Interfaces IBGE
interface IBGEUF {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGEMunicipio {
  id: number;
  nome: string;
}

export default function NovoClientePage() {
  // --- ESTADOS DO FORMULÁRIO ---
  const [tipoPessoa, setTipoPessoa] = useState<'fisica' | 'juridica'>('fisica');
  const [documento, setDocumento] = useState('');
  const [cep, setCep] = useState('');
  
  // --- ESTADOS DE ENDEREÇO ---
  const [ufs, setUfs] = useState<IBGEUF[]>([]);
  const [cidades, setCidades] = useState<IBGEMunicipio[]>([]);
  
  // Controle dos Selects
  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');
  const [loadingCidades, setLoadingCidades] = useState(false);

  // carrrega os estados ao abrir
  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then((res) => res.json())
      .then((data) => setUfs(data));
  }, []);

  // carregar cidades quando muda o estado
  useEffect(() => {
    if (!selectedUf) {
      setCidades([]);
      return;
    }
    
    setLoadingCidades(true);
    setSelectedCidade('');

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then((res) => res.json())
      .then((data) => {
        setCidades(data);
        setLoadingCidades(false);
      });
  }, [selectedUf]);

  // --- MÁSCARAS ---
  const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (tipoPessoa === 'fisica') {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})/, '$1-$2');
      value = value.replace(/(-\d{2})\d+?$/, '$1'); 
    } else {
      value = value.replace(/(\d{2})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
      value = value.replace(/(-\d{2})\d+?$/, '$1');
    }
    setDocumento(value);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    value = value.replace(/(-\d{3})\d+?$/, '$1');
    setCep(value);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Enviando formulário...");
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Novo Cliente
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados para cadastrar uma nova empresa ou pessoa física.
          </p>
        </div>
        
        <Link href="/clientes" className="w-full md:w-auto">
          <Button type="button" className="w-full md:w-auto bg-card border border-input text-foreground hover:bg-muted hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      {/* Container do Formulário */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* --- DADOS PESSOAIS --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Dados Pessoais</h2>
            </div>

            {/* Toggle Tipo Pessoa */}
            <div className="flex gap-4 mb-4">
                <button
                    type="button"
                    onClick={() => { setTipoPessoa('fisica'); setDocumento(''); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                        tipoPessoa === 'fisica' 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-input bg-background text-muted-foreground hover:bg-muted'
                    }`}
                >
                    {tipoPessoa === 'fisica' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    Pessoa Física
                </button>
                <button
                    type="button"
                    onClick={() => { setTipoPessoa('juridica'); setDocumento(''); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                        tipoPessoa === 'juridica' 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-input bg-background text-muted-foreground hover:bg-muted'
                    }`}
                >
                    {tipoPessoa === 'juridica' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    Pessoa Jurídica
                </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome_completo">
                    {tipoPessoa === 'fisica' ? 'Nome Completo *' : 'Razão Social *'}
                </Label>
                <Input 
                  id="nome_completo" 
                  name="nome_completo" 
                  placeholder={tipoPessoa === 'fisica' ? "Ex: João da Silva" : "Ex: Minha Empresa Ltda"}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cpf_cnpj">
                    {tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'}
                </Label>
                <Input 
                  id="cpf_cnpj" 
                  name="cpf_cnpj" 
                  value={documento}
                  onChange={handleDocumentoChange}
                  placeholder={tipoPessoa === 'fisica' ? "000.000.000-00" : "00.000.000/0000-00"} 
                  maxLength={18}
                />
              </div>
            </div>
          </div>

          {/* --- CONTATO --- */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
              <Contact className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Contato & Status</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="cliente@email.com" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input 
                  id="telefone" 
                  name="telefone" 
                  placeholder="(00) 00000-0000" 
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

          {/* --- ENDEREÇO --- */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Endereço</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[180px_1fr]">
                <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input 
                        id="cep" 
                        name="cep" 
                        placeholder="00000-000" 
                        value={cep}
                        onChange={handleCepChange}
                        maxLength={9}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="logradouro">Rua / Logradouro</Label>
                    <Input id="logradouro" name="logradouro" placeholder="Ex: Av. Paulista" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[120px_1fr_1fr]">
                 <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input id="numero" name="numero" placeholder="123" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input id="complemento" name="complemento" placeholder="Apto 101" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input id="bairro" name="bairro" placeholder="Centro" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[100px_1fr]">
                <div className="space-y-2">
                    <Label htmlFor="uf">UF</Label>
                    {/* SELECT UF: valor controlado pelo estado */}
                    <Select 
                      id="uf" 
                      name="uf" 
                      value={selectedUf} 
                      onChange={(e) => setSelectedUf(e.target.value)}
                    >
                        <option value="" disabled>--</option>
                        {ufs.map((uf) => (
                          <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>
                        ))}
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Select 
                      id="cidade" 
                      name="cidade" 
                      value={selectedCidade}
                      onChange={(e) => setSelectedCidade(e.target.value)}
                      disabled={!selectedUf || loadingCidades} 
                      className={!selectedUf ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        <option value="" disabled>
                          {loadingCidades ? "Carregando..." : (selectedUf ? "Selecione a cidade" : "Selecione um estado")}
                        </option>
                        {cidades.map((cidade) => (
                          <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>
                        ))}
                    </Select>
                </div>
            </div>

          </div>

          {/* --- AÇÕES --- */}
          <div className="flex flex-col-reverse justify-end gap-4 pt-4 md:flex-row">
            <Link href="/clientes" className="w-full md:w-auto">
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