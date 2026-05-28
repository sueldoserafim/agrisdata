import { useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export function ClienteBancos({ form }: { form: any }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'bancos' })
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={() => append({ banco_nome: '' })}>
          <Plus className="w-4 h-4 mr-2" /> Nova Conta Bancária
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
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name={`bancos.${index}.banco_nome`}
              render={({ field: f }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Banco</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`bancos.${index}.banco_codigo`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`bancos.${index}.tipo_conta`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`bancos.${index}.agencia`}
              render={({ field: f }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Agência</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`bancos.${index}.conta`}
              render={({ field: f }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Conta</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`bancos.${index}.chave_pix_tipo`}
              render={({ field: f }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Tipo Chave PIX</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`bancos.${index}.chave_pix`}
              render={({ field: f }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Chave PIX</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`bancos.${index}.swift`}
              render={({ field: f }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>SWIFT</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`bancos.${index}.iban`}
              render={({ field: f }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>IBAN</FormLabel>
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
          Nenhuma conta cadastrada.
        </div>
      )}
    </div>
  )
}
