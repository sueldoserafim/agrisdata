import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getTickets } from '@/services/admin/suporte'

export default function AdminSuporteList() {
  const [tickets, setTickets] = useState<any[]>([])

  useEffect(() => {
    getTickets().then((data) => setTickets(data || []))
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tickets de Suporte</h1>
      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">
                  <Link to={`/admin/suporte/${t.id}`} className="hover:underline text-primary">
                    {t.titulo}
                  </Link>
                </TableCell>
                <TableCell>{t.empresas?.nome}</TableCell>
                <TableCell>{t.modulo || 'Geral'}</TableCell>
                <TableCell>
                  <Badge variant="outline">{t.prioridade}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={t.status === 'aberto' ? 'destructive' : 'secondary'}>
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(t.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
