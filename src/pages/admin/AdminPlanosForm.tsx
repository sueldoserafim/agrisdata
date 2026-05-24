import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { getPlano, savePlano } from '@/services/admin/planos'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'

const schema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, 'Nome obrigatório'),
  descricao: z.string().optional().nullable(),
  preco_mensal: z.coerce.number().min(0),
  limite_usuarios: z.coerce.number().min(1),
  ativo: z.boolean().default(true),
  modulos_habilitados: z
    .string()
    .transform((v) =>
      v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .or(z.array(z.string()))
    .optional()
    .default([]),
})

export default function AdminPlanosForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ativo: true,
      nome: '',
      descricao: '',
      preco_mensal: 0,
      limite_usuarios: 5,
      modulos_habilitados: [],
    },
  })

  useEffect(() => {
    if (id) {
      getPlano(id).then((data) => {
        form.reset({
          ...data,
          modulos_habilitados: (data.modulos_habilitados || []).join(', ') as any,
        })
      })
    }
  }, [id, form])

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await savePlano(values)
      toast({ title: 'Plano salvo!' })
      navigate('/admin/planos')
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{id ? 'Editar Plano' : 'Novo Plano'}</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 bg-card p-6 rounded-lg border"
        >
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Plano</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="preco_mensal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço Mensal (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="limite_usuarios"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite de Usuários</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="modulos_habilitados"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Módulos (separados por vírgula)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ativo"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0 pt-4">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Plano Ativo</FormLabel>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Salvar Plano
          </Button>
        </form>
      </Form>
    </div>
  )
}
