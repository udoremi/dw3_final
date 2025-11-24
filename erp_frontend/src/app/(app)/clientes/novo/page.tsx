'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User, MapPin, Contact, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import api from '../../../../../services/api';

interface IBGEUF { id: number; sigla: string; nome: string; }
interface IBGEMunicipio { id: number; nome: string; }

export default function NovoClientePage() {
  const router = useRouter();
  
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados de Campos
  const [tipoPessoa, setTipoPessoa] = useState<'fisica' | 'juridica'>('fisica');
  const [documento, setDocumento] = useState('');
  const [cep, setCep] = useState('');
  const [telefone, setTelefone] = useState('');
  
  // Dados IBGE
  const [ufs, setUfs] = useState<IBGEUF[]>([]);
  const [cidades, setCidades] = useState<IBGEMunicipio[]>([]);
  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');
  const [loadingCidades, setLoadingCidades] = useState(false);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then((res) => res.json())
      .then((data) => setUfs(data));
  }, []);

  useEffect(() => {
    if (!selectedUf) { setCidades([]); return; }
    setLoadingCidades(true);
    setSelectedCidade('');
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then((res) => res.json())
      .then((data) => { setCidades(data); setLoadingCidades(false); });
  }, [selectedUf]);

  // --- MÁSCARAS ---

  const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (tipoPessoa === 'fisica') {
      value = value.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
    } else {
      value = value.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
    }
    setDocumento(value);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1');
    setCep(value);
  };

  // MÁSCARA TELEFONE
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove tudo que não é número
    value = value.replace(/\D/g, "");
    
    // Limita a 11 dígitos
    value = value.substring(0, 11);

    // Aplica a formatação
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");

    setTelefone(value);
  };

  // --- SUBMIT ---
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
        nome_completo: formData.get('nome_completo'),
        email: formData.get('email'),
        cpf_cnpj: documento,
        telefone: telefone,
        
        logradouro: formData.get('logradouro'),
        numero: formData.get('numero'),
        complemento: formData.get('complemento'),
        bairro: formData.get('bairro'),
        cidade: selectedCidade,
        uf: selectedUf,
        cep: cep,

        data_cadastro: new Date().toISOString(),
        ativo: true 
    };

    try {
        const response = await api.post('/insertClientes', payload);
        if(response.data.status === "ok") {
            router.push('/clientes');
        } else {
            alert("Erro do backend: " + response.data.status);
        }
    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro de conexão.");
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Novo Cliente</h1>
          <p className="text-muted-foreground">Preencha os dados para cadastrar.</p>
        </div>
        <Link href="/clientes"><Button type="button" className="bg-card border border-input text-foreground hover:bg-muted"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button></Link>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* DADOS PESSOAIS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Dados Pessoais</h2>
            </div>
            <div className="flex gap-4 mb-4">
                <button type="button" onClick={() => { setTipoPessoa('fisica'); setDocumento(''); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${tipoPessoa === 'fisica' ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-muted-foreground hover:bg-muted'}`}>
                    {tipoPessoa === 'fisica' ? <CheckCircle2 size={16} /> : <Circle size={16} />} Pessoa Física
                </button>
                <button type="button" onClick={() => { setTipoPessoa('juridica'); setDocumento(''); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${tipoPessoa === 'juridica' ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-muted-foreground hover:bg-muted'}`}>
                    {tipoPessoa === 'juridica' ? <CheckCircle2 size={16} /> : <Circle size={16} />} Pessoa Jurídica
                </button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="nome_completo">Nome Completo / Razão Social</Label><Input id="nome_completo" name="nome_completo" required /></div>
              <div className="space-y-2"><Label htmlFor="cpf_cnpj">CPF / CNPJ</Label><Input id="cpf_cnpj" name="cpf_cnpj" value={documento} onChange={handleDocumentoChange} maxLength={18} /></div>
            </div>
          </div>

          {/* CONTATO */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 border-b border-border pb-2 mb-4"><Contact className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-foreground">Contato</h2></div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" /></div>
              
              {/* INPUT TELEFONE */}
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input 
                    id="telefone" 
                    name="telefone" 
                    value={telefone} 
                    onChange={handleTelefoneChange} 
                    maxLength={15} 
                    placeholder="(00) 00000-0000" 
                />
              </div>
            
            </div>
          </div>

          {/* ENDEREÇO */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 border-b border-border pb-2 mb-4"><MapPin className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-foreground">Endereço</h2></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
                <div className="space-y-2"><Label htmlFor="cep">CEP</Label><Input id="cep" name="cep" value={cep} onChange={handleCepChange} maxLength={9} /></div>
                <div className="space-y-2"><Label htmlFor="logradouro">Rua / Logradouro</Label><Input id="logradouro" name="logradouro" /></div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[120px_1fr_1fr]">
                 <div className="space-y-2"><Label htmlFor="numero">Número</Label><Input id="numero" name="numero" /></div>
                <div className="space-y-2"><Label htmlFor="complemento">Complemento</Label><Input id="complemento" name="complemento" /></div>
                <div className="space-y-2"><Label htmlFor="bairro">Bairro</Label><Input id="bairro" name="bairro" /></div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[100px_1fr]">
                <div className="space-y-2"><Label htmlFor="uf">UF</Label><Select id="uf" name="uf" value={selectedUf} onChange={(e) => setSelectedUf(e.target.value)}><option value="" disabled>--</option>{ufs.map((uf) => (<option key={uf.id} value={uf.sigla}>{uf.sigla}</option>))}</Select></div>
                <div className="space-y-2"><Label htmlFor="cidade">Cidade</Label><Select id="cidade" name="cidade" value={selectedCidade} onChange={(e) => setSelectedCidade(e.target.value)} disabled={!selectedUf || loadingCidades} className={!selectedUf ? "opacity-50 cursor-not-allowed" : ""}><option value="" disabled>Selecione...</option>{cidades.map((cidade) => (<option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>))}</Select></div>
            </div>
          </div>

          {/* AÇÕES */}
          <div className="flex flex-col-reverse justify-end gap-4 pt-4 md:flex-row">
            <Link href="/clientes">
                <Button 
                    type="button" 
                    className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border-transparent transition-all font-medium"
                >
                    Cancelar
                </Button>
            </Link>
            
            <Button type="submit" disabled={isSaving} className="min-w-[150px]">
                {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />} 
                Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}