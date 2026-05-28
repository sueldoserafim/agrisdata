import { z } from 'zod'

export const clienteSchema = z.object({
  nome: z.string().min(1, 'Obrigatório'),
  nome_fantasia: z.string().optional().nullable(),
  cnpj_cpf: z.string().min(1, 'Obrigatório').max(30, 'O documento não pode exceder 30 caracteres'),
  email: z.string().optional().nullable(),
  telefone: z.string().max(30, 'O telefone não pode exceder 30 caracteres').optional().nullable(),
  tipo_cliente: z.string().optional().nullable(),
  tipo_pessoa: z.string().min(1, 'Obrigatório'),
  indicador_ie: z.string().optional().nullable(),
  inscricao_estadual: z
    .string()
    .max(30, 'A inscrição estadual não pode exceder 30 caracteres')
    .optional()
    .nullable(),
  inscricao_municipal: z.string().optional().nullable(),
  vendedor_id: z.string().optional().nullable(),
  limite_credito: z.coerce.number().optional().nullable(),
  acesso_portal: z.boolean().default(false),
  enderecos: z.array(
    z.object({
      tipo_endereco: z.string(),
      logradouro: z.string().optional().nullable(),
      numero: z.string().optional().nullable(),
      complemento: z.string().optional().nullable(),
      bairro: z.string().optional().nullable(),
      cidade: z.string().optional().nullable(),
      estado: z.string().optional().nullable(),
      cep: z.string().max(20, 'O CEP não pode exceder 20 caracteres').optional().nullable(),
      pais: z.string().optional().nullable(),
      receiver: z.string().optional().nullable(),
    }),
  ),
  contatos: z.array(
    z.object({
      nome: z.string(),
      telefone: z
        .string()
        .max(30, 'O telefone não pode exceder 30 caracteres')
        .optional()
        .nullable(),
      email: z.string().optional().nullable(),
      cargo: z.string().optional().nullable(),
      whatsapp: z
        .string()
        .max(30, 'O whatsapp não pode exceder 30 caracteres')
        .optional()
        .nullable(),
    }),
  ),
  bancos: z.array(
    z.object({
      banco_nome: z.string().optional().nullable(),
      banco_codigo: z.string().optional().nullable(),
      agencia: z.string().optional().nullable(),
      conta: z.string().optional().nullable(),
      tipo_conta: z.string().optional().nullable(),
      swift: z.string().optional().nullable(),
      iban: z.string().optional().nullable(),
      chave_pix_tipo: z.string().optional().nullable(),
      chave_pix: z.string().optional().nullable(),
    }),
  ),
  documentos: z.array(
    z.object({
      tipo_documento: z.string().optional().nullable(),
      numero_documento: z.string().optional().nullable(),
      titulo: z.string().min(1, 'Obrigatório'),
      arquivo_url: z.string().optional().nullable(),
      data_emissao: z.string().optional().nullable(),
      data_validade: z.string().optional().nullable(),
      gerar_alerta: z.boolean().default(false),
      dias_antecedencia_alerta: z.coerce.number().optional().nullable(),
    }),
  ),
})
export type ClienteFormValues = z.infer<typeof clienteSchema>
