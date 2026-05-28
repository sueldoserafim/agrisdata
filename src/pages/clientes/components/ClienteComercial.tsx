import { UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ClienteFormValues } from '../schema'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useEmpresa } from '@/hooks/use-empresa'

interface ClienteComercialProps {
  form: UseFormReturn<ClienteFormValues>
}

export function ClienteComercial({ form }: ClienteComercialProps) {
  const { empresa } = useEmpresa()
  const [moedas, setMoedas] = useState<any[]>([])
  const [portos, setPortos] = useState<any[]>([])
  const [vendedores, setVendedores] = useState<any[]>([])

  useEffect(() => {
    if (!empresa) return
    const fetchData = async () => {
      const [moedasRes, portosRes, vendedoresRes] = await Promise.all([
        supabase
          .from('moedas' as any)
          .select('*')
          .eq('empresa_id', empresa.id)
          .is('deleted_at', null),
        supabase.from('portos').select('*').eq('empresa_id', empresa.id).is('deleted_at', null),
        supabase.from('vendedores').select('*').eq('empresa_id', empresa.id).is('deleted_at', null),
      ])
      if (moedasRes.data) setMoedas(moedasRes.data)
      if (portosRes.data) setPortos(portosRes.data)
      if (vendedoresRes.data) setVendedores(vendedoresRes.data)
    }
    fetchData()
  }, [empresa])

  const tipoCliente = form.watch('tipo_cliente')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="tipo_cliente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Cliente</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || undefined}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Nacional">Nacional</SelectItem>
                  <SelectItem value="Internacional">Internacional</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pais"
          render={({ field }) => (
            <FormItem>
              <FormLabel>País</FormLabel>
              <FormControl>
                <Input placeholder="País" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="moeda_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moeda</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || undefined}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {moedas.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nome} ({m.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {tipoCliente === 'Internacional' && (
          <FormField
            control={form.control}
            name="porto_destino_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porto Destino</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {portos.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nome_porto} {p.cidade ? `- ${p.cidade}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="vendedor_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendedor</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || undefined}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vendedores.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="limite_credito"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limite de Crédito</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="forma_pagamento_padrao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forma de Pagamento Padrão</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Boleto 30 dias" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="desconto_padrao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desconto Padrão (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prazo_dias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prazo Médio (Dias)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 30,60,90" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="observacoes_comerciais"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações Comerciais</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Observações adicionais sobre a negociação..."
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
