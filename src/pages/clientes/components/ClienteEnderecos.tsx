import { useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

export function ClienteEnderecos({ form }: { form: any }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'enderecos' })

  const handleCepSearch = async (index: number) => {
    const cep = form.getValues(`enderecos.${index}.cep`)
    if (!cep) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`)
      if (res.ok) {
        const data = await res.json()
        if (!data.erro) {
          form.setValue(`enderecos.${index}.logradouro`, data.logradouro)
          form.setValue(`enderecos.${index}.bairro`, data.bairro)
          form.setValue(`enderecos.${index}.cidade`, data.localidade)
          form.setValue(`enderecos.${index}.estado`, data.uf)
          form.setValue(`enderecos.${index}.pais`, 'Brasil')
        }
      }
    } catch {
      /* intentionally ignored */
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ tipo_endereco: 'Faturamento' })}
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar Endereço
        </Button>
      </div>
      {fields.map((field, index) => (
        <Card key={field.id} className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-destructive"
            onClick={() => remove(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name={`enderecos.${index}.tipo_endereco`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Tipo de Endereço</FormLabel>
                  <Select onValueChange={f.onChange} value={f.value || 'Faturamento'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Faturamento">Faturamento</SelectItem>
                      <SelectItem value="Entrega">Entrega</SelectItem>
                      <SelectItem value="Notify">Notify (Importador)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`enderecos.${index}.cep`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...f} value={f.value || ''} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleCepSearch(index)}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`enderecos.${index}.logradouro`}
              render={({ field: f }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Logradouro</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`enderecos.${index}.numero`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`enderecos.${index}.complemento`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`enderecos.${index}.bairro`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`enderecos.${index}.cidade`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`enderecos.${index}.estado`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Estado/UF</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`enderecos.${index}.pais`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch(`enderecos.${index}.tipo_endereco`) === 'Notify' && (
              <FormField
                control={form.control}
                name={`enderecos.${index}.receiver`}
                render={({ field: f }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Receiver (Nome da Empresa)</FormLabel>
                    <FormControl>
                      <Input {...f} value={f.value || ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>
      ))}
      {fields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
          Nenhum endereço cadastrado.
        </div>
      )}
    </div>
  )
}
