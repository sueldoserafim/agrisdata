import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/components/ui/use-toast'
import { exportacaoService } from '@/services/exportacao'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Save, UploadCloud } from 'lucide-react'

const formSchema = z.object({
  container_id: z.string().optional(),
  tipo_documento: z.string().min(1, 'Tipo é obrigatório'),
  numero_documento: z.string().optional(),
  data_emissao: z.string().optional(),
  data_validade: z.string().optional(),
  status: z.string().optional(),
  observacoes: z.string().optional(),
  arquivo_url: z.string().optional(),
})

export default function DocumentoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [containers, setContainers] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo_documento: 'bl',
      status: 'pendente',
    },
  })

  useEffect(() => {
    if (!empresa?.id) return
    const loadDependencies = async () => {
      const contRes = await exportacaoService.getContainers(empresa.id)
      setContainers(contRes.data || [])

      if (id) {
        const { data } = await exportacaoService.getDocumento(id)
        if (data) {
          form.reset({
            container_id: data.container_id || undefined,
            tipo_documento: data.tipo_documento || 'bl',
            numero_documento: data.numero_documento || '',
            data_emissao: data.data_emissao || '',
            data_validade: data.data_validade || '',
            status: data.status || 'pendente',
            observacoes: data.observacoes || '',
            arquivo_url: data.arquivo_url || '',
          })
        }
      }
    }
    loadDependencies()
  }, [id, empresa?.id])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !empresa?.id) return
    const file = event.target.files[0]

    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${empresa.id}/exportacao/${fileName}`

      const { error: uploadError } = await supabase.storage.from('anexos').upload(filePath, file)
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('anexos').getPublicUrl(filePath)
      form.setValue('arquivo_url', data.publicUrl)
      toast({ title: 'Upload concluído', description: 'O arquivo foi anexado com sucesso.' })
    } catch (error: any) {
      toast({ title: 'Erro no upload', description: error.message, variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!empresa?.id) return

    setLoading(true)
    const { error } = await exportacaoService.saveDocumento({
      id: id || undefined,
      empresa_id: empresa.id,
      ...values,
      data_emissao: values.data_emissao || null,
      data_validade: values.data_validade || null,
      container_id: values.container_id || null,
    })

    setLoading(false)
    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Documento salvo com sucesso.' })
      navigate('/app/exportacao/documentos')
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/app/exportacao/documentos')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-slate-800">
          {id ? 'Editar Documento' : 'Novo Documento'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Documento</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipo_documento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Documento</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bl">Bill of Lading (BL)</SelectItem>
                          <SelectItem value="awb">Air Waybill (AWB)</SelectItem>
                          <SelectItem value="co">Certificado de Origem (CO)</SelectItem>
                          <SelectItem value="phytosanitary">Fitossanitário</SelectItem>
                          <SelectItem value="fumigation">Certificado de Fumigação</SelectItem>
                          <SelectItem value="packing_list">Packing List</SelectItem>
                          <SelectItem value="commercial_invoice">Commercial Invoice</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numero_documento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Documento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: BL-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="container_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Container Associado</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um container" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {containers.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.numero_container}
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="valido">Válido</SelectItem>
                          <SelectItem value="vencido">Vencido</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="data_emissao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Emissão</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="data_validade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Validade</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <FormLabel>Anexo</FormLabel>
                <div className="flex items-center gap-4">
                  <Input type="file" onChange={handleFileUpload} disabled={uploading} />
                  {uploading && <span className="text-sm text-slate-500">Enviando...</span>}
                </div>
                {form.getValues('arquivo_url') && (
                  <p className="text-sm text-green-600 font-medium">Arquivo anexado com sucesso!</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/app/exportacao/documentos')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || uploading}>
                  <Save className="mr-2 h-4 w-4" /> {loading ? 'Salvando...' : 'Salvar Documento'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
