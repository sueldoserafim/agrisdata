import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Leaf, Sprout } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TransplantioList() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [transplantios, setTransplantios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (empresa) loadTransplantios()
  }, [empresa])

  const loadTransplantios = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('transplantios')
      .select(`
        *,
        lotes_mudas (nome_lote, culturas(nome)),
        safras (nome_safra, codigo_safra),
        talhoes (nome)
      `)
      .eq('empresa_id', empresa!.id)
      .is('deleted_at', null)
      .order('data_transplantio', { ascending: false })

    if (error) {
      toast({ title: 'Erro ao carregar', description: error.message, variant: 'destructive' })
    } else {
      setTransplantios(data || [])
    }
    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transplantios</h1>
          <p className="text-muted-foreground mt-1">
            Histórico de transferências de mudas para o campo
          </p>
        </div>
        <Button onClick={() => navigate('/app/transplantios/novo')}>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Transplantio
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimos Transplantios Realizados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Carregando...</div>
          ) : transplantios.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Nenhum transplantio registrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Lote Origem</TableHead>
                  <TableHead>Destino (Safra / Talhão)</TableHead>
                  <TableHead className="text-right">Qtd. Plantada</TableHead>
                  <TableHead className="text-right">Qtd. Replantio</TableHead>
                  <TableHead className="text-right">Custo Transferido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transplantios.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      {new Date(t.data_transplantio).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{t.lotes_mudas?.nome_lote}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.lotes_mudas?.culturas?.nome}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {t.safras?.nome_safra || t.safras?.codigo_safra}
                      </div>
                      <div className="text-xs text-muted-foreground">{t.talhoes?.nome}</div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-600">
                      {t.quantidade_transplantada}
                    </TableCell>
                    <TableCell className="text-right">{t.quantidade_replantio || 0}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(t.custo_transferido || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
