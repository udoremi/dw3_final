'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, User, MapPin, Contact, Trash2, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import api from '../../../../../../services/api';

interface IBGEUF { id: number; sigla: string; nome: string; }
interface IBGEMunicipio { id: number; nome: string; }

export default function EditarClientePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  // Estados
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [tipoPessoa, setTipoPessoa] = useState<'fisica' | 'juridica'>('fisica');
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [ativo, setAtivo] = useState('true');
  const [dataCadastro, setDataCadastro] = useState('');

  // Endereço
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  
  const [ufs, setUfs] = useState<IBGEUF[]>([]);
  const [cidades, setCidades] = useState<IBGEMunicipio[]>([]);
  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');
  const [loadingCidades, setLoadingCidades] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const resUfs = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        const dataUfs = await resUfs.json();
        setUfs(dataUfs);

        const response = await api.post('/getClienteByID', { id_cliente: id });
        
        if (response.data.status === "ok" && response.data.registro.length > 0) {
            const clienteDB = response.data.registro[0];

            setNome(clienteDB.nome_completo);
            setTipoPessoa(clienteDB.cpf_cnpj.length > 14 ? 'juridica' : 'fisica');
            setDocumento(clienteDB.cpf_cnpj);
            setEmail(clienteDB.email);
            setTelefone(clienteDB.telefone);
            setAtivo(clienteDB.ativo ? 'true' : 'false');
            setDataCadastro(clienteDB.data_cadastro);

            // Endereço
            setCep(clienteDB.cep);
            setLogradouro(clienteDB.logradouro);
            setNumero(clienteDB.numero);
            setComplemento(clienteDB.complemento);
            setBairro(clienteDB.bairro);
            setSelectedUf(clienteDB.uf);
            setSelectedCidade(clienteDB.cidade);
        } else {
            alert("Cliente não encontrado");
            router.push('/clientes');
        }

      } catch (error) {
        console.error("Erro ao carregar", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) init();
  }, [id, router]);

  // CIDADES
  useEffect(() => {
    if (!selectedUf) { setCidades([]); return; }
    const loadCidades = async () => {
      setLoadingCidades(true);
      try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`);
        const data = await res.json();
        setCidades(data);
      } catch (err) { console.error(err); } finally { setLoadingCidades(false); }
    };
    loadCidades();
  }, [selectedUf]);

  // Máscaras
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

  // UPDATE
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    const payload = {
        id_cliente: id,
        nome_completo: nome,
        email: email,
        cpf_cnpj: documento,
        telefone: telefone,
        logradouro: logradouro,
        numero: numero,
        complemento: complemento,
        bairro: bairro,
        cidade: selectedCidade,
        uf: selectedUf,
        cep: cep,
        data_cadastro: dataCadastro,
        ativo: ativo === 'true'
    };

    try {
        const response = await api.post('/updateClientes', payload);
        if(response.data.status === "ok") {
            alert("Cliente Atualizado!");
            router.push('/clientes');
        } else {
            alert("Erro ao atualizar: " + response.data.status);
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    } finally {
        setIsSaving(false);
    }
  }

  // DELETAR DA TELA DE EDIÇÃO
  const handleDelete = async () => {
    if(!confirm("Tem certeza que deseja apagar?")) return;
    try {
        const response = await api.post('/deleteClientes', { id_cliente: id });
        if(response.data.status === "ok") {
            router.push('/clientes');
        } else {
            alert("Erro ao excluir.");
        }
    } catch(e) { alert("Erro ao excluir"); }
  };

  if (isLoading) {
    return <div className="flex h-[50vh] justify-center items-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Editar Cliente
          </h1>
          <p className="text-muted-foreground">
            Atualizar dados do cliente #{id}.
          </p>
        </div>
        
        <Link href="/clientes" className="w-full md:w-auto">
          <Button type="button" className="w-full md:w-auto bg-card border border-input text-foreground hover:bg-muted">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      {/* Formulário */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Campos do Formulário */}
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
              <div className="space-y-2"><Label htmlFor="nome">{tipoPessoa === 'fisica' ? 'Nome Completo' : 'Razão Social'}</Label><Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="documento">{tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'}</Label><Input id="documento" value={documento} onChange={handleDocumentoChange} maxLength={18} /></div>
            </div>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-2 border-b border-border pb-2 mb-4"><Contact className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-foreground">Contato & Status</h2></div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="telefone">Telefone</Label><Input id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="ativo">Status</Label><Select id="ativo" value={ativo} onChange={(e) => setAtivo(e.target.value)}><option value="true">Ativo</option><option value="false">Inativo</option></Select></div>
            </div>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-2 border-b border-border pb-2 mb-4"><MapPin className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold text-foreground">Endereço</h2></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
                <div className="space-y-2"><Label htmlFor="cep">CEP</Label><Input id="cep" value={cep} onChange={handleCepChange} maxLength={9} /></div>
                <div className="space-y-2"><Label htmlFor="logradouro">Rua / Logradouro</Label><Input id="logradouro" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[120px_1fr_1fr]">
                 <div className="space-y-2"><Label htmlFor="numero">Número</Label><Input id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="complemento">Complemento</Label><Input id="complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="bairro">Bairro</Label><Input id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[100px_1fr]">
                <div className="space-y-2"><Label htmlFor="uf">UF</Label><Select id="uf" value={selectedUf} onChange={(e) => { setSelectedUf(e.target.value); setSelectedCidade(''); }}><option value="" disabled>--</option>{ufs.map((uf) => (<option key={uf.id} value={uf.sigla}>{uf.sigla}</option>))}</Select></div>
                <div className="space-y-2"><Label htmlFor="cidade">Cidade</Label><Select id="cidade" value={selectedCidade} onChange={(e) => setSelectedCidade(e.target.value)} disabled={!selectedUf || loadingCidades} className={!selectedUf ? "opacity-50 cursor-not-allowed" : ""}><option value="" disabled>{loadingCidades ? "Carregando..." : (selectedUf ? "Selecione a cidade" : "Selecione um estado")}</option>{cidades.map((cidade) => (<option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>))}</Select></div>
            </div>
          </div>

          <div className="flex flex-col-reverse items-center justify-between gap-4 pt-6 border-t border-border mt-8 md:flex-row">
                
             <Button 
                type="button" 
                className="w-full md:w-auto bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border-transparent transition-all font-medium"
                onClick={() => confirm("Tem certeza que deseja apagar este cliente permanentemente?") && console.log("Excluindo...")}
            >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Cliente
            </Button>

            <div className="flex flex-col-reverse w-full gap-4 md:w-auto md:flex-row md:items-center">
                {/* Cancelar */}
                <Link href="/clientes" className="w-full md:w-auto">
                    <Button 
                        type="button" 
                        className="w-full md:w-auto bg-background border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                    >
                        Cancelar
                    </Button>
                </Link>
                
                {/* Salvar */}
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full md:min-w-[180px] font-semibold shadow-sm"
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
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}