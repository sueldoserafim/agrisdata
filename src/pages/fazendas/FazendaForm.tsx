import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, Loader2, Building, MapPin, Contact, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cnpj_imobiliario: z.string().optional(),
  inscricao_estadual: z.string().optional(),
  endereco: z.string().optional(),
  municipio: z.string().optional(),
  estado: z.string().optional(),
  area_total_ha: z.coerce.number().min(0, 'Área não pode ser negativa').optional(),
  area_produtiva_ha: z.coerce.number().min(0, 'Área não pode ser negativa').optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  numero_car: z.string().optional(),
  nirf: z.string().optional(),
  ccir: z.string().optional(),
  data_fundacao: z.string().optional(),
  tipo_producao: z.string().optional(),
  responsavel_nome: z.string().optional(),
  responsavel_cpf: z.string().optional(),
  responsavel_telefone: z.string().optional(),
  responsavel_email: z.string().email('Email inválido').optional().or(z.literal('')),
})

type FazendaFormValues = z.infer<typeof formSchema>

export default function FazendaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!id)
  const isEditing = !!id

  const form = useForm<FazendaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      cnpj_imobiliario: '',
      inscricao_estadual: '',
      endereco: '',
      municipio: '',
      estado: '',
      area_total_ha: 0,
      area_produtiva_ha: 0,
      latitude: 0,
      longitude: 0,
      numero_car: '',
      nirf: '',
      ccir: '',
      data_fundacao: '',
      tipo_producao: '',
      responsavel_nome: '',
      responsavel_cpf: '',
      responsavel_telefone: '',
      responsavel_email: '',
    },
  })

  useEffect(() => {
    async function loadData() {
      if (!id || !user) return

      try {
        const { data: usuario } = await supabase
          .from('usuarios')
          .select('empresa_id')
          .eq('id', user.id)
          .single()

        if (!usuario?.empresa_id) throw new Error('Empresa não encontrada')

        const { data, error } = await supabase
          .from('fazendas')
          .select('*')
          .eq('id', id)
          .eq('empresa_id', usuario.empresa_id)
          .single()

        if (error) throw error
        if (data) {
          form.reset({
            nome: data.nome || '',
            cnpj_imobiliario: data.cnpj_imobiliario || '',
            inscricao_estadual: data.inscricao_estadual || '',
            endereco: data.endereco || '',
            municipio: data.municipio || '',
            estado: data.estado || '',
            area_total_ha: data.area_total_ha || 0,
            area_produtiva_ha: data.area_produtiva_ha || 0,
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            numero_car: data.numero_car || '',
            nirf: data.nirf || '',
            ccir: data.ccir || '',
            data_fundacao: data.data_fundacao || '',
            tipo_producao: data.tipo_producao || '',
            responsavel_nome: data.responsavel_nome || '',
            responsavel_cpf: data.responsavel_cpf || '',
            responsavel_telefone: data.responsavel_telefone || '',
            responsavel_email: data.responsavel_email || '',
          })
        }
      } catch (error: any) {
        toast.error('Erro ao carregar', { description: error.message })
        navigate('/app/fazendas')
      } finally {
        setInitialLoading(false)
      }
    }
    loadData()
  }, [id, user, form, navigate])

  const onSubmit = async (values: FazendaFormValues) => {
    if (!user) return
    setLoading(true)
    try {
      const { data: usuario } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('id', user.id)
        .single()

      if (!usuario?.empresa_id) throw new Error('Empresa não encontrada')

      const dataToSave = {
        empresa_id: usuario.empresa_id,
        nome: values.nome,
        cnpj_imobiliario: values.cnpj_imobiliario || null,
        inscricao_estadual: values.inscricao_estadual || null,
        endereco: values.endereco || null,
        municipio: values.municipio || null,
        estado: values.estado || null,
        area_total_ha: values.area_total_ha || null,
        area_produtiva_ha: values.area_produtiva_ha || null,
        latitude: values.latitude || null,
        longitude: values.longitude || null,
        numero_car: values.numero_car || null,
        nirf: values.nirf || null,
        ccir: values.ccir || null,
        data_fundacao: values.data_fundacao || null,
        tipo_producao: values.tipo_producao || null,
        responsavel_nome: values.responsavel_nome || null,
        responsavel_cpf: values.responsavel_cpf || null,
        responsavel_telefone: values.responsavel_telefone || null,
        responsavel_email: values.responsavel_email || null,
      }

      if (isEditing) {
        const { error } = await supabase
          .from('fazendas')
          .update(dataToSave)
          .eq('id', id)
          .eq('empresa_id', usuario.empresa_id)
        if (error) throw error
        toast.success('Fazenda atualizada com sucesso!')
      } else {
        const { error } = await supabase.from('fazendas').insert([dataToSave])
        if (error) throw error
        toast.success('Fazenda criada com sucesso!')
      }
      navigate('/app/fazendas')
    } catch (error: any) {
      toast.error('Erro ao salvar', { description: error.message })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-96 w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/app/fazendas')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-lg">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {isEditing ? 'Editar Fazenda' : 'Nova Fazenda'}
              </h1>
              <p className="text-muted-foreground text-sm">
                Preencha os dados da propriedade rural
              </p>
            </div>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* Card: Informações Básicas */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Dados Principais
              </CardTitle>
              <CardDescription>
                Informações básicas de registro e atividade da propriedade
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-2">
                    <FormLabel>Nome da Fazenda</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Fazenda Boa Esperança" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cnpj_imobiliario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ Imobiliário</FormLabel>
                    <FormControl>
                      <Input placeholder="00.000.000/0000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inscricao_estadual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inscrição Estadual</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000.000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo_producao"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2 lg:col-span-2">
                    <FormLabel>Tipo de Produção</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Grãos, Fruticultura, Pecuária..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data_fundacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fundação</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Card: Localização */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Localização
              </CardTitle>
              <CardDescription>Endereço, coordenadas e roteiro de acesso</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-6">
                    <FormLabel>Endereço / Roteiro de Acesso</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o endereço ou roteiro detalhado para chegar à propriedade..."
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="municipio"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-1 lg:col-span-2">
                    <FormLabel>Município</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Rio Verde" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-1">
                    <FormLabel>Estado (UF)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: GO" maxLength={2} className="uppercase" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-1">
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="-17.7946" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2">
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="-50.9234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Card: Dados Produtivos e Cadastrais */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Dados Produtivos e Cadastrais
              </CardTitle>
              <CardDescription>Áreas em hectares, cadastro ambiental e certidões</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              <FormField
                control={form.control}
                name="area_total_ha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Total (ha)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min={0} placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area_produtiva_ha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Produtiva (ha)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min={0} placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numero_car"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número CAR</FormLabel>
                    <FormControl>
                      <Input placeholder="Cadastro Ambiental Rural" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nirf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIRF</FormLabel>
                    <FormControl>
                      <Input placeholder="Nº Imóvel Receita Federal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ccir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CCIR</FormLabel>
                    <FormControl>
                      <Input placeholder="Cert. Cadastro de Imóvel Rural" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Card: Contato do Responsável */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Contact className="h-5 w-5 text-primary" />
                Contato do Responsável
              </CardTitle>
              <CardDescription>Dados do proprietário ou gerente da fazenda</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="responsavel_nome"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2 lg:col-span-2">
                    <FormLabel>Nome do Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsavel_cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF do Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsavel_telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone / WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsavel_email"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2 lg:col-span-4">
                    <FormLabel>E-mail de Contato</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pb-10 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/app/fazendas')}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Salvar Fazenda
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
