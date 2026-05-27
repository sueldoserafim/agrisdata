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
import { ArrowLeft, Save } from 'lucide-react'

const formSchema = z.object({
  numero_invoice: z.string().min(1, 'Número da Invoice é obrigatório'),
  data_emissao: z.string().optional(),
  cliente_id: z.string().optional(),
  container_id: z.string().optional(),
  incoterm: z.string().optional(),
  valor_total_usd: z.coerce.number().min(0).optional(),
  valor_total_brl: z.coerce.number().min(0).optional(),
  peso_total_kg: z.coerce.number().min(0).optional(),
  quantidade_pallets: z.coerce.number().min(0).optional(),
  status: z.string().optional(),
})

export default function InvoiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState<any[]>([])
  const [containers, setContainers] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero_invoice: '',
      status: 'rascunho',
    },
  })

  useEffect(() => {
    if (!empresa?.id) return
    const loadDependencies = async () => {
      const [cliRes, contRes] = await Promise.all([
        exportacaoService.getClientes(empresa.id),
        exportacaoService.getContainers(empresa.id),
      ])
      setClientes(cliRes.data || [])
      setContainers(contRes.data || [])

      if (id) {
        const { data } = await exportacaoService.getInvoice(id)
        if (data) {
          form.reset({
            numero_invoice: data.numero_invoice || '',
            data_emissao: data.data_emissao || '',
            cliente_id: data.cliente_id || undefined,
            container_id: data.container_id || undefined,
            incoterm: data.incoterm || undefined,
            valor_total_usd: data.valor_total_usd || 0,
            valor_total_brl: data.valor_total_brl || 0,
            peso_total_kg: data.peso_total_kg || 0,
            quantidade_pallets: data.quantidade_pallets || 0,
            status: data.status || 'rascunho',
          })
        }
      }
    }
    loadDependencies()
  }, [id, empresa?.id, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!empresa?.id) return

    setLoading(true)
    const { error } = await exportacaoService.saveInvoice({
      id: id || undefined,
      empresa_id: empresa.id,
      ...values,
      data_emissao: values.data_emissao || null,
    })

    setLoading(false)
    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Invoice salva com sucesso.' })
      navigate('/app/exportacao/invoices')
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/app/exportacao/invoices')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-slate-800">
          {id ? 'Editar Invoice' : 'Nova Invoice'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numero_invoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número da Invoice</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: INV-2023-001" {...field} />
                      </FormControl>
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
                  name="cliente_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clientes.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.nome}
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
                  name="container_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Container</FormLabel>
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
                  name="incoterm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incoterm</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fob">FOB</SelectItem>
                          <SelectItem value="cfr">CFR</SelectItem>
                          <SelectItem value="cif">CIF</SelectItem>
                          <SelectItem value="dap">DAP</SelectItem>
                          <SelectItem value="ddp">DDP</SelectItem>
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
                          <SelectItem value="rascunho">Rascunho</SelectItem>
                          <SelectItem value="emitida">Emitida</SelectItem>
                          <SelectItem value="paga">Paga</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valor_total_usd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Total (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valor_total_brl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Total (BRL)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="peso_total_kg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso Total (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantidade_pallets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade de Pallets</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/app/exportacao/invoices')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" /> {loading ? 'Salvando...' : 'Salvar Invoice'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
