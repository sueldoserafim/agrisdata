import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, Info, Save, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { TalhaoInstructionsSheet } from './components/talhao-instructions-sheet'

const formSchema = z
  .object({
    fazenda_id: z.string().min(1, 'Fazenda obrigatória'),
    nome: z.string().min(1, 'Nome obrigatório'),
    codigo_talhao: z.string().optional(),
    status_atual: z.string().default('disponível'),
    area_ha: z.coerce.number().min(0, 'Deve ser um número positivo').optional(),
    area_plantavel_ha: z.coerce.number().min(0, 'Deve ser um número positivo').optional(),
    tipo_solo: z.string().optional(),
    declividade: z.coerce.number().min(0).optional(),
    altitude: z.coerce.number().min(0).optional(),
    tem_irrigacao: z.boolean().default(false),
    tipo_irrigacao: z.string().optional(),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
    numero_globalgap: z.string().optional(),
    referencia_car: z.string().optional(),
    observacoes: z.string().optional(),
  })
  .refine(
    (data) => {
      const area = data.area_ha || 0
      const plantavel = data.area_plantavel_ha || 0
      return !(plantavel > area && area > 0)
    },
    { message: 'Área plantável não pode exceder a área total', path: ['area_plantavel_ha'] },
  )
  .refine((data) => !(data.tem_irrigacao && !data.tipo_irrigacao), {
    message: 'Informe o tipo de irrigação utilizado',
    path: ['tipo_irrigacao'],
  })

