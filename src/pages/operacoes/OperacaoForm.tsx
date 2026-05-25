import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InsumosTable } from './components/InsumosTable'

const schema = z
  .object({
    tipo_operacao: z.enum([
      'preparo_solo',
      'plantio',
      'adubação',
      'aplicação_defensivo',
      'irrigação',
      'colheita',
      'outro',
    ]),
    safra_id: z.string().min(1, 'Safra é obrigatória'),
    data_inicio: z.string().min(1, 'Data planejada é obrigatória'),
    data_conclusao: z.string().optional().nullable(),
    responsavel_id: z.string().min(1, 'Responsável é obrigatório'),
    equipamento_id: z.string().optional().nullable(),
    receituario_id: z.string().optional().nullable(),
    ponto_captacao: z.string().optional().nullable(),
    consumo_agua_m3: z.coerce.number().optional().nullable(),
    clima_observacoes: z.string().optional().nullable(),
    observacoes: z.string().optional().nullable(),
    status: z.string().optional(),
    fotos: z
      .array(z.object({ url: z.string(), latitude: z.number(), longitude: z.number() }))
      .optional(),
    insumos: z
      .array(
        z.object({
          produto_id: z.string().min(1),
          lote_id: z.string().optional().nullable(),
          quantidade_utilizada: z.coerce.number().min(0.01),
          area_aplicada_ha: z.coerce.number().optional().nullable(),
          unidade: z.string().optional(),
          custo_unit: z.number().optional(),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'concluída') {
      if (!data.data_conclusao)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Obrigatória para concluir',
          path: ['data_conclusao'],
        })
      if (!data.fotos?.length)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Ao menos 1 foto é necessária',
          path: ['fotos'],
        })
    }
  })

