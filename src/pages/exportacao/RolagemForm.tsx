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
import { ArrowLeft, Save } from 'lucide-react'

const formSchema = z.object({
  container_id: z.string().min(1, 'Container é obrigatório'),
  booking_original_id: z.string().min(1, 'Booking original é obrigatório'),
  booking_novo_id: z.string().min(1, 'Booking novo é obrigatório'),
  motivo_rolagem: z.string().min(1, 'Motivo é obrigatório'),
  custo_rolagem_usd: z.coerce.number().min(0).optional(),
  status: z.string().optional(),
})

export default function RolagemForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [containers, setContainers] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'pendente',
      custo_rolagem_usd: 0,
    },
  })

  useEffect(() => {
    if (!empresa?.id) return
    const loadDependencies = async () => {
      const [contRes, bkRes] = await Promise.all([
        exportacaoService.getContainers(empresa.id),
        exportacaoService.getBookings(empresa.id),
      ])
      setContainers(contRes.data || [])
      setBookings(bkRes.data || [])

      if (id) {
        const { data } = await exportacaoService.getRolagem(id)
        if (data) {
          form.reset({
            container_id: data.container_id || '',
            booking_original_id: data.booking_original_id || '',
            booking_novo_id: data.booking_novo_id || '',
            motivo_rolagem: data.motivo_rolagem || '',
            custo_rolagem_usd: data.custo_rolagem_usd || 0,
            status: data.status || 'pendente',
          })
        }
      }
    }
    loadDependencies()
  }, [id, empresa?.id])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!empresa?.id) return

    if (values.booking_original_id === values.booking_novo_id) {
      toast({
        title: 'Atenção',
        description: 'O Booking de destino deve ser diferente do original.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    const { error } = await exportacaoService.saveRolagem({
      id: id || undefined,
      empresa_id: empresa.id,
      ...values,
    })

    if (!error && !id) {
      const { data: bkg } = await supabase
        .from('bookings')
        .select('numero_booking')
        .eq('id', values.booking_original_id)
        .single()
      const { data: admins } = await supabase
        .from('usuarios')
        .select('id')
        .eq('empresa_id', empresa.id)
        .in('perfil', ['admin', 'gerente'])
      if (admins) {
        const alerts = admins.map((a) => ({
          empresa_id: empresa.id,
          usuario_id: a.id,
          titulo: 'Rolagem de Container Realizada',
          descricao: `Um container foi rolado do booking original ${bkg?.numero_booking}. Motivo: ${values.motivo_rolagem}. Custo: $${values.custo_rolagem_usd}`,
          tipo: 'alerta',
          lido: false,
        }))
        await supabase.from('alertas').insert(alerts)
      }

      // Update container booking
      await supabase
        .from('containers')
        .update({ booking_id: values.booking_novo_id })
        .eq('id', values.container_id)
    }

    setLoading(false)
    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Rolagem registrada com sucesso.' })
      navigate('/app/exportacao/rolagem')
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/app/exportacao/rolagem')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-slate-800">
          {id ? 'Editar Rolagem' : 'Nova Rolagem'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Rolagem</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="container_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Container</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o container" />
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
                  name="motivo_rolagem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo da Rolagem</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um motivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="atraso_navio">Atraso do Navio</SelectItem>
                          <SelectItem value="falta_espaco">Falta de Espaço</SelectItem>
                          <SelectItem value="problema_documentacao">
                            Problema na Documentação
                          </SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="booking_original_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Original</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o booking" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bookings.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.numero_booking}
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
                  name="booking_novo_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Destino (Novo)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o booking" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bookings.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.numero_booking}
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
                  name="custo_rolagem_usd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custo da Rolagem (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
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
                          <SelectItem value="aprovada">Aprovada</SelectItem>
                          <SelectItem value="executada">Executada</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/app/exportacao/rolagem')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" /> {loading ? 'Salvando...' : 'Salvar Rolagem'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