export default function TalhaoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { empresa } = useEmpresa()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [fazendas, setFazendas] = useState<{ id: string; nome: string }[]>([])
  const [activeSafras, setActiveSafras] = useState<any[]>([])
  const [currentSafraLinked, setCurrentSafraLinked] = useState<any | null>(null)
  const [selectedSafraToLink, setSelectedSafraToLink] = useState<string>('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      codigo_talhao: '',
      status_atual: 'disponível',
      tipo_solo: '',
      tipo_irrigacao: '',
      numero_globalgap: '',
      referencia_car: '',
      observacoes: '',
      tem_irrigacao: false,
    },
  })

  useEffect(() => {
    async function loadData() {
      if (!empresa?.id) return

      const { data: fazs } = await supabase
        .from('fazendas')
        .select('id, nome')
        .eq('empresa_id', empresa.id)
        .is('deleted_at', null)
        .order('nome')
      if (fazs) setFazendas(fazs)

      if (id) {
        const { data: t } = await supabase.from('talhoes').select('*').eq('id', id).single()

        // Load linked active safra if any
        const { data: st } = await supabase
          .from('safra_talhoes')
          .select('id, safras(id, nome_safra, status)')
          .eq('talhao_id', id)
          .neq('safras.status', 'Finalizada')
          .maybeSingle()

        if (st && st.safras) {
          setCurrentSafraLinked(st.safras)
        }

        // Load all active safras from this farm
        if (t?.fazenda_id) {
          const { data: safrasAtivas } = await supabase
            .from('safras')
            .select('id, nome_safra, status')
            .eq('fazenda_id', t.fazenda_id)
            .neq('status', 'Finalizada')

          if (safrasAtivas) setActiveSafras(safrasAtivas)
        }

        if (t) {
          form.reset({
            ...t,
            area_ha: t.area_ha ?? undefined,
            area_plantavel_ha: t.area_plantavel_ha ?? undefined,
            declividade: t.declividade ?? undefined,
            altitude: t.altitude ?? undefined,
            latitude: t.latitude ?? undefined,
            longitude: t.longitude ?? undefined,
            codigo_talhao: t.codigo_talhao || '',
            tipo_solo: t.tipo_solo || '',
            tipo_irrigacao: t.tipo_irrigacao || '',
            numero_globalgap: t.numero_globalgap || '',
            referencia_car: t.referencia_car || '',
            observacoes: t.observacoes || '',
            status_atual: t.status_atual || 'disponível',
          })
        }
      }
      setIsLoading(false)
    }
    loadData()
  }, [id, empresa?.id, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!empresa?.id) return
    setIsSaving(true)
    try {
      const payload = { ...values, empresa_id: empresa.id }
      if (id) {
        const { error } = await supabase.from('talhoes').update(payload).eq('id', id)
        if (error) throw error
        toast({ title: 'Sucesso', description: 'Talhão atualizado com sucesso.' })
      } else {
        const { error } = await supabase.from('talhoes').insert([payload])
        if (error) throw error
        toast({ title: 'Sucesso', description: 'Talhão criado com sucesso.' })
      }
      navigate('/app/talhoes')
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro', description: err.message })
    } finally {
      setIsSaving(false)
    }
  }

  const renderInput = (
    name: any,
    label: string,
    type = 'text',
    tooltip?: string,
    step?: string,
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            {label}
            {tooltip && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger type="button">
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              step={step ?? (type === 'number' ? 'any' : undefined)}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => {
                const val =
                  type === 'number'
                    ? e.target.value === ''
                      ? undefined
                      : e.target.value
                    : e.target.value
                field.onChange(val)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  if (isLoading)
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    )

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app/talhoes')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {id ? 'Editar Talhão' : 'Novo Talhão'}
          </h1>
        </div>
        <TalhaoInstructionsSheet />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fazenda_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fazenda</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a fazenda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fazendas.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderInput('nome', 'Nome do Talhão')}
            {renderInput(
              'codigo_talhao',
              'Código do Talhão',
              'text',
              'Identificador único dentro da fazenda',
            )}

            <FormField
              control={form.control}
              name="status_atual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Atual</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="disponível">Disponível</SelectItem>
                      <SelectItem value="em_uso">Em Uso</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderInput('area_ha', 'Área Total (ha)', 'number')}
            {renderInput(
              'area_plantavel_ha',
              'Área Plantável (ha)',
              'number',
              'Não pode exceder a área total',
            )}

            <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {renderInput('latitude', 'Latitude', 'number', 'Formato decimal: -90 a 90')}
              {renderInput('longitude', 'Longitude', 'number', 'Formato decimal: -180 a 180')}
              {renderInput('altitude', 'Altitude (m)', 'number')}
            </div>

            <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {renderInput(
                'numero_globalgap',
                'GLOBALG.A.P.',
                'text',
                'Número de certificação GLOBALG.A.P.',
              )}
              {renderInput(
                'referencia_car',
                'Referência CAR',
                'text',
                'Número do Cadastro Ambiental Rural',
              )}
            </div>

            <FormField
              control={form.control}
              name="tem_irrigacao"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Tem Irrigação?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('tem_irrigacao') && (
              <FormField
                control={form.control}
                name="tipo_irrigacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Irrigação</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de irrigação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Gotejamento">Gotejamento</SelectItem>
                        <SelectItem value="Aspersão">Aspersão</SelectItem>
                        <SelectItem value="Inundação">Inundação</SelectItem>
                        <SelectItem value="Pivô">Pivô</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="observacoes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-[100px] resize-y"
                    placeholder="Anotações adicionais sobre o talhão..."
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/app/talhoes')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar Talhão
            </Button>
          </div>
        </form>
      </Form>

      {id && (
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-xl font-bold mb-4">Vincular a uma Safra Ativa</h2>
          {currentSafraLinked ? (
            <div className="p-4 bg-muted rounded-md flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Vinculado à Safra:</p>
                <p className="text-primary">
                  {currentSafraLinked.nome_safra} ({currentSafraLinked.status})
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const { error } = await supabase
                    .from('safra_talhoes')
                    .delete()
                    .eq('talhao_id', id)
                    .eq('safra_id', currentSafraLinked.id)
                  if (error) toast({ title: 'Erro ao desvincular', variant: 'destructive' })
                  else {
                    toast({ title: 'Desvinculado com sucesso' })
                    setCurrentSafraLinked(null)
                  }
                }}
              >
                Desvincular
              </Button>
            </div>
          ) : (
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <FormLabel>Safras Ativas na Fazenda</FormLabel>
                <Select value={selectedSafraToLink} onValueChange={setSelectedSafraToLink}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma safra ativa..." />
                  </SelectTrigger>
                  <SelectContent>
                    {activeSafras.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nome_safra} ({s.status})
                      </SelectItem>
                    ))}
                    {activeSafras.length === 0 && (
                      <SelectItem value="none" disabled>
                        Nenhuma safra ativa encontrada nesta fazenda.
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button
                disabled={!selectedSafraToLink || selectedSafraToLink === 'none'}
                onClick={async () => {
                  if (!empresa?.id) return
                  const { error } = await supabase.from('safra_talhoes').insert({
                    empresa_id: empresa.id,
                    talhao_id: id,
                    safra_id: selectedSafraToLink,
                  })
                  if (error) toast({ title: 'Erro ao vincular', variant: 'destructive' })
                  else {
                    toast({ title: 'Vinculado com sucesso' })
                    const s = activeSafras.find((x) => x.id === selectedSafraToLink)
                    setCurrentSafraLinked(s)
                  }
                }}
              >
                Vincular
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
