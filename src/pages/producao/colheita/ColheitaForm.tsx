import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, X, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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

const formSchema = z.object({
  safra_id: z.string().min(1, 'Safra é obrigatória'),
  data_colheita: z.string().min(1, 'Data é obrigatória'),
  responsavel_id: z.string().min(1, 'Responsável é obrigatório'),
  producao_bruta_ton: z.coerce.number().positive('Deve ser maior que 0'),
  perdas_ton: z.coerce.number().min(0, 'Não pode ser negativo'),
  producao_liquida_ton: z.number(),
  area_colhida_ha: z.coerce.number().positive('Deve ser maior que 0'),
  numero_caixas: z.coerce.number().optional().nullable(),
  brix_medio: z.coerce.number().min(0).max(30).optional().nullable(),
  temperatura_colheita: z.coerce.number().optional().nullable(),
  observacoes: z.string().optional().nullable(),
  lote_producao: z.string().min(1, 'Lote é obrigatório'),
  operadores: z.array(z.string()).default([]),
  equipamento_id: z.string().optional().nullable(),
  destino_producao: z.string().min(1, 'Destino é obrigatório'),
  fotos: z.array(z.string()).min(1, 'Mínimo de 1 foto é necessária'),
})

type ColheitaFormValues = z.infer<typeof formSchema>

