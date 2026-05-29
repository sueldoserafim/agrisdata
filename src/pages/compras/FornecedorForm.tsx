import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Loader2,
  Search,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  KeyRound,
  FileText,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { comprasService } from '@/services/compras'
import { supabase } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'

const fornecedorSchema = z.object({
  nome: z.string().min(1, 'Nome / Razão Social é obrigatório'),
  nome_fantasia: z.string().optional(),
  tipo_pessoa: z.string().optional(),
  cnpj: z.string().optional(),
  indicador_ie: z.string().optional(),
  inscricao_estadual: z.string().optional(),
  inscricao_municipal: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  is_cooperado: z.boolean().default(false),
  // Endereco
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  // Portal
  acesso_portal: z.boolean().default(false),
  senha_portal: z.string().optional(),
})

type FornecedorFormValues = z.infer<typeof fornecedorSchema>

export default function FornecedorForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { empresa } = useEmpresa()
  const [loading, setLoading] = useState(false)
  const [fetchingCnpj, setFetchingCnpj] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [usuarioPortal, setUsuarioPortal] = useState<any>(null)

  const form = useForm<FornecedorFormValues>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: {
      nome: '',
      nome_fantasia: '',
      tipo_pessoa: 'PJ',
      cnpj: '',
      indicador_ie: 'nao_contribuinte',
      inscricao_estadual: '',
      inscricao_municipal: '',
      email: '',
      telefone: '',
      is_cooperado: false,
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      acesso_portal: false,
      senha_portal: '',
    },
  })

  useEffect(() => {
    if (id && empresa?.id) {
      loadFornecedor()
    }
  }, [id, empresa?.id])

  const loadFornecedor = async () => {
    try {
      setLoading(true)
      const data = await comprasService.getFornecedor(id!)
      const endereco = await comprasService.getEnderecoFornecedor(id!)
      const usuario = await comprasService.getUsuarioFornecedor(id!)

      form.reset({
        nome: data.nome || '',
        nome_fantasia: data.nome_fantasia || '',
        tipo_pessoa: data.tipo_pessoa || 'PJ',
        cnpj: data.cnpj || '',
        indicador_ie: data.indicador_ie || 'nao_contribuinte',
        inscricao_estadual: data.inscricao_estadual || '',
        inscricao_municipal: data.inscricao_municipal || '',
        email: data.email || '',
        telefone: data.telefone || '',
        is_cooperado: data.is_cooperado || false,
        cep: endereco?.cep || '',
        logradouro: endereco?.logradouro || '',
        numero: endereco?.numero || '',
        complemento: endereco?.complemento || '',
        bairro: endereco?.bairro || '',
        cidade: endereco?.cidade || '',
        estado: endereco?.estado || '',
        acesso_portal: !!usuario,
        senha_portal: '',
      })
      setUsuarioPortal(usuario)
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCnpjLookup = async () => {
    const cnpj = form.getValues('cnpj')
    if (!cnpj || cnpj.replace(/\D/g, '').length !== 14) {
      toast({
        title: 'CNPJ inválido',
        description: 'Digite um CNPJ válido com 14 dígitos.',
        variant: 'destructive',
      })
      return
    }

    try {
      setFetchingCnpj(true)
      const { data, error } = await supabase.functions.invoke('fetch-cnpj', {
        body: { cnpj: cnpj.replace(/\D/g, '') },
      })

      if (error) throw error
      if (data.error) throw new Error(data.error)

      if (data.razao_social) form.setValue('nome', data.razao_social)
      if (data.nome_fantasia) form.setValue('nome_fantasia', data.nome_fantasia)
      if (data.cep) form.setValue('cep', data.cep)
      if (data.logradouro) form.setValue('logradouro', data.logradouro)
      if (data.numero) form.setValue('numero', data.numero)
      if (data.complemento) form.setValue('complemento', data.complemento)
      if (data.bairro) form.setValue('bairro', data.bairro)
      if (data.municipio) form.setValue('cidade', data.municipio)
      if (data.uf) form.setValue('estado', data.uf)

      toast({ title: 'Dados atualizados com sucesso' })
    } catch (err: any) {
      toast({ title: 'Erro ao buscar CNPJ', description: err.message, variant: 'destructive' })
    } finally {
      setFetchingCnpj(false)
    }
  }

  const onSubmit = async (values: FornecedorFormValues) => {
    try {
      setLoading(true)

      const payloadFornecedor = {
        id: id || undefined,
        empresa_id: empresa!.id,
        nome: values.nome,
        nome_fantasia: values.nome_fantasia || null,
        tipo_pessoa: values.tipo_pessoa || null,
        cnpj: values.cnpj || null,
        indicador_ie: values.indicador_ie || null,
        inscricao_estadual: values.inscricao_estadual || null,
        inscricao_municipal: values.inscricao_municipal || null,
        email: values.email || null,
        telefone: values.telefone || null,
        is_cooperado: values.is_cooperado,
      }

      const payloadEndereco = {
        cep: values.cep || null,
        logradouro: values.logradouro || null,
        numero: values.numero || null,
        complemento: values.complemento || null,
        bairro: values.bairro || null,
        cidade: values.cidade || null,
        estado: values.estado || null,
      }

      const res = await comprasService.saveFornecedor(payloadFornecedor, payloadEndereco)

      if (values.acesso_portal && !usuarioPortal && values.email && values.senha_portal) {
        await comprasService.criarUsuarioPortal({
          nome: values.nome,
          email: values.email,
          password: values.senha_portal,
          perfil: 'fornecedor',
          fornecedor_id: res.id,
        })
      } else if (values.acesso_portal && usuarioPortal && values.senha_portal) {
        await comprasService.atualizarUsuarioPortal({
          id: usuarioPortal.id,
          password: values.senha_portal,
        })
      }

      toast({ title: 'Fornecedor salvo com sucesso' })
      navigate('/app/compras/fornecedores')
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full border-slate-200"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {id ? 'Editar Fornecedor' : 'Novo Fornecedor'}
            </h1>
            <p className="text-muted-foreground mt-1">
              Preencha os dados abaixo para cadastrar e integrar o parceiro
            </p>
          </div>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 min-w-[140px] shadow-sm"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Salvar Fornecedor
        </Button>
      </div>

      {loading && id && !form.getValues('nome') ? (
        <div className="space-y-6">
          <Skeleton className="h-[250px] w-full rounded-2xl" />
          <Skeleton className="h-[250px] w-full rounded-2xl" />
        </div>
      ) : (
        <Form {...form}>
          <form className="space-y-6 pb-20">
            {/* Seção 1: Informações Principais */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Informações Principais</h2>
                  <p className="text-sm text-slate-500">Dados básicos de identificação</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="tipo_pessoa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Tipo de Pessoa</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-50">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                          <SelectItem value="PF">Pessoa Física</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <FormLabel className="text-slate-700">CNPJ / CPF</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder={
                              form.watch('tipo_pessoa') === 'PF'
                                ? 'Ex: 000.000.000-00'
                                : 'Ex: 00.000.000/0000-00'
                            }
                            className="bg-slate-50"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleCnpjLookup}
                          disabled={
                            fetchingCnpj || !field.value || form.watch('tipo_pessoa') === 'PF'
                          }
                          title="Buscar dados na Receita Federal (Apenas CNPJ)"
                          className="px-3"
                        >
                          {fetchingCnpj ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Search className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <FormLabel className="text-slate-700">Nome / Razão Social *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Agro Insumos S/A"
                          className="bg-slate-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nome_fantasia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Nome Fantasia</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: AgroInsumos" className="bg-slate-50" {...field} />
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
                      <FormLabel className="text-slate-700">Email de Contato</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Ex: contato@empresa.com"
                          className="bg-slate-50"
                          {...field}
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
                      <FormLabel className="text-slate-700">Telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: (00) 00000-0000"
                          className="bg-slate-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_cooperado"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm h-[72px] mt-auto">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base text-slate-800">Cooperado?</FormLabel>
                        <p className="text-xs text-slate-500">Membro da cooperativa</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção 2: Dados Fiscais */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Dados Fiscais</h2>
                  <p className="text-sm text-slate-500">Inscrições e tributação</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="indicador_ie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Indicador IE</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-50">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="contribuinte">Contribuinte ICMS</SelectItem>
                          <SelectItem value="contribuinte_isento">Contribuinte Isento</SelectItem>
                          <SelectItem value="nao_contribuinte">Não Contribuinte</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inscricao_estadual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Inscrição Estadual (IE)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: 123.456.789.123"
                          className="bg-slate-50"
                          {...field}
                          disabled={form.watch('indicador_ie') === 'nao_contribuinte'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inscricao_municipal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Inscrição Municipal (IM)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 1234567" className="bg-slate-50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção 3: Endereço Completo */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Endereço Completo</h2>
                  <p className="text-sm text-slate-500">
                    Localização física para entregas e faturamento
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 00000-000" className="bg-slate-50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logradouro"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 lg:col-span-2">
                      <FormLabel className="text-slate-700">Logradouro</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Rua das Flores"
                          className="bg-slate-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 123" className="bg-slate-50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="complemento"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 lg:col-span-1">
                      <FormLabel className="text-slate-700">Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Sala 2" className="bg-slate-50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Centro" className="bg-slate-50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: São Paulo" className="bg-slate-50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Estado (UF)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: SP"
                          maxLength={2}
                          className="bg-slate-50 uppercase"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção 4: Acesso ao Portal */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Acesso ao Portal do Fornecedor
                    </h2>
                    <p className="text-sm text-slate-500">Credenciais para o painel externo</p>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="acesso_portal"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                      <FormLabel className="text-sm font-medium cursor-pointer text-slate-700">
                        Habilitar Acesso
                      </FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch('acesso_portal') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="space-y-2">
                    <FormLabel className="text-slate-700">Email de Login</FormLabel>
                    <Input
                      value={form.watch('email')}
                      disabled
                      placeholder="Preencha o email principal na seção inicial"
                      className="bg-slate-100 text-slate-500 cursor-not-allowed"
                    />
                    <p className="text-[0.8rem] text-slate-500 flex items-center gap-1">
                      O email principal será o login do usuário.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="senha_portal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">
                          {usuarioPortal
                            ? 'Nova Senha (deixe em branco para manter)'
                            : 'Senha de Acesso *'}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Ex: SenhaForte123!"
                              className="bg-slate-50 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
