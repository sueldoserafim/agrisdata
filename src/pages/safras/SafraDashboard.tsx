import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'
import { SafraCard } from '@/components/safras/SafraCard'
import { useToast } from '@/components/ui/use-toast'

const COLUMNS = [
  { id: 'Planejada', title: 'PLANEJADA' },
  { id: 'Em Andamento', title: 'EM ANDAMENTO' },
  { id: 'Finalizada', title: 'FINALIZADA' },
]

export default function SafraDashboard() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [safras, setSafras] = useState<any[]>([])

  const loadSafras = async () => {
    if (!empresa?.id) return
    const { data } = await supabase
      .from('safras')
      .select('*, cultivares(nome), fazendas(nome), safra_talhoes(talhoes(nome))')
      .eq('empresa_id', empresa.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (data) setSafras(data)
  }

  useEffect(() => {
    loadSafras()
  }, [empresa?.id])

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    const id = e.dataTransfer.getData('safraId')
    if (!id || !newStatus) return

    setSafras((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)))

    const updates: any = { status: newStatus }
    if (newStatus === 'Finalizada') {
      updates.data_colheita_real = new Date().toISOString().split('T')[0]
    }

    const { error } = await supabase.from('safras').update(updates).eq('id', id)
    if (error) {
      toast({ title: 'Erro', description: 'Erro ao atualizar status', variant: 'destructive' })
      loadSafras()
    }
  }

  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  return (
    <div className="p-8 w-full max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quadro de Safras</h1>
        <Button asChild>
          <Link to="/app/safras/new">
            <Plus className="w-4 h-4 mr-2" /> Nova Safra
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            onDrop={(e) => handleDrop(e, col.id)}
            onDragOver={handleDragOver}
            className="bg-muted/30 p-4 rounded-lg min-h-[600px] border border-dashed flex flex-col"
          >
            <h2 className="font-semibold mb-4 text-sm text-muted-foreground tracking-widest">
              {col.title}
            </h2>
            <div className="space-y-4 flex-1">
              {safras
                .filter((s) => s.status === col.id)
                .map((safra) => (
                  <SafraCard key={safra.id} safra={safra} onUpdate={loadSafras} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
