import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { VacariaAnimal } from './types'

const schema = z.object({
  brinco: z.string().min(1, 'Obrigatório'),
  nome: z.string().optional(),
  raca: z.string().optional(),
  data_nascimento: z.string().optional(),
  status: z.string().min(1, 'Obrigatório'),
  pai_id: z.string().optional(),
  mae_id: z.string().optional(),
  foto_url: z.string().optional(),
})

export default function VacariaRebanhoForm() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [empresaId, setEmpresaId] = useState('')
  const [animais, setAnimais] = useState<VacariaAnimal[]>([])

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { brinco: '', status: 'ativo' },
  })

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
            supabase
              .from('vacaria_animais')
              .select('*')
              .eq('empresa_id', data.empresa_id)
              .then((res) => {
                if (res.data) setAnimais(res.data)
              })
            if (id) {
              supabase
                .from('vacaria_animais')
                .select('*')
                .eq('id', id)
                .single()
                .then((res) => {
                  if (res.data) form.reset(res.data)
                })
            }
          }
        })
    }
  }, [user, id, form])

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const payload = { ...values, empresa_id: empresaId }
      if (!payload.pai_id) delete payload.pai_id
      if (!payload.mae_id) delete payload.mae_id

      const { error } = id
        ? await supabase.from('vacaria_animais').update(payload).eq('id', id)
        : await supabase.from('vacaria_animais').insert(payload)
      if (error) throw error
      toast({ title: 'Sucesso', description: 'Animal salvo com sucesso!' })
      navigate('/app/vacaria/rebanho')
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const { data, error } = await supabase.storage
      .from('vacaria_fotos')
      .upload(`public/${Date.now()}_${file.name}`, file)
    if (data) {
      const { data: urlData } = supabase.storage.from('vacaria_fotos').getPublicUrl(data.path)
      form.setValue('foto_url', urlData.publicUrl)
      toast({ title: 'Foto enviada' })
    } else if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{id ? 'Editar Animal' : 'Novo Animal'}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="brinco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brinco (SISBOV)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="raca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raça</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data_nascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="vendido">Vendido</SelectItem>
                      <SelectItem value="morto">Morto</SelectItem>
                      <SelectItem value="descarte">Descarte</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Foto</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={uploadPhoto} />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="pai_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pai</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {animais.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.brinco} - {a.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mae_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mãe</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {animais.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.brinco} - {a.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
