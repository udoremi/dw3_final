import { StatCard } from '@/components/ui/StatCard';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Cabeçalho da Página */}
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
          value="R$ 45.231,89"
          icon={DollarSign}
        />
        <StatCard 
          title="Pedidos Realizados"
          value="128"
          icon={ShoppingBag}
        />
        <StatCard 
          title="Clientes Ativos"
          value="1.203"
          icon={Users}
        />
        <StatCard 
          title="Ticket Médio"
          value="R$ 353,00"
          icon={TrendingUp}
        />
      </div>

      {/* Área de Gráficos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        <div className="w-full rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-xl font-bold text-foreground">Status dos Pedidos</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Pendentes vs Concluídos vs Cancelados.
          </p>
          
          <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border bg-background/50">
            <span className="text-muted-foreground">Gráfico de Rosca (Donut Chart)</span>
          </div>
        </div>

        <div className="w-full rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-xl font-bold text-foreground">Faturamento (Últimos 7 dias)</h3>
          <p className="text-sm text-muted-foreground mb-4">Comparativo diário de receita.</p>
          
          <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border bg-background/50">
             <span className="text-muted-foreground">Gráfico de Barras (Bar Chart)</span>
          </div>
        </div>
      </div>
    </div>
  );
}