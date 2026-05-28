import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useEmpresa } from '@/hooks/use-empresa'
import { getVendedores } from '@/services/vendedores'
import { ClienteFormValues } from '../schema'

export function ClienteComercial({ form }: { form: UseFormReturn<ClienteFormValues> }) {
  const { empresa } = useEmpresa()
  const [vendedores, setVendedores] = useState<any[]>([])

  useEffect(() => {
    if (empresa) {
      getVendedores(empresa.id).then(({ data }) => {
        if (data) setVendedores(data)
      })
    }
  }, [empresa])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="vendedor_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendedor Responsável</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um vendedor" />
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
                <Input {...field} value={field.value || ''} />
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

        <div className="flex gap-2 items-end">
          <FormField
            control={form.control}
            name="preset_prazo"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Preset Prazo</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" variant="outline" size="icon" className="mb-1">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <FormField
        control={form.control}
        name="observacoes_comerciais"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações Comerciais</FormLabel>
            <FormControl>
              <Textarea {...field} value={field.value || ''} rows={4} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="border rounded-md p-4 space-y-4">
        <h3 className="font-semibold text-lg">Acesso ao Portal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="acesso_portal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2 border p-4 rounded-md h-full">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Ativar acesso ao Portal do Cliente</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="usuario_vinculado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário Vinculado (Portal)</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
