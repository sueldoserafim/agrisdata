import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
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
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  tipo: z.enum(['viveiro', 'propagador', 'ambiente_controlado', 'sombrite']),
  area_m2: z.coerce.number().min(0, 'Área inválida').optional(),
  capacidade_lotes: z.coerce.number().min(0, 'Capacidade inválida').optional(),
  fazenda_id: z.string().uuid().optional().or(z.literal('')),
  responsavel_id: z.string().uuid().optional().or(z.literal('')),
  ativo: z.boolean().default(true),
})

export default function EstufaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [fazendas, setFazendas] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      tipo: 'viveiro',
      ativo: true,
      fazenda_id: '',
      responsavel_id: '',
    },
  })

  useEffect(() => {
    if (empresa) {
      loadDependencies()
      if (id) loadData()
    }
  }, [empresa, id])

  const loadDependencies = async () => {
    const [resFazendas, resUsuarios] = await Promise.all([
      supabase
        .from('fazendas')
        .select('id, nome')
        .eq('empresa_id', empresa!.id)
        .is('deleted_at', null),
      supabase.from('usuarios').select('id, nome').eq('empresa_id', empresa!.id),
    ])
    if (resFazendas.data) setFazendas(resFazendas.data)
    if (resUsuarios.data) setUsuarios(resUsuarios.data)
  }

  const loadData = async () => {
    const { data, error } = await supabase.from('estufas').select('*').eq('id', id).single()
    if (error) {
      toast({ title: 'Erro ao carregar', description: error.message, variant: 'destructive' })
    } else if (data) {
      form.reset({
        nome: data.nome,
        tipo: data.tipo as any,
        area_m2: data.area_m2 || undefined,
        capacidade_lotes: data.capacidade_lotes || undefined,
        fazenda_id: data.fazenda_id || '',
        responsavel_id: data.responsavel_id || '',
        ativo: data.ativo,
      })
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    const payload = {
      empresa_id: empresa!.id,
      nome: values.nome,
      tipo: values.tipo,
      area_m2: values.area_m2,
      capacidade_lotes: values.capacidade_lotes,
      fazenda_id: values.fazenda_id || null,
      responsavel_id: values.responsavel_id || null,
      ativo: values.ativo,
    }

    let error
    if (id) {
      const res = await supabase.from('estufas').update(payload).eq('id', id)
      error = res.error
    } else {
      const res = await supabase.from('estufas').insert(payload)
      error = res.error
    }

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Estufa salva com sucesso' })
      navigate('/app/estufas')
    }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/app/estufas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {id ? 'Editar Estufa' : 'Nova Estufa'}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Estufa</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Nome da Estufa/Viveiro</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Viveiro Principal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Estrutura</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="viveiro">Viveiro Padrão</SelectItem>
                        <SelectItem value="propagador">Propagador</SelectItem>
                        <SelectItem value="ambiente_controlado">Ambiente Controlado</SelectItem>
                        <SelectItem value="sombrite">Sombrite</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fazenda_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fazenda/Unidade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
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

              <FormField
                control={form.control}
                name="area_m2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacidade_lotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidade (Qtd. de Lotes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-1 md:col-span-2">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Estufa Ativa</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Define se a estufa está em operação atualmente.
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                'Salvando...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Estufa
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
