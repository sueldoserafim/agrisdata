import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { getCliente, saveCliente } from '@/services/clientes'
import { clienteSchema, type ClienteFormValues } from './schema'
import { ClienteCore } from './components/ClienteCore'
import { ClienteEnderecos } from './components/ClienteEnderecos'
import { ClienteContatos } from './components/ClienteContatos'
import { ClienteBancos } from './components/ClienteBancos'
import { ClienteDocumentos } from './components/ClienteDocumentos'

export default function ClienteForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

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

  const onSubmit = async (values: ClienteFormValues) => {
    if (!empresa) return
    setLoading(true)
    try {
      await saveCliente(empresa.id, id || null, values)
      toast({ title: 'Sucesso', description: 'Cliente salvo com sucesso.' })
      navigate('/app/clientes')
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
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
            </TabsList>

            <div className="mt-6 bg-white p-6 rounded-lg border shadow-sm">
              <TabsContent value="core" className="m-0">
                <ClienteCore form={form} />
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
                <ClienteDocumentos form={form} />
              </TabsContent>
            </div>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}
