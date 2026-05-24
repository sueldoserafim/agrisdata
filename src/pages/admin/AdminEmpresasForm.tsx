import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { getEmpresa, saveEmpresa } from '@/services/admin/empresas'
import { getPlanos } from '@/services/admin/planos'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
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
import { useToast } from '@/hooks/use-toast'

const schema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, 'Nome muito curto'),
  cnpj: z.string().optional().nullable(),
  email: z.string().email('Email inválido').optional().nullable(),
  telefone: z.string().optional().nullable(),
  plano_id: z.string().optional().nullable(),
  slug: z.string().min(2, 'Slug muito curto'),
  ativo: z.boolean().default(true),
})

export default function AdminEmpresasForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [planos, setPlanos] = useState<any[]>([])

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { ativo: true, nome: '', slug: '' },
  })

  useEffect(() => {
    getPlanos().then(setPlanos)
    if (id) {
      getEmpresa(id).then((data) => form.reset(data))
    }
  }, [id, form])

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await saveEmpresa(values)
      toast({ title: 'Empresa salva com sucesso!' })
      navigate('/admin/empresas')
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{id ? 'Editar Empresa' : 'Nova Empresa'}</h1>
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
                <FormLabel>Nome da Empresa</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug (URL amigável)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de Contato</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="plano_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plano SaaS</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um plano" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {planos.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <FormLabel>Empresa Ativa</FormLabel>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Salvar Empresa
          </Button>
        </form>
      </Form>
    </div>
  )
}
