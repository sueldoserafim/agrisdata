import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Camera, MapPin, Play, CheckCircle, Map, Tractor, Loader2 } from 'lucide-react'

export default function MinhasOperacoes() {
  const { user } = useAuth()
  const { empresa } = useEmpresa()
  const [operacoes, setOperacoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedOp, setSelectedOp] = useState<any>(null)
  const [concludeDialogOpen, setConcludeDialogOpen] = useState(false)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [notas, setNotas] = useState('')
  const [loc, setLoc] = useState<{ lat: number; lon: number } | null>(null)
  const [concluding, setConcluding] = useState(false)

  useEffect(() => {
    if (user && empresa) fetchOperacoes()
  }, [user, empresa])

  const fetchOperacoes = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('operacoes_campo')
      .select('*, safras(nome_safra, talhoes(nome))')
      .eq('empresa_id', empresa?.id)
      .eq('responsavel_id', user?.id)
      .in('status', ['pendente', 'em_execução'])
      .order('data_inicio', { ascending: true })

    setOperacoes(data || [])
    setLoading(false)
  }

  const handleStart = async (opId: string) => {
    try {
      await supabase.from('operacoes_campo').update({ status: 'em_execução' }).eq('id', opId)
      toast.success('Operação iniciada!')
      fetchOperacoes()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const openConclude = (op: any) => {
    setSelectedOp(op)
    setFotoFile(null)
    setNotas('')
    setLoc(null)
    setConcludeDialogOpen(true)
  }

  const getLoc = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => toast.error('Não foi possível obter localização.'),
      )
    } else {
      toast.error('Geolocalização não suportada.')
    }
  }

  const handleConcludeSubmit = async () => {
    if (!selectedOp) return
    setConcluding(true)
    try {
      let photoUrl = ''
      if (fotoFile) {
        const fileExt = fotoFile.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `${user?.id}/${fileName}`
        const { error: uploadError } = await supabase.storage
          .from('evidencias')
          .upload(filePath, fotoFile)
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('evidencias').getPublicUrl(filePath)
          photoUrl = urlData.publicUrl
        }
      }

      const fotosArr =
        photoUrl && loc ? [{ url: photoUrl, latitude: loc.lat, longitude: loc.lon }] : []

      const { error } = await supabase
        .from('operacoes_campo')
        .update({
          status: 'concluída',
          data_conclusao: new Date().toISOString().split('T')[0],
          observacoes: notas,
          foto_geolocalizada_url: fotosArr.length ? JSON.stringify(fotosArr) : null,
          latitude: loc?.lat || null,
          longitude: loc?.lon || null,
        })
        .eq('id', selectedOp.id)

      if (error) throw error

      toast.success('Operação concluída com sucesso!')
      setConcludeDialogOpen(false)
      fetchOperacoes()
    } catch (e: any) {
      toast.error('Erro ao concluir: ' + e.message)
    } finally {
      setConcluding(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto bg-muted/10 min-h-screen pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Minhas Tarefas</h1>
        <p className="text-muted-foreground text-sm">Gerencie suas operações em campo.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : operacoes.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-xl bg-background">
          <Tractor className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="font-semibold text-lg">Sem tarefas pendentes</h3>
          <p className="text-muted-foreground text-sm">Você está com tudo em dia!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {operacoes.map((op) => (
            <Card key={op.id} className="shadow-sm border-primary/10 overflow-hidden">
              <div
                className={`h-2 w-full ${op.status === 'em_execução' ? 'bg-blue-500' : 'bg-amber-500'}`}
              />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg capitalize">
                      {op.tipo_operacao?.replace('_', ' ')}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Map className="w-4 h-4" /> {op.safras?.talhoes?.nome || 'N/A'} -{' '}
                      {op.safras?.nome_safra}
                    </div>
                  </div>
                  <Badge variant={op.status === 'em_execução' ? 'default' : 'outline'}>
                    {op.status === 'em_execução' ? 'Em Andamento' : 'Pendente'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm">
                  <strong>Planejado:</strong>{' '}
                  {op.data_inicio ? new Date(op.data_inicio).toLocaleDateString() : 'N/A'}
                </p>
                {op.observacoes && (
                  <p className="text-sm text-muted-foreground mt-2 italic">"{op.observacoes}"</p>
                )}
              </CardContent>
              <CardFooter className="bg-muted/30 pt-4 flex gap-3">
                {op.status === 'pendente' ? (
                  <Button className="w-full h-12 text-base" onClick={() => handleStart(op.id)}>
                    <Play className="w-5 h-5 mr-2" /> Iniciar Agora
                  </Button>
                ) : (
                  <Button
                    className="w-full h-12 text-base bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => openConclude(op)}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" /> Concluir Tarefa
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={concludeDialogOpen} onOpenChange={setConcludeDialogOpen}>
        <DialogContent className="sm:max-w-md w-[95vw] rounded-xl">
          <DialogHeader>
            <DialogTitle>Concluir Operação</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Evidência Fotográfica</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="h-12 file:h-12 file:bg-transparent file:border-0 file:mr-4 file:font-semibold pt-2"
                  onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
                />
                <Camera className="w-6 h-6 text-muted-foreground shrink-0" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Localização GPS</label>
              <div className="flex gap-2">
                <Button
                  variant={loc ? 'default' : 'outline'}
                  className="h-12 flex-1 justify-start"
                  onClick={getLoc}
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  {loc ? `${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)}` : 'Capturar Coordenadas'}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Observações da Execução</label>
              <Textarea
                className="h-24 resize-none"
                placeholder="Ex: Utilizado 2 sacos a mais devido ao relevo."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button
              variant="ghost"
              className="h-12 w-full sm:w-auto"
              onClick={() => setConcludeDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="h-12 w-full sm:w-auto bg-green-600 hover:bg-green-700"
              onClick={handleConcludeSubmit}
              disabled={concluding}
            >
              {concluding ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <CheckCircle className="w-5 h-5 mr-2" />
              )}
              Salvar e Concluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
