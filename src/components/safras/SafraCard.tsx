import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Bug, Sprout, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { PragasModal } from './PragasModal'
import { ColheitaModal } from './ColheitaModal'

export function SafraCard({ safra, onUpdate }: { safra: any; onUpdate: () => void }) {
  const { toast } = useToast()
  const [pragasOpen, setPragasOpen] = useState(false)
  const [colheitaOpen, setColheitaOpen] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('safraId', safra.id)
  }

  const encerrarSafra = async () => {
    if (!confirm('Deseja realmente encerrar esta safra?')) return
    const { error } = await supabase
      .from('safras')
      .update({ status: 'encerrada', data_colheita_real: new Date().toISOString().split('T')[0] })
      .eq('id', safra.id)
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Safra encerrada com sucesso' })
      onUpdate()
    }
  }

  return (
    <>
      <Card
        draggable
        onDragStart={handleDragStart}
        className="p-4 cursor-move hover:border-primary/50 transition-colors bg-card shadow-sm"
      >
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="font-mono text-xs">
            {safra.codigo_safra || 'S/ Código'}
          </Badge>
        </div>
        <Link to={`/app/safras/${safra.id}`} className="hover:underline">
          <h3
            className="font-bold text-base leading-tight mb-1 truncate"
            title={safra.nome_safra || 'Sem Nome'}
          >
            {safra.nome_safra || 'Sem Nome'}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-4 truncate">
          {safra.cultivares?.nome || 'S/ Cultivar'} • {safra.talhoes?.nome || 'S/ Talhão'}
        </p>

        {safra.status !== 'encerrada' && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button variant="secondary" size="sm" className="w-full text-[10px] h-8 px-2" asChild>
              <Link to={`/app/operacoes/new?safra_id=${safra.id}`}>
                <FileText className="w-3 h-3 mr-1" /> OS
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full text-[10px] h-8 px-2"
              onClick={() => setPragasOpen(true)}
            >
              <Bug className="w-3 h-3 mr-1" /> Pragas
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full text-[10px] h-8 px-2"
              onClick={() => setColheitaOpen(true)}
            >
              <Sprout className="w-3 h-3 mr-1" /> Colheita
            </Button>
            <Button
              variant="default"
              size="sm"
              className="w-full text-[10px] h-8 px-2"
              onClick={encerrarSafra}
            >
              <CheckCircle2 className="w-3 h-3 mr-1" /> Encerrar
            </Button>
          </div>
        )}
      </Card>

      <PragasModal open={pragasOpen} onOpenChange={setPragasOpen} safra={safra} />
      <ColheitaModal open={colheitaOpen} onOpenChange={setColheitaOpen} safra={safra} />
    </>
  )
}
