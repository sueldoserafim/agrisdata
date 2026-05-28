import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useEmpresa } from '@/hooks/use-empresa'

interface PortalTokenFormProps {
  onClose: () => void
  onSuccess: () => void
}

const PERMISSOES_MAP: Record<string, { id: string; label: string }[]> = {
  produtor: [
    { id: 'extrato', label: 'Extrato de Conta Corrente' },
    { id: 'entregas', label: 'Histórico de Entregas' },
    { id: 'pagamentos', label: 'Pagamentos' },
  ],
  cliente: [
    { id: 'invoices', label: 'Invoices' },
    { id: 'containers', label: 'Tracking de Containers' },
    { id: 'documentos', label: 'Documentos de Exportação' },
  ],
  fornecedor: [
    { id: 'pedidos', label: 'Pedidos de Compra' },
    { id: 'pagamentos', label: 'Previsão de Pagamentos' },
  ],
  despachante: [
    { id: 'containers', label: 'Containers Ativos' },
    { id: 'documentos', label: 'Documentos Pendentes' },
  ],
}

export default function PortalTokenForm({ onClose, onSuccess }: PortalTokenFormProps) {
  const { empresa } = useEmpresa()
  const [saving, setSaving] = useState(false)
  const [tipo, setTipo] = useState<string>('produtor')
  const [entidades, setEntidades] = useState<any[]>([])
  const [entidadeId, setEntidadeId] = useState<string>('')
  const [diasValidade, setDiasValidade] = useState('90')
  const [permissoesSelecionadas, setPermissoesSelecionadas] = useState<string[]>([])

  useEffect(() => {
    setEntidadeId('')
    setPermissoesSelecionadas(PERMISSOES_MAP[tipo].map((p) => p.id))
    fetchEntidades(tipo)
  }, [tipo])

  const fetchEntidades = async (selectedTipo: string) => {
    if (!empresa?.id) return
    let table = ''

    if (selectedTipo === 'produtor' || selectedTipo === 'fornecedor') table = 'fornecedores'
    if (selectedTipo === 'cliente') table = 'clientes'
    if (selectedTipo === 'despachante') table = 'fornecedores'

    if (!table) return

    const { data } = await supabase
      .from(table)
      .select('id, nome')
      .eq('empresa_id', empresa.id)
      .order('nome')
    setEntidades(data || [])
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!entidadeId || !empresa?.id) return

    setSaving(true)
    const entidadeSelecionada = entidades.find((e) => e.id === entidadeId)

    const randomBuffer = new Uint8Array(24)
    crypto.getRandomValues(randomBuffer)
    const rawToken = Array.from(randomBuffer)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    const expiration = new Date()
    expiration.setDate(expiration.getDate() + parseInt(diasValidade))

    const { error } = await supabase.from('portal_tokens').insert({
      empresa_id: empresa.id,
      entidade_tipo: tipo,
      entidade_id: entidadeId,
      nome_entidade: entidadeSelecionada?.nome || 'Desconhecido',
      token: rawToken,
      data_expiracao: expiration.toISOString(),
      acessos_permitidos: permissoesSelecionadas,
    })

    if (error) {
      toast.error('Erro ao gerar token', { description: error.message })
      setSaving(false)
    } else {
      toast.success('Acesso gerado com sucesso!')
      onSuccess()
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Gerar Acesso Externo</DialogTitle>
            <DialogDescription>
              Crie um link seguro para parceiros acessarem o portal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Tipo de Portal</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produtor">Produtor</SelectItem>
                  <SelectItem value="cliente">Cliente Internacional</SelectItem>
                  <SelectItem value="fornecedor">Fornecedor Geral</SelectItem>
                  <SelectItem value="despachante">Despachante / Aduaneiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Selecionar Parceiro</Label>
              <Select value={entidadeId} onValueChange={setEntidadeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {entidades.map((ent) => (
                    <SelectItem key={ent.id} value={ent.id}>
                      {ent.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Validade (Dias)</Label>
              <Input
                type="number"
                value={diasValidade}
                onChange={(e) => setDiasValidade(e.target.value)}
                min="1"
                max="365"
              />
            </div>

            <div className="grid gap-2 border rounded-md p-3 mt-2">
              <Label className="mb-2">Permissões Habilitadas no Portal</Label>
              <div className="space-y-2">
                {PERMISSOES_MAP[tipo]?.map((perm) => (
                  <div key={perm.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`perm-${perm.id}`}
                      checked={permissoesSelecionadas.includes(perm.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPermissoesSelecionadas([...permissoesSelecionadas, perm.id])
                        } else {
                          setPermissoesSelecionadas(
                            permissoesSelecionadas.filter((p) => p !== perm.id),
                          )
                        }
                      }}
                    />
                    <label
                      htmlFor={`perm-${perm.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {perm.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving || !entidadeId || permissoesSelecionadas.length === 0}
            >
              {saving ? 'Gerando...' : 'Gerar Link Seguro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
