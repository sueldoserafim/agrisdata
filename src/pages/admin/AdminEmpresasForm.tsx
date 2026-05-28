import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Building2, Save, X } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 pb-10">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {id ? 'Editar Empresa' : 'Nova Empresa'}
            </h1>
            <p className="text-blue-100 text-sm md:text-base mt-1">
              {id
                ? 'Atualize os dados e configurações do tenant'
                : 'Crie um novo tenant e seu primeiro administrador'}
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
          <Button
            variant="secondary"
            className="flex-1 md:flex-none bg-white/20 text-white hover:bg-white/30 border-0"
            onClick={() => navigate('/admin/empresas')}
          >
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          <Button
            className="flex-1 md:flex-none bg-white text-blue-700 hover:bg-blue-50 shadow-sm"
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
          >
            <Save className="mr-2 h-4 w-4" /> {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
          <Card className="overflow-hidden border-none shadow-card">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b pb-4">
              <CardTitle className="text-xl text-primary flex items-center gap-2">
                <span className="bg-primary/10 p-2 rounded-lg">
                  <Building2 className="h-5 w-5" />
                </span>
                Dados da Empresa
              </CardTitle>
              <CardDescription>Informações cadastrais e contato da empresa.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                        Nome da Empresa *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Agro Indústria S.A."
                          className="bg-white dark:bg-slate-950"
                          {...field}
                        />
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
                      <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                        Slug (URL amigável) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="agro-industria"
                          className="bg-white dark:bg-slate-950"
                          {...field}
                        />
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
                      <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                        CNPJ
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ''}
                          className="bg-white dark:bg-slate-950"
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
                      <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                        Email de Contato
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contato@empresa.com"
                          className="bg-white dark:bg-slate-950"
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
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                        Telefone
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(00) 00000-0000"
                          className="bg-white dark:bg-slate-950"
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
                  name="ativo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4 shadow-sm bg-slate-50/50 dark:bg-slate-900/20">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">Empresa Ativa</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Define se os usuários podem acessar o sistema.
                        </p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-card">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b pb-4">
              <CardTitle className="text-xl text-primary flex items-center gap-2">
                <span className="bg-primary/10 p-2 rounded-lg">📦</span>
                Plano e Acessos
              </CardTitle>
              <CardDescription>
                Configure o plano de assinatura e as permissões do tenant.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="plano_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                        Plano SaaS *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-slate-950">
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
                      <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                        Limite de Usuários *
                      </FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-white dark:bg-slate-950" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/20 p-5 rounded-xl border">
                <FormField
                  control={form.control}
                  name="modulos_habilitados"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base font-semibold text-slate-800 dark:text-slate-200">
                          Módulos Habilitados
                        </FormLabel>
                        <p className="text-sm text-muted-foreground mt-1">
                          Selecione quais áreas do sistema esta empresa terá acesso.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {MODULOS_DISPONIVEIS.map((modulo) => (
                          <FormField
                            key={modulo.id}
                            control={form.control}
                            name="modulos_habilitados"
                            render={({ field }) => {
                              return (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 rounded-lg border bg-white dark:bg-slate-950 shadow-sm hover:border-primary/50 transition-colors cursor-pointer">
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
                                  <FormLabel className="font-medium cursor-pointer w-full">
                                    {modulo.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {!id && (
            <Card className="overflow-hidden border-none shadow-card">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b pb-4">
                <CardTitle className="text-xl text-primary flex items-center gap-2">
                  <span className="bg-primary/10 p-2 rounded-lg">👤</span>
                  Primeiro Administrador
                </CardTitle>
                <CardDescription>
                  Usuário master que receberá o acesso inicial ao tenant.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <FormField
                    control={form.control}
                    name="admin_nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                          Nome do Administrador *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="João da Silva"
                            className="bg-white dark:bg-slate-950"
                            {...field}
                          />
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
                        <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                          Email do Administrador *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="joao@empresa.com"
                            className="bg-white dark:bg-slate-950"
                            {...field}
                          />
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
                        <FormLabel className="font-semibold text-slate-700 dark:text-slate-300">
                          Senha Temporária
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            readOnly
                            className="bg-muted font-mono text-center tracking-widest text-lg"
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-1">
                          Copie esta senha e envie ao administrador.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="admin_troca_senha"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4 shadow-sm bg-slate-50/50 dark:bg-slate-900/20 h-[fit-content] md:mt-8">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-semibold">
                            Exigir Troca de Senha
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Força a alteração no primeiro login.
                          </p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end pt-4 pb-12 md:pb-0">
            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto shadow-md"
              disabled={loading}
            >
              <Save className="mr-2 h-5 w-5" />
              {loading ? 'Salvando...' : id ? 'Salvar Alterações' : 'Criar Empresa e Administrador'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
