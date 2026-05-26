import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save, Leaf } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const formSchema = z.object({
  lote_muda_id: z.string().uuid('Selecione o lote origem'),
  safra_id: z.string().uuid('Selecione a safra destino'),
  talhao_id: z.string().uuid('Selecione o talhão destino'),
  data_transplantio: z.string().min(1, 'Data obrigatória'),
  quantidade_transplantada: z.coerce.number().min(1, 'Mínimo de 1 muda'),
  quantidade_replantio: z.coerce.number().min(0).default(0),
  area_plantada_ha: z.coerce.number().min(0.01).optional(),
})

export default function TransplantioWizard() {
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [lotes, setLotes] = useState<any[]>([])
  const [safras, setSafras] = useState<any[]>([])
  const [talhoes, setTalhoes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedLote, setSelectedLote] = useState<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data_transplantio: new Date().toISOString().split('T')[0],
      quantidade_transplantada: 0,
      quantidade_replantio: 0,
    },
  })

  const watchLote = form.watch('lote_muda_id')

  useEffect(() => {
    if (empresa) loadDependencies()
  }, [empresa])

  useEffect(() => {
    if (watchLote && lotes.length > 0) {
      const lote = lotes.find((l) => l.id === watchLote)
      setSelectedLote(lote)
      if (lote && form.getValues('quantidade_transplantada') === 0) {
        form.setValue('quantidade_transplantada', lote.quantidade_viva)
      }
    } else {
      setSelectedLote(null)
    }
  }, [watchLote, lotes])

  const loadDependencies = async () => {
    const [resLotes, resSafras, resTalhoes] = await Promise.all([
      supabase
        .from('lotes_mudas')
        .select('*, culturas(nome)')
        .eq('empresa_id', empresa!.id)
        .eq('status', 'pronto')
        .is('deleted_at', null),
      supabase
        .from('safras')
        .select('id, nome_safra, codigo_safra')
        .eq('empresa_id', empresa!.id)
        .in('status', ['planejada', 'em_andamento'])
        .is('deleted_at', null),
      supabase
        .from('talhoes')
        .select('id, nome')
        .eq('empresa_id', empresa!.id)
        .is('deleted_at', null),
    ])

    if (resLotes.data) setLotes(resLotes.data)
    if (resSafras.data) setSafras(resSafras.data)
    if (resTalhoes.data) setTalhoes(resTalhoes.data)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedLote) return
    const totalMudadasUsadas = values.quantidade_transplantada + values.quantidade_replantio
    if (totalMudadasUsadas > selectedLote.quantidade_viva) {
      toast({
        title: 'Quantidade Excedida',
        description: 'A soma de transplantio e replantio é maior que o saldo vivo do lote.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    const { data: userData } = await supabase.auth.getUser()

    // 1. Criar registro de transplantio (trigger will handle cost calculation)
    const { error: tError } = await supabase.from('transplantios').insert({
      empresa_id: empresa!.id,
      ...values,
      data_transplantio: new Date(values.data_transplantio).toISOString(),
      responsavel_id: userData?.user?.id || null,
      confirmado: true,
    })

    if (tError) {
      toast({
        title: 'Erro ao registrar transplantio',
        description: tError.message,
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    // 2. Atualizar o saldo do lote (deduzindo a quantidade usada)
    // Se usou tudo, muda o status para transplantado
    const novoSaldo = selectedLote.quantidade_viva - totalMudadasUsadas
    const newStatus = novoSaldo <= 0 ? 'transplantado' : selectedLote.status

    await supabase
      .from('lotes_mudas')
      .update({
        quantidade_viva: novoSaldo,
        status: newStatus,
      })
      .eq('id', selectedLote.id)

    toast({
      title: 'Transplantio Concluído',
      description: 'O lote foi transferido para o campo com sucesso.',
    })
    navigate('/app/transplantios')
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/app/transplantios">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Registro de Transplantio</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Lote de Origem</CardTitle>
              <CardDescription>
                Apenas lotes com status "Pronto p/ Campo" são listados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="lote_muda_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lote de Mudas</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o lote..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lotes.map((l) => (
                          <SelectItem key={l.id} value={l.id}>
                            {l.nome_lote} - {l.culturas?.nome} (Saldo: {l.quantidade_viva})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedLote && (
                <div className="bg-muted p-4 rounded-md text-sm grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-semibold">Cultura:</span> {selectedLote.culturas?.nome}
                  </div>
                  <div>
                    <span className="font-semibold">Semeado em:</span>{' '}
                    {selectedLote.data_semeadura
                      ? new Date(selectedLote.data_semeadura).toLocaleDateString('pt-BR')
                      : '-'}
                  </div>
                  <div>
                    <span className="font-semibold">Mudas Disponíveis:</span>{' '}
                    {selectedLote.quantidade_viva}
                  </div>
                  <div>
                    <span className="font-semibold">Custo/Muda:</span> R${' '}
                    {selectedLote.custo_por_muda}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Destino (Campo)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="safra_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Safra Destino</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {safras.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.nome_safra || s.codigo_safra}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="talhao_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Talhão Destino</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {talhoes.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Dados Operacionais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_transplantio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Operação</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area_plantada_ha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Plantada (ha)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantidade_transplantada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mudas Plantadas</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Quantidade de mudas transferidas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantidade_replantio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mudas p/ Replantio</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Mudas usadas para cobrir falhas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={loading || !selectedLote}>
              {loading ? (
                'Processando...'
              ) : (
                <>
                  <Leaf className="w-4 h-4 mr-2" />
                  Confirmar Transplantio
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
