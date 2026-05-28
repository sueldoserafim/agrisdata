export interface VacariaAnimal {
  id: string
  empresa_id: string
  brinco: string
  nome: string | null
  raca: string | null
  data_nascimento: string | null
  status: string
  foto_url: string | null
  pai_id: string | null
  mae_id: string | null
  lote: string | null
  em_quarentena: boolean
  peso_atual: number | null
  data_ultima_pesagem: string | null
}

export interface VacariaEventoReprodutivo {
  id: string
  empresa_id: string
  animal_id: string
  tipo: string
  data_evento: string
  previsao_parto: string | null
  resultado_toque: string | null
  observacoes: string | null
  animal?: VacariaAnimal
}

export interface VacariaProducaoLeite {
  id: string
  empresa_id: string
  animal_id: string
  data_ordenha: string
  volume_litros: number
  ccs: number | null
  cbt: number | null
  periodo: string | null
  observacoes: string | null
  animal?: VacariaAnimal
}

export interface VacariaSaudeAnimal {
  id: string
  empresa_id: string
  animal_id: string
  tipo: string
  data_registro: string
  descricao: string | null
  medicamento: string | null
  resultado: string | null
  data_proxima_dose: string | null
  peso_kg: number | null
  animal?: VacariaAnimal
}
