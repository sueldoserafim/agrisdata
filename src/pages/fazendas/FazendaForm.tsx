import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/hooks/use-toast'
import { createFazenda, getFazenda, updateFazenda, getFazendaStats } from '@/services/fazendas'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ESTADOS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]

const maskCpf = (v: string) =>
  v
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14)
const maskPhone = (v: string) =>
  v
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2')
    .slice(0, 15)
const maskCnpj = (v: string) =>
  v
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
    .slice(0, 18)

const formSchema = z
  .object({
    nome: z.string().min(3).max(150),
    municipio: z.string().min(1),
    estado: z.string().min(1),
    tipo_producao: z.string().min(1),
    cnpj_imobiliario: z.string().optional(),
    inscricao_estadual: z.string().optional(),
    numero_car: z.string().optional(),
    nirf: z.string().optional(),
    ccir: z.string().optional(),
    data_fundacao: z.string().optional(),
    area_total_ha: z.coerce.number().min(0),
    area_produtiva_ha: z.coerce.number().min(0),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    responsavel_nome: z.string().optional(),
    responsavel_cpf: z.string().optional(),
    responsavel_telefone: z.string().optional(),
    responsavel_email: z.string().email().optional().or(z.literal('')),
  })
  .refine((d) => d.area_produtiva_ha <= d.area_total_ha, {
    message: 'Incorreta',
    path: ['area_produtiva_ha'],
  })

export default function FazendaForm() {
  const { id } = useParams()
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ numTalhoes: 0, culturaPrincipal: 'N/A' })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { area_total_ha: 0, area_produtiva_ha: 0, latitude: 0, longitude: 0 },
  })

  const areaTotal = form.watch('area_total_ha') || 0
  const areaProd = form.watch('area_produtiva_ha') || 0

  useEffect(() => {
    if (id && empresa?.id) {
      getFazenda(id, empresa.id).then((data) => {
        if (data) {
          form.reset({
            ...data,
            cnpj_imobiliario: data.cnpj_imobiliario ? maskCnpj(data.cnpj_imobiliario) : undefined,
            responsavel_cpf: data.responsavel_cpf ? maskCpf(data.responsavel_cpf) : undefined,
            responsavel_telefone: data.responsavel_telefone
              ? maskPhone(data.responsavel_telefone)
              : undefined,
            area_total_ha: data.area_total_ha || 0,
            area_produtiva_ha: data.area_produtiva_ha || 0,
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            data_fundacao: data.data_fundacao || undefined,
          })
        }
      })
      getFazendaStats(id).then(setStats)
    }
  }, [id, empresa?.id])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const sanitizedValues = {
        ...values,
        cnpj_imobiliario: values.cnpj_imobiliario?.replace(/\D/g, ''),
        responsavel_cpf: values.responsavel_cpf?.replace(/\D/g, ''),
        responsavel_telefone: values.responsavel_telefone?.replace(/\D/g, ''),
      }

      if (id) await updateFazenda(id, { ...sanitizedValues, empresa_id: empresa?.id })
      else await createFazenda({ ...sanitizedValues, empresa_id: empresa?.id })
      toast({ title: 'Sucesso', description: 'Fazenda salva com sucesso!' })
      navigate('/app/fazendas')
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {id ? 'Editar Fazenda' : 'Nova Fazenda'}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="geral">
            <TabsList className="w-full">
              <TabsTrigger value="geral" className="flex-1">
                Dados Gerais
              </TabsTrigger>
              <TabsTrigger value="doc" className="flex-1">
                Documentação
              </TabsTrigger>
              <TabsTrigger value="dim" className="flex-1">
                Dimensões & Local
              </TabsTrigger>
              <TabsTrigger value="resp" className="flex-1">
                Responsável
              </TabsTrigger>
            </TabsList>

            <TabsContent value="geral" className="space-y-4 mt-4">
              <Card>
                <CardContent className="grid grid-cols-2 gap-4 pt-6">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Fazenda</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <Input disabled value={empresa?.nome || ''} />
                  </FormItem>
                  <FormField
                    control={form.control}
                    name="municipio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Município</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ESTADOS.map((e) => (
                              <SelectItem key={e} value={e}>
                                {e}
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
                    name="tipo_producao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo Produção</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {['frutas', 'vegetais', 'graos', 'cafe', 'cana', 'outro'].map((t) => (
                              <SelectItem key={t} value={t} className="capitalize">
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="doc" className="space-y-4 mt-4">
              <Card>
                <CardContent className="grid grid-cols-2 gap-4 pt-6">
                  <FormField
                    control={form.control}
                    name="cnpj_imobiliario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ/CPF do Imóvel</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => field.onChange(maskCnpj(e.target.value))}
                          />
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
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numero_car"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nº do CAR</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
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
                          <Input {...field} />
                        </FormControl>
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
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dim" className="space-y-4 mt-4">
              <Card>
                <CardContent className="grid grid-cols-2 gap-4 pt-6">
                  <FormField
                    control={form.control}
                    name="area_total_ha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área Total (ha)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
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
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Área de Preservação (ha)</FormLabel>
                    <Input disabled value={Math.max(0, areaTotal - areaProd).toFixed(2)} />
                  </FormItem>
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.000001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.000001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resp" className="space-y-4 mt-4">
              <Card>
                <CardContent className="grid grid-cols-2 gap-4 pt-6">
                  <FormField
                    control={form.control}
                    name="responsavel_nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Responsável</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
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
                          <Input
                            {...field}
                            onChange={(e) => field.onChange(maskCpf(e.target.value))}
                          />
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
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => field.onChange(maskPhone(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="responsavel_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {id && (
            <Card className="bg-muted/50 border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Resumo Automático</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-8">
                <div>
                  <p className="text-sm font-medium">Nº de Talhões</p>
                  <p className="text-3xl font-bold">{stats.numTalhoes}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Cultura Principal</p>
                  <p className="text-3xl font-bold">{stats.culturaPrincipal}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => navigate('/app/fazendas')}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Fazenda</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
