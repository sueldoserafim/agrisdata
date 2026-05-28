import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const ACESSOS_MAP: Record<string, { id: string; label: string }[]> = {
  produtor: [
    { id: 'extrato', label: 'Extrato de Conta Corrente' },
    { id: 'entregas', label: 'Histórico de Entregas' },
    { id: 'financeiro', label: 'Pagamentos e Adiantamentos' }
  ],
  cliente: [
    { id: 'invoices', label: 'Invoices' },
    { id: 'documentos', label: 'Documentos de Exportação' },
    { id: 'tracking', label: 'Tracking de Containers' }
  ],
  fornecedor: [
    { id: 'pedidos', label: 'Pedidos de Compra' },
    { id: 'pagamentos', label: 'Pagamentos Pendentes' }
  ],
  despachante: [
    { id: 'containers', label: 'Containers Pendentes' },
    { id: 'documentos', label: 'Documentação Necessária' }
  ]
}

interface PortaisExternosFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function PortaisExternosForm({ onClose, onSuccess }: PortaisExternosFormProps) {
  const { empresa } = useEmpresa()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [tipo, setTipo] = useState<string>('')
  const [entidadeId, setEntidadeId] = useState<string>('')
  const [acessos, setAcessos] = useState<string[]>([])
  
  const [clientes, setClientes] = useState<any[]>([])
  const [fornecedores, setFornecedores] = useState<any[]>([])

  useEffect(() => {
    if (!empresa || !tipo) return
    const fetchEntities = async () => {
      setFetching(true)
      try {
        if (tipo === 'cliente') {
          if (clientes.length === 0) {
            const { data } = await supabase.from('clientes').select('id, nome').eq('empresa_id', empresa.id)
            setClientes(data || [])
          }
        } else {
          if (fornecedores.length === 0) {
            const { data } = await supabase.from('fornecedores').select('id, nome').eq('empresa_id', empresa.id)
            setFornecedores(data || [])
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setFetching(false)
      }
    }
    fetchEntities()
    setEntidadeId('')
    setAcessos(ACESSOS_MAP[tipo]?.map(a => a.id) || [])
  }, [tipo, empresa])

  const handleToggleAcesso = (id: string) => {
    setAcessos(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!empresa || !tipo || !entidadeId) return

    if (acessos.length === 0) {
      toast.error('Selecione pelo menos um acesso permitido.')
      return
    }

    try {
      setLoading(true)
      const tokenStr = crypto.randomUUID().replace(/-/g, '') + Math.random().toString(36).substring(2, 10)
      
      const { error } = await supabase.from('portal_tokens').insert({
        empresa_id: empresa.id,
        entidade_tipo: tipo,
        entidade_id: entidadeId,
        token: tokenStr,
        acessos_permitidos: acessos,
        ativo: true
      })

      if (error) throw error
      
      toast.success('Link de acesso gerado com sucesso!')
      onSuccess()
    } catch (error: any) {
      toast.error('Erro ao gerar acesso: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getOptions = () => {
    if (tipo === 'cliente') return clientes
    return fornecedores
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gerar Acesso Externo</DialogTitle>
          <DialogDescription>
            Crie um link seguro para compartilhar informações restritas com parceiros externos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Tipo de Portal</Label>
            <Select value={tipo} onValueChange={setTipo} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="produtor">Produtor</SelectItem>
                <SelectItem value="cliente">Cliente</SelectItem>
                <SelectItem value="fornecedor">Fornecedor</SelectItem>
                <SelectItem value="despachante">Despachante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {tipo && (
            <div className="space-y-2">
              <Label>Selecione a Entidade</Label>
              <Select value={entidadeId} onValueChange={setEntidadeId} required disabled={fetching}>
                <SelectTrigger>
                  <SelectValue placeholder={fetching ? "Carregando..." : "Selecione..."} />
                </SelectTrigger>
                <SelectContent>
                  {getOptions().map(opt => (
                    <SelectItem key={opt.id} value={opt.id}>{opt.nome}</SelectItem>
                  ))}
                  {getOptions().length === 0 && !fetching && (
                    <div className="p-2 text-sm text-muted-foreground">Nenhum registro encontrado.</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {tipo && (
            <div className="space-y-3">
              <Label>Acessos Permitidos</Label>
              <div className="bg-slate-50 border rounded-md p-4 space-y-3">
                {ACESSOS_MAP[tipo]?.map(acc => (
                  <div key={acc.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={acc.id} 
                      checked={acessos.includes(acc.id)}
                      onCheckedChange={() => handleToggleAcesso(acc.id)}
                    />
                    <label htmlFor={acc.id} className="text-sm font-medium leading-none cursor-pointer">
                      {acc.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !tipo || !entidadeId}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Gerar Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
