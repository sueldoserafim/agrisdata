import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { getEmpresa, saveEmpresa, createTenant } from '@/services/admin/empresas'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'

const MODULOS_DISPONIVEIS = [
  { id: 'caderno_campo', label: 'Caderno de Campo' },
  { id: 'financeiro', label: 'Financeiro' },
  { id: 'estoque', label: 'Estoque' },
  { id: 'maquinario', label: 'Maquinário' },
  { id: 'relatorios', label: 'Relatórios Avançados' },
]

const schema = z
  .object({
    id: z.string().optional(),
    nome: z.string().min(2, 'Nome muito curto'),
    cnpj: z.string().optional().nullable(),
    email: z.string().email('Email inválido').optional().nullable().or(z.literal('')),
    telefone: z.string().optional().nullable(),
    plano_id: z.string().optional().nullable(),
    slug: z.string().min(2, 'Slug muito curto'),
    ativo: z.boolean().default(true),
    modulos_habilitados: z.array(z.string()).default([]),
    limite_usuarios: z.coerce.number().min(1).default(5),
    admin_nome: z.string().optional(),
    admin_email: z.string().email('Email inválido').optional().or(z.literal('')),
    admin_senha: z.string().optional(),
    admin_troca_senha: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (!data.id) {
      if (!data.admin_nome || data.admin_nome.length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Obrigatório', path: ['admin_nome'] })
      }
      if (!data.admin_email || !data.admin_email.includes('@')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email inválido',
          path: ['admin_email'],
        })
      }
    }
  })

export default function AdminEmpresasForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [planos, setPlanos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ativo: true,
      nome: '',
      slug: '',
      modulos_habilitados: [],
      limite_usuarios: 5,
      admin_senha: Math.random().toString(36).slice(-8) + 'A1!',
      admin_troca_senha: true,
    },
  })

  useEffect(() => {
    getPlanos().then(setPlanos)
    if (id) {
      getEmpresa(id).then((data) =>
        form.reset({
          ...data,
          modulos_habilitados: data.modulos_habilitados || [],
          limite_usuarios: data.limite_usuarios || 5,
        }),
      )
    }
  }, [id, form])

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true)
    try {
      if (values.id) {
        await saveEmpresa(values)
        toast({ title: 'Empresa atualizada com sucesso!' })
      } else {
        await createTenant(values)
        toast({ title: 'Empresa e Administrador criados com sucesso!' })
      }
      navigate('/admin/empresas')
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{id ? 'Editar Empresa' : 'Nova Empresa'}</h1>
        <Button variant="outline" onClick={() => navigate('/admin/empresas')}>
          Cancelar
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa *</FormLabel>
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
                    <FormLabel>Slug (URL amigável) *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="00.000.000/0000-00"
                      />
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
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 pt-8">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Empresa Ativa</FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plano e Acessos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="plano_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plano SaaS *</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="limite_usuarios"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite de Usuários *</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="modulos_habilitados"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Módulos Habilitados</FormLabel>
                      </div>
                      {MODULOS_DISPONIVEIS.map((modulo) => (
                        <FormField
                          key={modulo.id}
                          control={form.control}
                          name="modulos_habilitados"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(modulo.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, modulo.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== modulo.id),
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{modulo.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {!id && (
            <Card>
              <CardHeader>
                <CardTitle>Primeiro Administrador</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="admin_nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Administrador *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="admin_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email do Administrador *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="admin_senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha Temporária</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="admin_troca_senha"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 pt-8">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="!mt-0">Exigir Troca de Senha</FormLabel>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : id ? 'Salvar Alterações' : 'Criar Empresa e Administrador'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
