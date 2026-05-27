import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { startOfDay } from 'date-fns'

const schema = z.object({
  cliente_id: z.string().optional(),
  data_prevista_carregamento: z.string().refine((val) => {
    if (!val) return true
    const selectedDate = startOfDay(new Date(val))
    const today = startOfDay(new Date())
    return selectedDate >= today
  }, 'Data prevista não pode ser anterior a hoje.'),
  observacoes: z.string().optional(),
})

export default function RomaneioForm() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [clientes, setClientes] = useState<any[]>([])

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      cliente_id: 'mock-1',
      data_prevista_carregamento: '',
      observacoes: '',
    },
  })

  useEffect(() => {
    if (empresa?.id) {
      supabase
        .from('clientes')
        .select('*')
        .eq('empresa_id', empresa.id)
        .then(({ data }) => setClientes(data || []))
    }
  }, [empresa?.id])

  const onSubmit = async (values: any) => {
    if (!empresa?.id) return
    const payload = {
      empresa_id: empresa.id,
      cliente_id: values.cliente_id === 'mock-1' ? null : values.cliente_id,
      data_prevista_carregamento: values.data_prevista_carregamento || null,
      observacoes: values.observacoes,
    }

    const { data, error } = await supabase.from('romaneios_venda').insert(payload).select().single()
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Romaneio criado com sucesso!' })
      navigate(`/app/packing/romaneios/${data.id}`)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Novo Romaneio de Venda</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cliente_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mock-1">Sem Cliente Especificado</SelectItem>
                        {clientes.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data_prevista_carregamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Prevista de Carregamento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    {form.formState.errors.data_prevista_carregamento && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.data_prevista_carregamento.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detalhes logísticos..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-4">
                <Button type="submit">Salvar Romaneio</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
