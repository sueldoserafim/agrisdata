import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Search, Plus, Edit2, Trash2, Loader2, Shield, User } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

type Usuario = {
  id: string
  nome: string | null
  email: string
  perfil: string | null
  ativo: boolean | null
}

export default function UsuariosPage() {
  const { user } = useAuth()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    perfil: 'user',
    senha: '',
    ativo: true,
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      const { data: profile } = await supabase
        .from('usuarios')
        .select('perfil')
        .eq('id', user?.id || '')
        .single()

      const adminStatus = profile?.perfil === 'admin' || profile?.perfil === 'admin_saas'
      setIsAdmin(adminStatus)

      if (adminStatus) {
        const { data, error } = await supabase
          .from('usuarios')
          .select('id, nome, email, perfil, ativo')
          .is('deleted_at', null)
          .order('nome')

        if (error) throw error
        setUsuarios(data || [])
      }
    } catch (error: any) {
      toast.error('Erro ao carregar usuários')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function openCreateDialog() {
    setEditingUser(null)
    setFormData({ nome: '', email: '', perfil: 'user', senha: '', ativo: true })
    setIsDialogOpen(true)
  }

  function openEditDialog(usuario: Usuario) {
    setEditingUser(usuario)
    setFormData({
      nome: usuario.nome || '',
      email: usuario.email,
      perfil: usuario.perfil || 'user',
      senha: '',
      ativo: usuario.ativo ?? true,
    })
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (formData.nome.trim().length < 3) {
      toast.error('Nome deve ter no mínimo 3 caracteres')
      return
    }
    if (!formData.email.includes('@')) {
      toast.error('Email inválido')
      return
    }

    setSaving(true)

    try {
      if (editingUser) {
        const { error } = await supabase
          .from('usuarios')
          .update({
            nome: formData.nome.trim(),
            perfil: formData.perfil,
            ativo: formData.ativo,
          })
          .eq('id', editingUser.id)

        if (error) throw error
        toast.success('Usuário atualizado com sucesso!')
      } else {
        if (!formData.senha || formData.senha.length < 6) {
          throw new Error('Senha deve ter no mínimo 6 caracteres')
        }

        const { data, error } = await supabase.functions.invoke('admin-create-user', {
          body: {
            nome: formData.nome.trim(),
            email: formData.email.trim(),
            perfil: formData.perfil,
            password: formData.senha,
          },
        })

        if (error || data?.error) throw new Error(error?.message || data?.error)
        toast.success('Usuário criado com sucesso!')
      }

      setIsDialogOpen(false)
      fetchUsers()
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar usuário')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente remover este usuário? O acesso será revogado.')) return

    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ deleted_at: new Date().toISOString(), ativo: false })
        .eq('id', id)

      if (error) throw error
      toast.success('Usuário removido com sucesso!')
      fetchUsers()
    } catch (error: any) {
      toast.error('Erro ao remover usuário')
    }
  }

  if (isAdmin === false && !loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-2">
          <Shield className="size-12 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-semibold">Acesso Negado</h2>
          <p className="text-muted-foreground">Você não tem permissão para gerenciar usuários.</p>
        </div>
      </div>
    )
  }

  const filteredUsuarios = usuarios.filter(
    (u) =>
      (u.nome?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (u.email?.toLowerCase() || '').includes(search.toLowerCase()),
  )

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os acessos da sua equipe à plataforma.
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="size-4" />
          Novo Usuário
        </Button>
      </div>

      <div className="flex items-center space-x-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-xl bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32">
                  <Loader2 className="size-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filteredUsuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.nome}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    {u.perfil === 'admin' ? (
                      <Badge
                        variant="default"
                        className="gap-1 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 shadow-none"
                      >
                        <Shield className="size-3" /> Administrador
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1 shadow-none">
                        <User className="size-3" /> Usuário
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={u.ativo ? 'outline' : 'secondary'}
                      className={
                        u.ativo
                          ? 'bg-green-50 text-green-700 border-green-200 shadow-none'
                          : 'shadow-none'
                      }
                    >
                      {u.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(u)}
                        title="Editar"
                      >
                        <Edit2 className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(u.id)}
                        disabled={u.id === user?.id}
                        title="Remover"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                required
                minLength={3}
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: João Silva"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                disabled={!!editingUser}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="joao@empresa.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="perfil">Perfil de Acesso</Label>
              <Select
                value={formData.perfil}
                onValueChange={(val) => setFormData({ ...formData, perfil: val })}
                disabled={editingUser?.id === user?.id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="senha">Senha Inicial</Label>
                <Input
                  id="senha"
                  type="password"
                  required
                  minLength={6}
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  placeholder="******"
                />
              </div>
            )}

            {editingUser && (
              <div className="flex items-center justify-between rounded-lg border p-3 mt-4">
                <div className="space-y-0.5">
                  <Label>Status da Conta</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.ativo ? 'Usuário ativo' : 'Usuário bloqueado'}
                  </p>
                </div>
                <Switch
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                  disabled={editingUser.id === user?.id}
                />
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                {editingUser ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