export default function OperacaoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const [loading, setLoading] = useState(false)

  const [safras, setSafras] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [equipamentos, setEquipamentos] = useState<any[]>([])
  const [receituarios, setReceituarios] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [lotes, setLotes] = useState<any[]>([])

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { fotos: [], insumos: [], status: 'pendente' },
  })

  const watchTipo = form.watch('tipo_operacao')
  const watchSafra = form.watch('safra_id')
  const watchFotos = form.watch('fotos') || []

  const selectedSafra = safras.find((s) => s.id === watchSafra)

  useEffect(() => {
    if (empresa) loadData()
  }, [empresa])

  const loadData = async () => {
    const [safRes, usuRes, eqRes, recRes, prodRes, loteRes] = await Promise.all([
      supabase.from('safras').select('id, nome_safra, talhoes(nome)').eq('empresa_id', empresa?.id),
      supabase.from('usuarios').select('id, nome').eq('empresa_id', empresa?.id),
      supabase.from('equipamentos').select('id, nome').eq('empresa_id', empresa?.id),
      supabase
        .from('receituarios_agronomicos')
        .select('id, nome')
        .eq('empresa_id', empresa?.id)
        .eq('valido', true),
      supabase
        .from('produtos')
        .select('id, nome, unidade_medida, preco_unitario')
        .eq('empresa_id', empresa?.id),
      supabase
        .from('lotes_estoque')
        .select('id, numero_lote, quantidade, produto_id')
        .eq('empresa_id', empresa?.id)
        .gt('quantidade', 0),
    ])
    setSafras(safRes.data || [])
    setUsuarios(usuRes.data || [])
    setEquipamentos(eqRes.data || [])
    setReceituarios(recRes.data || [])
    setProdutos(prodRes.data || [])
    setLotes(loteRes.data || [])

    if (id) {
      const { data: op } = await supabase.from('operacoes_campo').select('*').eq('id', id).single()
      if (op) {
        const { data: ins } = await supabase
          .from('operacao_insumos')
          .select('*')
          .eq('operacao_id', id)
        const fotosParsed = op.foto_geolocalizada_url ? JSON.parse(op.foto_geolocalizada_url) : []
        form.reset({
          ...op,
          fotos: fotosParsed,
          insumos: ins?.map((i) => {
            const p = prodRes.data?.find((x) => x.id === i.produto_id)
            return { ...i, unidade: p?.unidade_medida, custo_unit: p?.preco_unitario }
          }),
        })
      }
    }
  }

  const handleAddPhoto = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const url = `https://img.usecurling.com/p/400/300?q=farm&color=green&seed=${Math.random()}`
          form.setValue(
            'fotos',
            [
              ...watchFotos,
              { url, latitude: pos.coords.latitude, longitude: pos.coords.longitude },
            ],
            { shouldValidate: true },
          )
        },
        () => toast.error('Erro ao obter localização'),
      )
    } else toast.error('Geolocalização não suportada')
  }

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setLoading(true)
      const opStatus = values.status || 'pendente'
      const isConcluding = opStatus === 'concluída'
      const initialStatus = isConcluding ? (id ? undefined : 'em_execução') : opStatus

      const payload = {
        empresa_id: empresa?.id,
        safra_id: values.safra_id,
        tipo_operacao: values.tipo_operacao,
        data_inicio: values.data_inicio,
        data_conclusao: values.data_conclusao || null,
        responsavel_id: values.responsavel_id,
        equipamento_id: values.equipamento_id || null,
        receituario_id: values.receituario_id || null,
        ponto_captacao: values.ponto_captacao || null,
        consumo_agua_m3: values.consumo_agua_m3 || null,
        clima_observacoes: values.clima_observacoes || null,
        observacoes: values.observacoes || null,
        foto_geolocalizada_url: values.fotos?.length ? JSON.stringify(values.fotos) : null,
        latitude: values.fotos?.length ? values.fotos[0].latitude : null,
        longitude: values.fotos?.length ? values.fotos[0].longitude : null,
      }

      let opId = id
      if (id) {
        await supabase
          .from('operacoes_campo')
          .update(initialStatus ? { ...payload, status: initialStatus } : payload)
          .eq('id', id)
      } else {
        const { data, error } = await supabase
          .from('operacoes_campo')
          .insert({ ...payload, status: initialStatus })
          .select()
          .single()
        if (error) throw error
        opId = data.id
      }

      await supabase.from('operacao_insumos').delete().eq('operacao_id', opId)
      if (values.insumos?.length) {
        await supabase.from('operacao_insumos').insert(
          values.insumos.map((i) => ({
            empresa_id: empresa?.id,
            operacao_id: opId,
            produto_id: i.produto_id,
            lote_id: i.lote_id || null,
            quantidade_utilizada: i.quantidade_utilizada,
            area_aplicada_ha: i.area_aplicada_ha || null,
          })),
        )
      }

      if (isConcluding)
        await supabase.from('operacoes_campo').update({ status: 'concluída' }).eq('id', opId)

      toast.success('OS salva com sucesso!')
      navigate('/app/operacoes')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = (st: string) => {
    form.setValue('status', st)
    form.handleSubmit(onSubmit)()
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{id ? 'Editar OS' : 'Nova Ordem de Serviço'}</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate('/app/operacoes')}>
            Cancelar
          </Button>
          <Button disabled={loading} onClick={() => handleSave('em_execução')}>
            Salvar Progresso
          </Button>
          <Button
            disabled={loading}
            onClick={() => handleSave('concluída')}
            className="bg-green-600 hover:bg-green-700"
          >
            Concluir OS
          </Button>
        </div>
      </div>

      <FormProvider {...form}>
        <form className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo_operacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Operação</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          'preparo_solo',
                          'plantio',
                          'adubação',
                          'aplicação_defensivo',
                          'irrigação',
                          'colheita',
                          'outro',
                        ].map((t) => (
                          <SelectItem key={t} value={t} className="capitalize">
                            {t.replace('_', ' ')}
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
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {safras.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.nome_safra}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Talhão</FormLabel>
                <Input readOnly value={selectedSafra?.talhoes?.nome || ''} className="bg-muted" />
              </FormItem>
              <FormField
                control={form.control}
                name="responsavel_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {usuarios.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.nome}
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
                name="data_inicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Planejada</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data_conclusao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Real de Execução (Obrigatório p/ Concluir)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="equipamento_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Nenhum" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {equipamentos.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchTipo === 'aplicação_defensivo' && (
                <FormField
                  control={form.control}
                  name="receituario_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receituário Agronômico</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {receituarios.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {watchTipo === 'irrigação' && (
                <>
                  <FormField
                    control={form.control}
                    name="ponto_captacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ponto de Captação</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="consumo_agua_m3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consumo de Água (m³)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <InsumosTable produtos={produtos} lotesEstoque={lotes} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className={form.formState.errors.fotos ? 'text-red-500' : ''}>
                Evidências (Fotos Geolocalizadas)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {watchFotos.map((f, i) => (
                  <div key={i} className="relative aspect-video rounded-md overflow-hidden border">
                    <img src={f.url} className="object-cover w-full h-full" alt="Evidência" />
                    <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] p-1 truncate">
                      {f.latitude.toFixed(4)}, {f.longitude.toFixed(4)}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() =>
                        form.setValue(
                          'fotos',
                          watchFotos.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="aspect-video h-full flex flex-col items-center justify-center text-muted-foreground"
                  onClick={handleAddPhoto}
                >
                  <Camera className="w-6 h-6 mb-2" />
                  <span>Capturar Evidência</span>
                </Button>
              </div>
              {form.formState.errors.fotos && (
                <p className="text-red-500 text-sm mt-2">{form.formState.errors.fotos.message}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="clima_observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condições Climáticas</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="Ex: Ensolarado, 28°C"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações Gerais</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </div>
  )
}
