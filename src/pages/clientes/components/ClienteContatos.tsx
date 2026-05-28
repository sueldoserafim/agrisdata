import { useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export function ClienteContatos({ form }: { form: any }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'contatos' })
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={() => append({ nome: '' })}>
          <Plus className="w-4 h-4 mr-2" /> Novo Contato
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
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`contatos.${index}.nome`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`contatos.${index}.cargo`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`contatos.${index}.email`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`contatos.${index}.telefone`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`contatos.${index}.whatsapp`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ))}
      {fields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
          Nenhum contato cadastrado.
        </div>
      )}
    </div>
  )
}
