import { useDashboard } from '@/hooks/use-dashboard'
import { KPIRow } from '@/components/dashboard/KPIRow'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { AlertsShortcuts } from '@/components/dashboard/AlertsShortcuts'
import { Loader2 } from 'lucide-react'
import { HelpButton } from '@/components/HelpButton'

export default function Index() {
  const { data, loading, modulos } = useDashboard()

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-start md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Agrícola</h1>
          <p className="text-muted-foreground mt-1">Visão geral e indicadores da sua operação.</p>
        </div>
        <HelpButton
          title="Ajuda: Dashboard Agrícola"
          content={
            <div className="space-y-4">
              <p>
                Este painel consolida os principais indicadores de performance (KPIs) da sua
                operação.
              </p>
              <div>
                <h4 className="font-semibold text-foreground">Indicadores Disponíveis:</h4>
                <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                  <li>
                    <strong>Safras Ativas:</strong> Total de safras em andamento na fazenda.
                  </li>
                  <li>
                    <strong>Talhões em Produção:</strong> Áreas com safras não encerradas.
                  </li>
                  <li>
                    <strong>OS Pendentes:</strong> Ordens de serviço ainda não concluídas pelas
                    equipes.
                  </li>
                </ul>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Dica: Utilize os atalhos no final da página para acessar as tarefas pendentes
                rapidamente.
              </p>
            </div>
          }
        />
      </div>

      <div className="space-y-8 mt-6">
        <KPIRow
          title="Produção Agrícola"
          items={[
            { label: 'Safras Ativas', value: data?.kpis?.safrasAtivas },
            { label: 'Talhões em Produção', value: data?.kpis?.talhoesAtivos },
            { label: 'Área Plantada (ha)', value: data?.kpis?.areaPlantada?.toFixed(2) },
            { label: 'OS Pendentes', value: data?.kpis?.osPendentes },
          ]}
        />

        {modulos.includes('packing') && (
          <KPIRow
            title="Packing & Armazenagem"
            items={[
              { label: 'Pallets em Câmara Fria', value: data?.kpis?.palletsEmCamaraFria },
              { label: 'Carregamentos Hoje', value: data?.kpis?.carregamentosHoje },
              { label: 'Conformidade', value: `${data?.kpis?.conformidadeMedia?.toFixed(1)}%` },
            ]}
          />
        )}

        {modulos.includes('exportacao') && (
          <KPIRow
            title="Exportação"
            items={[
              { label: 'Containers Embarcados', value: data?.kpis?.containersEmbarcados },
              { label: 'Containers em Trânsito', value: data?.kpis?.containersEmTransito },
              { label: 'Cut-offs Próximos', value: data?.kpis?.cutoffsProximos },
            ]}
          />
        )}

        {modulos.includes('financeiro') && (
          <KPIRow
            title="Financeiro"
            items={[
              {
                label: 'Contas a Receber (R$)',
                value: data?.kpis?.contasAReceber?.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }),
              },
              {
                label: 'Contas a Pagar (R$)',
                value: data?.kpis?.contasAPagar?.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }),
              },
              {
                label: 'Saldo Projetado (R$)',
                value: data?.kpis?.saldoProjetado?.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }),
              },
            ]}
          />
        )}
      </div>

      <DashboardCharts charts={data?.charts} />

      <AlertsShortcuts
        osPendentes={data?.kpis?.osPendentes}
        cutoffsProximos={data?.kpis?.cutoffsProximos}
      />
    </div>
  )
}
