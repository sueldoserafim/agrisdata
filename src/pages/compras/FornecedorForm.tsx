import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { comprasService } from '@/services/compras'

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function FornecedorForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { empresa } = useEmpresa()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (id && id !== 'new') {
      loadData()
    }
  }, [id])

  async function loadData() {
    try {
      const data = await comprasService.getFornecedor(id!)
      reset({
        nome: data.nome,
        cnpj: data.cnpj || '',
        email: data.email || '',
        telefone: data.telefone || '',
      })
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!empresa?.id) return
    setLoading(true)
    try {
      const payload = {
        ...data,
        id: id !== 'new' ? id : undefined,
        empresa_id: empresa.id,
      }
      await comprasService.saveFornecedor(payload)
      toast({ title: 'Fornecedor salvo com sucesso!' })
      navigate('/app/compras/fornecedores')
    } catch (error: any) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/compras/fornecedores')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {id === 'new' ? 'Novo Fornecedor' : 'Editar Fornecedor'}
        </h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Nome / Razão Social *</Label>
              <Input {...register('nome')} placeholder="Ex: Agro Insumos S/A" />
              {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>CNPJ / CPF</Label>
              <Input {...register('cnpj')} placeholder="00.000.000/0000-00" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input type="email" {...register('email')} placeholder="contato@empresa.com" />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input {...register('telefone')} placeholder="(00) 00000-0000" />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" /> Salvar Fornecedor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
