import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Building2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useEmpresa } from '@/hooks/use-empresa'
import { getClientes } from '@/services/clientes'

export default function ClienteList() {
  const { empresa } = useEmpresa()
  const [clientes, setClientes] = useState<any[]>([])
  const [busca, setBusca] = useState('')

  useEffect(() => {
    if (empresa) {
      getClientes(empresa.id).then((res) => setClientes(res.data || []))
    }
  }, [empresa])

  const filtrados = clientes.filter(
    (c) => c.nome.toLowerCase().includes(busca.toLowerCase()) || c.cnpj_cpf?.includes(busca),
  )

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerenciamento avançado de clientes e importadores.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/clientes/novo">
            <Plus className="w-4 h-4 mr-2" /> Novo Cliente
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border shadow-sm w-max">
        <Search className="w-4 h-4 text-muted-foreground ml-2" />
        <Input
          placeholder="Buscar por nome ou documento..."
          className="border-0 shadow-none focus-visible:ring-0 w-[300px]"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome / Razão Social</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Portal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((cliente: any) => (
              <TableRow key={cliente.id}>
                <TableCell>
                  <Link
                    to={`/app/clientes/${cliente.id}`}
                    className="font-medium text-primary hover:underline flex items-center gap-2"
                  >
                    {cliente.tipo_pessoa === 'PJ' ? (
                      <Building2 className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    {cliente.nome}
                  </Link>
                </TableCell>
                <TableCell>{cliente.cnpj_cpf}</TableCell>
                <TableCell>
                  <Badge variant="outline">{cliente.tipo_cliente || 'Nacional'}</Badge>
                </TableCell>
                <TableCell>
                  {cliente.acesso_portal ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>
                  ) : (
                    <Badge variant="secondary">Inativo</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
