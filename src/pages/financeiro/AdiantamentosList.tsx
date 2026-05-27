import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Plus, Globe } from 'lucide-react'
import { format } from 'date-fns'

export default function AdiantamentosList() {
  const { empresa } = useEmpresa()
  const [adiantamentos, setAdiantamentos] = useState<any[]>([])

  useEffect(() => {
    if (empresa) loadAdiantamentos()
  }, [empresa])

  const loadAdiantamentos = async () => {
    const { data } = await supabase
      .from('adiantamentos_internacionais' as any)
      .select('*, clientes(nome), invoices_exportacao(numero_invoice)')
      .eq('empresa_id', empresa?.id)
      .is('deleted_at', null)
      .order('data_adiantamento', { ascending: false })
    if (data) setAdiantamentos(data)
  }

  const formatCurrency = (val: number, cur: string) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: cur }).format(val || 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Adiantamentos Internacionais</h1>
          <p className="text-muted-foreground">Controle de recebimentos antecipados (USD/EUR).</p>
        </div>
        <Button asChild>
          <Link to="/app/financeiro/adiantamentos/novo">
            <Plus className="w-4 h-4 mr-2" /> Novo Adiantamento
          </Link>
        </Button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 font-medium">Data</th>
              <th className="p-3 font-medium">Nº Ref.</th>
              <th className="p-3 font-medium">Cliente</th>
              <th className="p-3 font-medium text-right">Valor Estrangeiro</th>
              <th className="p-3 font-medium text-right">Taxa Câmbio</th>
              <th className="p-3 font-medium text-right">Valor Convertido (BRL)</th>
              <th className="p-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {adiantamentos.map((a) => (
              <tr key={a.id} className="hover:bg-muted/50">
                <td className="p-3">
                  {a.data_adiantamento ? format(new Date(a.data_adiantamento), 'dd/MM/yyyy') : '-'}
                </td>
                <td className="p-3 font-medium">{a.numero_adiantamento}</td>
                <td className="p-3">{a.clientes?.nome || '-'}</td>
                <td className="p-3 text-right font-medium text-blue-600">
                  {formatCurrency(a.valor_usd, 'USD')}
                </td>
                <td className="p-3 text-right">R$ {Number(a.taxa_cambio).toFixed(4)}</td>
                <td className="p-3 text-right font-medium text-green-600">
                  {formatCurrency(a.valor_brl, 'BRL')}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs capitalize ${a.status === 'reembolsado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                  >
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
            {adiantamentos.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" /> Nenhum adiantamento
                  registrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
