import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'

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
import { useEmpresa } from '@/hooks/use-empresa'
import { comprasService } from '@/services/compras'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'

const formSchema = z.object({
  requisicao_id: z.string().uuid('Selecione uma requisição válida'),
  prazo_respostas: z.string().refine((val) => new Date(val) > new Date(), {
    message: 'A data deve ser no futuro',
  }),
})

export default function CotacaoForm() {
  const { empresa } = useEmpresa()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [requisicoes, setRequisicoes] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requisicao_id: '',
      prazo_respostas: '',
    },
  })

  useEffect(() => {
    if (empresa?.id) {
      loadRequisicoes()
    }
  }, [empresa?.id])

  async function loadRequisicoes() {
    try {
      const { data, error } = await supabase
        .from('compras_requisicao')
        .select('*')
        .eq('empresa_id', empresa!.id)
        .eq('status', 'aprovada')
        .eq('pedido_gerado', false)
        .is('deleted_at', null)
      if (error) throw error
      setRequisicoes(data || [])
    } catch (err: any) {
      toast({
        title: 'Erro ao carregar requisições',
        description: err.message,
        variant: 'destructive',
      })
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = await comprasService.createCotacao({
        empresa_id: empresa!.id,
        requisicao_id: values.requisicao_id,
        prazo_respostas: values.prazo_respostas,
        status: 'aberta',
      })
      toast({ title: 'Cotação criada com sucesso!' })
      navigate(`/app/compras/cotacoes/${data.id}`)
    } catch (err: any) {
      toast({
        title: 'Erro',
        description: err.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Cotação</h1>
          <p className="text-muted-foreground mt-2">
            Inicie um processo de cotação para uma requisição aprovada.
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="requisicao_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solicitação de Origem</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma requisição aprovada..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {requisicoes.map((req) => (
                        <SelectItem key={req.id} value={req.id}>
                          {req.numero_requisicao} - {req.justificativa}
                        </SelectItem>
                      ))}
                      {requisicoes.length === 0 && (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          Nenhuma requisição pendente.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prazo_respostas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo para Respostas</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} min={format(new Date(), 'yyyy-MM-dd')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Criar Cotação
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
