import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'

import { Input } from '@/components/ui/input'

export default function Settings() {
  const { empresa } = useEmpresa()
  const [fenologiaObrigatoria, setFenologiaObrigatoria] = useState(false)
  const [limiteAprovacao, setLimiteAprovacao] = useState<number>(500)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (empresa?.id) {
      supabase
        .from('empresas')
        .select('configuracoes')
        .eq('id', empresa.id)
        .single()
        .then(({ data }) => {
          if (data?.configuracoes && typeof data.configuracoes === 'object') {
            const conf = data.configuracoes as any
            if ('fenologia_obrigatoria' in conf) {
              setFenologiaObrigatoria(!!conf.fenologia_obrigatoria)
            }
            if ('limite_aprovacao_automatica' in conf) {
              setLimiteAprovacao(Number(conf.limite_aprovacao_automatica))
            }
          }
          setLoading(false)
        })
    }
  }, [empresa?.id])

  const saveConfig = async (updates: any) => {
    if (!empresa?.id) return
    const { data: currentData } = await supabase
      .from('empresas')
      .select('configuracoes')
      .eq('id', empresa.id)
      .single()
    const currentConfig = (currentData?.configuracoes as any) || {}

    const { error } = await supabase
      .from('empresas')
      .update({
        configuracoes: { ...currentConfig, ...updates },
      })
      .eq('id', empresa.id)

    if (error) {
      toast({ title: 'Erro', description: 'Erro ao salvar configuração', variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Configuração salva' })
    }
  }

  const toggleFenologia = (checked: boolean) => {
    setFenologiaObrigatoria(checked)
    saveConfig({ fenologia_obrigatoria: checked })
  }

  const handleLimiteBlur = () => {
    saveConfig({ limite_aprovacao_automatica: limiteAprovacao })
  }

  if (loading) return null

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>

      <div className="p-6 bg-card border rounded-xl shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base font-medium">Obrigatoriedade de Estágios Fenológicos</Label>
            <p className="text-sm text-muted-foreground">
              Exigir o preenchimento de ao menos um estágio fenológico no cadastro de culturas.
            </p>
          </div>
          <Switch checked={fenologiaObrigatoria} onCheckedChange={toggleFenologia} />
        </div>

        <div className="h-px bg-border w-full" />

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base font-medium">Limite de Aprovação Automática (R$)</Label>
            <p className="text-sm text-muted-foreground">
              Solicitações de compra até este valor serão aprovadas automaticamente.
            </p>
          </div>
          <div className="w-32">
            <Input
              type="number"
              step="0.01"
              value={limiteAprovacao}
              onChange={(e) => setLimiteAprovacao(Number(e.target.value))}
              onBlur={handleLimiteBlur}
              className="text-right font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