export default function ColheitaForm() {
  const { empresa } = useEmpresa()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [safras, setSafras] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [equipamentos, setEquipamentos] = useState<any[]>([])

  const form = useForm<ColheitaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data_colheita: new Date().toISOString().split('T')[0],
      producao_bruta_ton: 0,
      perdas_ton: 0,
      producao_liquida_ton: 0,
      area_colhida_ha: 0,
      numero_caixas: null,
      brix_medio: null,
      temperatura_colheita: null,
      observacoes: '',
      lote_producao: '',
      operadores: [],
      equipamento_id: null,
      fotos: [],
    },
  })

  useEffect(() => {
    if (empresa?.id) {
      loadData()
    }
  }, [empresa?.id])

  const loadData = async () => {
    const [safrasRes, usersRes, funcRes, equipRes] = await Promise.all([
      supabase
        .from('safras')
        .select(`id, nome_safra, codigo_safra, talhao_id, talhoes(id, nome)`)
        .eq('empresa_id', empresa?.id)
        .neq('status', 'encerrada')
        .is('deleted_at', null),
      supabase.from('usuarios').select('id, nome').eq('empresa_id', empresa?.id).eq('ativo', true),
      supabase
        .from('funcionarios')
        .select('id, nome')
        .eq('empresa_id', empresa?.id)
        .is('deleted_at', null),
      supabase
        .from('equipamentos')
        .select('id, nome')
        .eq('empresa_id', empresa?.id)
        .is('deleted_at', null),
    ])

    if (safrasRes.data) setSafras(safrasRes.data)
    if (usersRes.data) setUsuarios(usersRes.data)
    if (funcRes.data) setFuncionarios(funcRes.data)
    if (equipRes.data) setEquipamentos(equipRes.data)
  }

  // Automations: Auto-calculate Net Production
  const producao_bruta = form.watch('producao_bruta_ton') || 0
  const perdas = form.watch('perdas_ton') || 0

  useEffect(() => {
    const net = Number((producao_bruta - perdas).toFixed(2))
    form.setValue('producao_liquida_ton', net >= 0 ? net : 0)
  }, [producao_bruta, perdas])

  // Automations: Auto-generate Lote
  const safra_id = form.watch('safra_id')
  const data_colheita = form.watch('data_colheita')

  useEffect(() => {
    if (safra_id && data_colheita) {
      const safra = safras.find((s) => s.id === safra_id)
      const code = safra?.codigo_safra || safra?.nome_safra?.substring(0, 3).toUpperCase() || 'XXX'
      const dateStr = data_colheita.replace(/-/g, '')
      const random = Math.random().toString(36).substring(2, 8).toUpperCase()
      form.setValue('lote_producao', `LOTE-${code}-${dateStr}-${random}`)
    }
  }, [safra_id, data_colheita, safras])

  const selectedSafra = safras.find((s) => s.id === safra_id)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setUploading(true)
    const uploadedUrls = []

    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${empresa?.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('evidencias')
        .upload(filePath, file)

      if (uploadError) {
        toast.error(`Erro ao fazer upload de ${file.name}: ${uploadError.message}`)
        continue
      }

      const { data: publicUrlData } = supabase.storage.from('evidencias').getPublicUrl(filePath)
      uploadedUrls.push(publicUrlData.publicUrl)
    }

    const currentFotos = form.getValues('fotos') || []
    form.setValue('fotos', [...currentFotos, ...uploadedUrls], { shouldValidate: true })
    setUploading(false)
  }

  const onSubmit = async (values: ColheitaFormValues) => {
    if (!empresa?.id) return
    setLoading(true)

    try {
      // 1. Insert colheita_registros
      const { data: colheita, error: colheitaError } = await supabase
        .from('colheita_registros')
        .insert({
          empresa_id: empresa.id,
          safra_id: values.safra_id,
          data_colheita: values.data_colheita,
          responsavel_id: values.responsavel_id,
          producao_bruta_ton: values.producao_bruta_ton,
          perdas_ton: values.perdas_ton,
          producao_liquida_ton: values.producao_liquida_ton,
          area_colhida_ha: values.area_colhida_ha,
          numero_caixas: values.numero_caixas,
          brix_medio: values.brix_medio,
          temperatura_colheita: values.temperatura_colheita,
          observacoes: values.observacoes,
          lote_producao: values.lote_producao,
          operadores: values.operadores,
          equipamento_id: values.equipamento_id,
          destino_producao: values.destino_producao,
          fotos: values.fotos,
        })
        .select()
        .single()

      if (colheitaError) throw new Error(`Erro ao registrar colheita: ${colheitaError.message}`)

      // 2. Automations: Mass Balance
      const kgColhidos = values.producao_liquida_ton * 1000
      const { data: balanco } = await supabase
        .from('balanco_massas')
        .select('*')
        .eq('safra_id', values.safra_id)
        .maybeSingle()

      if (balanco) {
        await supabase
          .from('balanco_massas')
          .update({ quantidade_colhida_kg: (balanco.quantidade_colhida_kg || 0) + kgColhidos })
          .eq('id', balanco.id)
      } else {
        await supabase.from('balanco_massas').insert({
          empresa_id: empresa.id,
          safra_id: values.safra_id,
          quantidade_colhida_kg: kgColhidos,
        })
      }

      // 3. Automations: Packing Reception
      if (values.destino_producao === 'packing_house') {
        const { error: packingError } = await supabase.from('packing_recepcoes').insert({
          empresa_id: empresa.id,
          colheita_id: colheita.id,
          safra_id: values.safra_id,
          quantidade_ton: values.producao_liquida_ton,
          status: 'pendente',
        })
        if (packingError) console.error('Erro ao gerar recepção:', packingError)
      }

      // 4. Automations: Safra Status
      await supabase.from('safras').update({ status: 'em_colheita' }).eq('id', values.safra_id)

      // 5. Automations: Productivity History
      const prod_kg_ha = kgColhidos / values.area_colhida_ha
      const ano = new Date(values.data_colheita).getFullYear()
      const safraInfo = safras.find((s) => s.id === values.safra_id)

      if (safraInfo?.talhao_id) {
        const { data: hist } = await supabase
          .from('historico_produtividade_talhao')
          .select('*')
          .eq('talhao_id', safraInfo.talhao_id)
          .eq('ano', ano)
          .maybeSingle()

        if (hist) {
          await supabase
            .from('historico_produtividade_talhao')
            .update({ produtividade_kg_ha: prod_kg_ha })
            .eq('id', hist.id)
        } else {
          await supabase.from('historico_produtividade_talhao').insert({
            empresa_id: empresa.id,
            talhao_id: safraInfo.talhao_id,
            ano: ano,
            produtividade_kg_ha: prod_kg_ha,
          })
        }
      }

      toast.success('Colheita registrada com sucesso!')
      navigate('/app/producao')
    } catch (error: any) {
      toast.error(error.message || 'Ocorreu um erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Registro de Colheita</h1>
        <p className="text-muted-foreground">
          Registre os dados de colheita e garanta a rastreabilidade da produção.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Volume e Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="safra_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Safra</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

              <div className="space-y-2">
                <Label>Talhão</Label>
                <Input disabled value={selectedSafra?.talhoes?.nome || 'Selecione uma safra'} />
              </div>

              <FormField
                control={form.control}
                name="data_colheita"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Colheita</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsavel_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o responsável" />
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
                name="producao_bruta_ton"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produção Bruta (ton)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="perdas_ton"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perdas (ton)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="producao_liquida_ton"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produção Líquida (ton) - Auto</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        type="number"
                        {...field}
                        className="bg-muted font-bold text-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area_colhida_ha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Colhida (ha)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numero_caixas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nº de Caixas (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Qualidade</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="brix_medio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brix Médio (0 - 30)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="temperatura_colheita"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperatura na Colheita (°C)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Observações de Qualidade</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalhes sobre pragas, maturação, etc."
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rastreabilidade</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="lote_producao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lote de Produção</FormLabel>
                    <FormControl>
                      <Input disabled {...field} className="bg-muted" />
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
                    <FormLabel>Equipamento Utilizado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione (Opcional)" />
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

              <div className="md:col-span-2 space-y-4">
                <Label>Operadores de Colheita</Label>
                <div className="flex gap-2 items-center">
                  <Select
                    onValueChange={(val) => {
                      const current = form.getValues('operadores')
                      if (!current.includes(val)) form.setValue('operadores', [...current, val])
                    }}
                  >
                    <SelectTrigger className="max-w-[300px]">
                      <SelectValue placeholder="Adicionar Operador" />
                    </SelectTrigger>
                    <SelectContent>
                      {funcionarios.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.watch('operadores').map((opId) => {
                    const f = funcionarios.find((func) => func.id === opId)
                    return (
                      <Badge key={opId} variant="secondary" className="px-3 py-1">
                        {f?.nome || opId}
                        <X
                          className="ml-2 w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() =>
                            form.setValue(
                              'operadores',
                              form.getValues('operadores').filter((id) => id !== opId),
                            )
                          }
                        />
                      </Badge>
                    )
                  })}
                  {form.watch('operadores').length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      Nenhum operador selecionado.
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Destino e Evidências</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="destino_producao"
                render={({ field }) => (
                  <FormItem className="md:w-1/2">
                    <FormLabel>Destino da Produção</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o destino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="packing_house">Packing House (Recepção)</SelectItem>
                        <SelectItem value="processamento">Indústria / Processamento</SelectItem>
                        <SelectItem value="venda_direta">Venda Direta</SelectItem>
                        <SelectItem value="doação">Doação</SelectItem>
                        <SelectItem value="descarte">Descarte</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="fotos"
                render={() => (
                  <FormItem>
                    <FormLabel>Fotos e Evidências</FormLabel>
                    <FormControl>
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <Button
                            variant="outline"
                            type="button"
                            disabled={uploading}
                            className="relative"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? 'Enviando...' : 'Fazer Upload'}
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={handleFileUpload}
                              disabled={uploading}
                            />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          {form.watch('fotos').map((url, i) => (
                            <div key={i} className="relative group">
                              <img
                                src={url}
                                alt={`Evidência ${i + 1}`}
                                className="w-24 h-24 rounded-lg object-cover border"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const current = form.getValues('fotos')
                                  form.setValue(
                                    'fotos',
                                    current.filter((u) => u !== url),
                                    { shouldValidate: true },
                                  )
                                }}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirmar Registro de Colheita
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
