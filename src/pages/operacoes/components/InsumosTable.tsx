import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function InsumosTable({ produtos, lotesEstoque }: { produtos: any[]; lotesEstoque: any[] }) {
  const { control, watch, setValue, register } = useFormContext()
  const { fields, append, remove } = useFieldArray({ control, name: 'insumos' })
  const insumosWatch = watch('insumos') || []

  const handleProdutoChange = (index: number, val: string) => {
    setValue(`insumos.${index}.produto_id`, val)
    const p = produtos.find((x) => x.id === val)
    setValue(`insumos.${index}.unidade`, p?.unidade_medida || '')
    setValue(`insumos.${index}.custo_unit`, p?.preco_unitario || 0)
    setValue(`insumos.${index}.lote_id`, '')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Insumos Utilizados</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ produto_id: '', quantidade_utilizada: 1 })}
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar Insumo
        </Button>
      </div>
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Produto</TableHead>
              <TableHead className="min-w-[150px]">Lote</TableHead>
              <TableHead>Qtd.</TableHead>
              <TableHead>Unid.</TableHead>
              <TableHead>Área Aplic. (ha)</TableHead>
              <TableHead>Custo Unit.</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => {
              const currentProdId = insumosWatch[index]?.produto_id
              const prodLotes = lotesEstoque.filter((l) => l.produto_id === currentProdId)
              return (
                <TableRow key={field.id}>
                  <TableCell>
                    <Select
                      value={currentProdId || ''}
                      onValueChange={(v) => handleProdutoChange(index, v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {produtos.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={insumosWatch[index]?.lote_id || ''}
                      onValueChange={(v) => setValue(`insumos.${index}.lote_id`, v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {prodLotes.map((l) => (
                          <SelectItem key={l.id} value={l.id}>
                            {l.numero_lote || 'S/L'} ({l.quantidade} disp.)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`insumos.${index}.quantidade_utilizada`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      readOnly
                      value={insumosWatch[index]?.unidade || ''}
                      className="bg-muted"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`insumos.${index}.area_aplicada_ha`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      readOnly
                      value={insumosWatch[index]?.custo_unit || 0}
                      className="bg-muted"
                    />
                  </TableCell>
                  <TableCell>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {fields.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Nenhum insumo adicionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
