import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'

export default function Settings() {
  const { empresa } = useEmpresa()
  const [fenologiaObrigatoria, setFenologiaObrigatoria] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (empresa?.id) {
      supabase
        .from('empresas')
        .select('configuracoes')
        .eq('id', empresa.id)
        .single()
        .then(({ data }) => {
          if (
            data?.configuracoes &&
            typeof data.configuracoes === 'object' &&
            'fenologia_obrigatoria' in data.configuracoes
          ) {
            setFenologiaObrigatoria(!!(data.configuracoes as any).fenologia_obrigatoria)
          }
          setLoading(false)
        })
    }
  }, [empresa?.id])

  const toggleFenologia = async (checked: boolean) => {
    if (!empresa?.id) return
    setFenologiaObrigatoria(checked)
    const { data: currentData } = await supabase
      .from('empresas')
      .select('configuracoes')
      .eq('id', empresa.id)
      .single()
    const currentConfig = (currentData?.configuracoes as any) || {}

    const { error } = await supabase
      .from('empresas')
      .update({
        configuracoes: { ...currentConfig, fenologia_obrigatoria: checked },
      })
      .eq('id', empresa.id)

    if (error) {
      toast({ title: 'Erro', description: 'Erro ao salvar configuração', variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Configuração salva' })
    }
  }

  if (loading) return null

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      <div className="p-6 bg-card border rounded-xl shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-base font-medium">Obrigatoriedade de Estágios Fenológicos</Label>
          <p className="text-sm text-muted-foreground">
            Exigir o preenchimento de ao menos um estágio fenológico no cadastro de culturas.
          </p>
        </div>
        <Switch checked={fenologiaObrigatoria} onCheckedChange={toggleFenologia} />
      </div>
    </div>
  )
}
