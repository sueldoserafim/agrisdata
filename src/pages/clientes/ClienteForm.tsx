import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { getCliente, saveCliente, checkClienteDuplicado } from '@/services/clientes'
import { clienteSchema, type ClienteFormValues } from './schema'
import { ToastAction } from '@/components/ui/toast'
import { ClienteCore } from './components/ClienteCore'
import { ClienteEnderecos } from './components/ClienteEnderecos'
import { ClienteContatos } from './components/ClienteContatos'
import { ClienteBancos } from './components/ClienteBancos'
import { ClienteDocumentos } from './components/ClienteDocumentos'
import { ClienteHistorico } from './components/ClienteHistorico'
import { supabase } from '@/lib/supabase/client'

export default function ClienteForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isFetchingCnpj, setIsFetchingCnpj] = useState(false)
  const lastFetchedCnpj = useRef<string>('')

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: '',
      nome_fantasia: '',
      cnpj_cpf: '',
      email: '',
      telefone: '',
      tipo_cliente: 'Nacional',
      tipo_pessoa: 'PJ',
      indicador_ie: '1',
      inscricao_estadual: '',
      inscricao_municipal: '',
      vendedor_id: '',
      limite_credito: 0,
      acesso_portal: false,
      enderecos: [],
      contatos: [],
      bancos: [],
      documentos: [],
    },
  })

  // Visual validation indicator for required fields
  useEffect(() => {
    const timer = setTimeout(() => {
      const labels = document.querySelectorAll('label')
      labels.forEach((label) => {
        const text = label.textContent || ''
        const normalizedText = text.replace('*', '').trim()
        if (
          ['Nome', 'Nome / Razão Social', 'CNPJ/CPF', 'CNPJ / CPF', 'Tipo de Pessoa'].includes(
            normalizedText,
          )
        ) {
          if (!label.querySelector('.text-destructive')) {
            const span = document.createElement('span')
            span.className = 'text-destructive ml-1'
            span.textContent = '*'
            label.appendChild(span)
          }
        }
      })
    }, 100)
    return () => clearTimeout(timer)
  }, [form.watch('tipo_pessoa')])

  useEffect(() => {
    if (id && empresa) {
      getCliente(id).then((data) => {
        form.reset({
          ...data,
          enderecos: data.enderecos || [],
          contatos: data.contatos || [],
          bancos: data.bancos || [],
          documentos: data.documentos || [],
        })
      })
    }
  }, [id, empresa, form])

  const handleSearchCnpj = async (force = false) => {
    const currentCnpj = form.getValues('cnpj_cpf')
    const cleanCnpj = currentCnpj?.replace(/\D/g, '') || ''

    if (cleanCnpj.length !== 14) {
      toast({
        title: 'CNPJ Inválido',
        description: 'Digite um CNPJ válido com 14 dígitos para buscar.',
        variant: 'destructive',
      })
      return
    }

    if (!force && cleanCnpj === lastFetchedCnpj.current) {
      return
    }

    setIsFetchingCnpj(true)
    try {
      let data
      try {
        const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`)
        if (!res.ok) throw new Error('Failed to fetch')
        data = await res.json()
      } catch (err: any) {
        const { data: edgeData, error } = await supabase.functions.invoke('fetch-cnpj', {
          body: { cnpj: cleanCnpj },
        })
        if (error || !edgeData) {
          throw new Error('Serviço temporariamente indisponível. Preencha os dados manualmente.')
        }
        data = edgeData
      }

      form.setValue('nome', data.razao_social || '', { shouldValidate: true })
      form.setValue('nome_fantasia', data.nome_fantasia || data.razao_social || '', {
        shouldValidate: true,
      })

      const logradouroPrefix = data.descricao_tipo_de_logradouro
        ? `${data.descricao_tipo_de_logradouro} `
        : ''
      const logradouroFull = `${logradouroPrefix}${data.logradouro || ''}`.trim()

      const enderecos = form.getValues('enderecos') || []
      const hasFaturamentoIndex = enderecos.findIndex((e: any) => e.tipo_endereco === 'Faturamento')

      const newEndereco = {
        tipo_endereco: 'Faturamento',
        logradouro: logradouroFull,
        numero: data.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        cidade: data.municipio || '',
        estado: data.uf || '',
        cep: data.cep?.replace(/\D/g, '') || '',
        pais: 'Brasil',
        receiver: data.razao_social || '',
      }

      if (hasFaturamentoIndex === -1) {
        form.setValue('enderecos', [...enderecos, newEndereco], { shouldValidate: true })
      } else {
        const updatedEnderecos = [...enderecos]
        updatedEnderecos[hasFaturamentoIndex] = {
          ...updatedEnderecos[hasFaturamentoIndex],
          ...newEndereco,
        }
        form.setValue('enderecos', updatedEnderecos, { shouldValidate: true })
      }

      let indicador_ie = '9'
      if (data.inscricao_estadual && data.inscricao_estadual.trim() !== '') {
        indicador_ie = '1'
        form.setValue('inscricao_estadual', data.inscricao_estadual, { shouldValidate: true })
      }
      form.setValue('indicador_ie', indicador_ie, { shouldValidate: true })

      toast({
        title: 'CNPJ Encontrado',
        description: 'Os dados foram preenchidos automaticamente.',
      })
      lastFetchedCnpj.current = cleanCnpj
    } catch (err: any) {
      toast({
        title: 'Erro na busca de CNPJ',
        description: err.message,
        variant: 'destructive',
      })
      lastFetchedCnpj.current = cleanCnpj
    } finally {
      setIsFetchingCnpj(false)
    }
  }

  const onSubmit = async (values: ClienteFormValues) => {
    if (!empresa) return
    setLoading(true)
    try {
      // Data Sanitization Engine
      const sanitizedCnpjCpf = values.cnpj_cpf?.replace(/\D/g, '') || ''
      const sanitizedTelefone = values.telefone?.replace(/\D/g, '') || null

      if (sanitizedCnpjCpf && sanitizedCnpjCpf.length > 20) {
        throw new Error(
          'O CNPJ/CPF excede o limite máximo de 20 caracteres permitidos após a formatação.',
        )
      }
      if (sanitizedTelefone && sanitizedTelefone.length > 30) {
        throw new Error(
          'O telefone excede o limite máximo de 30 caracteres permitidos após a formatação.',
        )
      }

      const cleanValues = { ...values } as Record<string, any>
      Object.keys(cleanValues).forEach((key) => {
        if (cleanValues[key] === '') {
          cleanValues[key] = null
        }
      })

      const sanitizedValues = {
        ...cleanValues,
        cnpj_cpf: sanitizedCnpjCpf,
        telefone: sanitizedTelefone,
        enderecos:
          values.enderecos?.map((endereco: any) => ({
            ...endereco,
            cep: endereco.cep?.replace(/\D/g, '') || null,
          })) || [],
        contatos:
          values.contatos?.map((contato: any) => ({
            ...contato,
            telefone: contato.telefone?.replace(/\D/g, '') || null,
            whatsapp: contato.whatsapp?.replace(/\D/g, '') || null,
          })) || [],
      }

      await saveCliente(empresa.id, id || null, sanitizedValues)
      toast({ title: 'Sucesso', description: 'Cliente salvo com sucesso.' })
      navigate('/app/clientes')
    } catch (error: any) {
      toast({ title: 'Erro ao salvar cliente', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app/clientes')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {id ? 'Editar Cliente' : 'Novo Cliente'}
          </h1>
          {isFetchingCnpj && (
            <span className="text-sm text-muted-foreground animate-pulse flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Buscando dados do CNPJ...
            </span>
          )}
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Salvar Cliente
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <Tabs defaultValue="core" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="core"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3"
              >
                Principal
              </TabsTrigger>
              <TabsTrigger
                value="enderecos"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3"
              >
                Endereços
              </TabsTrigger>
              <TabsTrigger
                value="contatos"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3"
              >
                Contatos
              </TabsTrigger>
              <TabsTrigger
                value="bancos"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3"
              >
                Contas Bancárias
              </TabsTrigger>
              <TabsTrigger
                value="documentos"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3"
              >
                Documentos
              </TabsTrigger>
              {id && (
                <TabsTrigger
                  value="historico"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3"
                >
                  Histórico
                </TabsTrigger>
              )}
            </TabsList>

            <div className="mt-6 bg-white p-6 rounded-lg border shadow-sm">
              <TabsContent value="core" className="m-0">
                <ClienteCore
                  form={form}
                  onSearchCnpj={handleSearchCnpj}
                  isFetchingCnpj={isFetchingCnpj}
                />
              </TabsContent>
              <TabsContent value="enderecos" className="m-0">
                <ClienteEnderecos form={form} />
              </TabsContent>
              <TabsContent value="contatos" className="m-0">
                <ClienteContatos form={form} />
              </TabsContent>
              <TabsContent value="bancos" className="m-0">
                <ClienteBancos form={form} />
              </TabsContent>
              <TabsContent value="documentos" className="m-0">
                <ClienteDocumentos form={form} clienteId={id} />
              </TabsContent>
              {id && (
                <TabsContent value="historico" className="m-0">
                  <ClienteHistorico clienteId={id} />
                </TabsContent>
              )}
            </div>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}
