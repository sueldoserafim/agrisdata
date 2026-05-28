import { useState } from 'react'
import { useEmpresa } from '@/hooks/use-empresa'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { QrCode, Search, ScanLine } from 'lucide-react'

export default function PatrimonioScanner() {
  const { empresa } = useEmpresa()
  const [code, setCode] = useState('')
  const [asset, setAsset] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!empresa || !code) return
    setLoading(true)
    setAsset(null)

    try {
      const { data, error } = await supabase
        .from('patrimonio_bens')
        .select('*')
        .eq('empresa_id', empresa.id)
        .eq('codigo_qr', code)
        .maybeSingle()

      if (error) throw error
      if (!data) {
        toast.error('Nenhum ativo encontrado com este código')
      } else {
        setAsset(data)
        toast.success('Ativo localizado!')
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const calcularBookValue = (
    valorOriginal: number,
    vidaUtilMeses: number,
    dataAquisicao: string,
  ) => {
    if (!vidaUtilMeses || vidaUtilMeses <= 0) return valorOriginal
    const dateAq = new Date(dataAquisicao)
    const today = new Date()
    let mesesUsados =
      (today.getFullYear() - dateAq.getFullYear()) * 12 + (today.getMonth() - dateAq.getMonth())
    if (mesesUsados < 0) mesesUsados = 0
    if (mesesUsados > vidaUtilMeses) mesesUsados = vidaUtilMeses

    const depreciaoMensal = valorOriginal / vidaUtilMeses
    const bookValue = valorOriginal - depreciaoMensal * mesesUsados
    return bookValue < 0 ? 0 : bookValue
  }

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scanner de Inventário</h1>
        <p className="text-muted-foreground">Leia o QR code ou digite o código do ativo.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Bem</CardTitle>
          <CardDescription>
            Simulação de leitura óptica usando a câmera do dispositivo móvel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Digite o código (ex: PAT-001)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading || !code}>
              <Search className="h-4 w-4 mr-2" /> Buscar
            </Button>
          </div>

          <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/20">
            <ScanLine className="h-16 w-16 mb-4 opacity-50" />
            <p>Leitor de Câmera</p>
            <p className="text-xs mt-2">(Funcionalidade disponível no App Nativo)</p>
          </div>

          {asset && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <QrCode className="h-5 w-5" />
                <span className="font-bold text-lg">{asset.codigo_qr}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nome do Ativo</p>
                <p className="font-medium text-lg">{asset.nome}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Data Aquisição</p>
                  <p className="font-medium">
                    {new Date(asset.data_aquisicao).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Aquisição</p>
                  <p className="font-medium">
                    R${' '}
                    {Number(asset.valor_aquisicao).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Valor Contábil Atual (Depreciado)</p>
                  <p className="font-bold text-green-600 text-xl">
                    R${' '}
                    {calcularBookValue(
                      asset.valor_aquisicao,
                      asset.vida_util_meses,
                      asset.data_aquisicao,
                    ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
