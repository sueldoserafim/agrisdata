import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { MapPin, Camera } from 'lucide-react'
import { HelpPanel } from '@/components/HelpPanel'

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function PontoEletronico() {
  const { empresa } = useEmpresa()
  const { toast } = useToast()
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [funcId, setFuncId] = useState('')
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [inRange, setInRange] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!empresa?.id) return
    supabase
      .from('funcionarios')
      .select('*')
      .eq('empresa_id', empresa.id)
      .is('deleted_at', null)
      .then(({ data }) => {
        if (data) setFuncionarios(data)
      })

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude,
        lng = pos.coords.longitude
      setLocation({ lat, lng })
      const { data: fazendas } = await supabase
        .from('fazendas')
        .select('latitude, longitude')
        .eq('empresa_id', empresa.id)
      let ok = false
      if (fazendas) {
        for (const f of fazendas) {
          if (f.latitude && f.longitude && getDistance(lat, lng, f.latitude, f.longitude) <= 500)
            ok = true
        }
      }
      setInRange(ok)
    })
  }, [empresa])

  const handleBaterPonto = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!funcId || !location) return toast({ title: 'Aguarde o GPS e selecione o funcionário' })
    if (!inRange)
      return toast({ title: 'Você está fora do raio permitido (500m)', variant: 'destructive' })
    setLoading(true)
    const { error } = await supabase.from('rh_ponto').insert({
      empresa_id: empresa?.id,
      funcionario_id: funcId,
      tipo,
      latitude: location.lat,
      longitude: location.lng,
    })
    setLoading(false)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else toast({ title: 'Ponto registrado com sucesso!' })
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Ponto Eletrônico</h1>
        <HelpPanel title="Ponto Eletrônico">
          <p>
            O registro de ponto exige que o funcionário esteja dentro de um raio de 500m de uma das
            fazendas da empresa (Geofencing).
          </p>
          <p>
            Ative a localização do dispositivo. Se estiver fora da área, o registro será bloqueado.
          </p>
        </HelpPanel>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Bater Ponto</CardTitle>
          <CardDescription>Registre sua entrada ou saída</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBaterPonto} className="space-y-4">
            <div className="space-y-2">
              <Label>Funcionário</Label>
              <Select value={funcId} onValueChange={setFuncId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {funcionarios.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Movimento</Label>
              <Select value={tipo} onValueChange={(v: any) => setTipo(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-muted rounded-lg flex items-center gap-3">
              <MapPin className={inRange ? 'text-green-500' : 'text-destructive'} />
              <div className="text-sm">
                {location
                  ? inRange
                    ? 'Localização válida (dentro do raio)'
                    : 'Fora do raio da fazenda'
                  : 'Obtendo GPS...'}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Foto de Comprovação</Label>
              <div className="relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer">
                <Camera className="h-8 w-8 mb-2" />
                <span>Tirar foto (Câmera)</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading || !inRange}>
              Registrar {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
