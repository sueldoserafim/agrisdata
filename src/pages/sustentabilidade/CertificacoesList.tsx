import { useEmpresa } from '@/hooks/use-empresa'
import { useEffect, useState } from 'react'
import { sustentabilidadeService } from '@/services/sustentabilidade'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

export default function CertificacoesList() {
  const { empresa } = useEmpresa()
  const navigate = useNavigate()
  const [modelos, setModelos] = useState<any[]>([])
  const [auditorias, setAuditorias] = useState<any[]>([])

  useEffect(() => {
    if (empresa?.id) load()
  }, [empresa?.id])

  const load = async () => {
    const m = await sustentabilidadeService.getModelos(empresa!.id)
    const a = await sustentabilidadeService.getAuditorias(empresa!.id)
    if (m.data) setModelos(m.data)
    if (a.data) setAuditorias(a.data)
  }

  const startAuditoria = async (modelo_id: string) => {
    const { data } = await sustentabilidadeService.createAuditoria({
      empresa_id: empresa!.id,
      modelo_id,
      data_agendada: new Date().toISOString().split('T')[0],
      tipo_auditoria: 'interna',
      status: 'em_andamento',
    })
    if (data) navigate(`/app/sustentabilidade/auditoria/${data.id}`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Certificações & Auditorias</h1>
      </div>

      <Tabs defaultValue="auditorias">
        <TabsList>
          <TabsTrigger value="auditorias">Auditorias</TabsTrigger>
          <TabsTrigger value="modelos">Modelos (Templates)</TabsTrigger>
        </TabsList>

        <TabsContent value="auditorias">
          <Card>
            <CardHeader>
              <CardTitle>Auditorias Agendadas e Realizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditorias.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.data_agendada}</TableCell>
                      <TableCell>{a.certificacoes_modelos?.nome}</TableCell>
                      <TableCell className="capitalize">{a.tipo_auditoria}</TableCell>
                      <TableCell>
                        <Badge variant={a.status === 'concluida' ? 'default' : 'secondary'}>
                          {a.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {a.score_final ? `${Number(a.score_final).toFixed(1)}%` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/app/sustentabilidade/auditoria/${a.id}`}>Ver / Executar</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {auditorias.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Nenhuma auditoria encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modelos">
          <Card>
            <CardHeader>
              <CardTitle>Modelos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Versão</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelos.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.nome}</TableCell>
                      <TableCell>{m.tipo}</TableCell>
                      <TableCell>{m.versao}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => startAuditoria(m.id)}>
                          Nova Auditoria
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {modelos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Nenhum modelo disponível.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
