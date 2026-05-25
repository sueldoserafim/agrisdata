import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { armazensService } from '@/services/armazens'
import { supabase } from '@/lib/supabase/client'
import { HelpButton } from '@/components/HelpButton'

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  fazenda_id: z.string().min(1, 'Fazenda é obrigatória'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  responsavel_id: z.string().min(1, 'Responsável é obrigatório'),
  usa_peps: z.boolean().default(false),
  temperatura_controlada: z.boolean().default(false),
  temp_minima: z.number().nullable().optional(),
  temp_maxima: z.number().nullable().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function ArmazemForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { empresa } = useEmpresa()

  const [fazendas, setFazendas] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { usa_peps: false, temperatura_controlada: false },
  })

  const isTempControlada = watch('temperatura_controlada')

  useEffect(() => {
    if (empresa?.id) {
      supabase
        .from('fazendas')
        .select('id, nome')
        .eq('empresa_id', empresa.id)
        .then(({ data }) => setFazendas(data || []))
      supabase
        .from('usuarios')
        .select('id, nome')
        .eq('empresa_id', empresa.id)
        .then(({ data }) => setUsuarios(data || []))
    }
  }, [empresa?.id])

  useEffect(() => {
    if (id && id !== 'new') {
      armazensService.getById(id).then((data) => {
        setValue('nome', data.nome)
        if (data.fazenda_id) setValue('fazenda_id', data.fazenda_id)
        if (data.tipo) setValue('tipo', data.tipo)
        if (data.responsavel_id) setValue('responsavel_id', data.responsavel_id)
        setValue('usa_peps', data.usa_peps || false)
        setValue('temperatura_controlada', data.temperatura_controlada || false)
        if (data.temp_minima) setValue('temp_minima', data.temp_minima)
        if (data.temp_maxima) setValue('temp_maxima', data.temp_maxima)
      })
    }
  }, [id, setValue])

  const onSubmit = async (data: FormData) => {
    if (!empresa?.id) return
    setLoading(true)
    try {
      const payload = {
        ...data,
        empresa_id: empresa.id,
        temp_minima: data.temperatura_controlada ? data.temp_minima : null,
        temp_maxima: data.temperatura_controlada ? data.temp_maxima : null,
      }

      if (id && id !== 'new') {
        await armazensService.update(id, payload)
        toast({ title: 'Armazém atualizado com sucesso' })
      } else {
        await armazensService.create(payload)
        toast({ title: 'Armazém criado com sucesso' })
      }
      navigate('/app/armazens')
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/armazens')}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold flex-1">
          {id === 'new' ? 'Novo Armazém' : 'Editar Armazém'}
        </h1>
        <HelpButton
          title="Ajuda: Armazéns"
          content={
            <>
              <p>Cadastre os locais físicos de armazenamento de sua operação.</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <strong>PEPS:</strong> Primeiro a Entrar, Primeiro a Sair. Usado para garantir
                  giro de estoque.
                </li>
                <li>
                  <strong>Temperatura:</strong> Ative se o local for câmara fria para sementes ou
                  químicos específicos.
                </li>
              </ul>
            </>
          }
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Nome do Armazém</Label>
                <Input {...register('nome')} placeholder="Ex: Galpão Principal" />
                {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Fazenda</Label>
                <Select
                  onValueChange={(val) => setValue('fazenda_id', val)}
                  value={watch('fazenda_id')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {fazendas.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fazenda_id && (
                  <p className="text-sm text-destructive">{errors.fazenda_id.message}</p>
                )}
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Tipo de Armazém</Label>
                <Select onValueChange={(val) => setValue('tipo', val)} value={watch('tipo')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Insumos">Insumos</SelectItem>
                    <SelectItem value="Produtos Acabados">Produtos Acabados</SelectItem>
                    <SelectItem value="Embalagens">Embalagens</SelectItem>
                    <SelectItem value="Máquinas/Peças">Máquinas/Peças</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipo && <p className="text-sm text-destructive">{errors.tipo.message}</p>}
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Responsável</Label>
                <Select
                  onValueChange={(val) => setValue('responsavel_id', val)}
                  value={watch('responsavel_id')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.responsavel_id && (
                  <p className="text-sm text-destructive">{errors.responsavel_id.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-8 py-4 border-y">
              <div className="flex items-center gap-3">
                <Switch
                  checked={watch('usa_peps')}
                  onCheckedChange={(v) => setValue('usa_peps', v)}
                />
                <Label className="cursor-pointer">Usa controle PEPS (FIFO)?</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={isTempControlada}
                  onCheckedChange={(v) => setValue('temperatura_controlada', v)}
                />
                <Label className="cursor-pointer">Temperatura Controlada?</Label>
              </div>
            </div>

            {isTempControlada && (
              <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="space-y-2">
                  <Label>Temp. Mínima (°C)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register('temp_minima', { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Temp. Máxima (°C)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register('temp_maxima', { valueAsNumber: true })}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/app/armazens')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                Salvar Armazém
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
