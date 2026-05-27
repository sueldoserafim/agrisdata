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
  numero_booking: z.string().min(1, 'Número é obrigatório'),
  navio_id: z.string().optional(),
  porto_origem_id: z.string().optional(),
  porto_destino_id: z.string().optional(),
  data_etd: z.string().optional(),
  data_eta: z.string().optional(),
  quantidade_containeres: z.coerce.number().min(1).optional(),
  tipo_container: z.string().optional(),
  status: z.string().optional(),
  agente_maritimo: z.string().optional(),
  observacoes: z.string().optional(),
})

export default function BookingForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [navios, setNavios] = useState<any[]>([])
  const [portos, setPortos] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero_booking: '',
      tipo_container: 'dry_40',
      status: 'reservado',
    },
  })

  useEffect(() => {
    if (!empresa?.id) return
    const loadDependencies = async () => {
      const [nv, pt] = await Promise.all([
        exportacaoService.getNavios(empresa.id),
        exportacaoService.getPortos(empresa.id),
      ])
      setNavios(nv.data || [])
      setPortos(pt.data || [])

      if (id) {
        const { data } = await exportacaoService.getBooking(id)
        if (data) {
          form.reset({
            numero_booking: data.numero_booking || '',
            navio_id: data.navio_id || undefined,
            porto_origem_id: data.porto_origem_id || undefined,
            porto_destino_id: data.porto_destino_id || undefined,
            data_etd: data.data_etd || '',
            data_eta: data.data_eta || '',
            quantidade_containeres: data.quantidade_containeres || 1,
            tipo_container: data.tipo_container || 'dry_40',
            status: data.status || 'reservado',
            agente_maritimo: data.agente_maritimo || '',
            observacoes: data.observacoes || '',
          })
        }
      }
    }
    loadDependencies()
  }, [id, empresa?.id])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!empresa?.id) return
    if (
      values.data_etd &&
      values.data_eta &&
      new Date(values.data_etd) >= new Date(values.data_eta)
    ) {
      toast({
        title: 'Atenção',
        description: 'A data ETD deve ser anterior à data ETA.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    const { error } = await exportacaoService.saveBooking({
      id: id || undefined,
      empresa_id: empresa.id,
      ...values,
      data_etd: values.data_etd || null,
      data_eta: values.data_eta || null,
    })

    setLoading(false)
    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Booking salvo com sucesso.' })
      navigate('/app/exportacao/bookings')
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/app/exportacao/bookings')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-slate-800">
          {id ? 'Editar Booking' : 'Novo Booking'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numero_booking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Booking</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: BKG-2023-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="navio_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Navio</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um navio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {navios.map((n) => (
                            <SelectItem key={n.id} value={n.id}>
                              {n.nome_navio}
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
                  name="porto_origem_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porto de Origem</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione origem" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {portos.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.nome_porto}
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
                  name="porto_destino_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porto de Destino</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione destino" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {portos.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.nome_porto}
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
                  name="data_etd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data ETD (Partida)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="data_eta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data ETA (Chegada)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantidade_containeres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade de Containers</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tipo_container"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Container</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dry_20">Dry 20'</SelectItem>
                          <SelectItem value="dry_40">Dry 40'</SelectItem>
                          <SelectItem value="reefer_20">Reefer 20'</SelectItem>
                          <SelectItem value="reefer_40">Reefer 40'</SelectItem>
                          <SelectItem value="hc_40">High Cube 40'</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="reservado">Reservado</SelectItem>
                          <SelectItem value="confirmado">Confirmado</SelectItem>
                          <SelectItem value="em_transito">Em Trânsito</SelectItem>
                          <SelectItem value="concluido">Concluído</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agente_maritimo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agente Marítimo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do Agente/Companhia" {...field} />
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
                  onClick={() => navigate('/app/exportacao/bookings')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" /> {loading ? 'Salvando...' : 'Salvar Booking'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
