import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { ArrowLeft, Save, Loader2, Leaf, Box } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { cultivaresService } from '@/services/cultivares'
import { supabase } from '@/lib/supabase/client'

const formSchema = z
  .object({
    cultura_id: z.string().min(1, 'Selecione a cultura'),
    nome: z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
    codigo_interno: z.string().optional(),
    pais_origem: z.string().optional(),
    detentor_licenciador: z.string().optional(),
    dias_para_colheita: z.preprocess(
      (v) => (v === '' || v === null ? null : v),
      z.coerce.number().int().positive('Deve ser maior que zero').nullable().optional(),
    ),
    produtividade_esperada_t_ha: z.preprocess(
      (v) => (v === '' || v === null ? null : v),
      z.coerce.number().positive('Deve ser maior que zero').nullable().optional(),
    ),
    shelf_life_ideal_dias: z.preprocess(
      (v) => (v === '' || v === null ? null : v),
      z.coerce.number().int().positive('Deve ser maior que zero').nullable().optional(),
    ),
    shelf_life_minimo_dias: z.preprocess(
      (v) => (v === '' || v === null ? null : v),
      z.coerce.number().int().positive('Deve ser maior que zero').nullable().optional(),
    ),
    gda_objetivo_colheita: z.preprocess(
      (v) => (v === '' || v === null ? null : v),
      z.coerce.number().positive('Deve ser maior que zero').nullable().optional(),
    ),
  })
  .refine(
    (data) => {
      if (data.shelf_life_minimo_dias != null && data.shelf_life_ideal_dias != null) {
        return data.shelf_life_minimo_dias <= data.shelf_life_ideal_dias
      }
      return true
    },
    {
      message: 'Shelf Life Mínimo deve ser menor ou igual ao Ideal',
      path: ['shelf_life_minimo_dias'],
    },
  )

export default function CultivarForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { empresa } = useEmpresa()
  const [loading, setLoading] = useState(false)
  const [culturas, setCulturas] = useState<{ id: string; nome: string }[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cultura_id: '',
      nome: '',
      codigo_interno: '',
      pais_origem: '',
      detentor_licenciador: '',
      dias_para_colheita: null,
      produtividade_esperada_t_ha: null,
      shelf_life_ideal_dias: null,
      shelf_life_minimo_dias: null,
      gda_objetivo_colheita: null,
    },
  })

  useEffect(() => {
    if (empresa) {
      loadCulturas()
      if (id) {
        loadCultivar()
      }
    }
  }, [id, empresa])

  const loadCulturas = async () => {
    try {
      const { data, error } = await supabase
        .from('culturas')
        .select('id, nome')
        .eq('empresa_id', empresa!.id)
        .is('deleted_at', null)
        .order('nome')
      if (error) throw error
      setCulturas(data || [])
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar culturas',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const loadCultivar = async () => {
    try {
      setLoading(true)
      const data = await cultivaresService.getById(id!)
      form.reset({
        cultura_id: data.cultura_id,
        nome: data.nome,
        codigo_interno: data.codigo_interno || '',
        pais_origem: data.pais_origem || '',
        detentor_licenciador: data.detentor_licenciador || '',
        dias_para_colheita: data.dias_para_colheita,
        produtividade_esperada_t_ha: data.produtividade_esperada_t_ha,
        shelf_life_ideal_dias: data.shelf_life_ideal_dias,
        shelf_life_minimo_dias: data.shelf_life_minimo_dias,
        gda_objetivo_colheita: data.gda_objetivo_colheita,
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar cultivar',
        description: error.message,
        variant: 'destructive',
      })
      navigate('/app/cultivares')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const payload = {
        ...values,
        empresa_id: empresa!.id,
      }

      if (id) {
        await cultivaresService.update(id, payload)
        toast({ title: 'Sucesso', description: 'Cultivar atualizada com sucesso' })
      } else {
        await cultivaresService.create(payload)
        toast({ title: 'Sucesso', description: 'Cultivar criada com sucesso' })
      }
      navigate('/app/cultivares')
    } catch (error: any) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/app/cultivares')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {id ? 'Editar Cultivar' : 'Nova Cultivar'}
          </h1>
          <p className="text-muted-foreground">Preencha as informações detalhadas da variedade.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Leaf className="size-5 text-primary" />
                <CardTitle>Produção</CardTitle>
              </div>
              <CardDescription>Dados gerais e expectativas de produção.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cultura_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cultura *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma cultura" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {culturas.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.nome}
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
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Cultivar *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Hass, Palmer, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codigo_interno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Interno</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: AV-001" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pais_origem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País de Origem</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: México" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="detentor_licenciador"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Detentor/Licenciador</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome da empresa detentora"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dias_para_colheita"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciclo Médio (dias)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Ex: 120"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="produtividade_esperada_t_ha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produtividade Esperada (t/ha)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0.1}
                        placeholder="Ex: 25.5"
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
              <div className="flex items-center gap-2">
                <Box className="size-5 text-primary" />
                <CardTitle>Shelf Life</CardTitle>
              </div>
              <CardDescription>Expectativa de vida útil pós-colheita.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="shelf_life_ideal_dias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shelf Life Ideal (dias)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Ex: 30"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shelf_life_minimo_dias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shelf Life Mínimo (dias)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Ex: 15"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gda_objetivo_colheita"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GDA Objetivo Colheita</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min={1}
                        placeholder="Ex: 1500"
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

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => navigate('/app/cultivares')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              Salvar Cultivar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
