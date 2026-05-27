import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export default function AccountSalesList() {
  const { empresa } = useEmpresa()
  const [sales, setSales] = useState<any[]>([])

  useEffect(() => {
    if (empresa) loadSales()
  }, [empresa])

  const loadSales = async () => {
    const { data } = await supabase
      .from('account_sales' as any)
      .select('*, invoices_exportacao(numero_invoice), containers(numero_container)')
      .eq('empresa_id', empresa?.id)
      .is('deleted_at', null)
      .order('data_venda', { ascending: false })
    if (data) setSales(data)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este registro?')) return
    const { error } = await supabase
      .from('account_sales' as any)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) toast.error('Erro ao excluir')
    else {
      toast.success('Registro excluído')
      loadSales()
    }
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(val || 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Sales</h1>
          <p className="text-muted-foreground">Apuração de resultados das exportações.</p>
        </div>
        <Button asChild>
          <Link to="/app/financeiro/account-sales/novo">
            <Plus className="w-4 h-4 mr-2" /> Nova Apuração
          </Link>
        </Button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 font-medium">Data</th>
              <th className="p-3 font-medium">Invoice</th>
              <th className="p-3 font-medium">Container</th>
              <th className="p-3 font-medium text-right">Valor Bruto</th>
              <th className="p-3 font-medium text-right">Valor Líquido</th>
              <th className="p-3 font-medium text-center">Status</th>
              <th className="p-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sales.map((s) => (
              <tr key={s.id} className="hover:bg-muted/50">
                <td className="p-3">
                  {s.data_venda ? format(new Date(s.data_venda), 'dd/MM/yyyy') : '-'}
                </td>
                <td className="p-3 font-medium">{s.invoices_exportacao?.numero_invoice || '-'}</td>
                <td className="p-3">{s.containers?.numero_container || '-'}</td>
                <td className="p-3 text-right">{formatCurrency(s.valor_bruto)}</td>
                <td className="p-3 text-right font-medium text-green-600">
                  {formatCurrency(s.valor_liquido)}
                </td>
                <td className="p-3 text-center">
                  <Badge
                    variant={s.status === 'liquidado' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {s.status}
                  </Badge>
                </td>
                <td className="p-3 text-right space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/app/financeiro/account-sales/${s.id}`}>
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => handleDelete(s.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  Nenhum registro encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
