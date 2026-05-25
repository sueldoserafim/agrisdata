import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { comprasService } from '@/services/compras'
import { supabase } from '@/lib/supabase/client'
import { HelpButton } from '@/components/HelpButton'

const formSchema = z.object({
  armazem_id: z.string().min(1, 'Selecione o armazém de destino'),
  quantidade: z.number().positive('Quantidade deve ser maior que zero'),
  numero_nota_fiscal: z.string().min(1, 'Número da NF-e é obrigatório'),
  numero_lote: z.string().optional(),
  data_validade: z.string().optional(),
})

export default function RecebimentoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { empresa } = useEmpresa()

  const [pedido, setPedido] = useState<any>(null)
  const [armazens, setArmazens] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (!id || !empresa?.id) return
    comprasService.getPedido(id).then((data) => {
      setPedido(data)
      setValue('quantidade', data.quantidade)
    })
    supabase
      .from('armazens')
      .select('id, nome')
      .eq('empresa_id', empresa.id)
      .then(({ data }) => setArmazens(data || []))
  }, [id, empresa?.id, setValue])

  const onSubmit = async (data: any) => {
    if (!empresa?.id || !pedido) return
    setLoading(true)
    try {
      const payload = {
        ...data,
        empresa_id: empresa.id,
        produto_id: pedido.produto_id,
        data_validade: data.data_validade || null,
        numero_lote: data.numero_lote || null,
      }
      await comprasService.receberPedido(pedido.id, payload)
      toast({ title: 'Recebimento registrado. Estoque atualizado!' })
      navigate('/app/compras')
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  if (!pedido) return <div className="p-6">Carregando...</div>

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/compras')}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold flex-1">Recebimento de Mercadoria</h1>
        <HelpButton
          title="Instruções de Recebimento"
          content={
            <p>
              Ao registrar o recebimento informando a NF-e, o sistema dará entrada automática do
              produto no Armazém escolhido, atualizando o saldo do estoque e gerando um movimento de
              entrada.
            </p>
          }
        />
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Produto Aguardado</p>
            <p className="font-semibold text-lg">{pedido.produto?.nome}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Qtd. Solicitada no Pedido</p>
            <p className="font-semibold text-lg">
              {pedido.quantidade} {pedido.produto?.unidade_medida}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Armazém de Destino</Label>
                <Select
                  onValueChange={(val) => setValue('armazem_id', val)}
                  value={watch('armazem_id')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Onde será guardado?" />
                  </SelectTrigger>
                  <SelectContent>
                    {armazens.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.armazem_id && (
                  <p className="text-sm text-destructive">{errors.armazem_id.message as string}</p>
                )}
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Quantidade Efetivamente Recebida</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register('quantidade', { valueAsNumber: true })}
                />
                {errors.quantidade && (
                  <p className="text-sm text-destructive">{errors.quantidade.message as string}</p>
                )}
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Número da NF-e</Label>
                <Input
                  {...register('numero_nota_fiscal')}
                  placeholder="Chave de acesso ou número"
                />
                {errors.numero_nota_fiscal && (
                  <p className="text-sm text-destructive">
                    {errors.numero_nota_fiscal.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Lote do Fabricante (Opcional)</Label>
                <Input {...register('numero_lote')} placeholder="Lote" />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Data de Validade (Opcional)</Label>
                <Input type="date" {...register('data_validade')} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/app/compras')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                <CheckCircle2 className="size-4 mr-2" /> Confirmar Entrada
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
