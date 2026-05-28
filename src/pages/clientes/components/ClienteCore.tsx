import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function ClienteCore({ form }: { form: any }) {
  const handleCnpjSearch = async () => {
    const cnpj = form.getValues('cnpj_cpf')
    if (!cnpj) return
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj.replace(/\D/g, '')}`)
      if (res.ok) {
        const data = await res.json()
        form.setValue('nome', data.razao_social)
        form.setValue('nome_fantasia', data.nome_fantasia)
        form.setValue('tipo_pessoa', 'PJ')
      }
    } catch {
      /* intentionally ignored */
    }
  }

  const tipoPessoa = form.watch('tipo_pessoa')
  const temIE = !!form.watch('inscricao_estadual')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="cnpj_cpf"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CNPJ / CPF</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <Button type="button" variant="outline" size="icon" onClick={handleCnpjSearch}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tipo_pessoa"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Pessoa</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || 'PJ'}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                <SelectItem value="PF">Pessoa Física</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Razão Social / Nome</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="nome_fantasia"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Fantasia</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tipo_cliente"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Cliente</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || 'Nacional'}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Nacional">Nacional</SelectItem>
                <SelectItem value="Importador">Importador</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="inscricao_estadual"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Inscrição Estadual (IE)</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  field.onChange(e)
                  if (e.target.value) form.setValue('indicador_ie', '1')
                  else form.setValue('indicador_ie', tipoPessoa === 'PJ' ? '2' : '9')
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="indicador_ie"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indicador IE</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || (temIE ? '1' : tipoPessoa === 'PJ' ? '2' : '9')}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">1 - Contribuinte ICMS</SelectItem>
                <SelectItem value="2">2 - Contribuinte Isento</SelectItem>
                <SelectItem value="9">9 - Não Contribuinte</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-mail Principal</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} type="email" />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="telefone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone Principal</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="col-span-1 md:col-span-2 flex flex-col gap-4 bg-muted/50 p-4 rounded-lg mt-4 border">
        <h3 className="font-semibold text-sm">Acesso Externo & Crédito</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="limite_credito"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Limite de Crédito (R$)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value || 0} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="acesso_portal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-3 shadow-sm h-[68px]">
                <div className="space-y-0.5">
                  <FormLabel>Acesso ao Portal</FormLabel>
                  <div className="text-xs text-muted-foreground">
                    Gerar credenciais e enviar e-mail.
                  </div>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
