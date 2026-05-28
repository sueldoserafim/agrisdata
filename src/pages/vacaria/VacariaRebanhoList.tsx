import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { VacariaAnimal } from './types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import { Plus, Edit2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { format } from 'date-fns'

export default function VacariaRebanhoList() {
  const { user } = useAuth()
  const [animais, setAnimais] = useState<VacariaAnimal[]>([])
  const [empresaId, setEmpresaId] = useState('')

  useEffect(() => {
    if (user) {
      supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setEmpresaId(data.empresa_id)
            loadAnimais(data.empresa_id)
          }
        })
    }
  }, [user])

  const loadAnimais = async (empId: string) => {
    const { data } = await supabase
      .from('vacaria_animais')
      .select('*')
      .eq('empresa_id', empId)
      .order('brinco')
    if (data) setAnimais(data)
  }

  const toggleQuarantine = async (id: string, current: boolean) => {
    await supabase.from('vacaria_animais').update({ em_quarentena: !current }).eq('id', id)
    if (empresaId) loadAnimais(empresaId)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Rebanho Individual</h1>
        <Button asChild>
          <Link to="/app/vacaria/rebanho/novo">
            <Plus className="mr-2 h-4 w-4" /> Novo Animal
          </Link>
        </Button>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Brinco</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Raça</TableHead>
              <TableHead>Nascimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quarentena</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {animais.map((animal) => (
              <TableRow key={animal.id} className={animal.em_quarentena ? 'bg-amber-500/10' : ''}>
                <TableCell>
                  {animal.foto_url ? (
                    <img
                      src={animal.foto_url}
                      alt="Foto"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs">
                      Sem Foto
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{animal.brinco}</TableCell>
                <TableCell>{animal.nome}</TableCell>
                <TableCell>{animal.raca}</TableCell>
                <TableCell>
                  {animal.data_nascimento
                    ? format(new Date(animal.data_nascimento), 'dd/MM/yyyy')
                    : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{animal.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={animal.em_quarentena}
                      onCheckedChange={() => toggleQuarantine(animal.id, animal.em_quarentena)}
                    />
                    {animal.em_quarentena && <AlertCircle className="h-4 w-4 text-amber-500" />}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/app/vacaria/rebanho/${animal.id}`}>
                      <Edit2 className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {animais.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Nenhum animal cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
