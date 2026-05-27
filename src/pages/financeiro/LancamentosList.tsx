import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function LancamentosList() {
  const { empresa } = useEmpresa()
  const [lancamentos, setLancamentos] = useState<any[]>([])
  const [filterTipo, setFilterTipo] = useState<string>('todos')
  const [filterStatus, setFilterStatus] = useState<string>('todos')
  const [filterConta, setFilterConta] = useState<string>('todas')
  const [contas, setContas] = useState<any[]>([])

  useEffect(() => {
    if (empresa) {
      loadLancamentos()
      loadContas()
    }
  }, [empresa, filterTipo, filterStatus, filterConta])

  const loadContas = async () => {
    const { data } = await supabase
      .from('contas_bancarias' as any)
      .select('id, nome_banco')
      .eq('empresa_id', empresa?.id)
    if (data) setContas(data)
  }

  const loadLancamentos = async () => {
    let q = supabase
      .from('financeiro_lancamentos')
      .select('*, contas_bancarias(nome_banco, moeda), plano_contas(descricao)')
      .eq('empresa_id', empresa?.id)
      .is('deleted_at', null)
      .order('data_vencimento', { ascending: true })

    if (filterTipo !== 'todos') {
      q = q.eq('tipo', filterTipo)
    }
    if (filterStatus !== 'todos') {
      q = q.eq('status', filterStatus)
    }
    if (filterConta !== 'todas') {
      q = q.eq('conta_bancaria_id', filterConta)
    }

    const { data } = await q
    if (data) setLancamentos(data)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este lançamento?')) return
    const { error } = await supabase
      .from('financeiro_lancamentos')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) toast.error('Erro ao excluir')
    else {
      toast.success('Lançamento excluído')
      loadLancamentos()
    }
  }

  const markAsPaid = async (id: string) => {
    const { error } = await supabase
      .from('financeiro_lancamentos')
      .update({ status: 'pago', data_pagamento: new Date().toISOString().split('T')[0] })
      .eq('id', id)
    if (error) toast.error('Erro ao baixar lançamento')
    else {
      toast.success('Baixado com sucesso')
      loadLancamentos()
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lançamentos Financeiros</h1>
          <p className="text-muted-foreground">Contas a Pagar e a Receber.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Select value={filterTipo} onValueChange={setFilterTipo}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Tipos</SelectItem>
              <SelectItem value="receita">Receitas</SelectItem>
              <SelectItem value="despesa">Despesas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="recebido">Recebido</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterConta} onValueChange={setFilterConta}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Conta Bancária" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas Contas</SelectItem>
              {contas.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nome_banco}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button asChild>
            <Link to="/app/financeiro/lancamentos/novo">
              <Plus className="w-4 h-4 mr-2" /> Novo
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 font-medium">Vencimento</th>
              <th className="p-3 font-medium">Descrição</th>
              <th className="p-3 font-medium">Tipo</th>
              <th className="p-3 font-medium">Categoria</th>
              <th className="p-3 font-medium">Conta/Moeda</th>
              <th className="p-3 font-medium text-right">Valor</th>
              <th className="p-3 font-medium text-center">Status</th>
              <th className="p-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {lancamentos.map((l) => (
              <tr
                key={l.id}
                className={`hover:bg-muted/50 ${l.status === 'atrasado' ? 'bg-red-500/10' : ''}`}
              >
                <td className="p-3">
                  {l.data_vencimento ? format(new Date(l.data_vencimento), 'dd/MM/yyyy') : '-'}
                </td>
                <td className="p-3 font-medium">{l.descricao}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${l.tipo === 'receita' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {l.tipo}
                  </span>
                </td>
                <td className="p-3">{l.plano_contas?.descricao || '-'}</td>
                <td className="p-3">
                  {l.contas_bancarias?.nome_banco || '-'} (
                  {l.contas_bancarias?.moeda?.toUpperCase() || ''})
                </td>
                <td className="p-3 text-right font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: l.contas_bancarias?.moeda?.toUpperCase() || 'BRL',
                  }).format(l.valor)}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs capitalize
                    ${l.status === 'pago' || l.status === 'recebido' ? 'bg-blue-100 text-blue-700' : ''}
                    ${l.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${l.status === 'atrasado' ? 'bg-red-100 text-red-700 font-bold' : ''}
                  `}
                  >
                    {l.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  {l.status !== 'pago' && l.status !== 'recebido' && (
                    <Button variant="outline" size="sm" onClick={() => markAsPaid(l.id)}>
                      Baixar
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/app/financeiro/lancamentos/${l.id}`}>
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => handleDelete(l.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {lancamentos.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-muted-foreground">
                  Nenhum lançamento encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
