import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Trash2, Download, FileText, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormLabel } from '@/components/ui/form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useEmpresa } from '@/hooks/use-empresa'
import { ClienteFormValues } from '../schema'
import { format } from 'date-fns'

interface Props {
  form: UseFormReturn<ClienteFormValues>
  clienteId?: string
}

export function ClienteDocumentos({ form, clienteId }: Props) {
  const { toast } = useToast()
  const { empresa } = useEmpresa()
  const [uploading, setUploading] = useState(false)
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)

  const documentos = form.watch('documentos') || []

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!fileToUpload || !empresa) return

    setUploading(true)
    try {
      const fileExt = fileToUpload.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${empresa.id}/${clienteId || 'temp'}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('clientes-documentos')
        .upload(filePath, fileToUpload)

      if (uploadError) throw uploadError

      const newDoc = {
        titulo: fileToUpload.name,
        arquivo_url: filePath,
        data_emissao: format(new Date(), 'yyyy-MM-dd'),
        tipo_documento: fileExt?.toUpperCase() || 'OUTRO',
        numero_documento: '',
        data_validade: '',
        gerar_alerta: false,
        dias_antecedencia_alerta: null,
      }

      form.setValue('documentos', [...documentos, newDoc], { shouldValidate: true })
      setFileToUpload(null)
      const fileInput = document.getElementById('file-upload') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      toast({ title: 'Sucesso', description: 'Documento enviado com sucesso.' })
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const downloadDoc = async (doc: any) => {
    if (!doc.arquivo_url) return
    if (doc.arquivo_url.startsWith('http')) {
      window.open(doc.arquivo_url, '_blank')
      return
    }
    const { data, error } = await supabase.storage
      .from('clientes-documentos')
      .createSignedUrl(doc.arquivo_url, 3600)
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank')
    } else {
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o link do arquivo.',
        variant: 'destructive',
      })
    }
  }

  const removeDoc = async (index: number) => {
    const doc = documentos[index]

    if (doc.arquivo_url && !doc.arquivo_url.startsWith('http')) {
      try {
        await supabase.storage.from('clientes-documentos').remove([doc.arquivo_url])
      } catch (e) {
        console.error('Error removing file from storage', e)
      }
    }

    const updated = [...documentos]
    updated.splice(index, 1)
    form.setValue('documentos', updated, { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-4 bg-muted/30 p-4 rounded-lg border">
        <div className="flex-1 space-y-2">
          <FormLabel>Novo Documento</FormLabel>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
          />
        </div>
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!fileToUpload || uploading}
          className="w-32"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          Upload
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Arquivo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data Emissão</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentos.map((doc, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    {doc.titulo}
                  </div>
                </TableCell>
                <TableCell>{doc.tipo_documento}</TableCell>
                <TableCell>
                  {doc.data_emissao ? format(new Date(doc.data_emissao), 'dd/MM/yyyy') : '-'}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {doc.arquivo_url && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadDoc(doc)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDoc(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {documentos.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum documento anexado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
