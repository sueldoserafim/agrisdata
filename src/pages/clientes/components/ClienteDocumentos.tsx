import { useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export function ClienteDocumentos({ form }: { form: any }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'documentos' })
  const { toast } = useToast()

  const handleUpload = async (e: any, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`

    try {
      const { data, error } = await supabase.storage
        .from('documentos')
        .upload(`entidades/${fileName}`, file)
      if (error) throw error
      const {
        data: { publicUrl },
      } = supabase.storage.from('documentos').getPublicUrl(data.path)
      form.setValue(`documentos.${index}.arquivo_url`, publicUrl)
      toast({ title: 'Sucesso', description: 'Arquivo anexado.' })
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={() => append({ titulo: '' })}>
          <Plus className="w-4 h-4 mr-2" /> Novo Documento
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
              name={`documentos.${index}.titulo`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`documentos.${index}.tipo_documento`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`documentos.${index}.numero_documento`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Número / Referência</FormLabel>
                  <FormControl>
                    <Input {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Arquivo</FormLabel>
              <FormControl>
                <div className="flex gap-2 items-center">
                  <Input
                    type="file"
                    onChange={(e) => handleUpload(e, index)}
                    className="cursor-pointer"
                  />
                  {form.watch(`documentos.${index}.arquivo_url`) && (
                    <span className="text-xs text-green-600 font-semibold truncate max-w-[100px]">
                      Anexado
                    </span>
                  )}
                </div>
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name={`documentos.${index}.data_emissao`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Emissão</FormLabel>
                  <FormControl>
                    <Input type="date" {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`documentos.${index}.data_validade`}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Validade</FormLabel>
                  <FormControl>
                    <Input type="date" {...f} value={f.value || ''} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`documentos.${index}.gerar_alerta`}
              render={({ field: f }) => (
                <FormItem className="flex items-center gap-2 pt-8">
                  <FormControl>
                    <Switch checked={f.value} onCheckedChange={f.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">Gerar Alerta de Vencimento</FormLabel>
                </FormItem>
              )}
            />
            {form.watch(`documentos.${index}.gerar_alerta`) && (
              <FormField
                control={form.control}
                name={`documentos.${index}.dias_antecedencia_alerta`}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel>Dias de Antecedência</FormLabel>
                    <FormControl>
                      <Input type="number" {...f} value={f.value || 0} />
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
          Nenhum documento cadastrado.
        </div>
      )}
    </div>
  )
}
