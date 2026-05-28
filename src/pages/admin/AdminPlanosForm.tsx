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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'

const AVAILABLE_MODULES = [
  { id: 'producao', label: 'Produção' },
  { id: 'estoque', label: 'Estoque' },
  { id: 'financeiro', label: 'Financeiro' },
  { id: 'qualidade', label: 'Qualidade' },
  { id: 'rh', label: 'Recursos Humanos' },
]

const schema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, 'Nome obrigatório'),
  descricao: z.string().optional().nullable(),
  preco_mensal: z.coerce.number().min(0, 'Deve ser maior ou igual a zero'),
  limite_usuarios: z.coerce.number().min(1, 'Deve ser pelo menos 1'),
  ativo: z.boolean().default(true),
  modulos_habilitados: z.array(z.string()).default([]),
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
          modulos_habilitados: data.modulos_habilitados || [],
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
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-bold">{id ? 'Editar Plano' : 'Novo Plano'}</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-card p-6 rounded-lg border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
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
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="modulos_habilitados"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Módulos Incluídos</FormLabel>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {AVAILABLE_MODULES.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="modulos_habilitados"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-center space-x-3 space-y-0 p-3 rounded-lg border bg-white dark:bg-slate-950 shadow-sm hover:border-primary/50 transition-colors cursor-pointer"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== item.id),
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer leading-none m-0 w-full">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ativo"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0 pt-4 border-t">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>Plano Ativo</FormLabel>
              </FormItem>
            )}
          />
          <div className="flex justify-end mt-6">
            <Button type="submit" className="w-full md:w-auto">
              Salvar Plano
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
