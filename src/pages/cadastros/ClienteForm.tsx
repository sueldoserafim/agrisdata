import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

export default function ClienteForm() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [vendedores, setVendedores] = useState<any[]>([])

  const [formData, setFormData] = useState({
    nome: '',
    nome_fantasia: '',
    email: '',
    telefone: '',
    cnpj_cpf: '',
    limite_credito: 0,
    forma_pagamento_padrao: '',
    desconto_padrao: 0,
    vendedor_id: '',
    preset_prazo: '',
    prazo_dias: '',
    observacoes_comerciais: '',
    usuario_vinculado: '',
    acesso_portal: false,
  })

  useEffect(() => {
    if (empresa) {
      if (!isNew) {
        fetchCliente()
      }
      fetchVendedores()
    }
  }, [id, empresa])

  const fetchCliente = async () => {
    try {
      const { data, error } = await supabase.from('clientes').select('*').eq('id', id).single()

      if (error) throw error
      if (data) {
        setFormData({
          nome: data.nome || '',
          nome_fantasia: data.nome_fantasia || '',
          email: data.email || '',
          telefone: data.telefone || '',
          cnpj_cpf: data.cnpj_cpf || '',
          limite_credito: data.limite_credito || 0,
          forma_pagamento_padrao: data.forma_pagamento_padrao || '',
          desconto_padrao: data.desconto_padrao || 0,
          vendedor_id: data.vendedor_id || '',
          preset_prazo: data.preset_prazo || '',
          prazo_dias: data.prazo_dias || '',
          observacoes_comerciais: data.observacoes_comerciais || '',
          usuario_vinculado: data.usuario_vinculado || '',
          acesso_portal: data.acesso_portal || false,
        })
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar cliente',
        description: error.message,
        variant: 'destructive',
      })
      navigate('/app/clientes')
    }
  }

  const fetchVendedores = async () => {
    try {
      const { data, error } = await supabase
        .from('vendedores')
        .select('id, nome')
        .eq('empresa_id', empresa?.id)
        .is('deleted_at', null)
      if (data) setVendedores(data)
    } catch (e) {
      console.error('Erro ao carregar vendedores', e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value === 'null' ? '' : value }))
  }

  const handleCheckedChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!empresa) return

    if (!formData.preset_prazo) {
      toast({
        title: 'Erro de validação',
        description: 'O campo Preset Prazo é obrigatório.',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)

      const sanitizedCnpjCpf = formData.cnpj_cpf?.replace(/\D/g, '') || ''
      const sanitizedTelefone = formData.telefone?.replace(/\D/g, '') || null

      if (sanitizedCnpjCpf && sanitizedCnpjCpf.length > 20) {
        throw new Error(
          'O CNPJ/CPF excede o limite máximo de 20 caracteres permitidos após a formatação.',
        )
      }
      if (sanitizedTelefone && sanitizedTelefone.length > 30) {
        throw new Error(
          'O telefone excede o limite máximo de 30 caracteres permitidos após a formatação.',
        )
      }

      const payload = {
        ...formData,
        cnpj_cpf: sanitizedCnpjCpf,
        telefone: sanitizedTelefone,
        empresa_id: empresa.id,
        vendedor_id: formData.vendedor_id || null,
        limite_credito: Number(formData.limite_credito) || 0,
        desconto_padrao: Number(formData.desconto_padrao) || 0,
      }

      if (isNew) {
        const { error } = await supabase.from('clientes').insert([payload])
        if (error) throw error
        toast({ title: 'Cliente cadastrado com sucesso' })
      } else {
        const { error } = await supabase.from('clientes').update(payload).eq('id', id)
        if (error) throw error
        toast({ title: 'Cliente atualizado com sucesso' })
      }

      navigate('/app/clientes')
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar cliente',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/app/clientes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isNew ? 'Novo Cliente' : 'Editar Cliente'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Razão Social / Nome *</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                <Input
                  id="nome_fantasia"
                  name="nome_fantasia"
                  value={formData.nome_fantasia}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="cnpj_cpf">CPF/CNPJ</Label>
                <Input
                  id="cnpj_cpf"
                  name="cnpj_cpf"
                  value={formData.cnpj_cpf}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-600 text-white py-3">
            <CardTitle className="text-lg">Dados Comerciais</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="limite_credito">Limite de Crédito</Label>
                <Input
                  id="limite_credito"
                  name="limite_credito"
                  type="number"
                  step="0.01"
                  value={formData.limite_credito}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Forma de Pagamento Padrão</Label>
                <Select
                  value={formData.forma_pagamento_padrao}
                  onValueChange={(val) => handleSelectChange('forma_pagamento_padrao', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Invoice">Invoice</SelectItem>
                    <SelectItem value="Boleto">Boleto</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="Transferência">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desconto_padrao">Desconto Padrão (%)</Label>
                <Input
                  id="desconto_padrao"
                  name="desconto_padrao"
                  type="number"
                  step="0.01"
                  value={formData.desconto_padrao}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Vendedor Responsável</Label>
                <Select
                  value={formData.vendedor_id}
                  onValueChange={(val) => handleSelectChange('vendedor_id', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Nenhum</SelectItem>
                    {vendedores.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Label>
                    Preset Prazo <span className="text-red-500">*</span>
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 text-emerald-700 border-emerald-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Select
                  value={formData.preset_prazo}
                  onValueChange={(val) => handleSelectChange('preset_prazo', val)}
                >
                  <SelectTrigger className={!formData.preset_prazo ? 'border-red-300' : ''}>
                    <SelectValue placeholder="Selecione um preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10/28 (10,22)">10/28 (10,22)</SelectItem>
                    <SelectItem value="15/30 (15,30)">15/30 (15,30)</SelectItem>
                    <SelectItem value="30/60/90">30/60/90</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={formData.prazo_dias}
                  onValueChange={(val) => handleSelectChange('prazo_dias', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione os dias..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10 dias">10 dias</SelectItem>
                    <SelectItem value="15 dias">15 dias</SelectItem>
                    <SelectItem value="30 dias">30 dias</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Selecione um preset para escolher os termos de prazo
                </p>
              </div>
              <div className="space-y-2">
                <Label>Observações Comerciais</Label>
                <Textarea
                  name="observacoes_comerciais"
                  value={formData.observacoes_comerciais}
                  onChange={handleChange}
                  className="h-[120px] resize-none"
                  placeholder="Avisos importador: Porto de destino não selecionado"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6 pt-2">
              <div className="space-y-2 w-1/3">
                <Label>Usuário Vinculado (Portal)</Label>
                <Input
                  name="usuario_vinculado"
                  value={formData.usuario_vinculado}
                  onChange={handleChange}
                  placeholder="Agricola Salutaris ME"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="acesso_portal"
                  checked={formData.acesso_portal}
                  onCheckedChange={(checked) =>
                    handleCheckedChange('acesso_portal', checked as boolean)
                  }
                />
                <Label htmlFor="acesso_portal" className="font-medium cursor-pointer">
                  Acesso ao Portal
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </div>
  )
}
