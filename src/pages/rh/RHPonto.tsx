import { useState, useRef, useCallback } from 'react'
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Camera, MapPin, CheckCircle, Upload } from 'lucide-react'

export default function RHPonto() {
  const { empresa } = useEmpresa()
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [streamActive, setStreamActive] = useState(false)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setStreamActive(true)
      }
    } catch (err) {
      toast.error('Erro ao acessar câmera')
    }
  }

  const takePhoto = () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0)
      setPhoto(canvas.toDataURL('image/jpeg'))
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      setStreamActive(false)
    }
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não suportada')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        toast.success('Localização capturada com sucesso')
      },
      () => toast.error('Erro ao obter localização'),
    )
  }

  const handleRegister = async (tipo: 'entrada' | 'saida') => {
    if (!empresa) return
    if (!location) return toast.error('Capture sua localização primeiro')
    if (!photo) return toast.error('Tire uma foto para verificação')

    setLoading(true)
    try {
      // Get first func for user (mocked for current user)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { data: funcionarios } = await supabase
        .from('funcionarios')
        .select('id')
        .eq('empresa_id', empresa.id)
        .limit(1)
      const funcId = funcionarios?.[0]?.id

      if (!funcId) {
        toast.error('Você não está vinculado a um funcionário.')
        setLoading(false)
        return
      }

      const { error } = await supabase.from('rh_ponto').insert({
        empresa_id: empresa.id,
        funcionario_id: funcId,
        tipo,
        latitude: location.lat,
        longitude: location.lng,
        foto_url: photo,
      })

      if (error) throw error
      toast.success(`Ponto de ${tipo} registrado com sucesso!`)
      setPhoto(null)
      setLocation(null)
    } catch (error: any) {
      toast.error('Erro ao registrar ponto: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ponto Eletrônico</h1>
        <p className="text-muted-foreground">
          Registre sua entrada e saída com verificação GPS e foto.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Validação</CardTitle>
          <CardDescription>Precisamos da sua localização e uma selfie</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Localização</p>
                <p className="text-sm text-muted-foreground">
                  {location
                    ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                    : 'Não verificada'}
                </p>
              </div>
            </div>
            {location ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <Button variant="outline" size="sm" onClick={getLocation}>
                Verificar GPS
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">Foto de Verificação</p>
              </div>
              {!streamActive && !photo && (
                <Button variant="outline" size="sm" onClick={startCamera}>
                  Abrir Câmera
                </Button>
              )}
            </div>

            {streamActive && (
              <div className="relative rounded-lg overflow-hidden border">
                <video ref={videoRef} autoPlay playsInline className="w-full" />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <Button onClick={takePhoto} className="rounded-full shadow-lg">
                    Capturar
                  </Button>
                </div>
              </div>
            )}

            {photo && (
              <div className="relative rounded-lg overflow-hidden border">
                <img src={photo} alt="Selfie" className="w-full object-cover" />
                <div className="absolute top-2 right-2">
                  <Button variant="destructive" size="sm" onClick={() => setPhoto(null)}>
                    Remover
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => handleRegister('entrada')}
              disabled={loading || !location || !photo}
            >
              Bater Entrada
            </Button>
            <Button
              className="w-full bg-slate-800 hover:bg-slate-900"
              onClick={() => handleRegister('saida')}
              disabled={loading || !location || !photo}
            >
              Bater Saída
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
