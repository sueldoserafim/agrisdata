import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { produtosService } from '@/services/produtos'

const formSchema = z.object({
  codigo_interno: z.string().optional().nullable(),
  nome: z.string().min(3, 'Mínimo 3 caracteres').max(150),
  categoria: z.enum(['insumo', 'defensivo', 'fertilizante', 'sementes', 'embalagem', 'outro']),
  tipo: z.string().optional().nullable(),
  fabricante_marca: z.string().optional().nullable(),
  unidade_medida: z.enum(['kg', 'L', 'un', 'caixa', 'ton']),
  preco_unitario: z.coerce.number().nonnegative('Preço deve ser >= 0'),
  estoque_minimo: z.coerce.number().int().optional().nullable(),
  prazo_validade_dias: z.coerce.number().int().optional().nullable(),
  codigo_ncm: z.string().optional().nullable(),
  classe_risco: z.string().optional().nullable(),
  registro_mapa: z.string().optional().nullable(),
  classe_toxicologica: z.string().optional().nullable(),
  carencia_dias: z.coerce.number().int().nonnegative().optional().nullable(),
  exige_receituario: z.boolean().optional(),
  ingrediente_ativo: z.string().optional().nullable(),
  recomendacao_uso: z.string().optional().nullable(),
  visivel_operadores: z.boolean().optional().default(true),
  status: z.string().optional().default('ativo'),
})

type FormValues = z.infer<typeof formSchema>

export default function ProdutoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { empresa } = useEmpresa()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoria: 'insumo',
      unidade_medida: 'un',
      preco_unitario: 0,
      visivel_operadores: true,
      exige_receituario: false,
      status: 'ativo',
    },
  })

  useEffect(() => {
    if (id && id !== 'new') {
      setLoading(true)
      produtosService
        .getById(id)
        .then((data) => {
          form.reset({
            ...data,
            preco_unitario: Number(data.preco_unitario || 0),
            estoque_minimo: data.estoque_minimo ?? null,
            prazo_validade_dias: data.prazo_validade_dias ?? null,
            carencia_dias: data.carencia_dias ?? null,
          } as FormValues)
        })
        .finally(() => setLoading(false))
    }
  }, [id, form])

  const onSubmit = async (values: FormValues) => {
    if (!empresa) return
    try {
      setLoading(true)
      const payload = { ...values, empresa_id: empresa.id }
      if (id && id !== 'new') {
        await produtosService.update(id, payload)
        toast({ title: 'Produto atualizado com sucesso' })
      } else {
        await produtosService.create(payload)
        toast({ title: 'Produto criado com sucesso' })
      }
      navigate('/app/produtos')
    } catch (error: any) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const categoria = form.watch('categoria')

  const InputField = ({ name, label, type = 'text' }: any) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              {...field}
              value={field.value ?? ''}
              onChange={
                type === 'number'
                  ? (e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))
                  : field.onChange
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const SelectField = ({ name, label, options }: any) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || undefined}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o: string) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const SwitchField = ({ name, label }: any) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-2">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Switch checked={!!field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  )

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/app/produtos">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{id === 'new' ? 'Novo Produto' : 'Editar Produto'}</h1>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
          <Save className="size-4 mr-2" /> Salvar
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Identificação</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="codigo_interno" label="Código Interno" />
              <InputField name="nome" label="Nome *" />
              <SelectField
                name="categoria"
                label="Categoria *"
                options={['insumo', 'defensivo', 'fertilizante', 'sementes', 'embalagem', 'outro']}
              />
              <InputField name="tipo" label="Tipo" />
              <InputField name="fabricante_marca" label="Fabricante / Marca" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estoque</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                name="unidade_medida"
                label="Unidade de Medida *"
                options={['kg', 'L', 'un', 'caixa', 'ton']}
              />
              <InputField name="preco_unitario" label="Preço Unitário (R$) *" type="number" />
              <InputField name="estoque_minimo" label="Estoque Mínimo" type="number" />
              <InputField
                name="prazo_validade_dias"
                label="Prazo de Validade (dias)"
                type="number"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fiscal</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="codigo_ncm" label="Código NCM" />
              <SelectField
                name="classe_risco"
                label="Classe de Risco"
                options={['não perigoso', 'classe I', 'classe II', 'classe III', 'classe IV']}
              />
            </CardContent>
          </Card>

          {categoria === 'defensivo' && (
            <Card>
              <CardHeader>
                <CardTitle>Regulatório</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="registro_mapa" label="Registro no MAPA" />
                <SelectField
                  name="classe_toxicologica"
                  label="Classe Toxicológica"
                  options={['classe I', 'classe II', 'classe III', 'classe IV']}
                />
                <InputField name="carencia_dias" label="Carência (dias)" type="number" />
                <SwitchField name="exige_receituario" label="Exige Receituário?" />
                <InputField name="ingrediente_ativo" label="Ingrediente Ativo" />
                <FormField
                  control={form.control}
                  name="recomendacao_uso"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Recomendação de Uso</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value ?? ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Visibilidade & Status</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SwitchField name="visivel_operadores" label="Visível para Operadores?" />
              <SelectField name="status" label="Status" options={['ativo', 'inativo']} />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
