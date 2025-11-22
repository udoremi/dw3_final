'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { DollarSign, ShoppingBag, Users, TrendingUp, Loader2 } from 'lucide-react';
import api from '../../../../services/api';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        // Tenta buscar os dados
        const response = await api.get('/getDashboardMetrics');
        setData(response.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadMetrics();
  }, []);

  // Formatação de Dinheiro
  const formatMoney = (val: any) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val));

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard de Vendas
        </h1>
        <p className="text-muted-foreground">
          Visão geral do desempenho comercial e métricas chave.
        </p>
      </div>
    
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Receita Total"
          value={formatMoney(data?.receitaTotal || 0)}
          icon={DollarSign}
        />
        <StatCard 
          title="Pedidos Realizados"
          value={String(data?.totalPedidos || 0)}
          icon={ShoppingBag}
        />
        <StatCard 
          title="Clientes Ativos"
          value={String(data?.totalClientes || 0)}
          icon={Users}
        />
        <StatCard 
          title="Ticket Médio"
          value={formatMoney(data?.ticketMedio || 0)}
          icon={TrendingUp}
        />
      </div>

    </div>
  );
}