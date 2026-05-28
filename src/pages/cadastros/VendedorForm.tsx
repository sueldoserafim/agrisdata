import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function VendedorForm() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf_cnpj: '',
  })

  useEffect(() => {
    if (!isNew && empresa) {
      fetchVendedor()
    }
  }, [id, empresa])

  const fetchVendedor = async () => {
    try {
      const { data, error } = await supabase.from('vendedores').select('*').eq('id', id).single()

      if (error) throw error
      if (data) {
        setFormData({
          nome: data.nome || '',
          email: data.email || '',
          telefone: data.telefone || '',
          cpf_cnpj: data.cpf_cnpj || '',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar vendedor',
        description: error.message,
        variant: 'destructive',
      })
      navigate('/app/vendedores')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!empresa) return

    try {
      setLoading(true)

      const payload = {
        ...formData,
        empresa_id: empresa.id,
      }

      if (isNew) {
        const { error } = await supabase.from('vendedores').insert([payload])
        if (error) throw error
        toast({ title: 'Vendedor cadastrado com sucesso' })
      } else {
        const { error } = await supabase.from('vendedores').update(payload).eq('id', id)
        if (error) throw error
        toast({ title: 'Vendedor atualizado com sucesso' })
      }

      navigate('/app/vendedores')
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar vendedor',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/app/vendedores">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isNew ? 'Novo Vendedor' : 'Editar Vendedor'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Vendedor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
              <Input
                id="cpf_cnpj"
                name="cpf_cnpj"
                value={formData.cpf_cnpj}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
