import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { comprasService } from '@/services/compras'

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  habilitarPortal: z.boolean().default(false),
  portalEmail: z.string().optional(),
  portalSenha: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function FornecedorForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { empresa } = useEmpresa()
  const [loading, setLoading] = useState(false)
  const [existingUser, setExistingUser] = useState<any>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { habilitarPortal: false },
  })

  const habilitarPortal = watch('habilitarPortal')

  useEffect(() => {
    if (id && id !== 'new') {
      loadData()
    }
  }, [id])

  async function loadData() {
    try {
      const data = await comprasService.getFornecedor(id!)
      let user = null

      try {
        user = await comprasService.getUsuarioFornecedor(id!)
        if (user) setExistingUser(user)
      } catch (err) {
        console.warn('Erro ao buscar usuário do fornecedor', err)
      }

      reset({
        nome: data.nome,
        cnpj: data.cnpj || '',
        email: data.email || '',
        telefone: data.telefone || '',
        habilitarPortal: !!user,
        portalEmail: user?.email || data.email || '',
        portalSenha: '',
      })
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!empresa?.id) return

    if (data.habilitarPortal) {
      if (!data.portalEmail) {
        toast({
          title: 'Erro',
          description: 'E-mail de acesso ao portal é obrigatório.',
          variant: 'destructive',
        })
        return
      }
      if (!existingUser && (!data.portalSenha || data.portalSenha.length < 6)) {
        toast({
          title: 'Erro',
          description: 'A senha de acesso deve ter no mínimo 6 caracteres.',
          variant: 'destructive',
        })
        return
      }
    }

    setLoading(true)
    try {
      const payload = {
        nome: data.nome,
        cnpj: data.cnpj,
        email: data.email,
        telefone: data.telefone,
        id: id !== 'new' ? id : undefined,
        empresa_id: empresa.id,
      }

      const savedFornecedor = await comprasService.saveFornecedor(payload)

      if (data.habilitarPortal) {
        if (!existingUser) {
          await comprasService.criarUsuarioPortal({
            nome: data.nome,
            email: data.portalEmail,
            password: data.portalSenha,
            perfil: 'fornecedor',
            fornecedor_id: savedFornecedor.id,
          })
        } else {
          if (data.portalEmail !== existingUser.email || data.portalSenha) {
            await comprasService.atualizarUsuarioPortal({
              id: existingUser.id,
              nome: data.nome,
              email: data.portalEmail !== existingUser.email ? data.portalEmail : undefined,
              password: data.portalSenha ? data.portalSenha : undefined,
            })
          }
        }
      }

      toast({ title: 'Fornecedor salvo com sucesso!' })
      navigate('/app/compras/fornecedores')
    } catch (error: any) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/compras/fornecedores')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {id === 'new' ? 'Novo Fornecedor' : 'Editar Fornecedor'}
        </h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="gerais" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                <TabsTrigger value="gerais">Dados Gerais</TabsTrigger>
                <TabsTrigger value="portal">Acesso ao Portal</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="gerais" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <Label>Nome / Razão Social *</Label>
                    <Input {...register('nome')} placeholder="Ex: Agro Insumos S/A" />
                    {errors.nome && (
                      <p className="text-sm text-destructive">{errors.nome.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>CNPJ / CPF</Label>
                    <Input {...register('cnpj')} placeholder="00.000.000/0000-00" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>E-mail</Label>
                      <Input
                        type="email"
                        {...register('email')}
                        placeholder="contato@empresa.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input {...register('telefone')} placeholder="(00) 00000-0000" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="portal" className="space-y-6 mt-0">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="habilitarPortal"
                        checked={habilitarPortal}
                        onCheckedChange={(checked) =>
                          setValue('habilitarPortal', checked, { shouldValidate: true })
                        }
                        disabled={!!existingUser}
                      />
                      <Label htmlFor="habilitarPortal" className="font-semibold cursor-pointer">
                        {existingUser ? 'Acesso ao Portal Ativo' : 'Habilitar Acesso ao Portal'}
                      </Label>
                    </div>

                    {habilitarPortal && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                          <Label>E-mail de Acesso *</Label>
                          <Input
                            type="email"
                            {...register('portalEmail')}
                            placeholder="login@empresa.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>
                            {existingUser ? 'Nova Senha (opcional)' : 'Senha de Acesso *'}
                          </Label>
                          <Input
                            type="password"
                            {...register('portalSenha')}
                            placeholder="******"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground col-span-full">
                          {existingUser
                            ? 'Deixe a senha em branco caso não queira alterá-la.'
                            : 'O fornecedor usará este e-mail e senha para acessar o portal de cotações.'}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" /> Salvar Fornecedor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
