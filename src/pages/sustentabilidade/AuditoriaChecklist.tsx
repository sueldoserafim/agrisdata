import { useEmpresa } from '@/hooks/use-empresa'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { sustentabilidadeService } from '@/services/sustentabilidade'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'

export default function AuditoriaChecklist() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresa } = useEmpresa()
  const [auditoria, setAuditoria] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [responses, setResponses] = useState<
    Record<string, { resposta: string; observacoes: string }>
  >({})

  useEffect(() => {
    if (empresa?.id && id) load()
  }, [empresa?.id, id])

  const load = async () => {
    const { data: aud } = await sustentabilidadeService.getAuditoria(id!)
    if (aud) {
      setAuditoria(aud)
      const { data: itemsMod } = await sustentabilidadeService.getItensModelo(aud.modelo_id)
      const { data: itensAud } = await sustentabilidadeService.getItensAuditoria(aud.id)

      if (itemsMod) setItems(itemsMod)

      const respObj: any = {}
      if (itemsMod) {
        itemsMod.forEach((m: any) => {
          const ex = itensAud?.find((a: any) => a.item_modelo_id === m.id)
          respObj[m.id] = {
            resposta: ex?.resposta || '',
            observacoes: ex?.observacoes || '',
          }
        })
      }
      setResponses(respObj)
    }
  }

  const handleChange = (itemId: string, field: string, value: string) => {
    setResponses((prev) => ({ ...prev, [itemId]: { ...prev[itemId], [field]: value } }))
  }

  const handleSave = async () => {
    let totalPeso = 0
    let earnedPeso = 0

    const payloads = Object.keys(responses)
      .map((itemId) => {
        const resp = responses[itemId]
        const itemDef = items.find((i) => i.id === itemId)

        if (resp.resposta !== 'na' && resp.resposta !== '') {
          totalPeso += Number(itemDef.peso)
          if (resp.resposta === 'sim') earnedPeso += Number(itemDef.peso)
        }

        return {
          auditoria_id: id!,
          item_modelo_id: itemId,
          resposta: resp.resposta,
          observacoes: resp.observacoes,
        }
      })
      .filter((p) => p.resposta !== '')

    for (const p of payloads) {
      await sustentabilidadeService.saveItemAuditoria(p)
    }

    const score = totalPeso > 0 ? (earnedPeso / totalPeso) * 100 : 0
    await sustentabilidadeService.updateAuditoria(id!, {
      score_final: score,
      status: 'concluida',
      data_realizada: new Date().toISOString().split('T')[0],
    })

    toast({ title: 'Salvo', description: `Checklist concluído! Score: ${score.toFixed(1)}%` })
    navigate('/app/sustentabilidade/certificacoes')
  }

  if (!auditoria) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Checklist de Auditoria</h1>
          <p className="text-muted-foreground">
            {auditoria.certificacoes_modelos?.nome} - {auditoria.data_agendada}
          </p>
        </div>
        <Button onClick={handleSave}>Salvar e Concluir</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Seção</TableHead>
                <TableHead>Requisito</TableHead>
                <TableHead className="w-[200px]">Avaliação</TableHead>
                <TableHead>Evidências / Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.secao}</TableCell>
                  <TableCell>
                    {item.descricao}
                    {item.requisito_legal && (
                      <Badge variant="destructive" className="ml-2">
                        Legal
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <RadioGroup
                      value={responses[item.id]?.resposta}
                      onValueChange={(val) => handleChange(item.id, 'resposta', val)}
                      className="flex space-x-2"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="sim" id={`${item.id}-sim`} />
                        <Label htmlFor={`${item.id}-sim`}>Sim</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="nao" id={`${item.id}-nao`} />
                        <Label htmlFor={`${item.id}-nao`}>Não</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="na" id={`${item.id}-na`} />
                        <Label htmlFor={`${item.id}-na`}>NA</Label>
                      </div>
                    </RadioGroup>
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Observações ou links..."
                      value={responses[item.id]?.observacoes}
                      onChange={(e) => handleChange(item.id, 'observacoes', e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
