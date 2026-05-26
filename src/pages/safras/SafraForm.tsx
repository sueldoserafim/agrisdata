import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import { Upload, X, MapPin, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  nome_safra: z.string().min(1, 'Nome é obrigatório'),
  fazenda_id: z.string().min(1, 'Fazenda é obrigatória'),
  cultura_id: z.string().min(1, 'Cultura é obrigatória'),
  cultivar_id: z.string().min(1, 'Cultivar é obrigatório'),
  ano_safra: z.coerce.number().min(2000, 'Ano inválido'),
  data_plantio: z.string().min(1, 'Data de início é obrigatória'),
  data_colheita_prevista: z.string().min(1, 'Data de fim é obrigatória'),
  status: z.enum(['Planejada', 'Em Andamento', 'Finalizada']),
})

export default function SafraForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [dataSources, setSources] = useState({
    fazendas: [] as any[],
    culturas: [] as any[],
    cultivares: [] as any[],
  })

  const [talhoes, setTalhoes] = useState<any[]>([])
  const [selectedTalhoes, setSelectedTalhoes] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isEncerrada, setIsEncerrada] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'Planejada',
      ano_safra: new Date().getFullYear(),
    },
  })

  const wFazendaId = watch('fazenda_id')
  const wCulturaId = watch('cultura_id')
  const wAno = watch('ano_safra')
  const wNome = watch('nome_safra')

  useEffect(() => {
    if (!empresa?.id) return
    Promise.all([
      supabase
        .from('fazendas')
        .select('id, nome')
        .eq('empresa_id', empresa.id)
        .is('deleted_at', null),
      supabase
        .from('culturas')
        .select('id, nome')
        .eq('empresa_id', empresa.id)
        .is('deleted_at', null),
      supabase
        .from('cultivares')
        .select('id, nome, cultura_id')
        .eq('empresa_id', empresa.id)
        .is('deleted_at', null),
    ]).then(([fz, c, cv]) =>
      setSources({ fazendas: fz.data || [], culturas: c.data || [], cultivares: cv.data || [] }),
    )
  }, [empresa?.id])

  useEffect(() => {
    async function loadTalhoes() {
      if (!wFazendaId) {
        setTalhoes([])
        return
      }

      const { data: allT } = await supabase
        .from('talhoes')
        .select('id, nome, area_ha, status_atual')
        .eq('fazenda_id', wFazendaId)
        .is('deleted_at', null)
      if (!allT) return

      const { data: activeLinks } = await supabase
        .from('safra_talhoes')
        .select('talhao_id, safras!inner(status, id)')
        .in(
          'talhao_id',
          allT.map((t) => t.id),
        )
        .neq('safras.status', 'Finalizada')

      const processedTalhoes = allT.map((t) => {
        const link = activeLinks?.find((l) => l.talhao_id === t.id && l.safras.id !== id)
        return {
          ...t,
          isLocked: !!link,
        }
      })

      setTalhoes(processedTalhoes)
    }
    loadTalhoes()
  }, [wFazendaId, id])

  useEffect(() => {
    if (!id || !empresa?.id) return

    async function loadSafra() {
      const { data } = await supabase
        .from('safras')
        .select('*, cultivares(cultura_id)')
        .eq('id', id)
        .single()
      if (data) {
        const culturaId = (data.cultivares as any)?.cultura_id
        if (culturaId) setValue('cultura_id', culturaId)
        setValue('fazenda_id', data.fazenda_id)
        setValue('cultivar_id', data.cultivar_id)
        setValue('nome_safra', data.nome_safra || '')
        setValue('ano_safra', data.ano_safra || new Date().getFullYear())
        setValue('data_plantio', data.data_plantio || '')
        setValue('data_colheita_prevista', data.data_colheita_prevista || '')
        setValue('status', data.status as any)

        if (data.imagem_url) {
          setImagePreview(data.imagem_url)
        }

        if (data.status === 'encerrada') {
          setIsEncerrada(true)
        }

        const { data: st } = await supabase
          .from('safra_talhoes')
          .select('talhao_id')
          .eq('safra_id', id)
        if (st) {
          setSelectedTalhoes(st.map((x) => x.talhao_id))
        }
      }
    }
    loadSafra()
  }, [id, empresa?.id, setValue])

  useEffect(() => {
    if (!id && !wNome && wAno) {
      setValue('nome_safra', `Safra ${wAno}`)
    }
  }, [wAno, wNome, id, setValue])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const toggleTalhao = (talhaoId: string, isLocked: boolean) => {
    if (isLocked) return
    setSelectedTalhoes((prev) =>
      prev.includes(talhaoId) ? prev.filter((x) => x !== talhaoId) : [...prev, talhaoId],
    )
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${empresa?.id}/${Date.now()}.${fileExt}`
    const { error } = await supabase.storage.from('safra-images').upload(fileName, imageFile)
    if (error) {
      toast({
        title: 'Erro no upload da imagem',
        description: error.message,
        variant: 'destructive',
      })
      return null
    }
    const { data } = supabase.storage.from('safra-images').getPublicUrl(fileName)
    return data.publicUrl
  }

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!empresa?.id) return
    if (new Date(data.data_colheita_prevista) <= new Date(data.data_plantio)) {
      toast({
        title: 'Erro de Data',
        description: 'A data de fim deve ser posterior à data de início',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    const { data: existing } = await supabase
      .from('safras')
      .select('id')
      .eq('empresa_id', empresa.id)
      .eq('fazenda_id', data.fazenda_id)
      .eq('cultivar_id', data.cultivar_id)
      .eq('ano_safra', data.ano_safra)
      .neq('id', id || '00000000-0000-0000-0000-000000000000')
      .maybeSingle()

    if (existing) {
      setLoading(false)
      toast({
        title: 'Duplicação',
        description: 'Já existe uma safra para esta fazenda, cultivar e ano.',
        variant: 'destructive',
      })
      return
    }

    try {
      let finalImageUrl = imagePreview
      if (imageFile) {
        const url = await uploadImage()
        if (url) finalImageUrl = url
      }

      const payload = {
        empresa_id: empresa.id,
        fazenda_id: data.fazenda_id,
        cultivar_id: data.cultivar_id,
        nome_safra: data.nome_safra,
        ano_safra: data.ano_safra,
        data_plantio: data.data_plantio,
        data_colheita_prevista: data.data_colheita_prevista,
        status: data.status,
        imagem_url: finalImageUrl || null,
      }

      let safraId = id
      if (id) {
        const { error } = await supabase.from('safras').update(payload).eq('id', id)
        if (error) throw error
      } else {
        const { data: newSafra, error } = await supabase
          .from('safras')
          .insert(payload)
          .select()
          .single()
        if (error) throw error
        safraId = newSafra.id
      }

      if (safraId) {
        await supabase.from('safra_talhoes').delete().eq('safra_id', safraId)
        if (selectedTalhoes.length > 0) {
          const links = selectedTalhoes.map((tid) => ({
            empresa_id: empresa.id,
            safra_id: safraId,
            talhao_id: tid,
          }))
          const { error } = await supabase.from('safra_talhoes').insert(links)
          if (error) throw error
        }
      }

      toast({ title: 'Sucesso', description: 'Safra salva com sucesso' })
      navigate('/app/safras')
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight">{id ? 'Editar Safra' : 'Nova Safra'}</h1>
        <Button variant="outline" onClick={() => navigate('/app/safras')}>
          Cancelar
        </Button>
      </div>

      {isEncerrada && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md mb-6 flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            Esta safra está encerrada. O registro está protegido e os dados são apenas para
            visualização.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Identificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Nome da Safra *</Label>
                <Input {...register('nome_safra')} placeholder="Ex: Safra 2024" />
                {errors.nome_safra && (
                  <span className="text-destructive text-xs">{errors.nome_safra.message}</span>
                )}
              </div>
              <div className="space-y-1">
                <Label>Ano *</Label>
                <Input type="number" {...register('ano_safra')} />
                {errors.ano_safra && (
                  <span className="text-destructive text-xs">{errors.ano_safra.message}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fazenda e Cultura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Fazenda *</Label>
              <Select value={wFazendaId} onValueChange={(v) => setValue('fazenda_id', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.fazendas.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fazenda_id && (
                <span className="text-destructive text-xs">{errors.fazenda_id.message}</span>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Cultura *</Label>
                <Select
                  value={wCulturaId}
                  onValueChange={(v) => {
                    setValue('cultura_id', v)
                    setValue('cultivar_id', '')
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSources.culturas.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cultura_id && (
                  <span className="text-destructive text-xs">{errors.cultura_id.message}</span>
                )}
              </div>
              <div className="space-y-1">
                <Label>Cultivar *</Label>
                <Select
                  value={watch('cultivar_id')}
                  onValueChange={(v) => setValue('cultivar_id', v)}
                  disabled={!wCulturaId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSources.cultivares
                      .filter((c) => c.cultura_id === wCulturaId)
                      .map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nome}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.cultivar_id && (
                  <span className="text-destructive text-xs">{errors.cultivar_id.message}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Período e Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label>Data Início *</Label>
                <Input type="date" {...register('data_plantio')} />
                {errors.data_plantio && (
                  <span className="text-destructive text-xs">{errors.data_plantio.message}</span>
                )}
              </div>
              <div className="space-y-1">
                <Label>Data Fim *</Label>
                <Input type="date" {...register('data_colheita_prevista')} />
                {errors.data_colheita_prevista && (
                  <span className="text-destructive text-xs">
                    {errors.data_colheita_prevista.message}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select value={watch('status')} onValueChange={(v) => setValue('status', v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planejada">Planejada</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Finalizada">Finalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imagem (Opcional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" /> Upload de Imagem
                </Button>
                {imagePreview && (
                  <div className="relative w-16 h-16 rounded border shrink-0">
                    <img
                      src={imagePreview}
                      className="w-full h-full object-cover rounded"
                      alt="Preview"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview('')
                      }}
                      className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-sm transition-transform hover:scale-110"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              {!imagePreview && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma imagem selecionada. Adicione uma imagem para ilustrar a safra.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {wFazendaId && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Talhões Associados (Opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              {talhoes.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhum talhão encontrado para esta fazenda.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {talhoes.map((t) => {
                    const isSelected = selectedTalhoes.includes(t.id)
                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleTalhao(t.id, t.isLocked)}
                        className={cn(
                          'border p-4 rounded-lg cursor-pointer transition-all flex flex-col gap-1',
                          t.isLocked
                            ? 'bg-muted opacity-60 cursor-not-allowed border-dashed'
                            : 'hover:border-primary',
                          isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : '',
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-semibold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" /> {t.nome}
                          </span>
                          {t.isLocked && (
                            <Badge variant="secondary" className="text-[10px]">
                              Em Uso
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{t.area_ha || 0} ha</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end pt-4 pb-12">
          <Button
            type="submit"
            size="lg"
            disabled={loading || isEncerrada}
            className="w-full sm:w-auto"
          >
            {loading ? 'Salvando...' : 'Salvar Safra'}
          </Button>
        </div>
      </form>
    </div>
  )
}
