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

const formSchema = z
  .object({
    booking_id: z.string().optional(),
    numero_container: z
      .string()
      .min(1, 'Número é obrigatório')
      .regex(/^[A-Z0-9]+$/, 'Apenas letras e números'),
    selo: z.string().optional(),
    tara_kg: z.coerce.number().min(0).optional(),
    peso_liquido_kg: z.coerce.number().min(0).optional(),
    temperatura_configurada: z.coerce.number().optional(),
    status: z.string().optional(),
    aprovador_1_id: z.string().optional(),
    aprovador_2_id: z.string().optional(),
    romaneio_ids: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      return true
    },
    { message: 'Erro de validação' },
  )

export default function ContainerForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [bookings, setBookings] = useState<any[]>([])
  const [romaneios, setRomaneios] = useState<any[]>([])
  const [aprovadores, setAprovadores] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero_container: '',
      selo: '',
      tara_kg: 0,
      peso_liquido_kg: 0,
      status: 'aguardando',
      romaneio_ids: [],
    },
  })

  const { watch, setValue } = form
  const tara = watch('tara_kg') || 0
  const selectedRomaneios = watch('romaneio_ids') || []

  const pesoBrutoCalculado = selectedRomaneios.reduce((acc, rid) => {
    const rom = romaneios.find((r) => r.id === rid)
    return acc + (rom?.peso_total_kg || 0)
  }, tara)

  useEffect(() => {
    if (!empresa?.id) return
    const loadDependencies = async () => {
      const [bk, roms, users] = await Promise.all([
        exportacaoService.getBookings(empresa.id),
        exportacaoService.getRomaneiosDisponiveis(empresa.id, id),
        exportacaoService.getUsuariosAprovadores(empresa.id),
      ])
      setBookings(bk.data || [])
      setRomaneios(roms.data || [])
      setAprovadores(users.data || [])

      if (id) {
        const { data } = await exportacaoService.getContainer(id)
        if (data) {
          form.reset({
            booking_id: data.booking_id || undefined,
            numero_container: data.numero_container || '',
            selo: data.selo || '',
            tara_kg: data.tara_kg || 0,
            peso_liquido_kg: data.peso_liquido_kg || 0,
            temperatura_configurada: data.temperatura_configurada || undefined,
            status: data.status || 'aguardando',
            aprovador_1_id: data.aprovador_1_id || undefined,
            aprovador_2_id: data.aprovador_2_id || undefined,
            romaneio_ids: data.romaneio_ids || [],
          })
        }
      }
    }
    loadDependencies()
  }, [id, empresa?.id])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!empresa?.id) return
    if (values.peso_liquido_kg && values.peso_liquido_kg >= pesoBrutoCalculado) {
      toast({
        title: 'Erro',
        description: 'Peso líquido deve ser menor que o Peso Bruto',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    const { error } = await exportacaoService.saveContainer({
      id: id || undefined,
      empresa_id: empresa.id,
      ...values,
      peso_bruto_kg: pesoBrutoCalculado,
    })

    setLoading(false)
    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Container salvo com sucesso.' })
      navigate('/app/exportacao/containers')
    }
  }

  const toggleRomaneio = (romaneioId: string) => {
    const current = new Set(selectedRomaneios)
    if (current.has(romaneioId)) current.delete(romaneioId)
    else current.add(romaneioId)
    setValue('romaneio_ids', Array.from(current))
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/app/exportacao/containers')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-slate-800">
          {id ? 'Editar Container' : 'Novo Container'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Container</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="booking_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Associado</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um booking" />
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
                  name="numero_container"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Container</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: ABCD1234567"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="selo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Selo</FormLabel>
                      <FormControl>
                        <Input placeholder="Selo de lacre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="temperatura_configurada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperatura (Reefer) ºC</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="Ex: -2.5" {...field} />
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="aguardando">Aguardando</SelectItem>
                          <SelectItem value="gate_in">Gate In</SelectItem>
                          <SelectItem value="embarcado">Embarcado</SelectItem>
                          <SelectItem value="em_transito">Em Trânsito</SelectItem>
                          <SelectItem value="desembarcado">Desembarcado</SelectItem>
                          <SelectItem value="entregue">Entregue</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-lg font-medium mb-4">Pesos e Romaneios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="tara_kg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tara (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="peso_liquido_kg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso Líquido Declarado (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel>Romaneios Vinculados</FormLabel>
                  <div className="border rounded-md p-4 space-y-2 max-h-48 overflow-y-auto bg-slate-50">
                    {romaneios.length === 0 && (
                      <p className="text-sm text-slate-500">Nenhum romaneio disponível.</p>
                    )}
                    {romaneios.map((r) => (
                      <label
                        key={r.id}
                        className="flex items-center gap-2 cursor-pointer p-2 hover:bg-slate-100 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRomaneios.includes(r.id)}
                          onChange={() => toggleRomaneio(r.id)}
                          className="rounded border-slate-300"
                        />
                        <span className="text-sm font-medium">{r.numero_romaneio}</span>
                        <span className="text-xs text-slate-500">
                          ({r.peso_total_kg} kg | {r.total_pallets} pallets)
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-primary mt-2">
                    Peso Bruto Calculado: {pesoBrutoCalculado.toLocaleString()} kg
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-lg font-medium mb-4">Checklist Logístico (GO/NO-GO)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="aprovador_1_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aprovador 1 (Packing)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {aprovadores.map((a) => (
                              <SelectItem key={a.id} value={a.id}>
                                {a.nome}
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
                    name="aprovador_2_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aprovador 2 (Logística)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {aprovadores.map((a) => (
                              <SelectItem key={a.id} value={a.id}>
                                {a.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/app/exportacao/containers')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" /> {loading ? 'Salvando...' : 'Salvar Container'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
