import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

const formSchema = z.object({
  data_perda: z.string().min(1, 'Data é obrigatória'),
  quantidade_perdida: z.coerce.number().min(1, 'Quantidade deve ser maior que zero'),
  tipo_perda: z.enum([
    'pragas',
    'doencas',
    'estresse_hidrico',
    'estresse_termico',
    'falha_germinacao',
    'outro',
  ]),
  motivo: z.string().optional(),
})

interface PerdaEstufaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loteId: string
  onSaved: () => void
}

export default function PerdaEstufaModal({
  open,
  onOpenChange,
  loteId,
  onSaved,
}: PerdaEstufaModalProps) {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data_perda: new Date().toISOString().split('T')[0],
      quantidade_perdida: 0,
      tipo_perda: 'falha_germinacao',
      motivo: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    const { data: userData } = await supabase.auth.getUser()

    const payload = {
      empresa_id: empresa!.id,
      lote_muda_id: loteId,
      ...values,
      responsavel_id: userData?.user?.id || null,
    }

    const { error } = await supabase.from('perdas_estufa').insert(payload)

    if (error) {
      toast({
        title: 'Erro ao registrar perda',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Perda Registrada',
        description: 'O estoque do lote foi atualizado automaticamente.',
      })
      form.reset()
      onSaved()
      onOpenChange(false)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Mortalidade/Perda</DialogTitle>
          <DialogDescription>
            A quantidade informada será descontada das mudas vivas do lote selecionado.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_perda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Evento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantidade_perdida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade de Mudas</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo_perda"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Motivo Principal</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="falha_germinacao">Falha na Germinação</SelectItem>
                        <SelectItem value="pragas">Pragas</SelectItem>
                        <SelectItem value="doencas">Doenças</SelectItem>
                        <SelectItem value="estresse_hidrico">Estresse Hídrico</SelectItem>
                        <SelectItem value="estresse_termico">Estresse Térmico</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motivo"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Detalhes / Observações</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva os detalhes da perda..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Confirmar Baixa'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
