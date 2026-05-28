import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function VendedorCore({ form }: { form: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cpf_cnpj"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPF / CNPJ</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="rg"
        render={({ field }) => (
          <FormItem>
            <FormLabel>RG</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="data_nascimento"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Nascimento</FormLabel>
            <FormControl>
              <Input type="date" {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || 'ativo'}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <div className="md:col-span-2 mt-4">
        <h3 className="font-semibold text-sm mb-4 border-b pb-2">Contato & Localização</h3>
      </div>

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-mail</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email_corporativo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-mail Corporativo</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="telefone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="whatsapp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cep"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEP</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="logradouro"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logradouro</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="numero"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bairro"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bairro</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cidade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cidade</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="estado"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
