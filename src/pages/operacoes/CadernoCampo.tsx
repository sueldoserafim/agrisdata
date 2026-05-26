import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Printer, BookOpen, AlertCircle } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function CadernoCampo() {
  const { empresa } = useEmpresa()
  const [registros, setRegistros] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (empresa?.id) loadDados()
  }, [empresa?.id])

  const loadDados = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('operacoes_campo')
      .select(`
        id, data_conclusao, tipo_operacao, observacoes, status,
        safras(nome_safra, talhoes(nome)),
        usuarios!operacoes_campo_responsavel_id_fkey(nome),
        operacao_insumos(quantidade_utilizada, produtos(nome, unidade_medida, carencia_dias))
      `)
      .eq('empresa_id', empresa?.id)
      .eq('status', 'concluída')
      .order('data_conclusao', { ascending: false })

    setRegistros(data || [])
    setLoading(false)
  }

  const printDocument = () => {
    window.print()
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 bg-white print:p-0 print:m-0 print:w-full print:max-w-none">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" /> Caderno de Campo Digital
          </h1>
          <p className="text-muted-foreground">Registro oficial auditável (Padrão GLOBALG.A.P.)</p>
        </div>
        <Button onClick={printDocument}>
          <Printer className="mr-2 h-4 w-4" /> Exportar PDF
        </Button>
      </div>

      {/* Header específico para impressão */}
      <div className="hidden print:block mb-8 border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold text-center mb-2">
          CADERNO DE CAMPO - REGISTRO DE APLICAÇÕES E OPERAÇÕES
        </h1>
        <div className="flex justify-between text-sm">
          <span>
            <strong>Empresa:</strong> {empresa?.nome}
          </span>
          <span>
            <strong>Data de Emissão:</strong> {format(new Date(), 'dd/MM/yyyy HH:mm')}
          </span>
        </div>
      </div>

      <Card className="print:border-none print:shadow-none">
        <CardContent className="p-0 sm:p-6 print:p-0">
          <Table>
            <TableHeader>
              <TableRow className="print:border-b-2 print:border-black">
                <TableHead>Data</TableHead>
                <TableHead>Safra / Talhão</TableHead>
                <TableHead>Operação</TableHead>
                <TableHead>Produtos e Doses</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Carência Restante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registros.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              )}
              {registros.map((r) => {
                const insumos = r.operacao_insumos || []

                // Calcular maior carência
                let maxCarenciaDias = 0
                let alertaCarencia = false
                insumos.forEach((i: any) => {
                  const diasRestantes =
                    i.produtos?.carencia_dias -
                    differenceInDays(new Date(), new Date(r.data_conclusao))
                  if (diasRestantes > maxCarenciaDias) maxCarenciaDias = diasRestantes
                })
                alertaCarencia = maxCarenciaDias > 0

                return (
                  <TableRow key={r.id} className="print:border-b print:border-gray-300">
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(r.data_conclusao), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{r.safras?.nome_safra}</div>
                      <div className="text-xs text-muted-foreground">{r.safras?.talhoes?.nome}</div>
                    </TableCell>
                    <TableCell>
                      <div className="capitalize">{r.tipo_operacao}</div>
                      {r.observacoes && (
                        <div className="text-xs text-muted-foreground italic mt-1 max-w-[200px] truncate">
                          {r.observacoes}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {insumos.length > 0 ? (
                        <ul className="text-sm list-disc pl-4 space-y-1">
                          {insumos.map((i: any, idx: number) => (
                            <li key={idx}>
                              {i.produtos?.nome}: {i.quantidade_utilizada}{' '}
                              {i.produtos?.unidade_medida}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-xs text-muted-foreground">Sem insumos</span>
                      )}
                    </TableCell>
                    <TableCell>{r.usuarios?.nome}</TableCell>
                    <TableCell>
                      {insumos.length > 0 ? (
                        alertaCarencia ? (
                          <span className="flex items-center text-amber-600 font-semibold text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" /> {maxCarenciaDias} dias
                          </span>
                        ) : (
                          <span className="text-green-600 font-medium text-sm">Liberado</span>
                        )
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="hidden print:block mt-16 text-sm text-center">
        <div className="w-64 mx-auto border-t border-black mb-2"></div>
        <p>Assinatura do Responsável Técnico</p>
      </div>
    </div>
  )
}
