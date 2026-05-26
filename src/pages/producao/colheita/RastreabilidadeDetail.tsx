import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'
import { Button } from '@/components/ui/button'
import {
  Printer,
  ArrowLeft,
  Loader2,
  MapPin,
  Thermometer,
  User,
  Tractor,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react'

export default function RastreabilidadeDetail() {
  const { id } = useParams()
  const { empresa } = useEmpresa()
  const [colheita, setColheita] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (empresa?.id && id) loadData()
  }, [empresa?.id, id])

  const loadData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('colheita_registros')
      .select(`
        *,
        safra:safras (
          nome_safra,
          cultivar:cultivares(nome),
          talhao:talhoes (
            nome,
            codigo_talhao,
            fazenda:fazendas ( nome, municipio, estado )
          )
        ),
        responsavel:usuarios!colheita_registros_responsavel_id_fkey(nome),
        equipamento:equipamentos(nome)
      `)
      .eq('id', id)
      .eq('empresa_id', empresa?.id)
      .maybeSingle()

    if (data) {
      setColheita(data)
    } else {
      if (id?.startsWith('mock-')) {
        setColheita({
          id,
          lote_producao: id === 'mock-1' ? 'LOTE-2026-A1' : 'LOTE-2026-B2',
          data_colheita: '2026-03-15',
          brix_medio: 14.5,
          temperatura_colheita: 22.4,
          qualidade_visual: 'Excelente',
          producao_liquida_ton: 120.5,
          responsavel: { nome: 'João Silva' },
          equipamento: { nome: 'Colheitadeira JD S700' },
          safra: {
            nome_safra: 'Safra Verão 2026',
            cultivar: { nome: 'Soja Premium XPTO' },
            talhao: {
              nome: 'Talhão 01 - Norte',
              fazenda: {
                nome: 'Fazenda Boa Vista',
                municipio: 'Cascavel',
                estado: 'PR',
              },
            },
          },
          fotos: [
            'https://img.usecurling.com/p/400/300?q=agriculture%20harvest',
            'https://img.usecurling.com/p/400/300?q=soybeans',
          ],
        })
      }
    }
    setLoading(false)
  }

  if (loading)
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  if (!colheita)
    return <div className="p-8 text-center text-muted-foreground">Registro não encontrado.</div>

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/app/financeiro/rentabilidade">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rastreabilidade</h1>
            <p className="text-muted-foreground">Certificado de Origem do Lote</p>
          </div>
        </div>
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="w-4 h-4" /> Exportar Certificado
        </Button>
      </div>

      <div className="bg-white p-10 rounded-lg shadow-sm border border-border print:shadow-none print:border-none print:p-0">
        <div className="border-b-2 border-primary pb-6 mb-8 text-center">
          <h2 className="text-2xl font-bold text-primary uppercase tracking-widest">
            Certificado de Origem e Qualidade
          </h2>
          <p className="text-muted-foreground mt-2">
            Documento oficial de rastreabilidade de lote de produção
          </p>
          <div className="mt-4 inline-block bg-muted px-4 py-1 rounded-full text-lg font-mono font-bold tracking-wider">
            {colheita.lote_producao || `LOTE-${colheita.id.substring(0, 8).toUpperCase()}`}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
              <MapPin className="w-5 h-5 text-primary" /> Origem da Produção
            </h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-muted-foreground">Fazenda:</span>
              <span className="font-medium text-right">
                {colheita.safra?.talhao?.fazenda?.nome || 'N/A'}
              </span>
              <span className="text-muted-foreground">Localização:</span>
              <span className="font-medium text-right">
                {colheita.safra?.talhao?.fazenda?.municipio} -{' '}
                {colheita.safra?.talhao?.fazenda?.estado}
              </span>
              <span className="text-muted-foreground">Talhão:</span>
              <span className="font-medium text-right">
                {colheita.safra?.talhao?.nome || 'N/A'}
              </span>
              <span className="text-muted-foreground">Safra:</span>
              <span className="font-medium text-right">{colheita.safra?.nome_safra || 'N/A'}</span>
              <span className="text-muted-foreground">Cultivar:</span>
              <span className="font-medium text-right">
                {colheita.safra?.cultivar?.nome || 'N/A'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
              <CheckCircle className="w-5 h-5 text-primary" /> Qualidade e Colheita
            </h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-muted-foreground">Data da Colheita:</span>
              <span className="font-medium text-right">
                {colheita.data_colheita
                  ? new Date(colheita.data_colheita).toLocaleDateString('pt-BR')
                  : 'N/A'}
              </span>
              <span className="text-muted-foreground">Volume (Ton):</span>
              <span className="font-medium text-right">
                {colheita.producao_liquida_ton || colheita.producao_bruta_ton || 0}
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Thermometer className="w-3 h-3" /> Temperatura:
              </span>
              <span className="font-medium text-right">
                {colheita.temperatura_colheita ? `${colheita.temperatura_colheita}°C` : 'N/A'}
              </span>
              <span className="text-muted-foreground">Nível Brix:</span>
              <span className="font-medium text-right">{colheita.brix_medio || 'N/A'}</span>
              <span className="text-muted-foreground">Aparência Visual:</span>
              <span className="font-medium text-right">{colheita.qualidade_visual || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
            <Tractor className="w-5 h-5 text-primary" /> Logística e Responsáveis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" /> Responsável Técnico:
              </span>
              <span className="font-medium">{colheita.responsavel?.nome || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <Tractor className="w-4 h-4" /> Equipamento:
              </span>
              <span className="font-medium">{colheita.equipamento?.nome || 'N/A'}</span>
            </div>
          </div>
        </div>

        {colheita.fotos && colheita.fotos.length > 0 && (
          <div className="space-y-4 print:break-inside-avoid">
            <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
              <ImageIcon className="w-5 h-5 text-primary" /> Evidências Fotográficas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {colheita.fotos.map((foto: string, idx: number) => (
                <div key={idx} className="rounded-lg overflow-hidden border border-border">
                  <img
                    src={foto}
                    alt={`Evidência ${idx + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-dashed text-center text-xs text-muted-foreground">
          Documento gerado eletronicamente pelo sistema Agrisdata. A autenticidade pode ser
          verificada através dos registros de auditoria imutáveis.
          <br />
          Data de emissão: {new Date().toLocaleString('pt-BR')}
        </div>
      </div>
    </div>
  )
}
