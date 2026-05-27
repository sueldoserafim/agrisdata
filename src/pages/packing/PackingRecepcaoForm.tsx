import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpTooltip } from '@/components/HelpTooltip'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z
  .object({
    lote_producao_id: z.string().min(1, 'Lote é obrigatório'),
    safra_id: z.string().min(1, 'Safra é obrigatória'),
    data_recepcao: z.string().min(1, 'Data e hora são obrigatórios'),
    peso_bruto_kg: z.coerce.number().min(0.1, 'Peso bruto inválido'),
    tara_kg: z.coerce.number().min(0, 'Tara não pode ser negativa'),
    quantidade_caixas: z.coerce.number().min(1, 'Mínimo de 1 caixa'),
    temperatura_recepcao: z.coerce.number().optional(),
    conformidade_visual: z.enum(['aprovado', 'reprovado', 'parcial']),
    motivo_reprovacao: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.conformidade_visual !== 'aprovado' &&
        (!data.motivo_reprovacao || data.motivo_reprovacao.trim() === '')
      ) {
        return false
      }
      return true
    },
    {
      message: 'Motivo é obrigatório quando a conformidade não for "Aprovado"',
      path: ['motivo_reprovacao'],
    },
  )

type FormData = z.infer<typeof formSchema>

export default function PackingRecepcaoForm() {
  const { id } = useParams()
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [colheitas, setColheitas] = useState<any[]>([])
  const [safras, setSafras] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data_recepcao: new Date().toISOString().slice(0, 16),
      peso_bruto_kg: 0,
      tara_kg: 0,
      quantidade_caixas: 1,
      conformidade_visual: 'aprovado',
      motivo_reprovacao: '',
    },
  })

  const watchPesoBruto = form.watch('peso_bruto_kg')
  const watchTara = form.watch('tara_kg')
  const watchConformidade = form.watch('conformidade_visual')
  const pesoLiquido = (watchPesoBruto || 0) - (watchTara || 0)

  useEffect(() => {
    if (empresa?.id) {
      loadDependencies()
      if (id) loadData()
    }
  }, [empresa?.id, id])

  const loadDependencies = async () => {
    const { data: sData } = await supabase
      .from('safras')
      .select('id, nome_safra, codigo_safra')
      .eq('empresa_id', empresa?.id)
      .in('status', ['em_colheita', 'encerrada', 'planejada', 'em_plantio'])
    if (sData) setSafras(sData)

    const { data: cData } = await supabase
      .from('colheita_registros')
      .select('id, lote_producao, safra_id, data_colheita')
      .eq('empresa_id', empresa?.id)
      .order('data_colheita', { ascending: false })
      .limit(50)
    if (cData) setColheitas(cData)
  }

  const loadData = async () => {
    const { data, error } = await supabase
      .from('packing_recepcoes')
      .select('*')
      .eq('id', id)
      .single()
    if (data) {
      form.reset({
        lote_producao_id: data.lote_producao_id || '',
        safra_id: data.safra_id || '',
        data_recepcao: data.data_recepcao
          ? new Date(data.data_recepcao).toISOString().slice(0, 16)
          : '',
        peso_bruto_kg: data.peso_bruto_kg || 0,
        tara_kg: data.tara_kg || 0,
        quantidade_caixas: data.quantidade_caixas || 1,
        temperatura_recepcao: data.temperatura_recepcao || undefined,
        conformidade_visual: (data.conformidade_visual as any) || 'aprovado',
        motivo_reprovacao: data.motivo_reprovacao || '',
      })
    } else if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const onSubmit = async (values: FormData) => {
    if (!empresa?.id) return
    setLoading(true)

    const payload = {
      empresa_id: empresa.id,
      lote_producao_id: values.lote_producao_id,
      safra_id: values.safra_id,
      data_recepcao: new Date(values.data_recepcao).toISOString(),
      peso_bruto_kg: values.peso_bruto_kg,
      tara_kg: values.tara_kg,
      peso_liquido_kg: pesoLiquido > 0 ? pesoLiquido : 0,
      quantidade_caixas: values.quantidade_caixas,
      temperatura_recepcao: values.temperatura_recepcao,
      conformidade_visual: values.conformidade_visual,
      motivo_reprovacao: values.motivo_reprovacao || null,
      quantidade_ton: (pesoLiquido > 0 ? pesoLiquido : 0) / 1000, // For retro-compatibility if still needed
    }

    let error
    if (id) {
      const res = await supabase.from('packing_recepcoes').update(payload).eq('id', id)
      error = res.error
    } else {
      const { data: user } = await supabase.auth.getUser()
      const res = await supabase
        .from('packing_recepcoes')
        .insert({ ...payload, responsavel_id: user?.user?.id, status: 'em_recebimento' })
      error = res.error
    }

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Recepção salva com sucesso.' })
      navigate('/app/packing/recepcao')
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/packing/recepcao')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {id ? 'Editar Recepção' : 'Nova Recepção'}
          </h1>
          <p className="text-muted-foreground">Registre a entrada de produção no Packing House</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="shadow-subtle border-none">
            <CardHeader>
              <CardTitle>Dados de Origem e Data</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="lote_producao_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Lote de Produção (Campo)
                      <HelpTooltip text="Seleciona o registro de colheita no campo para garantir a rastreabilidade total desde o plantio." />
                    </FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val)
                        const colheita = colheitas.find((c) => c.id === val)
                        if (colheita) form.setValue('safra_id', colheita.safra_id)
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o lote colhido" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colheitas.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.lote_producao || 'Sem Lote'} -{' '}
                            {new Date(c.data_colheita).toLocaleDateString()}
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
                name="safra_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Safra</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a safra" />
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
                name="data_recepcao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data e Hora da Recepção</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-subtle border-none">
            <CardHeader>
              <CardTitle>Pesagem e Embalagem</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="peso_bruto_kg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Peso Bruto (kg)
                      <HelpTooltip text="Peso total aferido na balança, incluindo as caixas plásticas ou pallets." />
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tara_kg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tara (kg)
                      <HelpTooltip text="Peso descontado das caixas e recipientes plásticos para obter o peso líquido real do produto agro." />
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Peso Líquido Calculado</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    readOnly
                    value={`${pesoLiquido > 0 ? pesoLiquido.toFixed(2) : 0} kg`}
                    className="bg-muted font-bold text-primary"
                  />
                </FormControl>
              </FormItem>

              <FormField
                control={form.control}
                name="quantidade_caixas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade de Caixas/Bins</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="temperatura_recepcao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Temperatura (°C){' '}
                      <span className="text-muted-foreground font-normal text-xs">(Opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-subtle border-none">
            <CardHeader>
              <CardTitle>Inspeção de Qualidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="conformidade_visual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Conformidade Visual
                      <HelpTooltip text="Aprovado: Lote atende os requisitos de qualidade. Parcial: Lote com defeitos aceitáveis, requer seleção manual. Reprovado: Lote com excesso de podridão ou pragas (descarte)." />
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="parcial">Parcial (Com ressalvas)</SelectItem>
                        <SelectItem value="reprovado">Reprovado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchConformidade !== 'aprovado' && (
                <FormField
                  control={form.control}
                  name="motivo_reprovacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo da Ressalva/Reprovação</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva os defeitos, pragas, danos físicos ou doenças encontradas no lote recebido..."
                          className="resize-y"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} size="lg">
              <Save className="w-4 h-4 mr-2" />
              Salvar Recepção
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
