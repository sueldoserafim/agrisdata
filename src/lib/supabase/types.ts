// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      account_sales: {
        Row: {
          comissoes: number | null
          container_id: string | null
          created_at: string | null
          data_venda: string | null
          deleted_at: string | null
          despesas_internacionais: number | null
          empresa_id: string
          id: string
          invoice_id: string | null
          margem_percentual: number | null
          status: string | null
          taxa_cambio: number | null
          updated_at: string | null
          valor_bruto: number | null
          valor_liquido: number | null
        }
        Insert: {
          comissoes?: number | null
          container_id?: string | null
          created_at?: string | null
          data_venda?: string | null
          deleted_at?: string | null
          despesas_internacionais?: number | null
          empresa_id: string
          id?: string
          invoice_id?: string | null
          margem_percentual?: number | null
          status?: string | null
          taxa_cambio?: number | null
          updated_at?: string | null
          valor_bruto?: number | null
          valor_liquido?: number | null
        }
        Update: {
          comissoes?: number | null
          container_id?: string | null
          created_at?: string | null
          data_venda?: string | null
          deleted_at?: string | null
          despesas_internacionais?: number | null
          empresa_id?: string
          id?: string
          invoice_id?: string | null
          margem_percentual?: number | null
          status?: string | null
          taxa_cambio?: number | null
          updated_at?: string | null
          valor_bruto?: number | null
          valor_liquido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'account_sales_container_id_fkey'
            columns: ['container_id']
            isOneToOne: false
            referencedRelation: 'containers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'account_sales_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'account_sales_invoice_id_fkey'
            columns: ['invoice_id']
            isOneToOne: false
            referencedRelation: 'invoices_exportacao'
            referencedColumns: ['id']
          },
        ]
      }
      adiantamentos_internacionais: {
        Row: {
          cliente_id: string
          created_at: string | null
          data_adiantamento: string | null
          data_prevista_reembolso: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          invoice_id: string | null
          numero_adiantamento: string
          observacoes: string | null
          status: string | null
          taxa_cambio: number | null
          updated_at: string | null
          valor_brl: number | null
          valor_usd: number | null
        }
        Insert: {
          cliente_id: string
          created_at?: string | null
          data_adiantamento?: string | null
          data_prevista_reembolso?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          invoice_id?: string | null
          numero_adiantamento: string
          observacoes?: string | null
          status?: string | null
          taxa_cambio?: number | null
          updated_at?: string | null
          valor_brl?: number | null
          valor_usd?: number | null
        }
        Update: {
          cliente_id?: string
          created_at?: string | null
          data_adiantamento?: string | null
          data_prevista_reembolso?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          invoice_id?: string | null
          numero_adiantamento?: string
          observacoes?: string | null
          status?: string | null
          taxa_cambio?: number | null
          updated_at?: string | null
          valor_brl?: number | null
          valor_usd?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'adiantamentos_internacionais_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'adiantamentos_internacionais_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'adiantamentos_internacionais_invoice_id_fkey'
            columns: ['invoice_id']
            isOneToOne: false
            referencedRelation: 'invoices_exportacao'
            referencedColumns: ['id']
          },
        ]
      }
      alertas: {
        Row: {
          created_at: string | null
          descricao: string | null
          empresa_id: string
          id: string
          lido: boolean | null
          tipo: string
          titulo: string
          updated_at: string | null
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          lido?: boolean | null
          tipo: string
          titulo: string
          updated_at?: string | null
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          lido?: boolean | null
          tipo?: string
          titulo?: string
          updated_at?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'alertas_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'alertas_usuario_id_fkey'
            columns: ['usuario_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      amostras_qualidade_campo: {
        Row: {
          acidez_titulavel: number | null
          apto_colheita: boolean | null
          brix_maximo: number | null
          brix_medio: number | null
          brix_minimo: number | null
          coloracao_escala: number | null
          cor: string | null
          created_at: string | null
          data_coleta: string | null
          data_estimada_colheita: string | null
          defeitos_percentual: number | null
          deleted_at: string | null
          empresa_id: string
          estagio_fenologico: string | null
          firmeza: string | null
          firmeza_media: number | null
          fotos: string[] | null
          id: string
          observacoes: string | null
          peso_medio_fruto: number | null
          ratio_brix_acidez: number | null
          safra_id: string | null
          solidos_soluveis_brix: number | null
          talhao_id: string
          tamanho_amostra_frutos: number | null
          tamanho_fruto_mm: number | null
          updated_at: string | null
        }
        Insert: {
          acidez_titulavel?: number | null
          apto_colheita?: boolean | null
          brix_maximo?: number | null
          brix_medio?: number | null
          brix_minimo?: number | null
          coloracao_escala?: number | null
          cor?: string | null
          created_at?: string | null
          data_coleta?: string | null
          data_estimada_colheita?: string | null
          defeitos_percentual?: number | null
          deleted_at?: string | null
          empresa_id: string
          estagio_fenologico?: string | null
          firmeza?: string | null
          firmeza_media?: number | null
          fotos?: string[] | null
          id?: string
          observacoes?: string | null
          peso_medio_fruto?: number | null
          ratio_brix_acidez?: number | null
          safra_id?: string | null
          solidos_soluveis_brix?: number | null
          talhao_id: string
          tamanho_amostra_frutos?: number | null
          tamanho_fruto_mm?: number | null
          updated_at?: string | null
        }
        Update: {
          acidez_titulavel?: number | null
          apto_colheita?: boolean | null
          brix_maximo?: number | null
          brix_medio?: number | null
          brix_minimo?: number | null
          coloracao_escala?: number | null
          cor?: string | null
          created_at?: string | null
          data_coleta?: string | null
          data_estimada_colheita?: string | null
          defeitos_percentual?: number | null
          deleted_at?: string | null
          empresa_id?: string
          estagio_fenologico?: string | null
          firmeza?: string | null
          firmeza_media?: number | null
          fotos?: string[] | null
          id?: string
          observacoes?: string | null
          peso_medio_fruto?: number | null
          ratio_brix_acidez?: number | null
          safra_id?: string | null
          solidos_soluveis_brix?: number | null
          talhao_id?: string
          tamanho_amostra_frutos?: number | null
          tamanho_fruto_mm?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'amostras_qualidade_campo_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'amostras_qualidade_campo_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'amostras_qualidade_campo_talhao_id_fkey'
            columns: ['talhao_id']
            isOneToOne: false
            referencedRelation: 'talhoes'
            referencedColumns: ['id']
          },
        ]
      }
      analises_solo: {
        Row: {
          areia: number | null
          argila: number | null
          boro: number | null
          calcario_recomendado: number | null
          calcio: number | null
          cobre: number | null
          created_at: string | null
          ctc: number | null
          data_coleta: string | null
          deleted_at: string | null
          empresa_id: string
          enxofre: number | null
          ferro: number | null
          fosforo: number | null
          gesso_recomendado: number | null
          id: string
          laboratorio: string | null
          laudo_pdf_url: string | null
          magnesio: number | null
          manganes: number | null
          materia_organica: number | null
          metodologia: string | null
          nitrogenio: number | null
          ph: number | null
          potassio: number | null
          profundidade_cm: number | null
          saturacao_bases: number | null
          silte: number | null
          talhao_id: string
          updated_at: string | null
          zinco: number | null
        }
        Insert: {
          areia?: number | null
          argila?: number | null
          boro?: number | null
          calcario_recomendado?: number | null
          calcio?: number | null
          cobre?: number | null
          created_at?: string | null
          ctc?: number | null
          data_coleta?: string | null
          deleted_at?: string | null
          empresa_id: string
          enxofre?: number | null
          ferro?: number | null
          fosforo?: number | null
          gesso_recomendado?: number | null
          id?: string
          laboratorio?: string | null
          laudo_pdf_url?: string | null
          magnesio?: number | null
          manganes?: number | null
          materia_organica?: number | null
          metodologia?: string | null
          nitrogenio?: number | null
          ph?: number | null
          potassio?: number | null
          profundidade_cm?: number | null
          saturacao_bases?: number | null
          silte?: number | null
          talhao_id: string
          updated_at?: string | null
          zinco?: number | null
        }
        Update: {
          areia?: number | null
          argila?: number | null
          boro?: number | null
          calcario_recomendado?: number | null
          calcio?: number | null
          cobre?: number | null
          created_at?: string | null
          ctc?: number | null
          data_coleta?: string | null
          deleted_at?: string | null
          empresa_id?: string
          enxofre?: number | null
          ferro?: number | null
          fosforo?: number | null
          gesso_recomendado?: number | null
          id?: string
          laboratorio?: string | null
          laudo_pdf_url?: string | null
          magnesio?: number | null
          manganes?: number | null
          materia_organica?: number | null
          metodologia?: string | null
          nitrogenio?: number | null
          ph?: number | null
          potassio?: number | null
          profundidade_cm?: number | null
          saturacao_bases?: number | null
          silte?: number | null
          talhao_id?: string
          updated_at?: string | null
          zinco?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'analises_solo_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'analises_solo_talhao_id_fkey'
            columns: ['talhao_id']
            isOneToOne: false
            referencedRelation: 'talhoes'
            referencedColumns: ['id']
          },
        ]
      }
      armazens: {
        Row: {
          capacidade_toneladas: number | null
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          fazenda_id: string | null
          id: string
          localizacao: string | null
          nome: string
          responsavel_id: string | null
          temp_maxima: number | null
          temp_minima: number | null
          temperatura_controlada: boolean | null
          tipo: string | null
          updated_at: string | null
          usa_peps: boolean | null
        }
        Insert: {
          capacidade_toneladas?: number | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          fazenda_id?: string | null
          id?: string
          localizacao?: string | null
          nome: string
          responsavel_id?: string | null
          temp_maxima?: number | null
          temp_minima?: number | null
          temperatura_controlada?: boolean | null
          tipo?: string | null
          updated_at?: string | null
          usa_peps?: boolean | null
        }
        Update: {
          capacidade_toneladas?: number | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          fazenda_id?: string | null
          id?: string
          localizacao?: string | null
          nome?: string
          responsavel_id?: string | null
          temp_maxima?: number | null
          temp_minima?: number | null
          temperatura_controlada?: boolean | null
          tipo?: string | null
          updated_at?: string | null
          usa_peps?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'armazens_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'armazens_fazenda_id_fkey'
            columns: ['fazenda_id']
            isOneToOne: false
            referencedRelation: 'fazendas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'armazens_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      audit_logs: {
        Row: {
          acao: string | null
          created_at: string | null
          dados_anteriores: Json | null
          dados_novos: Json | null
          empresa_id: string
          id: string
          registro_id: string | null
          tabela: string | null
          usuario_id: string | null
        }
        Insert: {
          acao?: string | null
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          empresa_id: string
          id?: string
          registro_id?: string | null
          tabela?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string | null
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          empresa_id?: string
          id?: string
          registro_id?: string | null
          tabela?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'audit_logs_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'audit_logs_usuario_id_fkey'
            columns: ['usuario_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      balanco_massas: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          descarte_excesso_kg: number | null
          descarte_qualidade_kg: number | null
          doacao_kg: number | null
          empresa_id: string
          exportacao_kg: number | null
          id: string
          mercado_interno_kg: number | null
          perda_campo_kg: number | null
          perda_packing_kg: number | null
          quantidade_colhida_kg: number | null
          quantidade_descarte_kg: number | null
          quantidade_plantada_kg: number | null
          quantidade_processada_kg: number | null
          safra_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          descarte_excesso_kg?: number | null
          descarte_qualidade_kg?: number | null
          doacao_kg?: number | null
          empresa_id: string
          exportacao_kg?: number | null
          id?: string
          mercado_interno_kg?: number | null
          perda_campo_kg?: number | null
          perda_packing_kg?: number | null
          quantidade_colhida_kg?: number | null
          quantidade_descarte_kg?: number | null
          quantidade_plantada_kg?: number | null
          quantidade_processada_kg?: number | null
          safra_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          descarte_excesso_kg?: number | null
          descarte_qualidade_kg?: number | null
          doacao_kg?: number | null
          empresa_id?: string
          exportacao_kg?: number | null
          id?: string
          mercado_interno_kg?: number | null
          perda_campo_kg?: number | null
          perda_packing_kg?: number | null
          quantidade_colhida_kg?: number | null
          quantidade_descarte_kg?: number | null
          quantidade_plantada_kg?: number | null
          quantidade_processada_kg?: number | null
          safra_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'balanco_massas_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'balanco_massas_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: true
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
        ]
      }
      bookings: {
        Row: {
          agente_maritimo: string | null
          created_at: string
          data_eta: string | null
          data_etd: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          navio_id: string | null
          numero_booking: string
          observacoes: string | null
          porto_destino_id: string | null
          porto_origem_id: string | null
          quantidade_containeres: number | null
          status: Database['public']['Enums']['booking_status_enum'] | null
          tipo_container: Database['public']['Enums']['tipo_container_enum'] | null
          updated_at: string
        }
        Insert: {
          agente_maritimo?: string | null
          created_at?: string
          data_eta?: string | null
          data_etd?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          navio_id?: string | null
          numero_booking: string
          observacoes?: string | null
          porto_destino_id?: string | null
          porto_origem_id?: string | null
          quantidade_containeres?: number | null
          status?: Database['public']['Enums']['booking_status_enum'] | null
          tipo_container?: Database['public']['Enums']['tipo_container_enum'] | null
          updated_at?: string
        }
        Update: {
          agente_maritimo?: string | null
          created_at?: string
          data_eta?: string | null
          data_etd?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          navio_id?: string | null
          numero_booking?: string
          observacoes?: string | null
          porto_destino_id?: string | null
          porto_origem_id?: string | null
          quantidade_containeres?: number | null
          status?: Database['public']['Enums']['booking_status_enum'] | null
          tipo_container?: Database['public']['Enums']['tipo_container_enum'] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'bookings_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bookings_navio_id_fkey'
            columns: ['navio_id']
            isOneToOne: false
            referencedRelation: 'navios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bookings_porto_destino_id_fkey'
            columns: ['porto_destino_id']
            isOneToOne: false
            referencedRelation: 'portos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bookings_porto_origem_id_fkey'
            columns: ['porto_origem_id']
            isOneToOne: false
            referencedRelation: 'portos'
            referencedColumns: ['id']
          },
        ]
      }
      caderno_campo: {
        Row: {
          created_at: string | null
          data: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          observacoes: string | null
          responsavel_id: string | null
          talhao_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          observacoes?: string | null
          responsavel_id?: string | null
          talhao_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          observacoes?: string | null
          responsavel_id?: string | null
          talhao_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'caderno_campo_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'caderno_campo_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'caderno_campo_talhao_id_fkey'
            columns: ['talhao_id']
            isOneToOne: false
            referencedRelation: 'talhoes'
            referencedColumns: ['id']
          },
        ]
      }
      carregamentos: {
        Row: {
          created_at: string
          data_carregamento: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          placa_veiculo: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_carregamento?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          placa_veiculo?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_carregamento?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          placa_veiculo?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'carregamentos_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      centros_custo: {
        Row: {
          codigo: string | null
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          codigo?: string | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          codigo?: string | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'centros_custo_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      certificacoes_auditorias: {
        Row: {
          auditor_nome: string | null
          created_at: string | null
          data_agendada: string
          data_realizada: string | null
          deleted_at: string | null
          empresa_id: string
          escopo: string | null
          id: string
          modelo_id: string
          responsavel_id: string | null
          score_final: number | null
          status: string | null
          tipo_auditoria: string
          updated_at: string | null
        }
        Insert: {
          auditor_nome?: string | null
          created_at?: string | null
          data_agendada: string
          data_realizada?: string | null
          deleted_at?: string | null
          empresa_id: string
          escopo?: string | null
          id?: string
          modelo_id: string
          responsavel_id?: string | null
          score_final?: number | null
          status?: string | null
          tipo_auditoria: string
          updated_at?: string | null
        }
        Update: {
          auditor_nome?: string | null
          created_at?: string | null
          data_agendada?: string
          data_realizada?: string | null
          deleted_at?: string | null
          empresa_id?: string
          escopo?: string | null
          id?: string
          modelo_id?: string
          responsavel_id?: string | null
          score_final?: number | null
          status?: string | null
          tipo_auditoria?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'certificacoes_auditorias_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'certificacoes_auditorias_modelo_id_fkey'
            columns: ['modelo_id']
            isOneToOne: false
            referencedRelation: 'certificacoes_modelos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'certificacoes_auditorias_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      certificacoes_itens_auditoria: {
        Row: {
          auditoria_id: string
          created_at: string | null
          evidencias_url: string[] | null
          id: string
          item_modelo_id: string
          observacoes: string | null
          resposta: string | null
          updated_at: string | null
        }
        Insert: {
          auditoria_id: string
          created_at?: string | null
          evidencias_url?: string[] | null
          id?: string
          item_modelo_id: string
          observacoes?: string | null
          resposta?: string | null
          updated_at?: string | null
        }
        Update: {
          auditoria_id?: string
          created_at?: string | null
          evidencias_url?: string[] | null
          id?: string
          item_modelo_id?: string
          observacoes?: string | null
          resposta?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'certificacoes_itens_auditoria_auditoria_id_fkey'
            columns: ['auditoria_id']
            isOneToOne: false
            referencedRelation: 'certificacoes_auditorias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'certificacoes_itens_auditoria_item_modelo_id_fkey'
            columns: ['item_modelo_id']
            isOneToOne: false
            referencedRelation: 'certificacoes_itens_modelo'
            referencedColumns: ['id']
          },
        ]
      }
      certificacoes_itens_modelo: {
        Row: {
          created_at: string | null
          descricao: string
          gravidade_default: string | null
          id: string
          modelo_id: string
          peso: number | null
          requisito_legal: boolean | null
          secao: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao: string
          gravidade_default?: string | null
          id?: string
          modelo_id: string
          peso?: number | null
          requisito_legal?: boolean | null
          secao?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string
          gravidade_default?: string | null
          id?: string
          modelo_id?: string
          peso?: number | null
          requisito_legal?: boolean | null
          secao?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'certificacoes_itens_modelo_modelo_id_fkey'
            columns: ['modelo_id']
            isOneToOne: false
            referencedRelation: 'certificacoes_modelos'
            referencedColumns: ['id']
          },
        ]
      }
      certificacoes_modelos: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          nome: string
          status: string | null
          tipo: string
          updated_at: string | null
          versao: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          nome: string
          status?: string | null
          tipo: string
          updated_at?: string | null
          versao: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          status?: string | null
          tipo?: string
          updated_at?: string | null
          versao?: string
        }
        Relationships: [
          {
            foreignKeyName: 'certificacoes_modelos_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      clientes: {
        Row: {
          acesso_portal: boolean | null
          cnpj_cpf: string | null
          created_at: string | null
          deleted_at: string | null
          desconto_padrao: number | null
          email: string | null
          empresa_id: string
          forma_pagamento_padrao: string | null
          id: string
          indicador_ie: string | null
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          limite_credito: number | null
          moeda_id: string | null
          nome: string
          nome_fantasia: string | null
          observacoes_comerciais: string | null
          pais: string | null
          porto_destino_id: string | null
          prazo_dias: string | null
          preset_prazo: string | null
          telefone: string | null
          tipo_cliente: string | null
          tipo_pessoa: string | null
          updated_at: string | null
          usuario_vinculado: string | null
          vendedor_id: string | null
        }
        Insert: {
          acesso_portal?: boolean | null
          cnpj_cpf?: string | null
          created_at?: string | null
          deleted_at?: string | null
          desconto_padrao?: number | null
          email?: string | null
          empresa_id: string
          forma_pagamento_padrao?: string | null
          id?: string
          indicador_ie?: string | null
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          limite_credito?: number | null
          moeda_id?: string | null
          nome: string
          nome_fantasia?: string | null
          observacoes_comerciais?: string | null
          pais?: string | null
          porto_destino_id?: string | null
          prazo_dias?: string | null
          preset_prazo?: string | null
          telefone?: string | null
          tipo_cliente?: string | null
          tipo_pessoa?: string | null
          updated_at?: string | null
          usuario_vinculado?: string | null
          vendedor_id?: string | null
        }
        Update: {
          acesso_portal?: boolean | null
          cnpj_cpf?: string | null
          created_at?: string | null
          deleted_at?: string | null
          desconto_padrao?: number | null
          email?: string | null
          empresa_id?: string
          forma_pagamento_padrao?: string | null
          id?: string
          indicador_ie?: string | null
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          limite_credito?: number | null
          moeda_id?: string | null
          nome?: string
          nome_fantasia?: string | null
          observacoes_comerciais?: string | null
          pais?: string | null
          porto_destino_id?: string | null
          prazo_dias?: string | null
          preset_prazo?: string | null
          telefone?: string | null
          tipo_cliente?: string | null
          tipo_pessoa?: string | null
          updated_at?: string | null
          usuario_vinculado?: string | null
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'clientes_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'clientes_moeda_id_fkey'
            columns: ['moeda_id']
            isOneToOne: false
            referencedRelation: 'moedas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'clientes_porto_destino_id_fkey'
            columns: ['porto_destino_id']
            isOneToOne: false
            referencedRelation: 'portos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'clientes_vendedor_id_fkey'
            columns: ['vendedor_id']
            isOneToOne: false
            referencedRelation: 'vendedores'
            referencedColumns: ['id']
          },
        ]
      }
      colheita_registros: {
        Row: {
          area_colhida_ha: number | null
          brix_medio: number | null
          created_at: string | null
          data_colheita: string | null
          deleted_at: string | null
          destino_producao: string | null
          empresa_id: string
          equipamento_id: string | null
          fotos: string[] | null
          id: string
          lote_producao: string | null
          numero_caixas: number | null
          observacoes: string | null
          operadores: Json | null
          perdas_ton: number | null
          producao_bruta_ton: number | null
          producao_liquida_ton: number | null
          qualidade_visual: string | null
          quantidade_colhida_kg: number | null
          responsavel_id: string | null
          safra_id: string
          temperatura_colheita: number | null
          updated_at: string | null
        }
        Insert: {
          area_colhida_ha?: number | null
          brix_medio?: number | null
          created_at?: string | null
          data_colheita?: string | null
          deleted_at?: string | null
          destino_producao?: string | null
          empresa_id: string
          equipamento_id?: string | null
          fotos?: string[] | null
          id?: string
          lote_producao?: string | null
          numero_caixas?: number | null
          observacoes?: string | null
          operadores?: Json | null
          perdas_ton?: number | null
          producao_bruta_ton?: number | null
          producao_liquida_ton?: number | null
          qualidade_visual?: string | null
          quantidade_colhida_kg?: number | null
          responsavel_id?: string | null
          safra_id: string
          temperatura_colheita?: number | null
          updated_at?: string | null
        }
        Update: {
          area_colhida_ha?: number | null
          brix_medio?: number | null
          created_at?: string | null
          data_colheita?: string | null
          deleted_at?: string | null
          destino_producao?: string | null
          empresa_id?: string
          equipamento_id?: string | null
          fotos?: string[] | null
          id?: string
          lote_producao?: string | null
          numero_caixas?: number | null
          observacoes?: string | null
          operadores?: Json | null
          perdas_ton?: number | null
          producao_bruta_ton?: number | null
          producao_liquida_ton?: number | null
          qualidade_visual?: string | null
          quantidade_colhida_kg?: number | null
          responsavel_id?: string | null
          safra_id?: string
          temperatura_colheita?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'colheita_registros_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'colheita_registros_equipamento_id_fkey'
            columns: ['equipamento_id']
            isOneToOne: false
            referencedRelation: 'equipamentos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'colheita_registros_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'colheita_registros_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
        ]
      }
      compras_cotacao_fornecedores: {
        Row: {
          condicao_pagamento: string | null
          cotacao_id: string
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          fornecedor_id: string
          id: string
          prazo_entrega_dias: number
          preco_unitario: number
          score_final: number | null
          updated_at: string | null
          validade_cotacao: string | null
          vencedor: boolean | null
        }
        Insert: {
          condicao_pagamento?: string | null
          cotacao_id: string
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          fornecedor_id: string
          id?: string
          prazo_entrega_dias: number
          preco_unitario: number
          score_final?: number | null
          updated_at?: string | null
          validade_cotacao?: string | null
          vencedor?: boolean | null
        }
        Update: {
          condicao_pagamento?: string | null
          cotacao_id?: string
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          fornecedor_id?: string
          id?: string
          prazo_entrega_dias?: number
          preco_unitario?: number
          score_final?: number | null
          updated_at?: string | null
          validade_cotacao?: string | null
          vencedor?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'compras_cotacao_fornecedores_cotacao_id_fkey'
            columns: ['cotacao_id']
            isOneToOne: false
            referencedRelation: 'compras_cotacoes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'compras_cotacao_fornecedores_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'compras_cotacao_fornecedores_fornecedor_id_fkey'
            columns: ['fornecedor_id']
            isOneToOne: false
            referencedRelation: 'fornecedores'
            referencedColumns: ['id']
          },
        ]
      }
      compras_cotacoes: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          prazo_respostas: string
          requisicao_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          prazo_respostas: string
          requisicao_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          prazo_respostas?: string
          requisicao_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'compras_cotacoes_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'compras_cotacoes_requisicao_id_fkey'
            columns: ['requisicao_id']
            isOneToOne: false
            referencedRelation: 'compras_requisicao'
            referencedColumns: ['id']
          },
        ]
      }
      compras_pedido: {
        Row: {
          avaliacao_recebimento: string | null
          condicoes_pagamento: string | null
          created_at: string | null
          data_entrega_prevista: string | null
          data_pedido: string | null
          deleted_at: string | null
          empresa_id: string
          fornecedor_id: string | null
          id: string
          numero_nota_fiscal: string | null
          observacoes: string | null
          preco_unitario: number | null
          produto_id: string
          quantidade: number | null
          requisicao_id: string
          status: string | null
          total_pedido: number | null
          updated_at: string | null
        }
        Insert: {
          avaliacao_recebimento?: string | null
          condicoes_pagamento?: string | null
          created_at?: string | null
          data_entrega_prevista?: string | null
          data_pedido?: string | null
          deleted_at?: string | null
          empresa_id: string
          fornecedor_id?: string | null
          id?: string
          numero_nota_fiscal?: string | null
          observacoes?: string | null
          preco_unitario?: number | null
          produto_id: string
          quantidade?: number | null
          requisicao_id: string
          status?: string | null
          total_pedido?: number | null
          updated_at?: string | null
        }
        Update: {
          avaliacao_recebimento?: string | null
          condicoes_pagamento?: string | null
          created_at?: string | null
          data_entrega_prevista?: string | null
          data_pedido?: string | null
          deleted_at?: string | null
          empresa_id?: string
          fornecedor_id?: string | null
          id?: string
          numero_nota_fiscal?: string | null
          observacoes?: string | null
          preco_unitario?: number | null
          produto_id?: string
          quantidade?: number | null
          requisicao_id?: string
          status?: string | null
          total_pedido?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'compras_pedido_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'compras_pedido_fornecedor_id_fkey'
            columns: ['fornecedor_id']
            isOneToOne: false
            referencedRelation: 'fornecedores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'compras_pedido_produto_id_fkey'
            columns: ['produto_id']
            isOneToOne: false
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'compras_pedido_requisicao_id_fkey'
            columns: ['requisicao_id']
            isOneToOne: false
            referencedRelation: 'compras_requisicao'
            referencedColumns: ['id']
          },
        ]
      }
      compras_requisicao: {
        Row: {
          created_at: string | null
          data_requisicao: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          itens: Json | null
          justificativa: string | null
          numero_requisicao: string | null
          observacoes: string | null
          pedido_gerado: boolean | null
          prioridade: string | null
          safra_id: string | null
          solicitante_id: string | null
          status: string | null
          updated_at: string | null
          valor_total_estimado: number | null
        }
        Insert: {
          created_at?: string | null
          data_requisicao?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          itens?: Json | null
          justificativa?: string | null
          numero_requisicao?: string | null
          observacoes?: string | null
          pedido_gerado?: boolean | null
          prioridade?: string | null
          safra_id?: string | null
          solicitante_id?: string | null
          status?: string | null
          updated_at?: string | null
          valor_total_estimado?: number | null
        }
        Update: {
          created_at?: string | null
          data_requisicao?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          itens?: Json | null
          justificativa?: string | null
          numero_requisicao?: string | null
          observacoes?: string | null
          pedido_gerado?: boolean | null
          prioridade?: string | null
          safra_id?: string | null
          solicitante_id?: string | null
          status?: string | null
          updated_at?: string | null
          valor_total_estimado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'compras_requisicao_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'compras_requisicao_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'compras_requisicao_solicitante_id_fkey'
            columns: ['solicitante_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      conta_corrente_produtor: {
        Row: {
          created_at: string | null
          data_movimento: string | null
          deleted_at: string | null
          descricao: string | null
          documento: string | null
          empresa_id: string
          id: string
          produtor_id: string
          safra_id: string | null
          saldo: number | null
          tipo_movimento: string | null
          updated_at: string | null
          valor: number | null
        }
        Insert: {
          created_at?: string | null
          data_movimento?: string | null
          deleted_at?: string | null
          descricao?: string | null
          documento?: string | null
          empresa_id: string
          id?: string
          produtor_id: string
          safra_id?: string | null
          saldo?: number | null
          tipo_movimento?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Update: {
          created_at?: string | null
          data_movimento?: string | null
          deleted_at?: string | null
          descricao?: string | null
          documento?: string | null
          empresa_id?: string
          id?: string
          produtor_id?: string
          safra_id?: string | null
          saldo?: number | null
          tipo_movimento?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'conta_corrente_produtor_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'conta_corrente_produtor_produtor_id_fkey'
            columns: ['produtor_id']
            isOneToOne: false
            referencedRelation: 'fornecedores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'conta_corrente_produtor_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
        ]
      }
      containers: {
        Row: {
          aprovador_1_id: string | null
          aprovador_2_id: string | null
          booking_id: string | null
          created_at: string
          cut_off: string | null
          data_embarque: string | null
          deleted_at: string | null
          destino: string | null
          empresa_id: string
          gate_in_data: string | null
          gate_out_data: string | null
          id: string
          numero_container: string
          peso_bruto_kg: number | null
          peso_liquido_kg: number | null
          selo: string | null
          status: string | null
          tara_kg: number | null
          temperatura_configurada: number | null
          updated_at: string
        }
        Insert: {
          aprovador_1_id?: string | null
          aprovador_2_id?: string | null
          booking_id?: string | null
          created_at?: string
          cut_off?: string | null
          data_embarque?: string | null
          deleted_at?: string | null
          destino?: string | null
          empresa_id: string
          gate_in_data?: string | null
          gate_out_data?: string | null
          id?: string
          numero_container: string
          peso_bruto_kg?: number | null
          peso_liquido_kg?: number | null
          selo?: string | null
          status?: string | null
          tara_kg?: number | null
          temperatura_configurada?: number | null
          updated_at?: string
        }
        Update: {
          aprovador_1_id?: string | null
          aprovador_2_id?: string | null
          booking_id?: string | null
          created_at?: string
          cut_off?: string | null
          data_embarque?: string | null
          deleted_at?: string | null
          destino?: string | null
          empresa_id?: string
          gate_in_data?: string | null
          gate_out_data?: string | null
          id?: string
          numero_container?: string
          peso_bruto_kg?: number | null
          peso_liquido_kg?: number | null
          selo?: string | null
          status?: string | null
          tara_kg?: number | null
          temperatura_configurada?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'containers_booking_id_fkey'
            columns: ['booking_id']
            isOneToOne: false
            referencedRelation: 'bookings'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'containers_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      contas_bancarias: {
        Row: {
          agencia: string | null
          ativo: boolean | null
          conta: string | null
          created_at: string | null
          data_saldo: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          moeda: string | null
          nome_banco: string
          saldo_atual: number | null
          saldo_inicial: number | null
          tipo: string | null
          updated_at: string | null
        }
        Insert: {
          agencia?: string | null
          ativo?: boolean | null
          conta?: string | null
          created_at?: string | null
          data_saldo?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          moeda?: string | null
          nome_banco: string
          saldo_atual?: number | null
          saldo_inicial?: number | null
          tipo?: string | null
          updated_at?: string | null
        }
        Update: {
          agencia?: string | null
          ativo?: boolean | null
          conta?: string | null
          created_at?: string | null
          data_saldo?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          moeda?: string | null
          nome_banco?: string
          saldo_atual?: number | null
          saldo_inicial?: number | null
          tipo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'contas_bancarias_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      contas_bancarias_entidade: {
        Row: {
          agencia: string | null
          banco_codigo: string | null
          banco_nome: string | null
          chave_pix: string | null
          chave_pix_tipo: string | null
          conta: string | null
          created_at: string | null
          empresa_id: string
          entidade_id: string
          entidade_tipo: string
          iban: string | null
          id: string
          swift: string | null
          tipo_conta: string | null
          updated_at: string | null
        }
        Insert: {
          agencia?: string | null
          banco_codigo?: string | null
          banco_nome?: string | null
          chave_pix?: string | null
          chave_pix_tipo?: string | null
          conta?: string | null
          created_at?: string | null
          empresa_id: string
          entidade_id: string
          entidade_tipo: string
          iban?: string | null
          id?: string
          swift?: string | null
          tipo_conta?: string | null
          updated_at?: string | null
        }
        Update: {
          agencia?: string | null
          banco_codigo?: string | null
          banco_nome?: string | null
          chave_pix?: string | null
          chave_pix_tipo?: string | null
          conta?: string | null
          created_at?: string | null
          empresa_id?: string
          entidade_id?: string
          entidade_tipo?: string
          iban?: string | null
          id?: string
          swift?: string | null
          tipo_conta?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'contas_bancarias_entidade_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      contatos_entidade: {
        Row: {
          cargo: string | null
          created_at: string | null
          email: string | null
          empresa_id: string
          entidade_id: string
          entidade_tipo: string
          id: string
          nome: string
          telefone: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          cargo?: string | null
          created_at?: string | null
          email?: string | null
          empresa_id: string
          entidade_id: string
          entidade_tipo: string
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          cargo?: string | null
          created_at?: string | null
          email?: string | null
          empresa_id?: string
          entidade_id?: string
          entidade_tipo?: string
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'contatos_entidade_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      cooperados_contratos: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          fornecedor_id: string
          id: string
          percentual_participacao: number
          safra_id: string
          talhao_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          fornecedor_id: string
          id?: string
          percentual_participacao?: number
          safra_id: string
          talhao_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          fornecedor_id?: string
          id?: string
          percentual_participacao?: number
          safra_id?: string
          talhao_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'cooperados_contratos_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cooperados_contratos_fornecedor_id_fkey'
            columns: ['fornecedor_id']
            isOneToOne: false
            referencedRelation: 'fornecedores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cooperados_contratos_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cooperados_contratos_talhao_id_fkey'
            columns: ['talhao_id']
            isOneToOne: false
            referencedRelation: 'talhoes'
            referencedColumns: ['id']
          },
        ]
      }
      cultivares: {
        Row: {
          codigo_interno: string | null
          created_at: string | null
          cultura_id: string
          deleted_at: string | null
          detentor_licenciador: string | null
          dias_para_colheita: number | null
          empresa_id: string
          gda_objetivo_colheita: number | null
          id: string
          nome: string
          pais_origem: string | null
          produtividade_esperada_t_ha: number | null
          shelf_life_ideal_dias: number | null
          shelf_life_minimo_dias: number | null
          updated_at: string | null
        }
        Insert: {
          codigo_interno?: string | null
          created_at?: string | null
          cultura_id: string
          deleted_at?: string | null
          detentor_licenciador?: string | null
          dias_para_colheita?: number | null
          empresa_id: string
          gda_objetivo_colheita?: number | null
          id?: string
          nome: string
          pais_origem?: string | null
          produtividade_esperada_t_ha?: number | null
          shelf_life_ideal_dias?: number | null
          shelf_life_minimo_dias?: number | null
          updated_at?: string | null
        }
        Update: {
          codigo_interno?: string | null
          created_at?: string | null
          cultura_id?: string
          deleted_at?: string | null
          detentor_licenciador?: string | null
          dias_para_colheita?: number | null
          empresa_id?: string
          gda_objetivo_colheita?: number | null
          id?: string
          nome?: string
          pais_origem?: string | null
          produtividade_esperada_t_ha?: number | null
          shelf_life_ideal_dias?: number | null
          shelf_life_minimo_dias?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'cultivares_cultura_id_fkey'
            columns: ['cultura_id']
            isOneToOne: false
            referencedRelation: 'culturas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cultivares_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      culturas: {
        Row: {
          brix_maximo_ideal: number | null
          brix_minimo_ideal: number | null
          ciclo_dias: number | null
          codigo_ncm: string | null
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          necessidade_hidrica_mm_dia: number | null
          nome: string
          nome_cientifico: string | null
          produtividade_media_t_ha: number | null
          temp_maxima_ideal: number | null
          temp_minima_ideal: number | null
          temperatura_base_gda: number | null
          tipo: string | null
          unidade_medida: string | null
          updated_at: string | null
        }
        Insert: {
          brix_maximo_ideal?: number | null
          brix_minimo_ideal?: number | null
          ciclo_dias?: number | null
          codigo_ncm?: string | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          necessidade_hidrica_mm_dia?: number | null
          nome: string
          nome_cientifico?: string | null
          produtividade_media_t_ha?: number | null
          temp_maxima_ideal?: number | null
          temp_minima_ideal?: number | null
          temperatura_base_gda?: number | null
          tipo?: string | null
          unidade_medida?: string | null
          updated_at?: string | null
        }
        Update: {
          brix_maximo_ideal?: number | null
          brix_minimo_ideal?: number | null
          ciclo_dias?: number | null
          codigo_ncm?: string | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          necessidade_hidrica_mm_dia?: number | null
          nome?: string
          nome_cientifico?: string | null
          produtividade_media_t_ha?: number | null
          temp_maxima_ideal?: number | null
          temp_minima_ideal?: number | null
          temperatura_base_gda?: number | null
          tipo?: string | null
          unidade_medida?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'culturas_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      culturas_fenologia: {
        Row: {
          created_at: string
          cultura_id: string
          deleted_at: string | null
          descricao: string | null
          dias_desde_plantio: number
          empresa_id: string
          estagio: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cultura_id: string
          deleted_at?: string | null
          descricao?: string | null
          dias_desde_plantio: number
          empresa_id: string
          estagio: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cultura_id?: string
          deleted_at?: string | null
          descricao?: string | null
          dias_desde_plantio?: number
          empresa_id?: string
          estagio?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'culturas_fenologia_cultura_id_fkey'
            columns: ['cultura_id']
            isOneToOne: false
            referencedRelation: 'culturas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'culturas_fenologia_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      custos_talhao: {
        Row: {
          centro_custo_id: string
          created_at: string | null
          data_lancamento: string | null
          deleted_at: string | null
          descricao: string | null
          empresa_id: string
          id: string
          safra_id: string
          talhao_id: string
          updated_at: string | null
          valor: number | null
        }
        Insert: {
          centro_custo_id: string
          created_at?: string | null
          data_lancamento?: string | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          safra_id: string
          talhao_id: string
          updated_at?: string | null
          valor?: number | null
        }
        Update: {
          centro_custo_id?: string
          created_at?: string | null
          data_lancamento?: string | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          safra_id?: string
          talhao_id?: string
          updated_at?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'custos_talhao_centro_custo_id_fkey'
            columns: ['centro_custo_id']
            isOneToOne: false
            referencedRelation: 'centros_custo'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'custos_talhao_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'custos_talhao_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'custos_talhao_talhao_id_fkey'
            columns: ['talhao_id']
            isOneToOne: false
            referencedRelation: 'talhoes'
            referencedColumns: ['id']
          },
        ]
      }
      devolucoes_compras: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          fornecedor_id: string
          id: string
          lote_id: string | null
          motivo: string | null
          pedido_id: string
          produto_id: string
          quantidade: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          fornecedor_id: string
          id?: string
          lote_id?: string | null
          motivo?: string | null
          pedido_id: string
          produto_id: string
          quantidade: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          fornecedor_id?: string
          id?: string
          lote_id?: string | null
          motivo?: string | null
          pedido_id?: string
          produto_id?: string
          quantidade?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'devolucoes_compras_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'devolucoes_compras_fornecedor_id_fkey'
            columns: ['fornecedor_id']
            isOneToOne: false
            referencedRelation: 'fornecedores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'devolucoes_compras_lote_id_fkey'
            columns: ['lote_id']
            isOneToOne: false
            referencedRelation: 'lotes_estoque'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'devolucoes_compras_pedido_id_fkey'
            columns: ['pedido_id']
            isOneToOne: false
            referencedRelation: 'compras_pedido'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'devolucoes_compras_produto_id_fkey'
            columns: ['produto_id']
            isOneToOne: false
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
        ]
      }
      divergencias_carregamento: {
        Row: {
          aprovado_por: string | null
          created_at: string
          deleted_at: string | null
          empresa_id: string
          id: string
          motivo: string | null
          pallet_id: string | null
          sessao_id: string
          status: string | null
          tipo_divergencia: string | null
          updated_at: string
          valor_esperado: number | null
          valor_real: number | null
        }
        Insert: {
          aprovado_por?: string | null
          created_at?: string
          deleted_at?: string | null
          empresa_id: string
          id?: string
          motivo?: string | null
          pallet_id?: string | null
          sessao_id: string
          status?: string | null
          tipo_divergencia?: string | null
          updated_at?: string
          valor_esperado?: number | null
          valor_real?: number | null
        }
        Update: {
          aprovado_por?: string | null
          created_at?: string
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          motivo?: string | null
          pallet_id?: string | null
          sessao_id?: string
          status?: string | null
          tipo_divergencia?: string | null
          updated_at?: string
          valor_esperado?: number | null
          valor_real?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'divergencias_carregamento_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'divergencias_carregamento_pallet_id_fkey'
            columns: ['pallet_id']
            isOneToOne: false
            referencedRelation: 'pallets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'divergencias_carregamento_sessao_id_fkey'
            columns: ['sessao_id']
            isOneToOne: false
            referencedRelation: 'sessoes_carregamento'
            referencedColumns: ['id']
          },
        ]
      }
      documentos_entidade: {
        Row: {
          arquivo_url: string | null
          created_at: string | null
          data_emissao: string | null
          data_validade: string | null
          dias_antecedencia_alerta: number | null
          empresa_id: string
          entidade_id: string
          entidade_tipo: string
          gerar_alerta: boolean | null
          id: string
          numero_documento: string | null
          tipo_documento: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          arquivo_url?: string | null
          created_at?: string | null
          data_emissao?: string | null
          data_validade?: string | null
          dias_antecedencia_alerta?: number | null
          empresa_id: string
          entidade_id: string
          entidade_tipo: string
          gerar_alerta?: boolean | null
          id?: string
          numero_documento?: string | null
          tipo_documento?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          arquivo_url?: string | null
          created_at?: string | null
          data_emissao?: string | null
          data_validade?: string | null
          dias_antecedencia_alerta?: number | null
          empresa_id?: string
          entidade_id?: string
          entidade_tipo?: string
          gerar_alerta?: boolean | null
          id?: string
          numero_documento?: string | null
          tipo_documento?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'documentos_entidade_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      documentos_exportacao: {
        Row: {
          arquivo_url: string | null
          container_id: string | null
          created_at: string
          data_emissao: string | null
          data_validade: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          numero_documento: string | null
          observacoes: string | null
          status: Database['public']['Enums']['status_documento_enum'] | null
          tipo_documento: Database['public']['Enums']['tipo_documento_enum']
          updated_at: string
        }
        Insert: {
          arquivo_url?: string | null
          container_id?: string | null
          created_at?: string
          data_emissao?: string | null
          data_validade?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          status?: Database['public']['Enums']['status_documento_enum'] | null
          tipo_documento: Database['public']['Enums']['tipo_documento_enum']
          updated_at?: string
        }
        Update: {
          arquivo_url?: string | null
          container_id?: string | null
          created_at?: string
          data_emissao?: string | null
          data_validade?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          status?: Database['public']['Enums']['status_documento_enum'] | null
          tipo_documento?: Database['public']['Enums']['tipo_documento_enum']
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'documentos_exportacao_container_id_fkey'
            columns: ['container_id']
            isOneToOne: false
            referencedRelation: 'containers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'documentos_exportacao_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      emissoes_carbono: {
        Row: {
          co2e_total: number
          created_at: string | null
          data_registro: string
          deleted_at: string | null
          empresa_id: string
          fator_conversao_ipcc: number
          fonte_emissao: string
          id: string
          observacoes: string | null
          quantidade: number
          safra_id: string | null
          talhao_id: string | null
          unidade: string
          updated_at: string | null
        }
        Insert: {
          co2e_total: number
          created_at?: string | null
          data_registro: string
          deleted_at?: string | null
          empresa_id: string
          fator_conversao_ipcc: number
          fonte_emissao: string
          id?: string
          observacoes?: string | null
          quantidade: number
          safra_id?: string | null
          talhao_id?: string | null
          unidade: string
          updated_at?: string | null
        }
        Update: {
          co2e_total?: number
          created_at?: string | null
          data_registro?: string
          deleted_at?: string | null
          empresa_id?: string
          fator_conversao_ipcc?: number
          fonte_emissao?: string
          id?: string
          observacoes?: string | null
          quantidade?: number
          safra_id?: string | null
          talhao_id?: string | null
          unidade?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'emissoes_carbono_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'emissoes_carbono_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'emissoes_carbono_talhao_id_fkey'
            columns: ['talhao_id']
            isOneToOne: false
            referencedRelation: 'talhoes'
            referencedColumns: ['id']
          },
        ]
      }
      empresas: {
        Row: {
          ativo: boolean | null
          cnpj: string | null
          configuracoes: Json | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          id: string
          limite_usuarios: number | null
          modulos_habilitados: string[] | null
          nome: string
          plano_id: string | null
          slug: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cnpj?: string | null
          configuracoes?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          limite_usuarios?: number | null
          modulos_habilitados?: string[] | null
          nome: string
          plano_id?: string | null
          slug?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cnpj?: string | null
          configuracoes?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          limite_usuarios?: number | null
          modulos_habilitados?: string[] | null
          nome?: string
          plano_id?: string | null
          slug?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'empresas_plano_id_fkey'
            columns: ['plano_id']
            isOneToOne: false
            referencedRelation: 'planos'
            referencedColumns: ['id']
          },
        ]
      }
      enderecos_entidade: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          created_at: string | null
          empresa_id: string
          entidade_id: string
          entidade_tipo: string
          estado: string | null
          id: string
          logradouro: string | null
          numero: string | null
          pais: string | null
          receiver: string | null
          tipo_endereco: string
          updated_at: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          created_at?: string | null
          empresa_id: string
          entidade_id: string
          entidade_tipo: string
          estado?: string | null
          id?: string
          logradouro?: string | null
          numero?: string | null
          pais?: string | null
          receiver?: string | null
          tipo_endereco: string
          updated_at?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          created_at?: string | null
          empresa_id?: string
          entidade_id?: string
          entidade_tipo?: string
          estado?: string | null
          id?: string
          logradouro?: string | null
          numero?: string | null
          pais?: string | null
          receiver?: string | null
          tipo_endereco?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'enderecos_entidade_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      equipamentos: {
        Row: {
          created_at: string | null
          data_aquisicao: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          nome: string
          tipo: string | null
          updated_at: string | null
          valor_aquisicao: number | null
        }
        Insert: {
          created_at?: string | null
          data_aquisicao?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          nome: string
          tipo?: string | null
          updated_at?: string | null
          valor_aquisicao?: number | null
        }
        Update: {
          created_at?: string | null
          data_aquisicao?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          tipo?: string | null
          updated_at?: string | null
          valor_aquisicao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'equipamentos_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      estoque_movimento: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          lote_id: string
          motivo: string | null
          quantidade: number | null
          tipo_movimento: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          lote_id: string
          motivo?: string | null
          quantidade?: number | null
          tipo_movimento?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          lote_id?: string
          motivo?: string | null
          quantidade?: number | null
          tipo_movimento?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'estoque_movimento_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'estoque_movimento_lote_id_fkey'
            columns: ['lote_id']
            isOneToOne: false
            referencedRelation: 'lotes_estoque'
            referencedColumns: ['id']
          },
        ]
      }
      estufas: {
        Row: {
          area_m2: number | null
          ativo: boolean | null
          capacidade_lotes: number | null
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          fazenda_id: string | null
          id: string
          nome: string
          responsavel_id: string | null
          tipo: string | null
          updated_at: string | null
        }
        Insert: {
          area_m2?: number | null
          ativo?: boolean | null
          capacidade_lotes?: number | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          fazenda_id?: string | null
          id?: string
          nome: string
          responsavel_id?: string | null
          tipo?: string | null
          updated_at?: string | null
        }
        Update: {
          area_m2?: number | null
          ativo?: boolean | null
          capacidade_lotes?: number | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          fazenda_id?: string | null
          id?: string
          nome?: string
          responsavel_id?: string | null
          tipo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'estufas_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'estufas_fazenda_id_fkey'
            columns: ['fazenda_id']
            isOneToOne: false
            referencedRelation: 'fazendas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'estufas_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      etiquetas_impressas: {
        Row: {
          created_at: string
          data_impressao: string
          deleted_at: string | null
          empresa_id: string
          id: string
          impresso_por: string | null
          motivo_reimpressao: string | null
          numero_etiqueta: string
          pallet_id: string
          reimpressao: boolean | null
          romaneio_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_impressao?: string
          deleted_at?: string | null
          empresa_id: string
          id?: string
          impresso_por?: string | null
          motivo_reimpressao?: string | null
          numero_etiqueta: string
          pallet_id: string
          reimpressao?: boolean | null
          romaneio_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_impressao?: string
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          impresso_por?: string | null
          motivo_reimpressao?: string | null
          numero_etiqueta?: string
          pallet_id?: string
          reimpressao?: boolean | null
          romaneio_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'etiquetas_impressas_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'etiquetas_impressas_pallet_id_fkey'
            columns: ['pallet_id']
            isOneToOne: false
            referencedRelation: 'pallets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'etiquetas_impressas_romaneio_id_fkey'
            columns: ['romaneio_id']
            isOneToOne: false
            referencedRelation: 'romaneios_venda'
            referencedColumns: ['id']
          },
        ]
      }
      fazendas: {
        Row: {
          area_produtiva_ha: number | null
          area_total_ha: number | null
          ccir: string | null
          cnpj_imobiliario: string | null
          created_at: string | null
          data_fundacao: string | null
          deleted_at: string | null
          empresa_id: string
          endereco: string | null
          estado: string | null
          id: string
          inscricao_estadual: string | null
          latitude: number | null
          longitude: number | null
          municipio: string | null
          nirf: string | null
          nome: string
          numero_car: string | null
          responsavel_cpf: string | null
          responsavel_email: string | null
          responsavel_nome: string | null
          responsavel_telefone: string | null
          tipo_producao: string | null
          updated_at: string | null
        }
        Insert: {
          area_produtiva_ha?: number | null
          area_total_ha?: number | null
          ccir?: string | null
          cnpj_imobiliario?: string | null
          created_at?: string | null
          data_fundacao?: string | null
          deleted_at?: string | null
          empresa_id: string
          endereco?: string | null
          estado?: string | null
          id?: string
          inscricao_estadual?: string | null
          latitude?: number | null
          longitude?: number | null
          municipio?: string | null
          nirf?: string | null
          nome: string
          numero_car?: string | null
          responsavel_cpf?: string | null
          responsavel_email?: string | null
          responsavel_nome?: string | null
          responsavel_telefone?: string | null
          tipo_producao?: string | null
          updated_at?: string | null
        }
        Update: {
          area_produtiva_ha?: number | null
          area_total_ha?: number | null
          ccir?: string | null
          cnpj_imobiliario?: string | null
          created_at?: string | null
          data_fundacao?: string | null
          deleted_at?: string | null
          empresa_id?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          inscricao_estadual?: string | null
          latitude?: number | null
          longitude?: number | null
          municipio?: string | null
          nirf?: string | null
          nome?: string
          numero_car?: string | null
          responsavel_cpf?: string | null
          responsavel_email?: string | null
          responsavel_nome?: string | null
          responsavel_telefone?: string | null
          tipo_producao?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'fazendas_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      financeiro_lancamentos: {
        Row: {
          centro_custo_id: string | null
          cliente_id: string | null
          conta_bancaria_id: string | null
          created_at: string
          data_lancamento: string | null
          data_pagamento: string | null
          data_vencimento: string | null
          deleted_at: string | null
          descricao: string
          documento: string | null
          empresa_id: string
          fornecedor_id: string | null
          id: string
          invoice_id: string | null
          observacoes: string | null
          parcela: number | null
          plano_conta_id: string | null
          status: string | null
          tipo: string
          total_parcelas: number | null
          updated_at: string
          valor: number
        }
        Insert: {
          centro_custo_id?: string | null
          cliente_id?: string | null
          conta_bancaria_id?: string | null
          created_at?: string
          data_lancamento?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          deleted_at?: string | null
          descricao: string
          documento?: string | null
          empresa_id: string
          fornecedor_id?: string | null
          id?: string
          invoice_id?: string | null
          observacoes?: string | null
          parcela?: number | null
          plano_conta_id?: string | null
          status?: string | null
          tipo: string
          total_parcelas?: number | null
          updated_at?: string
          valor: number
        }
        Update: {
          centro_custo_id?: string | null
          cliente_id?: string | null
          conta_bancaria_id?: string | null
          created_at?: string
          data_lancamento?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          deleted_at?: string | null
          descricao?: string
          documento?: string | null
          empresa_id?: string
          fornecedor_id?: string | null
          id?: string
          invoice_id?: string | null
          observacoes?: string | null
          parcela?: number | null
          plano_conta_id?: string | null
          status?: string | null
          tipo?: string
          total_parcelas?: number | null
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: 'financeiro_lancamentos_centro_custo_id_fkey'
            columns: ['centro_custo_id']
            isOneToOne: false
            referencedRelation: 'centros_custo'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'financeiro_lancamentos_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'financeiro_lancamentos_conta_bancaria_id_fkey'
            columns: ['conta_bancaria_id']
            isOneToOne: false
            referencedRelation: 'contas_bancarias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'financeiro_lancamentos_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'financeiro_lancamentos_fornecedor_id_fkey'
            columns: ['fornecedor_id']
            isOneToOne: false
            referencedRelation: 'fornecedores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'financeiro_lancamentos_invoice_id_fkey'
            columns: ['invoice_id']
            isOneToOne: false
            referencedRelation: 'invoices_exportacao'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'financeiro_lancamentos_plano_conta_id_fkey'
            columns: ['plano_conta_id']
            isOneToOne: false
            referencedRelation: 'plano_contas'
            referencedColumns: ['id']
          },
        ]
      }
      fornecedores: {
        Row: {
          area_total_ha: number | null
          cnpj: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          empresa_id: string
          id: string
          is_cooperado: boolean | null
          nome: string
          nome_propriedade: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          area_total_ha?: number | null
          cnpj?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          empresa_id: string
          id?: string
          is_cooperado?: boolean | null
          nome: string
          nome_propriedade?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          area_total_ha?: number | null
          cnpj?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          empresa_id?: string
          id?: string
          is_cooperado?: boolean | null
          nome?: string
          nome_propriedade?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'fornecedores_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      frota_abastecimentos: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          km_registro: number
          litros: number
          updated_at: string | null
          valor_total: number
          veiculo_id: string
          viagem_id: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          km_registro: number
          litros: number
          updated_at?: string | null
          valor_total: number
          veiculo_id: string
          viagem_id?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          km_registro?: number
          litros?: number
          updated_at?: string | null
          valor_total?: number
          veiculo_id?: string
          viagem_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'frota_abastecimentos_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'frota_abastecimentos_veiculo_id_fkey'
            columns: ['veiculo_id']
            isOneToOne: false
            referencedRelation: 'frota_veiculos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'frota_abastecimentos_viagem_id_fkey'
            columns: ['viagem_id']
            isOneToOne: false
            referencedRelation: 'frota_viagens'
            referencedColumns: ['id']
          },
        ]
      }
      frota_manutencoes: {
        Row: {
          created_at: string | null
          custo: number | null
          data_prevista: string | null
          data_realizada: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          km_previsto: number | null
          km_realizado: number | null
          os_numero: string | null
          tipo: string
          updated_at: string | null
          veiculo_id: string
        }
        Insert: {
          created_at?: string | null
          custo?: number | null
          data_prevista?: string | null
          data_realizada?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          km_previsto?: number | null
          km_realizado?: number | null
          os_numero?: string | null
          tipo: string
          updated_at?: string | null
          veiculo_id: string
        }
        Update: {
          created_at?: string | null
          custo?: number | null
          data_prevista?: string | null
          data_realizada?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          km_previsto?: number | null
          km_realizado?: number | null
          os_numero?: string | null
          tipo?: string
          updated_at?: string | null
          veiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'frota_manutencoes_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'frota_manutencoes_veiculo_id_fkey'
            columns: ['veiculo_id']
            isOneToOne: false
            referencedRelation: 'frota_veiculos'
            referencedColumns: ['id']
          },
        ]
      }
      frota_veiculos: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          km_atual: number | null
          modelo: string
          placa: string
          updated_at: string | null
          vencimento_documento: string | null
          vencimento_seguro: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          km_atual?: number | null
          modelo: string
          placa: string
          updated_at?: string | null
          vencimento_documento?: string | null
          vencimento_seguro?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          km_atual?: number | null
          modelo?: string
          placa?: string
          updated_at?: string | null
          vencimento_documento?: string | null
          vencimento_seguro?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'frota_veiculos_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      frota_viagens: {
        Row: {
          created_at: string | null
          data_fim: string | null
          data_inicio: string
          deleted_at: string | null
          destino: string
          empresa_id: string
          id: string
          km_final: number | null
          km_inicial: number
          motorista_id: string | null
          origem: string
          updated_at: string | null
          veiculo_id: string
        }
        Insert: {
          created_at?: string | null
          data_fim?: string | null
          data_inicio: string
          deleted_at?: string | null
          destino: string
          empresa_id: string
          id?: string
          km_final?: number | null
          km_inicial: number
          motorista_id?: string | null
          origem: string
          updated_at?: string | null
          veiculo_id: string
        }
        Update: {
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string
          deleted_at?: string | null
          destino?: string
          empresa_id?: string
          id?: string
          km_final?: number | null
          km_inicial?: number
          motorista_id?: string | null
          origem?: string
          updated_at?: string | null
          veiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'frota_viagens_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'frota_viagens_motorista_id_fkey'
            columns: ['motorista_id']
            isOneToOne: false
            referencedRelation: 'funcionarios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'frota_viagens_veiculo_id_fkey'
            columns: ['veiculo_id']
            isOneToOne: false
            referencedRelation: 'frota_veiculos'
            referencedColumns: ['id']
          },
        ]
      }
      funcionarios: {
        Row: {
          cargo: string | null
          cpf: string | null
          created_at: string | null
          data_admissao: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          cargo?: string | null
          cpf?: string | null
          created_at?: string | null
          data_admissao?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          cargo?: string | null
          cpf?: string | null
          created_at?: string | null
          data_admissao?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'funcionarios_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      graus_dia: {
        Row: {
          created_at: string | null
          data: string | null
          deleted_at: string | null
          empresa_id: string
          fonte_dados: string | null
          gda_diario: number | null
          graus_dia_acumulado: number | null
          id: string
          safra_id: string | null
          talhao_id: string
          temp_maxima: number | null
          temp_minima: number | null
          temperatura_media: number | null
          updated_at: string | null
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: string | null
          deleted_at?: string | null
          empresa_id: string
          fonte_dados?: string | null
          gda_diario?: number | null
          graus_dia_acumulado?: number | null
          id?: string
          safra_id?: string | null
          talhao_id: string
          temp_maxima?: number | null
          temp_minima?: number | null
          temperatura_media?: number | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string | null
          deleted_at?: string | null
          empresa_id?: string
          fonte_dados?: string | null
          gda_diario?: number | null
          graus_dia_acumulado?: number | null
          id?: string
          safra_id?: string | null
          talhao_id?: string
          temp_maxima?: number | null
          temp_minima?: number | null
          temperatura_media?: number | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'graus_dia_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'graus_dia_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'graus_dia_talhao_id_fkey'
            columns: ['talhao_id']
            isOneToOne: false
            referencedRelation: 'talhoes'
            referencedColumns: ['id']
          },
        ]
      }
      historico_produtividade_talhao: {
        Row: {
          ano: number | null
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          produtividade_kg_ha: number | null
          talhao_id: string
          updated_at: string | null
        }
        Insert: {
          ano?: number | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          produtividade_kg_ha?: number | null
          talhao_id: string
          updated_at?: string | null
        }
        Update: {
          ano?: number | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          produtividade_kg_ha?: number | null
          talhao_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'historico_produtividade_talhao_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'historico_produtividade_talhao_talhao_id_fkey'
            columns: ['talhao_id']
            isOneToOne: false
            referencedRelation: 'talhoes'
            referencedColumns: ['id']
          },
        ]
      }
      invoices_exportacao: {
        Row: {
          cliente_id: string | null
          container_id: string | null
          created_at: string
          data_emissao: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          incoterm: Database['public']['Enums']['invoice_incoterm_enum'] | null
          numero_invoice: string
          pdf_url: string | null
          peso_total_kg: number | null
          quantidade_pallets: number | null
          romaneio_ids: string[] | null
          status: Database['public']['Enums']['invoice_status_enum'] | null
          updated_at: string
          valor_total_brl: number | null
          valor_total_usd: number | null
        }
        Insert: {
          cliente_id?: string | null
          container_id?: string | null
          created_at?: string
          data_emissao?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          incoterm?: Database['public']['Enums']['invoice_incoterm_enum'] | null
          numero_invoice: string
          pdf_url?: string | null
          peso_total_kg?: number | null
          quantidade_pallets?: number | null
          romaneio_ids?: string[] | null
          status?: Database['public']['Enums']['invoice_status_enum'] | null
          updated_at?: string
          valor_total_brl?: number | null
          valor_total_usd?: number | null
        }
        Update: {
          cliente_id?: string | null
          container_id?: string | null
          created_at?: string
          data_emissao?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          incoterm?: Database['public']['Enums']['invoice_incoterm_enum'] | null
          numero_invoice?: string
          pdf_url?: string | null
          peso_total_kg?: number | null
          quantidade_pallets?: number | null
          romaneio_ids?: string[] | null
          status?: Database['public']['Enums']['invoice_status_enum'] | null
          updated_at?: string
          valor_total_brl?: number | null
          valor_total_usd?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'invoices_exportacao_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'invoices_exportacao_container_id_fkey'
            columns: ['container_id']
            isOneToOne: false
            referencedRelation: 'containers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'invoices_exportacao_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      lotes_estoque: {
        Row: {
          armazem_id: string
          created_at: string | null
          data_entrada: string | null
          data_fabricacao: string | null
          data_validade: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          localizacao: string | null
          numero_lote: string | null
          produto_id: string
          quantidade: number | null
          updated_at: string | null
        }
        Insert: {
          armazem_id: string
          created_at?: string | null
          data_entrada?: string | null
          data_fabricacao?: string | null
          data_validade?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          localizacao?: string | null
          numero_lote?: string | null
          produto_id: string
          quantidade?: number | null
          updated_at?: string | null
        }
        Update: {
          armazem_id?: string
          created_at?: string | null
          data_entrada?: string | null
          data_fabricacao?: string | null
          data_validade?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          localizacao?: string | null
          numero_lote?: string | null
          produto_id?: string
          quantidade?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'lotes_estoque_armazem_id_fkey'
            columns: ['armazem_id']
            isOneToOne: false
            referencedRelation: 'armazens'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'lotes_estoque_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'lotes_estoque_produto_id_fkey'
            columns: ['produto_id']
            isOneToOne: false
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
        ]
      }
      lotes_mudas: {
        Row: {
          created_at: string | null
          cultivar_id: string | null
          cultura_id: string | null
          custo_por_muda: number | null
          custo_total: number | null
          data_prevista_transplantio: string | null
          data_semeadura: string | null
          deleted_at: string | null
          empresa_id: string
          estufa_id: string | null
          id: string
          nome_lote: string
          observacoes: string | null
          quantidade_mudas: number | null
          quantidade_viva: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cultivar_id?: string | null
          cultura_id?: string | null
          custo_por_muda?: number | null
          custo_total?: number | null
          data_prevista_transplantio?: string | null
          data_semeadura?: string | null
          deleted_at?: string | null
          empresa_id: string
          estufa_id?: string | null
          id?: string
          nome_lote: string
          observacoes?: string | null
          quantidade_mudas?: number | null
          quantidade_viva?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cultivar_id?: string | null
          cultura_id?: string | null
          custo_por_muda?: number | null
          custo_total?: number | null
          data_prevista_transplantio?: string | null
          data_semeadura?: string | null
          deleted_at?: string | null
          empresa_id?: string
          estufa_id?: string | null
          id?: string
          nome_lote?: string
          observacoes?: string | null
          quantidade_mudas?: number | null
          quantidade_viva?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'lotes_mudas_cultivar_id_fkey'
            columns: ['cultivar_id']
            isOneToOne: false
            referencedRelation: 'cultivares'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'lotes_mudas_cultura_id_fkey'
            columns: ['cultura_id']
            isOneToOne: false
            referencedRelation: 'culturas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'lotes_mudas_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'lotes_mudas_estufa_id_fkey'
            columns: ['estufa_id']
            isOneToOne: false
            referencedRelation: 'estufas'
            referencedColumns: ['id']
          },
        ]
      }
      moedas: {
        Row: {
          codigo: string
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          nome: string
          simbolo: string
          updated_at: string | null
        }
        Insert: {
          codigo: string
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          nome: string
          simbolo: string
          updated_at?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          simbolo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'moedas_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      monitoramento_pragas: {
        Row: {
          acao_recomendada: string | null
          area_afetada_percentual: number | null
          created_at: string | null
          data_monitoramento: string | null
          deleted_at: string | null
          empresa_id: string
          fotos: string[] | null
          id: string
          latitude: number | null
          longitude: number | null
          nivel_infestacao: string | null
          num_armadilhas: number | null
          num_capturas: number | null
          praga_identificada: string | null
          responsavel_id: string | null
          safra_id: string | null
          talhao_id: string
          tipo: string | null
          updated_at: string | null
        }
        Insert: {
          acao_recomendada?: string | null
          area_afetada_percentual?: number | null
          created_at?: string | null
          data_monitoramento?: string | null
          deleted_at?: string | null
          empresa_id: string
          fotos?: string[] | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nivel_infestacao?: string | null
          num_armadilhas?: number | null
          num_capturas?: number | null
          praga_identificada?: string | null
          responsavel_id?: string | null
          safra_id?: string | null
          talhao_id: string
          tipo?: string | null
          updated_at?: string | null
        }
        Update: {
          acao_recomendada?: string | null
          area_afetada_percentual?: number | null
          created_at?: string | null
          data_monitoramento?: string | null
          deleted_at?: string | null
          empresa_id?: string
          fotos?: string[] | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nivel_infestacao?: string | null
          num_armadilhas?: number | null
          num_capturas?: number | null
          praga_identificada?: string | null
          responsavel_id?: string | null
          safra_id?: string | null
          talhao_id?: string
          tipo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'monitoramento_pragas_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'monitoramento_pragas_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'monitoramento_pragas_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'monitoramento_pragas_talhao_id_fkey'
            columns: ['talhao_id']
            isOneToOne: false
            referencedRelation: 'talhoes'
            referencedColumns: ['id']
          },
        ]
      }
      nao_conformidades: {
        Row: {
          auditoria_id: string | null
          bloqueia_certificado: boolean | null
          created_at: string | null
          data_fechamento: string | null
          deleted_at: string | null
          descricao: string
          empresa_id: string
          evidencias_correcao_url: string[] | null
          gravidade: string
          id: string
          item_auditoria_id: string | null
          plano_acao: string | null
          prazo_correcao: string | null
          responsavel_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          auditoria_id?: string | null
          bloqueia_certificado?: boolean | null
          created_at?: string | null
          data_fechamento?: string | null
          deleted_at?: string | null
          descricao: string
          empresa_id: string
          evidencias_correcao_url?: string[] | null
          gravidade: string
          id?: string
          item_auditoria_id?: string | null
          plano_acao?: string | null
          prazo_correcao?: string | null
          responsavel_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          auditoria_id?: string | null
          bloqueia_certificado?: boolean | null
          created_at?: string | null
          data_fechamento?: string | null
          deleted_at?: string | null
          descricao?: string
          empresa_id?: string
          evidencias_correcao_url?: string[] | null
          gravidade?: string
          id?: string
          item_auditoria_id?: string | null
          plano_acao?: string | null
          prazo_correcao?: string | null
          responsavel_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'nao_conformidades_auditoria_id_fkey'
            columns: ['auditoria_id']
            isOneToOne: false
            referencedRelation: 'certificacoes_auditorias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'nao_conformidades_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'nao_conformidades_item_auditoria_id_fkey'
            columns: ['item_auditoria_id']
            isOneToOne: false
            referencedRelation: 'certificacoes_itens_auditoria'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'nao_conformidades_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      navios: {
        Row: {
          ano_construcao: number | null
          armador: string | null
          ativo: boolean | null
          bandeira: string | null
          capacidade_teus: number | null
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          imo_number: string | null
          nome_navio: string
          updated_at: string | null
        }
        Insert: {
          ano_construcao?: number | null
          armador?: string | null
          ativo?: boolean | null
          bandeira?: string | null
          capacidade_teus?: number | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          imo_number?: string | null
          nome_navio: string
          updated_at?: string | null
        }
        Update: {
          ano_construcao?: number | null
          armador?: string | null
          ativo?: boolean | null
          bandeira?: string | null
          capacidade_teus?: number | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          imo_number?: string | null
          nome_navio?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'navios_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      operacao_insumos: {
        Row: {
          area_aplicada_ha: number | null
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          lote_id: string | null
          operacao_id: string
          produto_id: string
          quantidade_utilizada: number | null
          updated_at: string | null
        }
        Insert: {
          area_aplicada_ha?: number | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          lote_id?: string | null
          operacao_id: string
          produto_id: string
          quantidade_utilizada?: number | null
          updated_at?: string | null
        }
        Update: {
          area_aplicada_ha?: number | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          lote_id?: string | null
          operacao_id?: string
          produto_id?: string
          quantidade_utilizada?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'operacao_insumos_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'operacao_insumos_lote_id_fkey'
            columns: ['lote_id']
            isOneToOne: false
            referencedRelation: 'lotes_estoque'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'operacao_insumos_operacao_id_fkey'
            columns: ['operacao_id']
            isOneToOne: false
            referencedRelation: 'operacoes_campo'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'operacao_insumos_produto_id_fkey'
            columns: ['produto_id']
            isOneToOne: false
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
        ]
      }
      operacoes_campo: {
        Row: {
          clima_observacoes: string | null
          consumo_agua_m3: number | null
          created_at: string | null
          data_conclusao: string | null
          data_inicio: string | null
          deleted_at: string | null
          empresa_id: string
          equipamento_id: string | null
          foto_geolocalizada_url: string | null
          id: string
          latitude: number | null
          longitude: number | null
          observacoes: string | null
          ponto_captacao: string | null
          receituario_id: string | null
          responsavel_id: string | null
          safra_id: string
          status: string | null
          tipo_operacao: string | null
          updated_at: string | null
        }
        Insert: {
          clima_observacoes?: string | null
          consumo_agua_m3?: number | null
          created_at?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          deleted_at?: string | null
          empresa_id: string
          equipamento_id?: string | null
          foto_geolocalizada_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          observacoes?: string | null
          ponto_captacao?: string | null
          receituario_id?: string | null
          responsavel_id?: string | null
          safra_id: string
          status?: string | null
          tipo_operacao?: string | null
          updated_at?: string | null
        }
        Update: {
          clima_observacoes?: string | null
          consumo_agua_m3?: number | null
          created_at?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          deleted_at?: string | null
          empresa_id?: string
          equipamento_id?: string | null
          foto_geolocalizada_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          observacoes?: string | null
          ponto_captacao?: string | null
          receituario_id?: string | null
          responsavel_id?: string | null
          safra_id?: string
          status?: string | null
          tipo_operacao?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'operacoes_campo_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'operacoes_campo_equipamento_id_fkey'
            columns: ['equipamento_id']
            isOneToOne: false
            referencedRelation: 'equipamentos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'operacoes_campo_receituario_id_fkey'
            columns: ['receituario_id']
            isOneToOne: false
            referencedRelation: 'receituarios_agronomicos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'operacoes_campo_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'operacoes_campo_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
        ]
      }
      packing_recepcoes: {
        Row: {
          conformidade_visual: string | null
          created_at: string | null
          data_recepcao: string
          deleted_at: string | null
          empresa_id: string
          id: string
          lote_producao_id: string
          motivo_reprovacao: string | null
          peso_bruto_kg: number | null
          peso_liquido_kg: number | null
          quantidade_caixas: number | null
          quantidade_ton: number
          responsavel_id: string | null
          safra_id: string
          status: string | null
          tara_kg: number | null
          temperatura_recepcao: number | null
          updated_at: string | null
        }
        Insert: {
          conformidade_visual?: string | null
          created_at?: string | null
          data_recepcao?: string
          deleted_at?: string | null
          empresa_id: string
          id?: string
          lote_producao_id: string
          motivo_reprovacao?: string | null
          peso_bruto_kg?: number | null
          peso_liquido_kg?: number | null
          quantidade_caixas?: number | null
          quantidade_ton: number
          responsavel_id?: string | null
          safra_id: string
          status?: string | null
          tara_kg?: number | null
          temperatura_recepcao?: number | null
          updated_at?: string | null
        }
        Update: {
          conformidade_visual?: string | null
          created_at?: string | null
          data_recepcao?: string
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          lote_producao_id?: string
          motivo_reprovacao?: string | null
          peso_bruto_kg?: number | null
          peso_liquido_kg?: number | null
          quantidade_caixas?: number | null
          quantidade_ton?: number
          responsavel_id?: string | null
          safra_id?: string
          status?: string | null
          tara_kg?: number | null
          temperatura_recepcao?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'packing_recepcoes_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'packing_recepcoes_lote_producao_id_fkey'
            columns: ['lote_producao_id']
            isOneToOne: false
            referencedRelation: 'colheita_registros'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'packing_recepcoes_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'packing_recepcoes_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
        ]
      }
      pallets: {
        Row: {
          calibre: string | null
          codigo: string
          codigo_pallet: string | null
          conformidade_percentual: number | null
          created_at: string
          data_paletizacao: string | null
          data_saida_camara: string | null
          deleted_at: string | null
          destino: string | null
          empresa_id: string
          etiqueta_impressa: boolean | null
          etiqueta_zpl: string | null
          id: string
          peso_bruto_kg: number | null
          peso_kg: number | null
          peso_liquido_kg: number | null
          produto_id: string | null
          produtor_id: string | null
          quantidade_caixas: number | null
          recepcao_id: string | null
          romaneio_id: string | null
          safra_id: string | null
          status: string | null
          temperatura_camara: number | null
          updated_at: string
        }
        Insert: {
          calibre?: string | null
          codigo: string
          codigo_pallet?: string | null
          conformidade_percentual?: number | null
          created_at?: string
          data_paletizacao?: string | null
          data_saida_camara?: string | null
          deleted_at?: string | null
          destino?: string | null
          empresa_id: string
          etiqueta_impressa?: boolean | null
          etiqueta_zpl?: string | null
          id?: string
          peso_bruto_kg?: number | null
          peso_kg?: number | null
          peso_liquido_kg?: number | null
          produto_id?: string | null
          produtor_id?: string | null
          quantidade_caixas?: number | null
          recepcao_id?: string | null
          romaneio_id?: string | null
          safra_id?: string | null
          status?: string | null
          temperatura_camara?: number | null
          updated_at?: string
        }
        Update: {
          calibre?: string | null
          codigo?: string
          codigo_pallet?: string | null
          conformidade_percentual?: number | null
          created_at?: string
          data_paletizacao?: string | null
          data_saida_camara?: string | null
          deleted_at?: string | null
          destino?: string | null
          empresa_id?: string
          etiqueta_impressa?: boolean | null
          etiqueta_zpl?: string | null
          id?: string
          peso_bruto_kg?: number | null
          peso_kg?: number | null
          peso_liquido_kg?: number | null
          produto_id?: string | null
          produtor_id?: string | null
          quantidade_caixas?: number | null
          recepcao_id?: string | null
          romaneio_id?: string | null
          safra_id?: string | null
          status?: string | null
          temperatura_camara?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'pallets_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pallets_produto_id_fkey'
            columns: ['produto_id']
            isOneToOne: false
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pallets_produtor_id_fkey'
            columns: ['produtor_id']
            isOneToOne: false
            referencedRelation: 'fornecedores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pallets_recepcao_id_fkey'
            columns: ['recepcao_id']
            isOneToOne: false
            referencedRelation: 'packing_recepcoes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pallets_romaneio_id_fkey'
            columns: ['romaneio_id']
            isOneToOne: false
            referencedRelation: 'romaneios_venda'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pallets_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
        ]
      }
      patrimonio_bens: {
        Row: {
          codigo_qr: string
          created_at: string | null
          data_aquisicao: string
          deleted_at: string | null
          empresa_id: string
          id: string
          localizacao_id: string | null
          nome: string
          updated_at: string | null
          valor_aquisicao: number
          vida_util_meses: number
        }
        Insert: {
          codigo_qr: string
          created_at?: string | null
          data_aquisicao: string
          deleted_at?: string | null
          empresa_id: string
          id?: string
          localizacao_id?: string | null
          nome: string
          updated_at?: string | null
          valor_aquisicao?: number
          vida_util_meses?: number
        }
        Update: {
          codigo_qr?: string
          created_at?: string | null
          data_aquisicao?: string
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          localizacao_id?: string | null
          nome?: string
          updated_at?: string | null
          valor_aquisicao?: number
          vida_util_meses?: number
        }
        Relationships: [
          {
            foreignKeyName: 'patrimonio_bens_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      perdas_estufa: {
        Row: {
          created_at: string | null
          data_perda: string
          deleted_at: string | null
          empresa_id: string
          foto_url: string | null
          id: string
          lote_muda_id: string | null
          motivo: string | null
          quantidade_perdida: number
          responsavel_id: string | null
          tipo_perda: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_perda: string
          deleted_at?: string | null
          empresa_id: string
          foto_url?: string | null
          id?: string
          lote_muda_id?: string | null
          motivo?: string | null
          quantidade_perdida: number
          responsavel_id?: string | null
          tipo_perda?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_perda?: string
          deleted_at?: string | null
          empresa_id?: string
          foto_url?: string | null
          id?: string
          lote_muda_id?: string | null
          motivo?: string | null
          quantidade_perdida?: number
          responsavel_id?: string | null
          tipo_perda?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'perdas_estufa_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'perdas_estufa_lote_muda_id_fkey'
            columns: ['lote_muda_id']
            isOneToOne: false
            referencedRelation: 'lotes_mudas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'perdas_estufa_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      planejamento_safra: {
        Row: {
          atividade: string | null
          created_at: string | null
          data_prevista: string | null
          data_realizada: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          responsavel_id: string | null
          safra_id: string
          updated_at: string | null
        }
        Insert: {
          atividade?: string | null
          created_at?: string | null
          data_prevista?: string | null
          data_realizada?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          responsavel_id?: string | null
          safra_id: string
          updated_at?: string | null
        }
        Update: {
          atividade?: string | null
          created_at?: string | null
          data_prevista?: string | null
          data_realizada?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          responsavel_id?: string | null
          safra_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'planejamento_safra_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'planejamento_safra_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'planejamento_safra_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
        ]
      }
      plano_contas: {
        Row: {
          ativo: boolean | null
          codigo: string
          created_at: string | null
          deleted_at: string | null
          descricao: string
          empresa_id: string
          id: string
          natureza: string | null
          nivel: number | null
          pai_id: string | null
          tipo: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo: string
          created_at?: string | null
          deleted_at?: string | null
          descricao: string
          empresa_id: string
          id?: string
          natureza?: string | null
          nivel?: number | null
          pai_id?: string | null
          tipo?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo?: string
          created_at?: string | null
          deleted_at?: string | null
          descricao?: string
          empresa_id?: string
          id?: string
          natureza?: string | null
          nivel?: number | null
          pai_id?: string | null
          tipo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'plano_contas_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'plano_contas_pai_id_fkey'
            columns: ['pai_id']
            isOneToOne: false
            referencedRelation: 'plano_contas'
            referencedColumns: ['id']
          },
        ]
      }
      planos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          deleted_at: string | null
          descricao: string | null
          id: string
          limite_usuarios: number
          modulos_habilitados: string[] | null
          nome: string
          preco_mensal: number
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          limite_usuarios: number
          modulos_habilitados?: string[] | null
          nome: string
          preco_mensal: number
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          limite_usuarios?: number
          modulos_habilitados?: string[] | null
          nome?: string
          preco_mensal?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      pluviometria: {
        Row: {
          created_at: string | null
          data: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          precipitacao_mm: number | null
          talhao_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          precipitacao_mm?: number | null
          talhao_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          precipitacao_mm?: number | null
          talhao_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'pluviometria_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pluviometria_talhao_id_fkey'
            columns: ['talhao_id']
            isOneToOne: false
            referencedRelation: 'talhoes'
            referencedColumns: ['id']
          },
        ]
      }
      portal_tokens: {
        Row: {
          acessos_permitidos: string[] | null
          ativo: boolean | null
          created_at: string | null
          data_expiracao: string
          deleted_at: string | null
          empresa_id: string
          entidade_id: string
          entidade_tipo: Database['public']['Enums']['entidade_portal_enum']
          id: string
          token: string
          ultimo_acesso: string | null
          updated_at: string | null
        }
        Insert: {
          acessos_permitidos?: string[] | null
          ativo?: boolean | null
          created_at?: string | null
          data_expiracao?: string
          deleted_at?: string | null
          empresa_id: string
          entidade_id: string
          entidade_tipo: Database['public']['Enums']['entidade_portal_enum']
          id?: string
          token: string
          ultimo_acesso?: string | null
          updated_at?: string | null
        }
        Update: {
          acessos_permitidos?: string[] | null
          ativo?: boolean | null
          created_at?: string | null
          data_expiracao?: string
          deleted_at?: string | null
          empresa_id?: string
          entidade_id?: string
          entidade_tipo?: Database['public']['Enums']['entidade_portal_enum']
          id?: string
          token?: string
          ultimo_acesso?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'portal_tokens_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      portos: {
        Row: {
          cidade: string | null
          codigo_un_locode: string | null
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          nome_porto: string
          pais: string | null
          tipo: string | null
          updated_at: string | null
        }
        Insert: {
          cidade?: string | null
          codigo_un_locode?: string | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          nome_porto: string
          pais?: string | null
          tipo?: string | null
          updated_at?: string | null
        }
        Update: {
          cidade?: string | null
          codigo_un_locode?: string | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          nome_porto?: string
          pais?: string | null
          tipo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'portos_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      produtos: {
        Row: {
          carencia_dias: number | null
          categoria: string | null
          classe_risco: string | null
          classe_toxicologica: string | null
          codigo_interno: string | null
          codigo_ncm: string | null
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          estoque_minimo: number | null
          exige_receituario: boolean | null
          fabricante_marca: string | null
          id: string
          ingrediente_ativo: string | null
          nome: string
          prazo_validade_dias: number | null
          preco_unitario: number | null
          recomendacao_uso: string | null
          registro_mapa: string | null
          status: string | null
          tipo: string | null
          unidade_medida: string | null
          updated_at: string | null
          visivel_operadores: boolean | null
        }
        Insert: {
          carencia_dias?: number | null
          categoria?: string | null
          classe_risco?: string | null
          classe_toxicologica?: string | null
          codigo_interno?: string | null
          codigo_ncm?: string | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          estoque_minimo?: number | null
          exige_receituario?: boolean | null
          fabricante_marca?: string | null
          id?: string
          ingrediente_ativo?: string | null
          nome: string
          prazo_validade_dias?: number | null
          preco_unitario?: number | null
          recomendacao_uso?: string | null
          registro_mapa?: string | null
          status?: string | null
          tipo?: string | null
          unidade_medida?: string | null
          updated_at?: string | null
          visivel_operadores?: boolean | null
        }
        Update: {
          carencia_dias?: number | null
          categoria?: string | null
          classe_risco?: string | null
          classe_toxicologica?: string | null
          codigo_interno?: string | null
          codigo_ncm?: string | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          estoque_minimo?: number | null
          exige_receituario?: boolean | null
          fabricante_marca?: string | null
          id?: string
          ingrediente_ativo?: string | null
          nome?: string
          prazo_validade_dias?: number | null
          preco_unitario?: number | null
          recomendacao_uso?: string | null
          registro_mapa?: string | null
          status?: string | null
          tipo?: string | null
          unidade_medida?: string | null
          updated_at?: string | null
          visivel_operadores?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'produtos_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      receituarios_agronomicos: {
        Row: {
          created_at: string | null
          cultura_id: string
          deleted_at: string | null
          descricao: string | null
          empresa_id: string
          id: string
          nome: string
          updated_at: string | null
          valido: boolean | null
        }
        Insert: {
          created_at?: string | null
          cultura_id: string
          deleted_at?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          nome: string
          updated_at?: string | null
          valido?: boolean | null
        }
        Update: {
          created_at?: string | null
          cultura_id?: string
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          updated_at?: string | null
          valido?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'receituarios_agronomicos_cultura_id_fkey'
            columns: ['cultura_id']
            isOneToOne: false
            referencedRelation: 'culturas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'receituarios_agronomicos_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      replantios: {
        Row: {
          created_at: string | null
          data_replantio: string
          deleted_at: string | null
          empresa_id: string
          id: string
          motivo: string | null
          observacoes: string | null
          quantidade_replantada: number
          talhao_id: string
          transplantio_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_replantio: string
          deleted_at?: string | null
          empresa_id: string
          id?: string
          motivo?: string | null
          observacoes?: string | null
          quantidade_replantada: number
          talhao_id: string
          transplantio_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_replantio?: string
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          motivo?: string | null
          observacoes?: string | null
          quantidade_replantada?: number
          talhao_id?: string
          transplantio_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'replantios_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'replantios_talhao_id_fkey'
            columns: ['talhao_id']
            isOneToOne: false
            referencedRelation: 'talhoes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'replantios_transplantio_id_fkey'
            columns: ['transplantio_id']
            isOneToOne: false
            referencedRelation: 'transplantios'
            referencedColumns: ['id']
          },
        ]
      }
      requisicoes_internas: {
        Row: {
          aprovador_id: string | null
          created_at: string | null
          data_aprovacao: string | null
          empresa_id: string
          id: string
          justificativa: string | null
          produto_id: string
          quantidade: number
          solicitante_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          aprovador_id?: string | null
          created_at?: string | null
          data_aprovacao?: string | null
          empresa_id: string
          id?: string
          justificativa?: string | null
          produto_id: string
          quantidade: number
          solicitante_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          aprovador_id?: string | null
          created_at?: string | null
          data_aprovacao?: string | null
          empresa_id?: string
          id?: string
          justificativa?: string | null
          produto_id?: string
          quantidade?: number
          solicitante_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'requisicoes_internas_aprovador_id_fkey'
            columns: ['aprovador_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'requisicoes_internas_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'requisicoes_internas_produto_id_fkey'
            columns: ['produto_id']
            isOneToOne: false
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'requisicoes_internas_solicitante_id_fkey'
            columns: ['solicitante_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      residuos: {
        Row: {
          created_at: string | null
          data_devolucao: string | null
          data_geracao: string
          data_vencimento_cdf: string | null
          deleted_at: string | null
          descricao: string
          empresa_id: string
          id: string
          numero_cdf: string | null
          numero_mtr: string | null
          quantidade: number
          responsavel_id: string | null
          status_logistica_reversa: string | null
          tipo_residuo: string
          unidade: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_devolucao?: string | null
          data_geracao: string
          data_vencimento_cdf?: string | null
          deleted_at?: string | null
          descricao: string
          empresa_id: string
          id?: string
          numero_cdf?: string | null
          numero_mtr?: string | null
          quantidade: number
          responsavel_id?: string | null
          status_logistica_reversa?: string | null
          tipo_residuo: string
          unidade: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_devolucao?: string | null
          data_geracao?: string
          data_vencimento_cdf?: string | null
          deleted_at?: string | null
          descricao?: string
          empresa_id?: string
          id?: string
          numero_cdf?: string | null
          numero_mtr?: string | null
          quantidade?: number
          responsavel_id?: string | null
          status_logistica_reversa?: string | null
          tipo_residuo?: string
          unidade?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'residuos_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'residuos_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      rh_epi_entregas: {
        Row: {
          assinatura_digital_url: string | null
          created_at: string | null
          data_entrega: string
          data_vencimento: string
          deleted_at: string | null
          empresa_id: string
          epi_id: string
          funcionario_id: string
          id: string
          updated_at: string | null
        }
        Insert: {
          assinatura_digital_url?: string | null
          created_at?: string | null
          data_entrega: string
          data_vencimento: string
          deleted_at?: string | null
          empresa_id: string
          epi_id: string
          funcionario_id: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          assinatura_digital_url?: string | null
          created_at?: string | null
          data_entrega?: string
          data_vencimento?: string
          deleted_at?: string | null
          empresa_id?: string
          epi_id?: string
          funcionario_id?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'rh_epi_entregas_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rh_epi_entregas_epi_id_fkey'
            columns: ['epi_id']
            isOneToOne: false
            referencedRelation: 'rh_epis'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rh_epi_entregas_funcionario_id_fkey'
            columns: ['funcionario_id']
            isOneToOne: false
            referencedRelation: 'funcionarios'
            referencedColumns: ['id']
          },
        ]
      }
      rh_epis: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          nome: string
          updated_at: string | null
          validade_dias: number
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          nome: string
          updated_at?: string | null
          validade_dias: number
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          updated_at?: string | null
          validade_dias?: number
        }
        Relationships: [
          {
            foreignKeyName: 'rh_epis_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      rh_ferias_afastamentos: {
        Row: {
          aprovador_id: string | null
          created_at: string | null
          data_fim: string
          data_inicio: string
          deleted_at: string | null
          empresa_id: string
          funcionario_id: string
          id: string
          status: string | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          aprovador_id?: string | null
          created_at?: string | null
          data_fim: string
          data_inicio: string
          deleted_at?: string | null
          empresa_id: string
          funcionario_id: string
          id?: string
          status?: string | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          aprovador_id?: string | null
          created_at?: string | null
          data_fim?: string
          data_inicio?: string
          deleted_at?: string | null
          empresa_id?: string
          funcionario_id?: string
          id?: string
          status?: string | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'rh_ferias_afastamentos_aprovador_id_fkey'
            columns: ['aprovador_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rh_ferias_afastamentos_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rh_ferias_afastamentos_funcionario_id_fkey'
            columns: ['funcionario_id']
            isOneToOne: false
            referencedRelation: 'funcionarios'
            referencedColumns: ['id']
          },
        ]
      }
      rh_folha_pagamento: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          descontos: number
          empresa_id: string
          fgts: number
          funcionario_id: string
          id: string
          inss: number
          irrf: number
          liquido: number
          mes_referencia: string
          proventos: number
          salario_base: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          descontos?: number
          empresa_id: string
          fgts?: number
          funcionario_id: string
          id?: string
          inss?: number
          irrf?: number
          liquido?: number
          mes_referencia: string
          proventos?: number
          salario_base?: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          descontos?: number
          empresa_id?: string
          fgts?: number
          funcionario_id?: string
          id?: string
          inss?: number
          irrf?: number
          liquido?: number
          mes_referencia?: string
          proventos?: number
          salario_base?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'rh_folha_pagamento_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rh_folha_pagamento_funcionario_id_fkey'
            columns: ['funcionario_id']
            isOneToOne: false
            referencedRelation: 'funcionarios'
            referencedColumns: ['id']
          },
        ]
      }
      rh_ponto: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          foto_url: string | null
          funcionario_id: string
          id: string
          latitude: number | null
          longitude: number | null
          timestamp: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          foto_url?: string | null
          funcionario_id: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          timestamp?: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          foto_url?: string | null
          funcionario_id?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          timestamp?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'rh_ponto_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rh_ponto_funcionario_id_fkey'
            columns: ['funcionario_id']
            isOneToOne: false
            referencedRelation: 'funcionarios'
            referencedColumns: ['id']
          },
        ]
      }
      rolagens_container: {
        Row: {
          aprovado_por: string | null
          booking_novo_id: string
          booking_original_id: string
          container_id: string
          created_at: string
          custo_rolagem_usd: number | null
          data_aprovacao: string | null
          data_solicitacao: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          motivo_rolagem: Database['public']['Enums']['motivo_rolagem_enum']
          status: Database['public']['Enums']['status_rolagem_enum'] | null
          updated_at: string
        }
        Insert: {
          aprovado_por?: string | null
          booking_novo_id: string
          booking_original_id: string
          container_id: string
          created_at?: string
          custo_rolagem_usd?: number | null
          data_aprovacao?: string | null
          data_solicitacao?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          motivo_rolagem: Database['public']['Enums']['motivo_rolagem_enum']
          status?: Database['public']['Enums']['status_rolagem_enum'] | null
          updated_at?: string
        }
        Update: {
          aprovado_por?: string | null
          booking_novo_id?: string
          booking_original_id?: string
          container_id?: string
          created_at?: string
          custo_rolagem_usd?: number | null
          data_aprovacao?: string | null
          data_solicitacao?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          motivo_rolagem?: Database['public']['Enums']['motivo_rolagem_enum']
          status?: Database['public']['Enums']['status_rolagem_enum'] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'rolagens_container_booking_novo_id_fkey'
            columns: ['booking_novo_id']
            isOneToOne: false
            referencedRelation: 'bookings'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rolagens_container_booking_original_id_fkey'
            columns: ['booking_original_id']
            isOneToOne: false
            referencedRelation: 'bookings'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rolagens_container_container_id_fkey'
            columns: ['container_id']
            isOneToOne: false
            referencedRelation: 'containers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rolagens_container_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      romaneios_venda: {
        Row: {
          cliente_id: string | null
          container_id: string | null
          created_at: string
          data_emissao: string
          data_prevista_carregamento: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          numero_romaneio: string
          observacoes: string | null
          peso_total_kg: number | null
          status: string | null
          total_pallets: number | null
          updated_at: string
          valor_total: number | null
        }
        Insert: {
          cliente_id?: string | null
          container_id?: string | null
          created_at?: string
          data_emissao?: string
          data_prevista_carregamento?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          numero_romaneio: string
          observacoes?: string | null
          peso_total_kg?: number | null
          status?: string | null
          total_pallets?: number | null
          updated_at?: string
          valor_total?: number | null
        }
        Update: {
          cliente_id?: string | null
          container_id?: string | null
          created_at?: string
          data_emissao?: string
          data_prevista_carregamento?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          numero_romaneio?: string
          observacoes?: string | null
          peso_total_kg?: number | null
          status?: string | null
          total_pallets?: number | null
          updated_at?: string
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'romaneios_venda_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'romaneios_venda_container_id_fkey'
            columns: ['container_id']
            isOneToOne: false
            referencedRelation: 'containers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'romaneios_venda_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      saas_faturas: {
        Row: {
          created_at: string | null
          data_vencimento: string | null
          empresa_id: string
          id: string
          mes_referencia: string
          status: string | null
          updated_at: string | null
          valor_total: number
        }
        Insert: {
          created_at?: string | null
          data_vencimento?: string | null
          empresa_id: string
          id?: string
          mes_referencia: string
          status?: string | null
          updated_at?: string | null
          valor_total: number
        }
        Update: {
          created_at?: string | null
          data_vencimento?: string | null
          empresa_id?: string
          id?: string
          mes_referencia?: string
          status?: string | null
          updated_at?: string | null
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: 'saas_faturas_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      safra_talhoes: {
        Row: {
          created_at: string
          empresa_id: string
          id: string
          safra_id: string
          talhao_id: string
        }
        Insert: {
          created_at?: string
          empresa_id: string
          id?: string
          safra_id: string
          talhao_id: string
        }
        Update: {
          created_at?: string
          empresa_id?: string
          id?: string
          safra_id?: string
          talhao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'safra_talhoes_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'safra_talhoes_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'safra_talhoes_talhao_id_fkey'
            columns: ['talhao_id']
            isOneToOne: false
            referencedRelation: 'talhoes'
            referencedColumns: ['id']
          },
        ]
      }
      safras: {
        Row: {
          ano_safra: number | null
          area_planejada_ha: number | null
          codigo_safra: string | null
          created_at: string | null
          cultivar_id: string
          data_assinatura_tecnica: string | null
          data_colheita_prevista: string | null
          data_colheita_real: string | null
          data_plantio: string | null
          deleted_at: string | null
          densidade_plantio: number | null
          empresa_id: string
          fazenda_id: string | null
          id: string
          imagem_url: string | null
          meta_producao_kg: number | null
          nome_safra: string | null
          orcamento_total: number | null
          produtividade_planejada: number | null
          responsavel_encerramento_id: string | null
          status: string | null
          talhao_id: string | null
          updated_at: string | null
        }
        Insert: {
          ano_safra?: number | null
          area_planejada_ha?: number | null
          codigo_safra?: string | null
          created_at?: string | null
          cultivar_id: string
          data_assinatura_tecnica?: string | null
          data_colheita_prevista?: string | null
          data_colheita_real?: string | null
          data_plantio?: string | null
          deleted_at?: string | null
          densidade_plantio?: number | null
          empresa_id: string
          fazenda_id?: string | null
          id?: string
          imagem_url?: string | null
          meta_producao_kg?: number | null
          nome_safra?: string | null
          orcamento_total?: number | null
          produtividade_planejada?: number | null
          responsavel_encerramento_id?: string | null
          status?: string | null
          talhao_id?: string | null
          updated_at?: string | null
        }
        Update: {
          ano_safra?: number | null
          area_planejada_ha?: number | null
          codigo_safra?: string | null
          created_at?: string | null
          cultivar_id?: string
          data_assinatura_tecnica?: string | null
          data_colheita_prevista?: string | null
          data_colheita_real?: string | null
          data_plantio?: string | null
          deleted_at?: string | null
          densidade_plantio?: number | null
          empresa_id?: string
          fazenda_id?: string | null
          id?: string
          imagem_url?: string | null
          meta_producao_kg?: number | null
          nome_safra?: string | null
          orcamento_total?: number | null
          produtividade_planejada?: number | null
          responsavel_encerramento_id?: string | null
          status?: string | null
          talhao_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'safras_cultivar_id_fkey'
            columns: ['cultivar_id']
            isOneToOne: false
            referencedRelation: 'cultivares'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'safras_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'safras_fazenda_id_fkey'
            columns: ['fazenda_id']
            isOneToOne: false
            referencedRelation: 'fazendas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'safras_responsavel_encerramento_id_fkey'
            columns: ['responsavel_encerramento_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'safras_talhao_id_fkey'
            columns: ['talhao_id']
            isOneToOne: false
            referencedRelation: 'talhoes'
            referencedColumns: ['id']
          },
        ]
      }
      sessoes_carregamento: {
        Row: {
          created_at: string
          data_carregamento: string
          deleted_at: string | null
          empresa_id: string
          id: string
          motorista_nome: string | null
          peso_confirmado_kg: number | null
          responsavel_id: string | null
          romaneio_id: string
          status: string | null
          temperatura_carga: number | null
          transportadora_id: string | null
          updated_at: string
          veiculo_placa: string | null
        }
        Insert: {
          created_at?: string
          data_carregamento?: string
          deleted_at?: string | null
          empresa_id: string
          id?: string
          motorista_nome?: string | null
          peso_confirmado_kg?: number | null
          responsavel_id?: string | null
          romaneio_id: string
          status?: string | null
          temperatura_carga?: number | null
          transportadora_id?: string | null
          updated_at?: string
          veiculo_placa?: string | null
        }
        Update: {
          created_at?: string
          data_carregamento?: string
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          motorista_nome?: string | null
          peso_confirmado_kg?: number | null
          responsavel_id?: string | null
          romaneio_id?: string
          status?: string | null
          temperatura_carga?: number | null
          transportadora_id?: string | null
          updated_at?: string
          veiculo_placa?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'sessoes_carregamento_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'sessoes_carregamento_romaneio_id_fkey'
            columns: ['romaneio_id']
            isOneToOne: false
            referencedRelation: 'romaneios_venda'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'sessoes_carregamento_transportadora_id_fkey'
            columns: ['transportadora_id']
            isOneToOne: false
            referencedRelation: 'transportadoras'
            referencedColumns: ['id']
          },
        ]
      }
      suporte_mensagens: {
        Row: {
          created_at: string
          id: string
          mensagem: string
          ticket_id: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mensagem: string
          ticket_id: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mensagem?: string
          ticket_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'suporte_mensagens_ticket_id_fkey'
            columns: ['ticket_id']
            isOneToOne: false
            referencedRelation: 'suporte_tickets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'suporte_mensagens_usuario_id_fkey'
            columns: ['usuario_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      suporte_tickets: {
        Row: {
          atendente_id: string | null
          created_at: string | null
          deleted_at: string | null
          descricao: string | null
          empresa_id: string
          id: string
          modulo: string | null
          prioridade: string | null
          status: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          atendente_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          modulo?: string | null
          prioridade?: string | null
          status?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          atendente_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          modulo?: string | null
          prioridade?: string | null
          status?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'suporte_tickets_atendente_id_fkey'
            columns: ['atendente_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'suporte_tickets_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      talhoes: {
        Row: {
          altitude: number | null
          area_ha: number | null
          area_plantavel_ha: number | null
          codigo_talhao: string | null
          created_at: string | null
          declividade: number | null
          deleted_at: string | null
          empresa_id: string
          fazenda_id: string
          id: string
          latitude: number | null
          longitude: number | null
          nome: string
          numero_globalgap: string | null
          observacoes: string | null
          referencia_car: string | null
          status_atual: string | null
          tem_irrigacao: boolean | null
          tipo_irrigacao: string | null
          tipo_solo: string | null
          updated_at: string | null
        }
        Insert: {
          altitude?: number | null
          area_ha?: number | null
          area_plantavel_ha?: number | null
          codigo_talhao?: string | null
          created_at?: string | null
          declividade?: number | null
          deleted_at?: string | null
          empresa_id: string
          fazenda_id: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome: string
          numero_globalgap?: string | null
          observacoes?: string | null
          referencia_car?: string | null
          status_atual?: string | null
          tem_irrigacao?: boolean | null
          tipo_irrigacao?: string | null
          tipo_solo?: string | null
          updated_at?: string | null
        }
        Update: {
          altitude?: number | null
          area_ha?: number | null
          area_plantavel_ha?: number | null
          codigo_talhao?: string | null
          created_at?: string | null
          declividade?: number | null
          deleted_at?: string | null
          empresa_id?: string
          fazenda_id?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome?: string
          numero_globalgap?: string | null
          observacoes?: string | null
          referencia_car?: string | null
          status_atual?: string | null
          tem_irrigacao?: boolean | null
          tipo_irrigacao?: string | null
          tipo_solo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'talhoes_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'talhoes_fazenda_id_fkey'
            columns: ['fazenda_id']
            isOneToOne: false
            referencedRelation: 'fazendas'
            referencedColumns: ['id']
          },
        ]
      }
      transplantio_itens: {
        Row: {
          created_at: string | null
          custo_total: number
          custo_unitario: number
          deleted_at: string | null
          descricao: string | null
          empresa_id: string
          id: string
          item_tipo: string
          produto_id: string | null
          quantidade: number
          transplantio_id: string
          unidade: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custo_total?: number
          custo_unitario?: number
          deleted_at?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          item_tipo: string
          produto_id?: string | null
          quantidade?: number
          transplantio_id: string
          unidade?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custo_total?: number
          custo_unitario?: number
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          item_tipo?: string
          produto_id?: string | null
          quantidade?: number
          transplantio_id?: string
          unidade?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'transplantio_itens_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transplantio_itens_produto_id_fkey'
            columns: ['produto_id']
            isOneToOne: false
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transplantio_itens_transplantio_id_fkey'
            columns: ['transplantio_id']
            isOneToOne: false
            referencedRelation: 'transplantios'
            referencedColumns: ['id']
          },
        ]
      }
      transplantios: {
        Row: {
          area_plantada_ha: number | null
          confirmado: boolean | null
          created_at: string | null
          custo_transferido: number | null
          data_transplantio: string
          deleted_at: string | null
          densidade_plantio: number | null
          empresa_id: string
          id: string
          lote_muda_id: string | null
          quantidade_replantio: number | null
          quantidade_transplantada: number
          responsavel_id: string | null
          safra_id: string | null
          talhao_id: string | null
          updated_at: string | null
        }
        Insert: {
          area_plantada_ha?: number | null
          confirmado?: boolean | null
          created_at?: string | null
          custo_transferido?: number | null
          data_transplantio: string
          deleted_at?: string | null
          densidade_plantio?: number | null
          empresa_id: string
          id?: string
          lote_muda_id?: string | null
          quantidade_replantio?: number | null
          quantidade_transplantada: number
          responsavel_id?: string | null
          safra_id?: string | null
          talhao_id?: string | null
          updated_at?: string | null
        }
        Update: {
          area_plantada_ha?: number | null
          confirmado?: boolean | null
          created_at?: string | null
          custo_transferido?: number | null
          data_transplantio?: string
          deleted_at?: string | null
          densidade_plantio?: number | null
          empresa_id?: string
          id?: string
          lote_muda_id?: string | null
          quantidade_replantio?: number | null
          quantidade_transplantada?: number
          responsavel_id?: string | null
          safra_id?: string | null
          talhao_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'transplantios_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transplantios_lote_muda_id_fkey'
            columns: ['lote_muda_id']
            isOneToOne: false
            referencedRelation: 'lotes_mudas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transplantios_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transplantios_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transplantios_talhao_id_fkey'
            columns: ['talhao_id']
            isOneToOne: false
            referencedRelation: 'talhoes'
            referencedColumns: ['id']
          },
        ]
      }
      transportadoras: {
        Row: {
          cnpj: string | null
          created_at: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          nome: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cnpj?: string | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cnpj?: string | null
          created_at?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'transportadoras_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      user_2fa_codes: {
        Row: {
          codigo: string
          criado_em: string | null
          expira_em: string | null
          id: string
          usado: boolean | null
          usuario_id: string
        }
        Insert: {
          codigo: string
          criado_em?: string | null
          expira_em?: string | null
          id?: string
          usado?: boolean | null
          usuario_id: string
        }
        Update: {
          codigo?: string
          criado_em?: string | null
          expira_em?: string | null
          id?: string
          usado?: boolean | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_2fa_codes_usuario_id_fkey'
            columns: ['usuario_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          cliente_id: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          empresa_id: string
          enable_2fa: boolean | null
          fornecedor_id: string | null
          id: string
          nome: string | null
          perfil: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cliente_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          empresa_id: string
          enable_2fa?: boolean | null
          fornecedor_id?: string | null
          id?: string
          nome?: string | null
          perfil?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cliente_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          empresa_id?: string
          enable_2fa?: boolean | null
          fornecedor_id?: string | null
          id?: string
          nome?: string | null
          perfil?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'usuarios_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'usuarios_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'usuarios_fornecedor_id_fkey'
            columns: ['fornecedor_id']
            isOneToOne: false
            referencedRelation: 'fornecedores'
            referencedColumns: ['id']
          },
        ]
      }
      vacaria_animais: {
        Row: {
          brinco: string
          created_at: string | null
          data_nascimento: string | null
          data_ultima_pesagem: string | null
          deleted_at: string | null
          em_quarentena: boolean | null
          empresa_id: string
          foto_url: string | null
          id: string
          lote: string | null
          mae_id: string | null
          nome: string | null
          pai_id: string | null
          peso_atual: number | null
          raca: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          brinco: string
          created_at?: string | null
          data_nascimento?: string | null
          data_ultima_pesagem?: string | null
          deleted_at?: string | null
          em_quarentena?: boolean | null
          empresa_id: string
          foto_url?: string | null
          id?: string
          lote?: string | null
          mae_id?: string | null
          nome?: string | null
          pai_id?: string | null
          peso_atual?: number | null
          raca?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          brinco?: string
          created_at?: string | null
          data_nascimento?: string | null
          data_ultima_pesagem?: string | null
          deleted_at?: string | null
          em_quarentena?: boolean | null
          empresa_id?: string
          foto_url?: string | null
          id?: string
          lote?: string | null
          mae_id?: string | null
          nome?: string | null
          pai_id?: string | null
          peso_atual?: number | null
          raca?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vacaria_animais_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vacaria_animais_mae_id_fkey'
            columns: ['mae_id']
            isOneToOne: false
            referencedRelation: 'vacaria_animais'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vacaria_animais_pai_id_fkey'
            columns: ['pai_id']
            isOneToOne: false
            referencedRelation: 'vacaria_animais'
            referencedColumns: ['id']
          },
        ]
      }
      vacaria_eventos_reprodutivos: {
        Row: {
          animal_id: string
          created_at: string | null
          data_evento: string
          deleted_at: string | null
          empresa_id: string
          id: string
          observacoes: string | null
          previsao_parto: string | null
          resultado_toque: string | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          data_evento: string
          deleted_at?: string | null
          empresa_id: string
          id?: string
          observacoes?: string | null
          previsao_parto?: string | null
          resultado_toque?: string | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          data_evento?: string
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          observacoes?: string | null
          previsao_parto?: string | null
          resultado_toque?: string | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vacaria_eventos_reprodutivos_animal_id_fkey'
            columns: ['animal_id']
            isOneToOne: false
            referencedRelation: 'vacaria_animais'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vacaria_eventos_reprodutivos_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      vacaria_producao_leite: {
        Row: {
          animal_id: string
          cbt: number | null
          ccs: number | null
          created_at: string | null
          data_ordenha: string
          deleted_at: string | null
          empresa_id: string
          id: string
          observacoes: string | null
          periodo: string | null
          updated_at: string | null
          volume_litros: number
        }
        Insert: {
          animal_id: string
          cbt?: number | null
          ccs?: number | null
          created_at?: string | null
          data_ordenha: string
          deleted_at?: string | null
          empresa_id: string
          id?: string
          observacoes?: string | null
          periodo?: string | null
          updated_at?: string | null
          volume_litros: number
        }
        Update: {
          animal_id?: string
          cbt?: number | null
          ccs?: number | null
          created_at?: string | null
          data_ordenha?: string
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          observacoes?: string | null
          periodo?: string | null
          updated_at?: string | null
          volume_litros?: number
        }
        Relationships: [
          {
            foreignKeyName: 'vacaria_producao_leite_animal_id_fkey'
            columns: ['animal_id']
            isOneToOne: false
            referencedRelation: 'vacaria_animais'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vacaria_producao_leite_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      vacaria_saude_animal: {
        Row: {
          animal_id: string
          created_at: string | null
          data_proxima_dose: string | null
          data_registro: string
          deleted_at: string | null
          descricao: string | null
          empresa_id: string
          id: string
          medicamento: string | null
          peso_kg: number | null
          resultado: string | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          data_proxima_dose?: string | null
          data_registro: string
          deleted_at?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          medicamento?: string | null
          peso_kg?: number | null
          resultado?: string | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          data_proxima_dose?: string | null
          data_registro?: string
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          medicamento?: string | null
          peso_kg?: number | null
          resultado?: string | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vacaria_saude_animal_animal_id_fkey'
            columns: ['animal_id']
            isOneToOne: false
            referencedRelation: 'vacaria_animais'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vacaria_saude_animal_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      vendedores: {
        Row: {
          acesso_crm: boolean | null
          agencia: string | null
          agencia_digito: string | null
          bairro: string | null
          banco_codigo: string | null
          banco_nome: string | null
          cep: string | null
          chave_pix: string | null
          chave_pix_tipo: string | null
          cidade: string | null
          comissao_exportacao: number | null
          comissao_fixa: number | null
          comissao_interna: number | null
          complemento: string | null
          conta: string | null
          conta_ativa: boolean | null
          conta_digito: string | null
          conta_principal: boolean | null
          cpf_cnpj: string | null
          created_at: string | null
          data_contratacao: string | null
          data_desligamento: string | null
          data_nascimento: string | null
          deleted_at: string | null
          email: string | null
          email_corporativo: string | null
          email_pessoal: string | null
          empresa_id: string
          estado: string | null
          experiencia_anos: number | null
          foto_url: string | null
          frequencia_pagamento: string | null
          id: string
          idiomas: string | null
          logradouro: string | null
          meta_mensal: number | null
          moeda_padrao: string | null
          nivel_autonomia: string | null
          nome: string
          numero: string | null
          paises_atuacao: string | null
          regioes_atuacao: string | null
          rg: string | null
          status: string | null
          supervisor_id: string | null
          telefone: string | null
          telefone_secundario: string | null
          tipo_conta: string | null
          tipo_mercado: string | null
          tipo_vinculo: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          acesso_crm?: boolean | null
          agencia?: string | null
          agencia_digito?: string | null
          bairro?: string | null
          banco_codigo?: string | null
          banco_nome?: string | null
          cep?: string | null
          chave_pix?: string | null
          chave_pix_tipo?: string | null
          cidade?: string | null
          comissao_exportacao?: number | null
          comissao_fixa?: number | null
          comissao_interna?: number | null
          complemento?: string | null
          conta?: string | null
          conta_ativa?: boolean | null
          conta_digito?: string | null
          conta_principal?: boolean | null
          cpf_cnpj?: string | null
          created_at?: string | null
          data_contratacao?: string | null
          data_desligamento?: string | null
          data_nascimento?: string | null
          deleted_at?: string | null
          email?: string | null
          email_corporativo?: string | null
          email_pessoal?: string | null
          empresa_id: string
          estado?: string | null
          experiencia_anos?: number | null
          foto_url?: string | null
          frequencia_pagamento?: string | null
          id?: string
          idiomas?: string | null
          logradouro?: string | null
          meta_mensal?: number | null
          moeda_padrao?: string | null
          nivel_autonomia?: string | null
          nome: string
          numero?: string | null
          paises_atuacao?: string | null
          regioes_atuacao?: string | null
          rg?: string | null
          status?: string | null
          supervisor_id?: string | null
          telefone?: string | null
          telefone_secundario?: string | null
          tipo_conta?: string | null
          tipo_mercado?: string | null
          tipo_vinculo?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          acesso_crm?: boolean | null
          agencia?: string | null
          agencia_digito?: string | null
          bairro?: string | null
          banco_codigo?: string | null
          banco_nome?: string | null
          cep?: string | null
          chave_pix?: string | null
          chave_pix_tipo?: string | null
          cidade?: string | null
          comissao_exportacao?: number | null
          comissao_fixa?: number | null
          comissao_interna?: number | null
          complemento?: string | null
          conta?: string | null
          conta_ativa?: boolean | null
          conta_digito?: string | null
          conta_principal?: boolean | null
          cpf_cnpj?: string | null
          created_at?: string | null
          data_contratacao?: string | null
          data_desligamento?: string | null
          data_nascimento?: string | null
          deleted_at?: string | null
          email?: string | null
          email_corporativo?: string | null
          email_pessoal?: string | null
          empresa_id?: string
          estado?: string | null
          experiencia_anos?: number | null
          foto_url?: string | null
          frequencia_pagamento?: string | null
          id?: string
          idiomas?: string | null
          logradouro?: string | null
          meta_mensal?: number | null
          moeda_padrao?: string | null
          nivel_autonomia?: string | null
          nome?: string
          numero?: string | null
          paises_atuacao?: string | null
          regioes_atuacao?: string | null
          rg?: string | null
          status?: string | null
          supervisor_id?: string | null
          telefone?: string | null
          telefone_secundario?: string | null
          tipo_conta?: string | null
          tipo_mercado?: string | null
          tipo_vinculo?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vendedores_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vendedores_supervisor_id_fkey'
            columns: ['supervisor_id']
            isOneToOne: false
            referencedRelation: 'vendedores'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_daily_alerts: { Args: never; Returns: undefined }
      check_daily_alerts_compliance: { Args: never; Returns: undefined }
      gerar_alertas_fenologia: {
        Args: { p_empresa_id: string }
        Returns: undefined
      }
      gerar_alertas_rh_frota: {
        Args: { p_empresa_id: string }
        Returns: undefined
      }
      get_portal_cliente_data: { Args: { p_token: string }; Returns: Json }
      get_portal_data: { Args: { p_token: string }; Returns: Json }
      get_portal_despachante_data: { Args: { p_token: string }; Returns: Json }
      get_portal_fornecedor_data: { Args: { p_token: string }; Returns: Json }
      get_portal_produtor_data: { Args: { p_token: string }; Returns: Json }
      get_user_empresa_id: { Args: never; Returns: string }
      get_user_perfil: { Args: never; Returns: string }
      is_admin_saas: { Args: never; Returns: boolean }
      validar_token_portal: { Args: { p_token: string }; Returns: Json }
      verificar_carencia_safra: {
        Args: { p_data_colheita: string; p_safra_id: string }
        Returns: Json
      }
    }
    Enums: {
      booking_status_enum: 'reservado' | 'confirmado' | 'em_transito' | 'concluido' | 'cancelado'
      entidade_portal_enum: 'produtor' | 'cliente' | 'fornecedor' | 'despachante'
      invoice_incoterm_enum: 'fob' | 'cfr' | 'cif' | 'dap' | 'ddp'
      invoice_status_enum: 'rascunho' | 'emitida' | 'paga' | 'cancelada'
      motivo_rolagem_enum: 'atraso_navio' | 'falta_espaco' | 'problema_documentacao' | 'outro'
      pallet_status: 'em_camara' | 'etiquetado' | 'reservado' | 'carregado' | 'descartado'
      status_documento_enum: 'valido' | 'vencido' | 'pendente'
      status_rolagem_enum: 'pendente' | 'aprovada' | 'executada' | 'cancelada'
      tipo_container_enum: 'dry_20' | 'dry_40' | 'reefer_20' | 'reefer_40' | 'hc_40' | 'outro'
      tipo_documento_enum:
        | 'bl'
        | 'awb'
        | 'co'
        | 'phytosanitary'
        | 'certificate_origin'
        | 'fumigation'
        | 'packing_list'
        | 'commercial_invoice'
        | 'other'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status_enum: ['reservado', 'confirmado', 'em_transito', 'concluido', 'cancelado'],
      entidade_portal_enum: ['produtor', 'cliente', 'fornecedor', 'despachante'],
      invoice_incoterm_enum: ['fob', 'cfr', 'cif', 'dap', 'ddp'],
      invoice_status_enum: ['rascunho', 'emitida', 'paga', 'cancelada'],
      motivo_rolagem_enum: ['atraso_navio', 'falta_espaco', 'problema_documentacao', 'outro'],
      pallet_status: ['em_camara', 'etiquetado', 'reservado', 'carregado', 'descartado'],
      status_documento_enum: ['valido', 'vencido', 'pendente'],
      status_rolagem_enum: ['pendente', 'aprovada', 'executada', 'cancelada'],
      tipo_container_enum: ['dry_20', 'dry_40', 'reefer_20', 'reefer_40', 'hc_40', 'outro'],
      tipo_documento_enum: [
        'bl',
        'awb',
        'co',
        'phytosanitary',
        'certificate_origin',
        'fumigation',
        'packing_list',
        'commercial_invoice',
        'other',
      ],
    },
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: account_sales
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   invoice_id: uuid (nullable)
//   container_id: uuid (nullable)
//   data_venda: date (nullable)
//   valor_bruto: numeric (nullable, default: 0)
//   despesas_internacionais: numeric (nullable, default: 0)
//   comissoes: numeric (nullable, default: 0)
//   valor_liquido: numeric (nullable, default: 0)
//   margem_percentual: numeric (nullable, default: 0)
//   status: text (nullable, default: 'rascunho'::text)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   taxa_cambio: numeric (nullable, default: 1)
// Table: adiantamentos_internacionais
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   cliente_id: uuid (not null)
//   invoice_id: uuid (nullable)
//   numero_adiantamento: text (not null)
//   data_adiantamento: date (nullable)
//   valor_usd: numeric (nullable, default: 0)
//   valor_brl: numeric (nullable, default: 0)
//   taxa_cambio: numeric (nullable, default: 1)
//   data_prevista_reembolso: date (nullable)
//   status: character varying (nullable, default: 'pendente'::character varying)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: alertas
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   titulo: character varying (not null)
//   descricao: text (nullable)
//   tipo: character varying (not null)
//   lido: boolean (nullable, default: false)
//   usuario_id: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: amostras_qualidade_campo
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   talhao_id: uuid (not null)
//   data_coleta: date (nullable)
//   tamanho_fruto_mm: numeric (nullable)
//   cor: character varying (nullable)
//   firmeza: character varying (nullable)
//   solidos_soluveis_brix: numeric (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   safra_id: uuid (nullable)
//   estagio_fenologico: text (nullable)
//   tamanho_amostra_frutos: integer (nullable)
//   brix_minimo: numeric (nullable)
//   brix_medio: numeric (nullable)
//   brix_maximo: numeric (nullable)
//   firmeza_media: numeric (nullable)
//   coloracao_escala: integer (nullable)
//   peso_medio_fruto: numeric (nullable)
//   defeitos_percentual: numeric (nullable)
//   acidez_titulavel: numeric (nullable)
//   ratio_brix_acidez: numeric (nullable)
//   apto_colheita: boolean (nullable, default: false)
//   data_estimada_colheita: date (nullable)
//   fotos: _text (nullable)
//   observacoes: text (nullable)
// Table: analises_solo
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   talhao_id: uuid (not null)
//   data_coleta: date (nullable)
//   profundidade_cm: integer (nullable)
//   ph: numeric (nullable)
//   materia_organica: numeric (nullable)
//   nitrogenio: numeric (nullable)
//   fosforo: numeric (nullable)
//   potassio: numeric (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   laboratorio: text (nullable)
//   metodologia: text (nullable)
//   calcio: numeric (nullable)
//   magnesio: numeric (nullable)
//   enxofre: numeric (nullable)
//   boro: numeric (nullable)
//   zinco: numeric (nullable)
//   ferro: numeric (nullable)
//   manganes: numeric (nullable)
//   cobre: numeric (nullable)
//   ctc: numeric (nullable)
//   saturacao_bases: numeric (nullable)
//   argila: numeric (nullable)
//   areia: numeric (nullable)
//   silte: numeric (nullable)
//   calcario_recomendado: numeric (nullable)
//   gesso_recomendado: numeric (nullable)
//   laudo_pdf_url: text (nullable)
// Table: armazens
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: character varying (not null)
//   localizacao: text (nullable)
//   capacidade_toneladas: numeric (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   fazenda_id: uuid (nullable)
//   tipo: character varying (nullable)
//   responsavel_id: uuid (nullable)
//   usa_peps: boolean (nullable, default: false)
//   temperatura_controlada: boolean (nullable, default: false)
//   temp_minima: numeric (nullable)
//   temp_maxima: numeric (nullable)
// Table: audit_logs
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   usuario_id: uuid (nullable)
//   acao: character varying (nullable)
//   tabela: character varying (nullable)
//   registro_id: uuid (nullable)
//   dados_anteriores: jsonb (nullable)
//   dados_novos: jsonb (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: balanco_massas
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   safra_id: uuid (not null)
//   quantidade_plantada_kg: numeric (nullable)
//   quantidade_colhida_kg: numeric (nullable)
//   quantidade_descarte_kg: numeric (nullable)
//   quantidade_processada_kg: numeric (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   exportacao_kg: numeric (nullable, default: 0)
//   mercado_interno_kg: numeric (nullable, default: 0)
//   doacao_kg: numeric (nullable, default: 0)
//   descarte_qualidade_kg: numeric (nullable, default: 0)
//   descarte_excesso_kg: numeric (nullable, default: 0)
//   perda_campo_kg: numeric (nullable, default: 0)
//   perda_packing_kg: numeric (nullable, default: 0)
// Table: bookings
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   numero_booking: text (not null)
//   navio_id: uuid (nullable)
//   porto_origem_id: uuid (nullable)
//   porto_destino_id: uuid (nullable)
//   data_etd: date (nullable)
//   data_eta: date (nullable)
//   quantidade_containeres: integer (nullable)
//   tipo_container: tipo_container_enum (nullable)
//   status: booking_status_enum (nullable, default: 'reservado'::booking_status_enum)
//   agente_maritimo: text (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: caderno_campo
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   talhao_id: uuid (not null)
//   data: date (nullable)
//   observacoes: text (nullable)
//   responsavel_id: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: carregamentos
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   data_carregamento: date (nullable)
//   placa_veiculo: character varying (nullable)
//   status: character varying (nullable, default: 'pendente'::character varying)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: centros_custo
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: character varying (not null)
//   codigo: character varying (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: certificacoes_auditorias
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   modelo_id: uuid (not null)
//   data_agendada: date (not null)
//   data_realizada: date (nullable)
//   tipo_auditoria: text (not null)
//   auditor_nome: text (nullable)
//   escopo: text (nullable)
//   status: text (nullable, default: 'agendada'::text)
//   score_final: numeric (nullable)
//   responsavel_id: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: certificacoes_itens_auditoria
//   id: uuid (not null, default: gen_random_uuid())
//   auditoria_id: uuid (not null)
//   item_modelo_id: uuid (not null)
//   resposta: text (nullable)
//   evidencias_url: _text (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: certificacoes_itens_modelo
//   id: uuid (not null, default: gen_random_uuid())
//   modelo_id: uuid (not null)
//   secao: text (nullable)
//   descricao: text (not null)
//   peso: numeric (nullable, default: 1)
//   requisito_legal: boolean (nullable, default: false)
//   gravidade_default: text (nullable, default: 'menor'::text)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: certificacoes_modelos
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: text (not null)
//   tipo: text (not null)
//   versao: text (not null)
//   status: text (nullable, default: 'ativo'::text)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: clientes
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: character varying (not null)
//   cnpj_cpf: character varying (nullable)
//   email: character varying (nullable)
//   telefone: character varying (nullable)
//   pais: character varying (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   nome_fantasia: text (nullable)
//   tipo_cliente: text (nullable)
//   tipo_pessoa: text (nullable)
//   indicador_ie: text (nullable)
//   inscricao_estadual: character varying (nullable)
//   inscricao_municipal: text (nullable)
//   vendedor_id: uuid (nullable)
//   limite_credito: numeric (nullable)
//   acesso_portal: boolean (nullable, default: false)
//   forma_pagamento_padrao: text (nullable)
//   desconto_padrao: numeric (nullable, default: 0)
//   preset_prazo: text (nullable)
//   prazo_dias: text (nullable)
//   observacoes_comerciais: text (nullable)
//   usuario_vinculado: text (nullable)
//   moeda_id: uuid (nullable)
//   porto_destino_id: uuid (nullable)
// Table: colheita_registros
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   safra_id: uuid (not null)
//   data_colheita: date (nullable)
//   quantidade_colhida_kg: numeric (nullable)
//   qualidade_visual: character varying (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   producao_bruta_ton: numeric (nullable)
//   perdas_ton: numeric (nullable, default: 0)
//   producao_liquida_ton: numeric (nullable)
//   area_colhida_ha: numeric (nullable)
//   numero_caixas: integer (nullable)
//   brix_medio: numeric (nullable)
//   temperatura_colheita: numeric (nullable)
//   lote_producao: character varying (nullable)
//   operadores: jsonb (nullable, default: '[]'::jsonb)
//   equipamento_id: uuid (nullable)
//   destino_producao: character varying (nullable)
//   fotos: _text (nullable)
//   responsavel_id: uuid (nullable)
// Table: compras_cotacao_fornecedores
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   cotacao_id: uuid (not null)
//   fornecedor_id: uuid (not null)
//   preco_unitario: numeric (not null)
//   prazo_entrega_dias: integer (not null)
//   condicao_pagamento: text (nullable)
//   validade_cotacao: date (nullable)
//   score_final: numeric (nullable)
//   vencedor: boolean (nullable, default: false)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: compras_cotacoes
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   requisicao_id: uuid (not null)
//   prazo_respostas: date (not null)
//   status: text (nullable, default: 'aberta'::text)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: compras_pedido
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   requisicao_id: uuid (not null)
//   produto_id: uuid (not null)
//   fornecedor_id: uuid (nullable)
//   quantidade: numeric (nullable)
//   preco_unitario: numeric (nullable)
//   data_entrega_prevista: date (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   status: character varying (nullable, default: 'pendente'::character varying)
//   numero_nota_fiscal: character varying (nullable)
//   condicoes_pagamento: text (nullable)
//   total_pedido: numeric (nullable)
//   observacoes: text (nullable)
//   data_pedido: date (nullable, default: CURRENT_DATE)
//   avaliacao_recebimento: character varying (nullable)
// Table: compras_requisicao
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   numero_requisicao: character varying (nullable)
//   data_requisicao: date (nullable)
//   solicitante_id: uuid (nullable)
//   status: character varying (nullable, default: 'pendente'::character varying)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   prioridade: character varying (nullable)
//   justificativa: text (nullable)
//   valor_total_estimado: numeric (nullable)
//   safra_id: uuid (nullable)
//   observacoes: text (nullable)
//   itens: jsonb (nullable, default: '[]'::jsonb)
//   pedido_gerado: boolean (nullable, default: false)
// Table: conta_corrente_produtor
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   produtor_id: uuid (not null)
//   safra_id: uuid (nullable)
//   tipo_movimento: character varying (nullable)
//   data_movimento: date (nullable)
//   descricao: text (nullable)
//   valor: numeric (nullable, default: 0)
//   saldo: numeric (nullable, default: 0)
//   documento: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: containers
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   numero_container: character varying (not null)
//   destino: character varying (nullable)
//   status: character varying (nullable, default: 'embarcado'::character varying)
//   data_embarque: date (nullable)
//   cut_off: date (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   booking_id: uuid (nullable)
//   selo: text (nullable)
//   tara_kg: numeric (nullable)
//   peso_bruto_kg: numeric (nullable)
//   peso_liquido_kg: numeric (nullable)
//   temperatura_configurada: numeric (nullable)
//   aprovador_1_id: uuid (nullable)
//   aprovador_2_id: uuid (nullable)
//   gate_in_data: timestamp with time zone (nullable)
//   gate_out_data: timestamp with time zone (nullable)
// Table: contas_bancarias
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome_banco: text (not null)
//   agencia: text (nullable)
//   conta: text (nullable)
//   tipo: character varying (nullable)
//   moeda: character varying (nullable)
//   saldo_inicial: numeric (nullable, default: 0)
//   saldo_atual: numeric (nullable, default: 0)
//   data_saldo: date (nullable)
//   ativo: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: contas_bancarias_entidade
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   entidade_id: uuid (not null)
//   entidade_tipo: text (not null)
//   banco_nome: text (nullable)
//   banco_codigo: text (nullable)
//   agencia: text (nullable)
//   conta: text (nullable)
//   tipo_conta: text (nullable)
//   swift: text (nullable)
//   iban: text (nullable)
//   chave_pix_tipo: text (nullable)
//   chave_pix: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: contatos_entidade
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   entidade_id: uuid (not null)
//   entidade_tipo: text (not null)
//   nome: text (not null)
//   telefone: text (nullable)
//   email: text (nullable)
//   cargo: text (nullable)
//   whatsapp: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: cooperados_contratos
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   fornecedor_id: uuid (not null)
//   safra_id: uuid (not null)
//   talhao_id: uuid (nullable)
//   percentual_participacao: numeric (not null, default: 0)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: cultivares
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   cultura_id: uuid (not null)
//   nome: character varying (not null)
//   dias_para_colheita: integer (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   codigo_interno: text (nullable)
//   pais_origem: text (nullable)
//   detentor_licenciador: text (nullable)
//   produtividade_esperada_t_ha: numeric (nullable)
//   shelf_life_ideal_dias: integer (nullable)
//   shelf_life_minimo_dias: integer (nullable)
//   gda_objetivo_colheita: numeric (nullable)
// Table: culturas
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: character varying (not null)
//   tipo: character varying (nullable)
//   ciclo_dias: integer (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   nome_cientifico: text (nullable)
//   codigo_ncm: text (nullable)
//   unidade_medida: text (nullable)
//   temperatura_base_gda: numeric (nullable)
//   temp_minima_ideal: numeric (nullable)
//   temp_maxima_ideal: numeric (nullable)
//   necessidade_hidrica_mm_dia: numeric (nullable)
//   brix_minimo_ideal: numeric (nullable)
//   brix_maximo_ideal: numeric (nullable)
//   produtividade_media_t_ha: numeric (nullable)
// Table: culturas_fenologia
//   id: uuid (not null, default: gen_random_uuid())
//   cultura_id: uuid (not null)
//   empresa_id: uuid (not null)
//   estagio: text (not null)
//   dias_desde_plantio: integer (not null)
//   descricao: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: custos_talhao
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   talhao_id: uuid (not null)
//   safra_id: uuid (not null)
//   centro_custo_id: uuid (not null)
//   descricao: character varying (nullable)
//   valor: numeric (nullable)
//   data_lancamento: date (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: devolucoes_compras
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   pedido_id: uuid (not null)
//   fornecedor_id: uuid (not null)
//   produto_id: uuid (not null)
//   lote_id: uuid (nullable)
//   quantidade: numeric (not null)
//   motivo: text (nullable)
//   status: character varying (nullable, default: 'pendente'::character varying)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: divergencias_carregamento
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   sessao_id: uuid (not null)
//   pallet_id: uuid (nullable)
//   tipo_divergencia: text (nullable)
//   valor_esperado: numeric (nullable)
//   valor_real: numeric (nullable)
//   motivo: text (nullable)
//   aprovado_por: uuid (nullable)
//   status: text (nullable, default: 'pendente'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: documentos_entidade
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   entidade_id: uuid (not null)
//   entidade_tipo: text (not null)
//   tipo_documento: text (nullable)
//   numero_documento: text (nullable)
//   titulo: text (not null)
//   arquivo_url: text (nullable)
//   data_emissao: date (nullable)
//   data_validade: date (nullable)
//   gerar_alerta: boolean (nullable, default: false)
//   dias_antecedencia_alerta: integer (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: documentos_exportacao
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   container_id: uuid (nullable)
//   tipo_documento: tipo_documento_enum (not null)
//   numero_documento: text (nullable)
//   data_emissao: date (nullable)
//   data_validade: date (nullable)
//   arquivo_url: text (nullable)
//   status: status_documento_enum (nullable, default: 'pendente'::status_documento_enum)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: emissoes_carbono
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   safra_id: uuid (nullable)
//   talhao_id: uuid (nullable)
//   data_registro: date (not null)
//   fonte_emissao: text (not null)
//   quantidade: numeric (not null)
//   unidade: text (not null)
//   fator_conversao_ipcc: numeric (not null)
//   co2e_total: numeric (not null)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: empresas
//   id: uuid (not null, default: gen_random_uuid())
//   nome: character varying (not null)
//   cnpj: character varying (nullable)
//   email: character varying (nullable)
//   telefone: character varying (nullable)
//   plano_id: uuid (nullable)
//   slug: character varying (nullable)
//   ativo: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   modulos_habilitados: _text (nullable, default: '{}'::text[])
//   limite_usuarios: integer (nullable, default: 5)
//   configuracoes: jsonb (nullable, default: '{}'::jsonb)
// Table: enderecos_entidade
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   entidade_id: uuid (not null)
//   entidade_tipo: text (not null)
//   tipo_endereco: text (not null)
//   logradouro: text (nullable)
//   numero: text (nullable)
//   complemento: text (nullable)
//   bairro: text (nullable)
//   cidade: text (nullable)
//   estado: text (nullable)
//   cep: text (nullable)
//   pais: text (nullable)
//   receiver: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: equipamentos
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: character varying (not null)
//   tipo: character varying (nullable)
//   data_aquisicao: date (nullable)
//   valor_aquisicao: numeric (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: estoque_movimento
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   lote_id: uuid (not null)
//   tipo_movimento: character varying (nullable)
//   quantidade: numeric (nullable)
//   motivo: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: estufas
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: text (not null)
//   tipo: text (nullable)
//   area_m2: numeric (nullable)
//   capacidade_lotes: integer (nullable)
//   fazenda_id: uuid (nullable)
//   responsavel_id: uuid (nullable)
//   ativo: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: etiquetas_impressas
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   pallet_id: uuid (not null)
//   romaneio_id: uuid (nullable)
//   numero_etiqueta: text (not null)
//   data_impressao: timestamp with time zone (not null, default: now())
//   impresso_por: uuid (nullable)
//   reimpressao: boolean (nullable, default: false)
//   motivo_reimpressao: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: fazendas
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: character varying (not null)
//   cnpj_imobiliario: text (nullable)
//   endereco: text (nullable)
//   municipio: character varying (nullable)
//   estado: character varying (nullable)
//   area_total_ha: numeric (nullable)
//   latitude: numeric (nullable)
//   longitude: numeric (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   inscricao_estadual: text (nullable)
//   numero_car: character varying (nullable)
//   nirf: text (nullable)
//   ccir: text (nullable)
//   data_fundacao: date (nullable)
//   area_produtiva_ha: numeric (nullable)
//   tipo_producao: text (nullable)
//   responsavel_nome: text (nullable)
//   responsavel_cpf: text (nullable)
//   responsavel_telefone: text (nullable)
//   responsavel_email: text (nullable)
// Table: financeiro_lancamentos
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   tipo: character varying (not null)
//   descricao: character varying (not null)
//   valor: numeric (not null)
//   data_vencimento: date (nullable)
//   status: character varying (nullable, default: 'pendente'::character varying)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   conta_bancaria_id: uuid (nullable)
//   plano_conta_id: uuid (nullable)
//   data_lancamento: date (nullable, default: CURRENT_DATE)
//   data_pagamento: date (nullable)
//   documento: text (nullable)
//   parcela: integer (nullable, default: 1)
//   total_parcelas: integer (nullable, default: 1)
//   fornecedor_id: uuid (nullable)
//   cliente_id: uuid (nullable)
//   centro_custo_id: uuid (nullable)
//   observacoes: text (nullable)
//   invoice_id: uuid (nullable)
// Table: fornecedores
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: character varying (not null)
//   cnpj: character varying (nullable)
//   email: character varying (nullable)
//   telefone: character varying (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   is_cooperado: boolean (nullable, default: false)
//   nome_propriedade: text (nullable)
//   area_total_ha: numeric (nullable)
// Table: frota_abastecimentos
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   viagem_id: uuid (nullable)
//   veiculo_id: uuid (not null)
//   litros: numeric (not null)
//   valor_total: numeric (not null)
//   km_registro: numeric (not null)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: frota_manutencoes
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   veiculo_id: uuid (not null)
//   tipo: text (not null)
//   data_prevista: date (nullable)
//   data_realizada: date (nullable)
//   km_previsto: numeric (nullable)
//   km_realizado: numeric (nullable)
//   custo: numeric (nullable, default: 0)
//   os_numero: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: frota_veiculos
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   modelo: text (not null)
//   placa: text (not null)
//   km_atual: numeric (nullable, default: 0)
//   vencimento_seguro: date (nullable)
//   vencimento_documento: date (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: frota_viagens
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   veiculo_id: uuid (not null)
//   motorista_id: uuid (nullable)
//   origem: text (not null)
//   destino: text (not null)
//   km_inicial: numeric (not null)
//   km_final: numeric (nullable)
//   data_inicio: timestamp with time zone (not null)
//   data_fim: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: funcionarios
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: character varying (not null)
//   cpf: character varying (nullable)
//   cargo: character varying (nullable)
//   data_admissao: date (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: graus_dia
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   talhao_id: uuid (not null)
//   data: date (nullable)
//   temperatura_media: numeric (nullable)
//   graus_dia_acumulado: numeric (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   temp_maxima: numeric (nullable)
//   temp_minima: numeric (nullable)
//   fonte_dados: character varying (nullable)
//   gda_diario: numeric (nullable)
//   safra_id: uuid (nullable)
//   usuario_id: uuid (nullable)
// Table: historico_produtividade_talhao
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   talhao_id: uuid (not null)
//   ano: integer (nullable)
//   produtividade_kg_ha: numeric (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: invoices_exportacao
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   container_id: uuid (nullable)
//   numero_invoice: text (not null)
//   data_emissao: date (nullable)
//   cliente_id: uuid (nullable)
//   incoterm: invoice_incoterm_enum (nullable)
//   valor_total_usd: numeric (nullable)
//   valor_total_brl: numeric (nullable)
//   peso_total_kg: numeric (nullable)
//   quantidade_pallets: integer (nullable)
//   romaneio_ids: _uuid (nullable)
//   status: invoice_status_enum (nullable, default: 'rascunho'::invoice_status_enum)
//   pdf_url: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: lotes_estoque
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   produto_id: uuid (not null)
//   armazem_id: uuid (not null)
//   numero_lote: character varying (nullable)
//   quantidade: numeric (nullable)
//   data_entrada: date (nullable)
//   data_validade: date (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   data_fabricacao: date (nullable)
//   localizacao: character varying (nullable)
// Table: lotes_mudas
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   estufa_id: uuid (nullable)
//   cultura_id: uuid (nullable)
//   cultivar_id: uuid (nullable)
//   nome_lote: text (not null)
//   quantidade_mudas: integer (nullable, default: 0)
//   quantidade_viva: integer (nullable, default: 0)
//   data_semeadura: date (nullable)
//   data_prevista_transplantio: date (nullable)
//   custo_total: numeric (nullable, default: 0)
//   custo_por_muda: numeric (nullable, default: 0)
//   status: text (nullable, default: 'germinando'::text)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: moedas
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: text (not null)
//   codigo: text (not null)
//   simbolo: text (not null)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: monitoramento_pragas
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   talhao_id: uuid (not null)
//   data_monitoramento: date (nullable)
//   praga_identificada: character varying (nullable)
//   nivel_infestacao: character varying (nullable)
//   acao_recomendada: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   safra_id: uuid (nullable)
//   responsavel_id: uuid (nullable)
//   tipo: character varying (nullable)
//   area_afetada_percentual: numeric (nullable)
//   num_armadilhas: integer (nullable)
//   num_capturas: integer (nullable)
//   latitude: numeric (nullable)
//   longitude: numeric (nullable)
//   fotos: _text (nullable)
// Table: nao_conformidades
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   auditoria_id: uuid (nullable)
//   item_auditoria_id: uuid (nullable)
//   descricao: text (not null)
//   gravidade: text (not null)
//   status: text (nullable, default: 'aberta'::text)
//   responsavel_id: uuid (nullable)
//   plano_acao: text (nullable)
//   prazo_correcao: date (nullable)
//   evidencias_correcao_url: _text (nullable)
//   data_fechamento: date (nullable)
//   bloqueia_certificado: boolean (nullable, default: false)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: navios
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome_navio: text (not null)
//   bandeira: text (nullable)
//   imo_number: text (nullable)
//   armador: text (nullable)
//   ano_construcao: integer (nullable)
//   capacidade_teus: integer (nullable)
//   ativo: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: operacao_insumos
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   operacao_id: uuid (not null)
//   produto_id: uuid (not null)
//   quantidade_utilizada: numeric (nullable)
//   lote_id: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   area_aplicada_ha: numeric (nullable)
// Table: operacoes_campo
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   safra_id: uuid (not null)
//   receituario_id: uuid (nullable)
//   tipo_operacao: character varying (nullable)
//   data_inicio: date (nullable)
//   data_conclusao: date (nullable)
//   status: character varying (nullable, default: 'pendente'::character varying)
//   responsavel_id: uuid (nullable)
//   foto_geolocalizada_url: text (nullable)
//   latitude: numeric (nullable)
//   longitude: numeric (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   ponto_captacao: text (nullable)
//   consumo_agua_m3: numeric (nullable)
//   equipamento_id: uuid (nullable)
//   clima_observacoes: text (nullable)
//   observacoes: text (nullable)
// Table: packing_recepcoes
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   lote_producao_id: uuid (not null)
//   safra_id: uuid (not null)
//   quantidade_ton: numeric (not null)
//   data_recepcao: timestamp with time zone (not null, default: now())
//   status: text (nullable, default: 'em_recebimento'::text)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   peso_bruto_kg: numeric (nullable)
//   peso_liquido_kg: numeric (nullable)
//   tara_kg: numeric (nullable)
//   quantidade_caixas: integer (nullable)
//   temperatura_recepcao: numeric (nullable)
//   conformidade_visual: text (nullable)
//   motivo_reprovacao: text (nullable)
//   responsavel_id: uuid (nullable)
// Table: pallets
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   codigo: character varying (not null)
//   safra_id: uuid (nullable)
//   peso_kg: numeric (nullable)
//   status: character varying (nullable, default: 'em_estoque'::character varying)
//   conformidade_percentual: numeric (nullable, default: 100)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   destino: character varying (nullable, default: 'mercado_interno'::character varying)
//   recepcao_id: uuid (nullable)
//   romaneio_id: uuid (nullable)
//   codigo_pallet: text (nullable)
//   produto_id: uuid (nullable)
//   peso_bruto_kg: numeric (nullable)
//   peso_liquido_kg: numeric (nullable)
//   quantidade_caixas: integer (nullable)
//   calibre: text (nullable)
//   data_paletizacao: timestamp with time zone (nullable, default: now())
//   data_saida_camara: timestamp with time zone (nullable)
//   temperatura_camara: numeric (nullable)
//   etiqueta_impressa: boolean (nullable, default: false)
//   etiqueta_zpl: text (nullable)
//   produtor_id: uuid (nullable)
// Table: patrimonio_bens
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: text (not null)
//   codigo_qr: text (not null)
//   valor_aquisicao: numeric (not null, default: 0)
//   data_aquisicao: date (not null)
//   vida_util_meses: integer (not null, default: 12)
//   localizacao_id: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: perdas_estufa
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   lote_muda_id: uuid (nullable)
//   data_perda: date (not null)
//   tipo_perda: text (nullable)
//   quantidade_perdida: integer (not null)
//   responsavel_id: uuid (nullable)
//   motivo: text (nullable)
//   foto_url: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: planejamento_safra
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   safra_id: uuid (not null)
//   atividade: character varying (nullable)
//   data_prevista: date (nullable)
//   data_realizada: date (nullable)
//   responsavel_id: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: plano_contas
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   codigo: text (not null)
//   descricao: text (not null)
//   tipo: character varying (nullable)
//   natureza: character varying (nullable)
//   pai_id: uuid (nullable)
//   nivel: integer (nullable, default: 1)
//   ativo: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: planos
//   id: uuid (not null, default: gen_random_uuid())
//   nome: character varying (not null)
//   descricao: text (nullable)
//   preco_mensal: numeric (not null)
//   limite_usuarios: integer (not null)
//   modulos_habilitados: _text (nullable, default: ARRAY[]::text[])
//   ativo: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: pluviometria
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   talhao_id: uuid (not null)
//   data: date (nullable)
//   precipitacao_mm: numeric (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: portal_tokens
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   entidade_tipo: entidade_portal_enum (not null)
//   entidade_id: uuid (not null)
//   token: text (not null)
//   data_expiracao: timestamp with time zone (not null, default: (now() + '90 days'::interval))
//   acessos_permitidos: _text (nullable, default: '{}'::text[])
//   ultimo_acesso: timestamp with time zone (nullable)
//   ativo: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: portos
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome_porto: text (not null)
//   pais: text (nullable)
//   cidade: text (nullable)
//   tipo: text (nullable)
//   codigo_un_locode: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: produtos
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: character varying (not null)
//   tipo: character varying (nullable)
//   unidade_medida: character varying (nullable)
//   preco_unitario: numeric (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   codigo_interno: text (nullable)
//   categoria: text (nullable)
//   fabricante_marca: text (nullable)
//   estoque_minimo: integer (nullable)
//   prazo_validade_dias: integer (nullable)
//   codigo_ncm: text (nullable)
//   classe_risco: text (nullable)
//   status: text (nullable, default: 'ativo'::text)
//   registro_mapa: text (nullable)
//   classe_toxicologica: text (nullable)
//   carencia_dias: integer (nullable)
//   exige_receituario: boolean (nullable)
//   ingrediente_ativo: text (nullable)
//   recomendacao_uso: text (nullable)
//   visivel_operadores: boolean (nullable, default: true)
// Table: receituarios_agronomicos
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   cultura_id: uuid (not null)
//   nome: character varying (not null)
//   descricao: text (nullable)
//   valido: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: replantios
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   transplantio_id: uuid (not null)
//   talhao_id: uuid (not null)
//   data_replantio: date (not null)
//   quantidade_replantada: integer (not null)
//   motivo: text (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: requisicoes_internas
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   solicitante_id: uuid (nullable)
//   produto_id: uuid (not null)
//   quantidade: numeric (not null)
//   justificativa: text (nullable)
//   status: character varying (nullable, default: 'pendente'::character varying)
//   aprovador_id: uuid (nullable)
//   data_aprovacao: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: residuos
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   data_geracao: date (not null)
//   tipo_residuo: text (not null)
//   descricao: text (not null)
//   quantidade: numeric (not null)
//   unidade: text (not null)
//   numero_mtr: text (nullable)
//   numero_cdf: text (nullable)
//   data_vencimento_cdf: date (nullable)
//   status_logistica_reversa: text (nullable, default: 'pendente'::text)
//   data_devolucao: date (nullable)
//   responsavel_id: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: rh_epi_entregas
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   funcionario_id: uuid (not null)
//   epi_id: uuid (not null)
//   data_entrega: date (not null)
//   data_vencimento: date (not null)
//   assinatura_digital_url: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: rh_epis
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: text (not null)
//   validade_dias: integer (not null)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: rh_ferias_afastamentos
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   funcionario_id: uuid (not null)
//   tipo: text (not null)
//   data_inicio: date (not null)
//   data_fim: date (not null)
//   status: text (nullable, default: 'solicitado'::text)
//   aprovador_id: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: rh_folha_pagamento
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   funcionario_id: uuid (not null)
//   mes_referencia: date (not null)
//   salario_base: numeric (not null, default: 0)
//   proventos: numeric (not null, default: 0)
//   descontos: numeric (not null, default: 0)
//   inss: numeric (not null, default: 0)
//   irrf: numeric (not null, default: 0)
//   fgts: numeric (not null, default: 0)
//   liquido: numeric (not null, default: 0)
//   status: text (nullable, default: 'aberto'::text)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: rh_ponto
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   funcionario_id: uuid (not null)
//   tipo: text (not null)
//   timestamp: timestamp with time zone (not null, default: now())
//   latitude: numeric (nullable)
//   longitude: numeric (nullable)
//   foto_url: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: rolagens_container
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   container_id: uuid (not null)
//   booking_original_id: uuid (not null)
//   booking_novo_id: uuid (not null)
//   motivo_rolagem: motivo_rolagem_enum (not null)
//   data_solicitacao: date (nullable, default: CURRENT_DATE)
//   data_aprovacao: date (nullable)
//   aprovado_por: uuid (nullable)
//   custo_rolagem_usd: numeric (nullable, default: 0)
//   status: status_rolagem_enum (nullable, default: 'pendente'::status_rolagem_enum)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: romaneios_venda
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   numero_romaneio: text (not null)
//   cliente_id: uuid (nullable)
//   data_emissao: date (not null, default: CURRENT_DATE)
//   data_prevista_carregamento: date (nullable)
//   status: text (nullable, default: 'em_aberto'::text)
//   total_pallets: integer (nullable, default: 0)
//   peso_total_kg: numeric (nullable, default: 0)
//   valor_total: numeric (nullable, default: 0)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   container_id: uuid (nullable)
// Table: saas_faturas
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   mes_referencia: date (not null)
//   valor_total: numeric (not null)
//   status: character varying (nullable, default: 'pendente'::character varying)
//   data_vencimento: date (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: safra_talhoes
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   safra_id: uuid (not null)
//   talhao_id: uuid (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: safras
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   talhao_id: uuid (nullable)
//   cultivar_id: uuid (not null)
//   data_plantio: date (nullable)
//   data_colheita_prevista: date (nullable)
//   data_colheita_real: date (nullable)
//   status: character varying (nullable, default: 'planejada'::character varying)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   nome_safra: character varying (nullable)
//   codigo_safra: character varying (nullable)
//   area_planejada_ha: numeric (nullable)
//   densidade_plantio: integer (nullable)
//   produtividade_planejada: numeric (nullable)
//   meta_producao_kg: numeric (nullable)
//   orcamento_total: numeric (nullable)
//   fazenda_id: uuid (nullable)
//   ano_safra: integer (nullable)
//   imagem_url: text (nullable)
//   responsavel_encerramento_id: uuid (nullable)
//   data_assinatura_tecnica: timestamp with time zone (nullable)
// Table: sessoes_carregamento
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   romaneio_id: uuid (not null)
//   data_carregamento: timestamp with time zone (not null, default: now())
//   veiculo_placa: text (nullable)
//   motorista_nome: text (nullable)
//   transportadora_id: uuid (nullable)
//   responsavel_id: uuid (nullable)
//   peso_confirmado_kg: numeric (nullable)
//   temperatura_carga: numeric (nullable)
//   status: text (nullable, default: 'em_andamento'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: suporte_mensagens
//   id: uuid (not null, default: gen_random_uuid())
//   ticket_id: uuid (not null)
//   usuario_id: uuid (not null)
//   mensagem: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: suporte_tickets
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   titulo: character varying (not null)
//   descricao: text (nullable)
//   prioridade: character varying (nullable, default: 'medium'::character varying)
//   status: character varying (nullable, default: 'aberto'::character varying)
//   modulo: character varying (nullable)
//   atendente_id: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: talhoes
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   fazenda_id: uuid (not null)
//   nome: character varying (not null)
//   area_ha: numeric (nullable)
//   tipo_solo: character varying (nullable)
//   declividade: numeric (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   codigo_talhao: character varying (nullable)
//   area_plantavel_ha: numeric (nullable)
//   altitude: integer (nullable)
//   tem_irrigacao: boolean (nullable, default: false)
//   tipo_irrigacao: character varying (nullable)
//   latitude: numeric (nullable)
//   longitude: numeric (nullable)
//   numero_globalgap: character varying (nullable)
//   referencia_car: character varying (nullable)
//   status_atual: character varying (nullable, default: 'disponível'::character varying)
//   observacoes: text (nullable)
// Table: transplantio_itens
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   transplantio_id: uuid (not null)
//   item_tipo: text (not null)
//   produto_id: uuid (nullable)
//   descricao: text (nullable)
//   quantidade: numeric (not null, default: 0)
//   unidade: text (nullable)
//   custo_unitario: numeric (not null, default: 0)
//   custo_total: numeric (not null, default: 0)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: transplantios
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   lote_muda_id: uuid (nullable)
//   safra_id: uuid (nullable)
//   talhao_id: uuid (nullable)
//   data_transplantio: timestamp with time zone (not null)
//   quantidade_transplantada: integer (not null)
//   quantidade_replantio: integer (nullable, default: 0)
//   area_plantada_ha: numeric (nullable)
//   densidade_plantio: integer (nullable)
//   custo_transferido: numeric (nullable)
//   responsavel_id: uuid (nullable)
//   confirmado: boolean (nullable, default: false)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: transportadoras
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: character varying (not null)
//   cnpj: character varying (nullable)
//   telefone: character varying (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: user_2fa_codes
//   id: uuid (not null, default: gen_random_uuid())
//   usuario_id: uuid (not null)
//   codigo: character varying (not null)
//   criado_em: timestamp with time zone (nullable, default: now())
//   expira_em: timestamp with time zone (nullable, default: (now() + '00:10:00'::interval))
//   usado: boolean (nullable, default: false)
// Table: usuarios
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   email: character varying (not null)
//   nome: character varying (nullable)
//   perfil: character varying (nullable, default: 'user'::character varying)
//   ativo: boolean (nullable, default: true)
//   enable_2fa: boolean (nullable, default: false)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   fornecedor_id: uuid (nullable)
//   cliente_id: uuid (nullable)
// Table: vacaria_animais
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   brinco: text (not null)
//   nome: text (nullable)
//   raca: text (nullable)
//   data_nascimento: date (nullable)
//   status: text (nullable, default: 'ativo'::text)
//   foto_url: text (nullable)
//   pai_id: uuid (nullable)
//   mae_id: uuid (nullable)
//   lote: text (nullable)
//   em_quarentena: boolean (nullable, default: false)
//   peso_atual: numeric (nullable)
//   data_ultima_pesagem: date (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: vacaria_eventos_reprodutivos
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   animal_id: uuid (not null)
//   tipo: text (not null)
//   data_evento: date (not null)
//   previsao_parto: date (nullable)
//   resultado_toque: text (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: vacaria_producao_leite
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   animal_id: uuid (not null)
//   data_ordenha: date (not null)
//   volume_litros: numeric (not null)
//   ccs: numeric (nullable)
//   cbt: numeric (nullable)
//   periodo: text (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: vacaria_saude_animal
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   animal_id: uuid (not null)
//   tipo: text (not null)
//   data_registro: date (not null)
//   descricao: text (nullable)
//   medicamento: text (nullable)
//   resultado: text (nullable)
//   data_proxima_dose: date (nullable)
//   peso_kg: numeric (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
// Table: vendedores
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: character varying (not null)
//   email: character varying (nullable)
//   telefone: character varying (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
//   cpf_cnpj: text (nullable)
//   rg: text (nullable)
//   data_nascimento: date (nullable)
//   foto_url: text (nullable)
//   tipo_mercado: text (nullable)
//   tipo_vinculo: text (nullable)
//   telefone_secundario: text (nullable)
//   whatsapp: text (nullable)
//   email_corporativo: text (nullable)
//   email_pessoal: text (nullable)
//   comissao_interna: numeric (nullable)
//   comissao_exportacao: numeric (nullable)
//   comissao_fixa: numeric (nullable)
//   meta_mensal: numeric (nullable)
//   moeda_padrao: text (nullable)
//   frequencia_pagamento: text (nullable)
//   regioes_atuacao: text (nullable)
//   paises_atuacao: text (nullable)
//   banco_nome: text (nullable)
//   banco_codigo: text (nullable)
//   agencia: text (nullable)
//   agencia_digito: text (nullable)
//   conta: text (nullable)
//   conta_digito: text (nullable)
//   tipo_conta: text (nullable)
//   chave_pix_tipo: text (nullable)
//   chave_pix: text (nullable)
//   conta_principal: boolean (nullable, default: true)
//   conta_ativa: boolean (nullable, default: true)
//   supervisor_id: uuid (nullable)
//   nivel_autonomia: text (nullable)
//   acesso_crm: boolean (nullable, default: false)
//   data_contratacao: date (nullable)
//   data_desligamento: date (nullable)
//   status: text (nullable, default: 'ativo'::text)
//   idiomas: text (nullable)
//   experiencia_anos: integer (nullable)
//   cep: text (nullable)
//   logradouro: text (nullable)
//   numero: text (nullable)
//   complemento: text (nullable)
//   bairro: text (nullable)
//   cidade: text (nullable)
//   estado: text (nullable)

// --- CONSTRAINTS ---
// Table: account_sales
//   FOREIGN KEY account_sales_container_id_fkey: FOREIGN KEY (container_id) REFERENCES containers(id) ON DELETE SET NULL
//   FOREIGN KEY account_sales_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY account_sales_invoice_id_fkey: FOREIGN KEY (invoice_id) REFERENCES invoices_exportacao(id) ON DELETE SET NULL
//   PRIMARY KEY account_sales_pkey: PRIMARY KEY (id)
//   CHECK account_sales_status_check: CHECK ((status = ANY (ARRAY['rascunho'::text, 'liquidado'::text, 'cancelado'::text])))
//   CHECK chk_account_sales_margem: CHECK ((margem_percentual >= (0)::numeric))
//   CHECK chk_account_sales_taxa: CHECK ((taxa_cambio > (0)::numeric))
// Table: adiantamentos_internacionais
//   FOREIGN KEY adiantamentos_internacionais_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
//   FOREIGN KEY adiantamentos_internacionais_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   UNIQUE adiantamentos_internacionais_empresa_id_numero_adiantamento_key: UNIQUE (empresa_id, numero_adiantamento)
//   FOREIGN KEY adiantamentos_internacionais_invoice_id_fkey: FOREIGN KEY (invoice_id) REFERENCES invoices_exportacao(id) ON DELETE SET NULL
//   PRIMARY KEY adiantamentos_internacionais_pkey: PRIMARY KEY (id)
//   CHECK adiantamentos_internacionais_status_check: CHECK (((status)::text = ANY ((ARRAY['pendente'::character varying, 'reembolsado'::character varying, 'parcial'::character varying, 'cancelado'::character varying])::text[])))
//   CHECK chk_adiantamento_taxa: CHECK ((taxa_cambio > (0)::numeric))
// Table: alertas
//   FOREIGN KEY alertas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY alertas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY alertas_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
// Table: amostras_qualidade_campo
//   CHECK amostras_qualidade_campo_coloracao_escala_check: CHECK (((coloracao_escala >= 1) AND (coloracao_escala <= 9)))
//   CHECK amostras_qualidade_campo_defeitos_percentual_check: CHECK (((defeitos_percentual >= (0)::numeric) AND (defeitos_percentual <= (100)::numeric)))
//   FOREIGN KEY amostras_qualidade_campo_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY amostras_qualidade_campo_pkey: PRIMARY KEY (id)
//   FOREIGN KEY amostras_qualidade_campo_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE CASCADE
//   FOREIGN KEY amostras_qualidade_campo_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE CASCADE
// Table: analises_solo
//   FOREIGN KEY analises_solo_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY analises_solo_pkey: PRIMARY KEY (id)
//   FOREIGN KEY analises_solo_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE CASCADE
// Table: armazens
//   FOREIGN KEY armazens_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY armazens_fazenda_id_fkey: FOREIGN KEY (fazenda_id) REFERENCES fazendas(id)
//   PRIMARY KEY armazens_pkey: PRIMARY KEY (id)
//   FOREIGN KEY armazens_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
// Table: audit_logs
//   FOREIGN KEY audit_logs_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id)
//   PRIMARY KEY audit_logs_pkey: PRIMARY KEY (id)
//   FOREIGN KEY audit_logs_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
// Table: balanco_massas
//   FOREIGN KEY balanco_massas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY balanco_massas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY balanco_massas_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE CASCADE
//   UNIQUE balanco_massas_safra_id_key: UNIQUE (safra_id)
// Table: bookings
//   CHECK bookings_check: CHECK ((data_etd < data_eta))
//   FOREIGN KEY bookings_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   UNIQUE bookings_empresa_id_numero_booking_key: UNIQUE (empresa_id, numero_booking)
//   FOREIGN KEY bookings_navio_id_fkey: FOREIGN KEY (navio_id) REFERENCES navios(id) ON DELETE SET NULL
//   PRIMARY KEY bookings_pkey: PRIMARY KEY (id)
//   FOREIGN KEY bookings_porto_destino_id_fkey: FOREIGN KEY (porto_destino_id) REFERENCES portos(id) ON DELETE SET NULL
//   FOREIGN KEY bookings_porto_origem_id_fkey: FOREIGN KEY (porto_origem_id) REFERENCES portos(id) ON DELETE SET NULL
// Table: caderno_campo
//   FOREIGN KEY caderno_campo_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY caderno_campo_pkey: PRIMARY KEY (id)
//   FOREIGN KEY caderno_campo_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
//   FOREIGN KEY caderno_campo_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE CASCADE
// Table: carregamentos
//   FOREIGN KEY carregamentos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY carregamentos_pkey: PRIMARY KEY (id)
// Table: centros_custo
//   FOREIGN KEY centros_custo_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY centros_custo_pkey: PRIMARY KEY (id)
// Table: certificacoes_auditorias
//   FOREIGN KEY certificacoes_auditorias_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY certificacoes_auditorias_modelo_id_fkey: FOREIGN KEY (modelo_id) REFERENCES certificacoes_modelos(id)
//   PRIMARY KEY certificacoes_auditorias_pkey: PRIMARY KEY (id)
//   FOREIGN KEY certificacoes_auditorias_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
// Table: certificacoes_itens_auditoria
//   FOREIGN KEY certificacoes_itens_auditoria_auditoria_id_fkey: FOREIGN KEY (auditoria_id) REFERENCES certificacoes_auditorias(id) ON DELETE CASCADE
//   FOREIGN KEY certificacoes_itens_auditoria_item_modelo_id_fkey: FOREIGN KEY (item_modelo_id) REFERENCES certificacoes_itens_modelo(id)
//   PRIMARY KEY certificacoes_itens_auditoria_pkey: PRIMARY KEY (id)
// Table: certificacoes_itens_modelo
//   FOREIGN KEY certificacoes_itens_modelo_modelo_id_fkey: FOREIGN KEY (modelo_id) REFERENCES certificacoes_modelos(id) ON DELETE CASCADE
//   PRIMARY KEY certificacoes_itens_modelo_pkey: PRIMARY KEY (id)
// Table: certificacoes_modelos
//   FOREIGN KEY certificacoes_modelos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY certificacoes_modelos_pkey: PRIMARY KEY (id)
// Table: clientes
//   FOREIGN KEY clientes_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY clientes_moeda_id_fkey: FOREIGN KEY (moeda_id) REFERENCES moedas(id) ON DELETE SET NULL
//   PRIMARY KEY clientes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY clientes_porto_destino_id_fkey: FOREIGN KEY (porto_destino_id) REFERENCES portos(id) ON DELETE SET NULL
//   FOREIGN KEY clientes_vendedor_id_fkey: FOREIGN KEY (vendedor_id) REFERENCES vendedores(id)
// Table: colheita_registros
//   FOREIGN KEY colheita_registros_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY colheita_registros_equipamento_id_fkey: FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE SET NULL
//   PRIMARY KEY colheita_registros_pkey: PRIMARY KEY (id)
//   FOREIGN KEY colheita_registros_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id) ON DELETE SET NULL
//   FOREIGN KEY colheita_registros_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE CASCADE
// Table: compras_cotacao_fornecedores
//   FOREIGN KEY compras_cotacao_fornecedores_cotacao_id_fkey: FOREIGN KEY (cotacao_id) REFERENCES compras_cotacoes(id) ON DELETE CASCADE
//   FOREIGN KEY compras_cotacao_fornecedores_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY compras_cotacao_fornecedores_fornecedor_id_fkey: FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE RESTRICT
//   PRIMARY KEY compras_cotacao_fornecedores_pkey: PRIMARY KEY (id)
// Table: compras_cotacoes
//   FOREIGN KEY compras_cotacoes_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY compras_cotacoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY compras_cotacoes_requisicao_id_fkey: FOREIGN KEY (requisicao_id) REFERENCES compras_requisicao(id) ON DELETE CASCADE
// Table: compras_pedido
//   FOREIGN KEY compras_pedido_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY compras_pedido_fornecedor_id_fkey: FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
//   PRIMARY KEY compras_pedido_pkey: PRIMARY KEY (id)
//   FOREIGN KEY compras_pedido_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id)
//   FOREIGN KEY compras_pedido_requisicao_id_fkey: FOREIGN KEY (requisicao_id) REFERENCES compras_requisicao(id) ON DELETE CASCADE
// Table: compras_requisicao
//   FOREIGN KEY compras_requisicao_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY compras_requisicao_pkey: PRIMARY KEY (id)
//   FOREIGN KEY compras_requisicao_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE SET NULL
//   FOREIGN KEY compras_requisicao_solicitante_id_fkey: FOREIGN KEY (solicitante_id) REFERENCES usuarios(id)
// Table: conta_corrente_produtor
//   FOREIGN KEY conta_corrente_produtor_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY conta_corrente_produtor_pkey: PRIMARY KEY (id)
//   FOREIGN KEY conta_corrente_produtor_produtor_id_fkey: FOREIGN KEY (produtor_id) REFERENCES fornecedores(id) ON DELETE CASCADE
//   FOREIGN KEY conta_corrente_produtor_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE SET NULL
//   CHECK conta_corrente_produtor_tipo_movimento_check: CHECK (((tipo_movimento)::text = ANY ((ARRAY['adiantamento'::character varying, 'entrega'::character varying, 'desconto'::character varying, 'pagamento'::character varying, 'rateio_receita'::character varying, 'rateio_custo'::character varying])::text[])))
// Table: containers
//   CHECK chk_container_weights: CHECK (((peso_liquido_kg IS NULL) OR (peso_bruto_kg IS NULL) OR (peso_liquido_kg < peso_bruto_kg)))
//   FOREIGN KEY containers_aprovador_1_id_fkey: FOREIGN KEY (aprovador_1_id) REFERENCES auth.users(id) ON DELETE SET NULL
//   FOREIGN KEY containers_aprovador_2_id_fkey: FOREIGN KEY (aprovador_2_id) REFERENCES auth.users(id) ON DELETE SET NULL
//   FOREIGN KEY containers_booking_id_fkey: FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
//   FOREIGN KEY containers_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY containers_pkey: PRIMARY KEY (id)
// Table: contas_bancarias
//   FOREIGN KEY contas_bancarias_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   CHECK contas_bancarias_moeda_check: CHECK (((moeda)::text = ANY ((ARRAY['brl'::character varying, 'usd'::character varying, 'eur'::character varying])::text[])))
//   PRIMARY KEY contas_bancarias_pkey: PRIMARY KEY (id)
//   CHECK contas_bancarias_tipo_check: CHECK (((tipo)::text = ANY ((ARRAY['corrente'::character varying, 'poupanca'::character varying, 'aplicacao'::character varying, 'exterior'::character varying])::text[])))
// Table: contas_bancarias_entidade
//   FOREIGN KEY contas_bancarias_entidade_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY contas_bancarias_entidade_pkey: PRIMARY KEY (id)
// Table: contatos_entidade
//   FOREIGN KEY contatos_entidade_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY contatos_entidade_pkey: PRIMARY KEY (id)
// Table: cooperados_contratos
//   FOREIGN KEY cooperados_contratos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY cooperados_contratos_fornecedor_id_fkey: FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE CASCADE
//   PRIMARY KEY cooperados_contratos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY cooperados_contratos_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE CASCADE
//   FOREIGN KEY cooperados_contratos_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE SET NULL
// Table: cultivares
//   FOREIGN KEY cultivares_cultura_id_fkey: FOREIGN KEY (cultura_id) REFERENCES culturas(id) ON DELETE CASCADE
//   FOREIGN KEY cultivares_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY cultivares_pkey: PRIMARY KEY (id)
// Table: culturas
//   FOREIGN KEY culturas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY culturas_pkey: PRIMARY KEY (id)
// Table: culturas_fenologia
//   FOREIGN KEY culturas_fenologia_cultura_id_fkey: FOREIGN KEY (cultura_id) REFERENCES culturas(id) ON DELETE CASCADE
//   FOREIGN KEY culturas_fenologia_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY culturas_fenologia_pkey: PRIMARY KEY (id)
// Table: custos_talhao
//   FOREIGN KEY custos_talhao_centro_custo_id_fkey: FOREIGN KEY (centro_custo_id) REFERENCES centros_custo(id)
//   FOREIGN KEY custos_talhao_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY custos_talhao_pkey: PRIMARY KEY (id)
//   FOREIGN KEY custos_talhao_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE CASCADE
//   FOREIGN KEY custos_talhao_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE CASCADE
// Table: devolucoes_compras
//   FOREIGN KEY devolucoes_compras_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY devolucoes_compras_fornecedor_id_fkey: FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE CASCADE
//   FOREIGN KEY devolucoes_compras_lote_id_fkey: FOREIGN KEY (lote_id) REFERENCES lotes_estoque(id) ON DELETE CASCADE
//   FOREIGN KEY devolucoes_compras_pedido_id_fkey: FOREIGN KEY (pedido_id) REFERENCES compras_pedido(id) ON DELETE CASCADE
//   PRIMARY KEY devolucoes_compras_pkey: PRIMARY KEY (id)
//   FOREIGN KEY devolucoes_compras_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
// Table: divergencias_carregamento
//   FOREIGN KEY divergencias_carregamento_aprovado_por_fkey: FOREIGN KEY (aprovado_por) REFERENCES auth.users(id)
//   FOREIGN KEY divergencias_carregamento_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY divergencias_carregamento_pallet_id_fkey: FOREIGN KEY (pallet_id) REFERENCES pallets(id)
//   PRIMARY KEY divergencias_carregamento_pkey: PRIMARY KEY (id)
//   FOREIGN KEY divergencias_carregamento_sessao_id_fkey: FOREIGN KEY (sessao_id) REFERENCES sessoes_carregamento(id) ON DELETE CASCADE
//   CHECK divergencias_carregamento_status_check: CHECK ((status = ANY (ARRAY['pendente'::text, 'aprovado'::text, 'rejeitado'::text])))
//   CHECK divergencias_carregamento_tipo_divergencia_check: CHECK ((tipo_divergencia = ANY (ARRAY['peso'::text, 'quantidade'::text, 'qualidade'::text, 'produto_errado'::text])))
// Table: documentos_entidade
//   FOREIGN KEY documentos_entidade_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY documentos_entidade_pkey: PRIMARY KEY (id)
// Table: documentos_exportacao
//   FOREIGN KEY documentos_exportacao_container_id_fkey: FOREIGN KEY (container_id) REFERENCES containers(id) ON DELETE CASCADE
//   FOREIGN KEY documentos_exportacao_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY documentos_exportacao_pkey: PRIMARY KEY (id)
// Table: emissoes_carbono
//   FOREIGN KEY emissoes_carbono_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY emissoes_carbono_pkey: PRIMARY KEY (id)
//   FOREIGN KEY emissoes_carbono_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE SET NULL
//   FOREIGN KEY emissoes_carbono_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE SET NULL
// Table: empresas
//   UNIQUE empresas_cnpj_key: UNIQUE (cnpj)
//   PRIMARY KEY empresas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY empresas_plano_id_fkey: FOREIGN KEY (plano_id) REFERENCES planos(id)
//   UNIQUE empresas_slug_key: UNIQUE (slug)
// Table: enderecos_entidade
//   FOREIGN KEY enderecos_entidade_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY enderecos_entidade_pkey: PRIMARY KEY (id)
// Table: equipamentos
//   FOREIGN KEY equipamentos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY equipamentos_pkey: PRIMARY KEY (id)
// Table: estoque_movimento
//   FOREIGN KEY estoque_movimento_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY estoque_movimento_lote_id_fkey: FOREIGN KEY (lote_id) REFERENCES lotes_estoque(id) ON DELETE CASCADE
//   PRIMARY KEY estoque_movimento_pkey: PRIMARY KEY (id)
// Table: estufas
//   FOREIGN KEY estufas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY estufas_fazenda_id_fkey: FOREIGN KEY (fazenda_id) REFERENCES fazendas(id) ON DELETE SET NULL
//   PRIMARY KEY estufas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY estufas_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id) ON DELETE SET NULL
//   CHECK estufas_tipo_check: CHECK ((tipo = ANY (ARRAY['viveiro'::text, 'propagador'::text, 'ambiente_controlado'::text, 'sombrite'::text])))
// Table: etiquetas_impressas
//   FOREIGN KEY etiquetas_impressas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY etiquetas_impressas_impresso_por_fkey: FOREIGN KEY (impresso_por) REFERENCES auth.users(id)
//   FOREIGN KEY etiquetas_impressas_pallet_id_fkey: FOREIGN KEY (pallet_id) REFERENCES pallets(id) ON DELETE CASCADE
//   PRIMARY KEY etiquetas_impressas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY etiquetas_impressas_romaneio_id_fkey: FOREIGN KEY (romaneio_id) REFERENCES romaneios_venda(id) ON DELETE SET NULL
// Table: fazendas
//   FOREIGN KEY fazendas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY fazendas_pkey: PRIMARY KEY (id)
// Table: financeiro_lancamentos
//   CHECK chk_lancamento_data_pagamento: CHECK (((data_pagamento IS NULL) OR (data_lancamento IS NULL) OR (data_pagamento >= data_lancamento)))
//   CHECK chk_lancamento_valor: CHECK ((valor > (0)::numeric))
//   FOREIGN KEY financeiro_lancamentos_centro_custo_id_fkey: FOREIGN KEY (centro_custo_id) REFERENCES centros_custo(id) ON DELETE SET NULL
//   FOREIGN KEY financeiro_lancamentos_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
//   FOREIGN KEY financeiro_lancamentos_conta_bancaria_id_fkey: FOREIGN KEY (conta_bancaria_id) REFERENCES contas_bancarias(id) ON DELETE SET NULL
//   FOREIGN KEY financeiro_lancamentos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY financeiro_lancamentos_fornecedor_id_fkey: FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE SET NULL
//   FOREIGN KEY financeiro_lancamentos_invoice_id_fkey: FOREIGN KEY (invoice_id) REFERENCES invoices_exportacao(id) ON DELETE SET NULL
//   PRIMARY KEY financeiro_lancamentos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY financeiro_lancamentos_plano_conta_id_fkey: FOREIGN KEY (plano_conta_id) REFERENCES plano_contas(id) ON DELETE SET NULL
// Table: fornecedores
//   FOREIGN KEY fornecedores_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY fornecedores_pkey: PRIMARY KEY (id)
// Table: frota_abastecimentos
//   FOREIGN KEY frota_abastecimentos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   CHECK frota_abastecimentos_litros_check: CHECK ((litros > (0)::numeric))
//   PRIMARY KEY frota_abastecimentos_pkey: PRIMARY KEY (id)
//   CHECK frota_abastecimentos_valor_total_check: CHECK ((valor_total > (0)::numeric))
//   FOREIGN KEY frota_abastecimentos_veiculo_id_fkey: FOREIGN KEY (veiculo_id) REFERENCES frota_veiculos(id) ON DELETE CASCADE
//   FOREIGN KEY frota_abastecimentos_viagem_id_fkey: FOREIGN KEY (viagem_id) REFERENCES frota_viagens(id) ON DELETE SET NULL
// Table: frota_manutencoes
//   CHECK frota_manutencoes_custo_check: CHECK ((custo >= (0)::numeric))
//   FOREIGN KEY frota_manutencoes_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY frota_manutencoes_pkey: PRIMARY KEY (id)
//   CHECK frota_manutencoes_tipo_check: CHECK ((tipo = ANY (ARRAY['preventiva'::text, 'corretiva'::text])))
//   FOREIGN KEY frota_manutencoes_veiculo_id_fkey: FOREIGN KEY (veiculo_id) REFERENCES frota_veiculos(id) ON DELETE CASCADE
// Table: frota_veiculos
//   FOREIGN KEY frota_veiculos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   UNIQUE frota_veiculos_empresa_id_placa_key: UNIQUE (empresa_id, placa)
//   PRIMARY KEY frota_veiculos_pkey: PRIMARY KEY (id)
// Table: frota_viagens
//   FOREIGN KEY frota_viagens_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY frota_viagens_motorista_id_fkey: FOREIGN KEY (motorista_id) REFERENCES funcionarios(id) ON DELETE SET NULL
//   PRIMARY KEY frota_viagens_pkey: PRIMARY KEY (id)
//   FOREIGN KEY frota_viagens_veiculo_id_fkey: FOREIGN KEY (veiculo_id) REFERENCES frota_veiculos(id) ON DELETE CASCADE
// Table: funcionarios
//   FOREIGN KEY funcionarios_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY funcionarios_pkey: PRIMARY KEY (id)
// Table: graus_dia
//   FOREIGN KEY graus_dia_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY graus_dia_pkey: PRIMARY KEY (id)
//   UNIQUE graus_dia_safra_id_data_key: UNIQUE (safra_id, data)
//   FOREIGN KEY graus_dia_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE CASCADE
//   FOREIGN KEY graus_dia_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE CASCADE
//   FOREIGN KEY graus_dia_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE SET NULL
// Table: historico_produtividade_talhao
//   FOREIGN KEY historico_produtividade_talhao_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY historico_produtividade_talhao_pkey: PRIMARY KEY (id)
//   FOREIGN KEY historico_produtividade_talhao_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE CASCADE
// Table: invoices_exportacao
//   FOREIGN KEY invoices_exportacao_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
//   FOREIGN KEY invoices_exportacao_container_id_fkey: FOREIGN KEY (container_id) REFERENCES containers(id) ON DELETE SET NULL
//   FOREIGN KEY invoices_exportacao_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   UNIQUE invoices_exportacao_empresa_id_numero_invoice_key: UNIQUE (empresa_id, numero_invoice)
//   PRIMARY KEY invoices_exportacao_pkey: PRIMARY KEY (id)
// Table: lotes_estoque
//   FOREIGN KEY lotes_estoque_armazem_id_fkey: FOREIGN KEY (armazem_id) REFERENCES armazens(id) ON DELETE CASCADE
//   FOREIGN KEY lotes_estoque_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY lotes_estoque_pkey: PRIMARY KEY (id)
//   FOREIGN KEY lotes_estoque_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
// Table: lotes_mudas
//   FOREIGN KEY lotes_mudas_cultivar_id_fkey: FOREIGN KEY (cultivar_id) REFERENCES cultivares(id) ON DELETE CASCADE
//   FOREIGN KEY lotes_mudas_cultura_id_fkey: FOREIGN KEY (cultura_id) REFERENCES culturas(id) ON DELETE CASCADE
//   FOREIGN KEY lotes_mudas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY lotes_mudas_estufa_id_fkey: FOREIGN KEY (estufa_id) REFERENCES estufas(id) ON DELETE CASCADE
//   PRIMARY KEY lotes_mudas_pkey: PRIMARY KEY (id)
//   CHECK lotes_mudas_status_check: CHECK ((status = ANY (ARRAY['germinando'::text, 'em_desenvolvimento'::text, 'pronto'::text, 'transplantado'::text, 'descartado'::text])))
// Table: moedas
//   FOREIGN KEY moedas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY moedas_pkey: PRIMARY KEY (id)
// Table: monitoramento_pragas
//   FOREIGN KEY monitoramento_pragas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY monitoramento_pragas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY monitoramento_pragas_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id) ON DELETE SET NULL
//   FOREIGN KEY monitoramento_pragas_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE CASCADE
//   FOREIGN KEY monitoramento_pragas_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE CASCADE
// Table: nao_conformidades
//   FOREIGN KEY nao_conformidades_auditoria_id_fkey: FOREIGN KEY (auditoria_id) REFERENCES certificacoes_auditorias(id) ON DELETE CASCADE
//   FOREIGN KEY nao_conformidades_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY nao_conformidades_item_auditoria_id_fkey: FOREIGN KEY (item_auditoria_id) REFERENCES certificacoes_itens_auditoria(id) ON DELETE SET NULL
//   PRIMARY KEY nao_conformidades_pkey: PRIMARY KEY (id)
//   FOREIGN KEY nao_conformidades_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
// Table: navios
//   FOREIGN KEY navios_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY navios_pkey: PRIMARY KEY (id)
// Table: operacao_insumos
//   FOREIGN KEY operacao_insumos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY operacao_insumos_lote_id_fkey: FOREIGN KEY (lote_id) REFERENCES lotes_estoque(id)
//   FOREIGN KEY operacao_insumos_operacao_id_fkey: FOREIGN KEY (operacao_id) REFERENCES operacoes_campo(id) ON DELETE CASCADE
//   PRIMARY KEY operacao_insumos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY operacao_insumos_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id)
// Table: operacoes_campo
//   FOREIGN KEY operacoes_campo_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY operacoes_campo_equipamento_id_fkey: FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id)
//   PRIMARY KEY operacoes_campo_pkey: PRIMARY KEY (id)
//   FOREIGN KEY operacoes_campo_receituario_id_fkey: FOREIGN KEY (receituario_id) REFERENCES receituarios_agronomicos(id)
//   FOREIGN KEY operacoes_campo_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
//   FOREIGN KEY operacoes_campo_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE CASCADE
// Table: packing_recepcoes
//   CHECK packing_recepcoes_conformidade_visual_check: CHECK ((conformidade_visual = ANY (ARRAY['aprovado'::text, 'reprovado'::text, 'parcial'::text])))
//   FOREIGN KEY packing_recepcoes_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY packing_recepcoes_lote_producao_id_fkey: FOREIGN KEY (lote_producao_id) REFERENCES colheita_registros(id) ON DELETE CASCADE
//   PRIMARY KEY packing_recepcoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY packing_recepcoes_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id) ON DELETE SET NULL
//   FOREIGN KEY packing_recepcoes_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE CASCADE
//   CHECK packing_recepcoes_status_check: CHECK ((status = ANY (ARRAY['em_recebimento'::text, 'recebido'::text, 'em_packing'::text, 'concluido'::text, 'expedido'::text])))
// Table: pallets
//   UNIQUE pallets_codigo_pallet_key: UNIQUE (codigo_pallet)
//   FOREIGN KEY pallets_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY pallets_pkey: PRIMARY KEY (id)
//   FOREIGN KEY pallets_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE SET NULL
//   FOREIGN KEY pallets_produtor_id_fkey: FOREIGN KEY (produtor_id) REFERENCES fornecedores(id) ON DELETE SET NULL
//   FOREIGN KEY pallets_recepcao_id_fkey: FOREIGN KEY (recepcao_id) REFERENCES packing_recepcoes(id) ON DELETE SET NULL
//   FOREIGN KEY pallets_romaneio_id_fkey: FOREIGN KEY (romaneio_id) REFERENCES romaneios_venda(id) ON DELETE SET NULL
//   FOREIGN KEY pallets_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE SET NULL
// Table: patrimonio_bens
//   UNIQUE patrimonio_bens_empresa_id_codigo_qr_key: UNIQUE (empresa_id, codigo_qr)
//   FOREIGN KEY patrimonio_bens_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY patrimonio_bens_pkey: PRIMARY KEY (id)
// Table: perdas_estufa
//   FOREIGN KEY perdas_estufa_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY perdas_estufa_lote_muda_id_fkey: FOREIGN KEY (lote_muda_id) REFERENCES lotes_mudas(id) ON DELETE CASCADE
//   PRIMARY KEY perdas_estufa_pkey: PRIMARY KEY (id)
//   FOREIGN KEY perdas_estufa_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id) ON DELETE SET NULL
//   CHECK perdas_estufa_tipo_perda_check: CHECK ((tipo_perda = ANY (ARRAY['pragas'::text, 'doencas'::text, 'estresse_hidrico'::text, 'estresse_termico'::text, 'falha_germinacao'::text, 'outro'::text])))
// Table: planejamento_safra
//   FOREIGN KEY planejamento_safra_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY planejamento_safra_pkey: PRIMARY KEY (id)
//   FOREIGN KEY planejamento_safra_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
//   FOREIGN KEY planejamento_safra_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE CASCADE
// Table: plano_contas
//   FOREIGN KEY plano_contas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   CHECK plano_contas_natureza_check: CHECK (((natureza)::text = ANY ((ARRAY['sintetica'::character varying, 'analitica'::character varying])::text[])))
//   FOREIGN KEY plano_contas_pai_id_fkey: FOREIGN KEY (pai_id) REFERENCES plano_contas(id) ON DELETE SET NULL
//   PRIMARY KEY plano_contas_pkey: PRIMARY KEY (id)
//   CHECK plano_contas_tipo_check: CHECK (((tipo)::text = ANY ((ARRAY['ativo'::character varying, 'passivo'::character varying, 'receita'::character varying, 'despesa'::character varying, 'custo'::character varying])::text[])))
// Table: planos
//   UNIQUE planos_nome_key: UNIQUE (nome)
//   PRIMARY KEY planos_pkey: PRIMARY KEY (id)
// Table: pluviometria
//   FOREIGN KEY pluviometria_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY pluviometria_pkey: PRIMARY KEY (id)
//   FOREIGN KEY pluviometria_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE CASCADE
// Table: portal_tokens
//   FOREIGN KEY portal_tokens_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY portal_tokens_pkey: PRIMARY KEY (id)
//   UNIQUE portal_tokens_token_key: UNIQUE (token)
// Table: portos
//   FOREIGN KEY portos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY portos_pkey: PRIMARY KEY (id)
//   CHECK portos_tipo_check: CHECK ((tipo = ANY (ARRAY['embarque'::text, 'desembarque'::text, 'ambos'::text])))
// Table: produtos
//   FOREIGN KEY produtos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY produtos_pkey: PRIMARY KEY (id)
// Table: receituarios_agronomicos
//   FOREIGN KEY receituarios_agronomicos_cultura_id_fkey: FOREIGN KEY (cultura_id) REFERENCES culturas(id)
//   FOREIGN KEY receituarios_agronomicos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY receituarios_agronomicos_pkey: PRIMARY KEY (id)
// Table: replantios
//   FOREIGN KEY replantios_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   CHECK replantios_motivo_check: CHECK ((motivo = ANY (ARRAY['falha_germinacao'::text, 'pragas'::text, 'doencas'::text, 'clima'::text, 'outro'::text])))
//   PRIMARY KEY replantios_pkey: PRIMARY KEY (id)
//   CHECK replantios_quantidade_replantada_check: CHECK ((quantidade_replantada > 0))
//   FOREIGN KEY replantios_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE CASCADE
//   FOREIGN KEY replantios_transplantio_id_fkey: FOREIGN KEY (transplantio_id) REFERENCES transplantios(id) ON DELETE CASCADE
// Table: requisicoes_internas
//   FOREIGN KEY requisicoes_internas_aprovador_id_fkey: FOREIGN KEY (aprovador_id) REFERENCES usuarios(id) ON DELETE SET NULL
//   FOREIGN KEY requisicoes_internas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY requisicoes_internas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY requisicoes_internas_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
//   CHECK requisicoes_internas_quantidade_check: CHECK ((quantidade > (0)::numeric))
//   FOREIGN KEY requisicoes_internas_solicitante_id_fkey: FOREIGN KEY (solicitante_id) REFERENCES usuarios(id) ON DELETE SET NULL
//   CHECK requisicoes_internas_status_check: CHECK (((status)::text = ANY ((ARRAY['pendente'::character varying, 'aprovado'::character varying, 'recusado'::character varying])::text[])))
// Table: residuos
//   FOREIGN KEY residuos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY residuos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY residuos_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
// Table: rh_epi_entregas
//   FOREIGN KEY rh_epi_entregas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY rh_epi_entregas_epi_id_fkey: FOREIGN KEY (epi_id) REFERENCES rh_epis(id) ON DELETE CASCADE
//   FOREIGN KEY rh_epi_entregas_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE CASCADE
//   PRIMARY KEY rh_epi_entregas_pkey: PRIMARY KEY (id)
// Table: rh_epis
//   FOREIGN KEY rh_epis_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY rh_epis_pkey: PRIMARY KEY (id)
// Table: rh_ferias_afastamentos
//   FOREIGN KEY rh_ferias_afastamentos_aprovador_id_fkey: FOREIGN KEY (aprovador_id) REFERENCES usuarios(id) ON DELETE SET NULL
//   FOREIGN KEY rh_ferias_afastamentos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY rh_ferias_afastamentos_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE CASCADE
//   PRIMARY KEY rh_ferias_afastamentos_pkey: PRIMARY KEY (id)
//   CHECK rh_ferias_afastamentos_status_check: CHECK ((status = ANY (ARRAY['solicitado'::text, 'aprovado'::text, 'rejeitado'::text])))
//   CHECK rh_ferias_afastamentos_tipo_check: CHECK ((tipo = ANY (ARRAY['ferias'::text, 'medico'::text, 'falta'::text, 'licenca'::text])))
// Table: rh_folha_pagamento
//   CHECK rh_folha_pagamento_descontos_check: CHECK ((descontos >= (0)::numeric))
//   FOREIGN KEY rh_folha_pagamento_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   CHECK rh_folha_pagamento_fgts_check: CHECK ((fgts >= (0)::numeric))
//   FOREIGN KEY rh_folha_pagamento_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE CASCADE
//   CHECK rh_folha_pagamento_inss_check: CHECK ((inss >= (0)::numeric))
//   CHECK rh_folha_pagamento_irrf_check: CHECK ((irrf >= (0)::numeric))
//   CHECK rh_folha_pagamento_liquido_check: CHECK ((liquido >= (0)::numeric))
//   PRIMARY KEY rh_folha_pagamento_pkey: PRIMARY KEY (id)
//   CHECK rh_folha_pagamento_proventos_check: CHECK ((proventos >= (0)::numeric))
//   CHECK rh_folha_pagamento_salario_base_check: CHECK ((salario_base >= (0)::numeric))
//   CHECK rh_folha_pagamento_status_check: CHECK ((status = ANY (ARRAY['aberto'::text, 'fechado'::text])))
// Table: rh_ponto
//   FOREIGN KEY rh_ponto_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY rh_ponto_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE CASCADE
//   PRIMARY KEY rh_ponto_pkey: PRIMARY KEY (id)
//   CHECK rh_ponto_tipo_check: CHECK ((tipo = ANY (ARRAY['entrada'::text, 'saida'::text])))
// Table: rolagens_container
//   FOREIGN KEY rolagens_container_aprovado_por_fkey: FOREIGN KEY (aprovado_por) REFERENCES auth.users(id) ON DELETE SET NULL
//   FOREIGN KEY rolagens_container_booking_novo_id_fkey: FOREIGN KEY (booking_novo_id) REFERENCES bookings(id) ON DELETE CASCADE
//   FOREIGN KEY rolagens_container_booking_original_id_fkey: FOREIGN KEY (booking_original_id) REFERENCES bookings(id) ON DELETE CASCADE
//   FOREIGN KEY rolagens_container_container_id_fkey: FOREIGN KEY (container_id) REFERENCES containers(id) ON DELETE CASCADE
//   FOREIGN KEY rolagens_container_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY rolagens_container_pkey: PRIMARY KEY (id)
// Table: romaneios_venda
//   FOREIGN KEY romaneios_venda_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id)
//   FOREIGN KEY romaneios_venda_container_id_fkey: FOREIGN KEY (container_id) REFERENCES containers(id) ON DELETE SET NULL
//   FOREIGN KEY romaneios_venda_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   UNIQUE romaneios_venda_empresa_id_numero_romaneio_key: UNIQUE (empresa_id, numero_romaneio)
//   PRIMARY KEY romaneios_venda_pkey: PRIMARY KEY (id)
// Table: saas_faturas
//   FOREIGN KEY saas_faturas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id)
//   PRIMARY KEY saas_faturas_pkey: PRIMARY KEY (id)
// Table: safra_talhoes
//   FOREIGN KEY safra_talhoes_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY safra_talhoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY safra_talhoes_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE CASCADE
//   UNIQUE safra_talhoes_safra_id_talhao_id_key: UNIQUE (safra_id, talhao_id)
//   FOREIGN KEY safra_talhoes_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE CASCADE
// Table: safras
//   FOREIGN KEY safras_cultivar_id_fkey: FOREIGN KEY (cultivar_id) REFERENCES cultivares(id)
//   FOREIGN KEY safras_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY safras_fazenda_id_fkey: FOREIGN KEY (fazenda_id) REFERENCES fazendas(id) ON DELETE CASCADE
//   PRIMARY KEY safras_pkey: PRIMARY KEY (id)
//   FOREIGN KEY safras_responsavel_encerramento_id_fkey: FOREIGN KEY (responsavel_encerramento_id) REFERENCES usuarios(id)
//   FOREIGN KEY safras_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE CASCADE
// Table: sessoes_carregamento
//   FOREIGN KEY sessoes_carregamento_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY sessoes_carregamento_pkey: PRIMARY KEY (id)
//   FOREIGN KEY sessoes_carregamento_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES auth.users(id)
//   FOREIGN KEY sessoes_carregamento_romaneio_id_fkey: FOREIGN KEY (romaneio_id) REFERENCES romaneios_venda(id) ON DELETE CASCADE
//   CHECK sessoes_carregamento_status_check: CHECK ((status = ANY (ARRAY['em_andamento'::text, 'concluido'::text, 'divergencia'::text])))
//   FOREIGN KEY sessoes_carregamento_transportadora_id_fkey: FOREIGN KEY (transportadora_id) REFERENCES transportadoras(id)
// Table: suporte_mensagens
//   PRIMARY KEY suporte_mensagens_pkey: PRIMARY KEY (id)
//   FOREIGN KEY suporte_mensagens_ticket_id_fkey: FOREIGN KEY (ticket_id) REFERENCES suporte_tickets(id) ON DELETE CASCADE
//   FOREIGN KEY suporte_mensagens_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
// Table: suporte_tickets
//   FOREIGN KEY suporte_tickets_atendente_id_fkey: FOREIGN KEY (atendente_id) REFERENCES usuarios(id)
//   FOREIGN KEY suporte_tickets_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id)
//   PRIMARY KEY suporte_tickets_pkey: PRIMARY KEY (id)
// Table: talhoes
//   FOREIGN KEY talhoes_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY talhoes_fazenda_id_fkey: FOREIGN KEY (fazenda_id) REFERENCES fazendas(id) ON DELETE CASCADE
//   PRIMARY KEY talhoes_pkey: PRIMARY KEY (id)
// Table: transplantio_itens
//   FOREIGN KEY transplantio_itens_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   CHECK transplantio_itens_item_tipo_check: CHECK ((item_tipo = ANY (ARRAY['insumo'::text, 'mao_de_obra'::text, 'energia'::text, 'agua'::text])))
//   PRIMARY KEY transplantio_itens_pkey: PRIMARY KEY (id)
//   FOREIGN KEY transplantio_itens_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id)
//   FOREIGN KEY transplantio_itens_transplantio_id_fkey: FOREIGN KEY (transplantio_id) REFERENCES transplantios(id) ON DELETE CASCADE
// Table: transplantios
//   FOREIGN KEY transplantios_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY transplantios_lote_muda_id_fkey: FOREIGN KEY (lote_muda_id) REFERENCES lotes_mudas(id) ON DELETE CASCADE
//   PRIMARY KEY transplantios_pkey: PRIMARY KEY (id)
//   FOREIGN KEY transplantios_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id) ON DELETE SET NULL
//   FOREIGN KEY transplantios_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE CASCADE
//   FOREIGN KEY transplantios_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE CASCADE
// Table: transportadoras
//   FOREIGN KEY transportadoras_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY transportadoras_pkey: PRIMARY KEY (id)
// Table: user_2fa_codes
//   PRIMARY KEY user_2fa_codes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY user_2fa_codes_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
// Table: usuarios
//   FOREIGN KEY usuarios_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
//   FOREIGN KEY usuarios_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY usuarios_fornecedor_id_fkey: FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE SET NULL
//   PRIMARY KEY usuarios_pkey: PRIMARY KEY (id)
// Table: vacaria_animais
//   FOREIGN KEY vacaria_animais_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY vacaria_animais_mae_id_fkey: FOREIGN KEY (mae_id) REFERENCES vacaria_animais(id) ON DELETE SET NULL
//   FOREIGN KEY vacaria_animais_pai_id_fkey: FOREIGN KEY (pai_id) REFERENCES vacaria_animais(id) ON DELETE SET NULL
//   PRIMARY KEY vacaria_animais_pkey: PRIMARY KEY (id)
// Table: vacaria_eventos_reprodutivos
//   FOREIGN KEY vacaria_eventos_reprodutivos_animal_id_fkey: FOREIGN KEY (animal_id) REFERENCES vacaria_animais(id) ON DELETE CASCADE
//   FOREIGN KEY vacaria_eventos_reprodutivos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY vacaria_eventos_reprodutivos_pkey: PRIMARY KEY (id)
// Table: vacaria_producao_leite
//   FOREIGN KEY vacaria_producao_leite_animal_id_fkey: FOREIGN KEY (animal_id) REFERENCES vacaria_animais(id) ON DELETE CASCADE
//   FOREIGN KEY vacaria_producao_leite_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY vacaria_producao_leite_pkey: PRIMARY KEY (id)
// Table: vacaria_saude_animal
//   FOREIGN KEY vacaria_saude_animal_animal_id_fkey: FOREIGN KEY (animal_id) REFERENCES vacaria_animais(id) ON DELETE CASCADE
//   FOREIGN KEY vacaria_saude_animal_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY vacaria_saude_animal_pkey: PRIMARY KEY (id)
// Table: vendedores
//   FOREIGN KEY vendedores_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY vendedores_pkey: PRIMARY KEY (id)
//   FOREIGN KEY vendedores_supervisor_id_fkey: FOREIGN KEY (supervisor_id) REFERENCES vendedores(id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: account_sales
//   Policy "account_sales_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: adiantamentos_internacionais
//   Policy "adiantamentos_internacionais_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: alertas
//   Policy "alertas_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: amostras_qualidade_campo
//   Policy "amostras_qualidade_campo_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//   Policy "amostras_qualidade_campo_empresa_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "amostras_qualidade_campo_empresa_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "amostras_qualidade_campo_empresa_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "amostras_qualidade_campo_empresa_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: analises_solo
//   Policy "analises_solo_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: armazens
//   Policy "armazens_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: audit_logs
//   Policy "audit_logs_read" (SELECT, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: balanco_massas
//   Policy "balanco_massas_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: bookings
//   Policy "bookings_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: caderno_campo
//   Policy "caderno_campo_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: carregamentos
//   Policy "carregamentos_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: centros_custo
//   Policy "centros_custo_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: certificacoes_auditorias
//   Policy "certificacoes_auditorias_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: certificacoes_itens_auditoria
//   Policy "certificacoes_itens_auditoria_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (auditoria_id IN ( SELECT certificacoes_auditorias.id    FROM certificacoes_auditorias   WHERE (certificacoes_auditorias.empresa_id = get_user_empresa_id())))
// Table: certificacoes_itens_modelo
//   Policy "certificacoes_itens_modelo_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (modelo_id IN ( SELECT certificacoes_modelos.id    FROM certificacoes_modelos   WHERE (certificacoes_modelos.empresa_id = get_user_empresa_id())))
// Table: certificacoes_modelos
//   Policy "certificacoes_modelos_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: clientes
//   Policy "clientes_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: colheita_registros
//   Policy "colheita_registros_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: compras_cotacao_fornecedores
//   Policy "compras_cotacao_fornecedores_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//   Policy "compras_cotacao_fornecedores_portal_read" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((empresa_id = get_user_empresa_id()) OR (fornecedor_id IN ( SELECT usuarios.fornecedor_id    FROM usuarios   WHERE (usuarios.id = auth.uid()))))
//   Policy "compras_cotacao_fornecedores_portal_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((empresa_id = get_user_empresa_id()) OR (fornecedor_id IN ( SELECT usuarios.fornecedor_id    FROM usuarios   WHERE (usuarios.id = auth.uid()))))
//     WITH CHECK: ((empresa_id = get_user_empresa_id()) OR (fornecedor_id IN ( SELECT usuarios.fornecedor_id    FROM usuarios   WHERE (usuarios.id = auth.uid()))))
// Table: compras_cotacoes
//   Policy "compras_cotacoes_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//   Policy "compras_cotacoes_fornecedor_read" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((empresa_id = get_user_empresa_id()) OR (id IN ( SELECT compras_cotacao_fornecedores.cotacao_id    FROM compras_cotacao_fornecedores   WHERE (compras_cotacao_fornecedores.fornecedor_id IN ( SELECT usuarios.fornecedor_id            FROM usuarios           WHERE (usuarios.id = auth.uid()))))))
// Table: compras_pedido
//   Policy "compras_pedido_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: compras_requisicao
//   Policy "compras_requisicao_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: conta_corrente_produtor
//   Policy "conta_corrente_produtor_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: containers
//   Policy "containers_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: contas_bancarias
//   Policy "contas_bancarias_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: contas_bancarias_entidade
//   Policy "contas_bancarias_entidade_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: contatos_entidade
//   Policy "contatos_entidade_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: cooperados_contratos
//   Policy "cooperados_contratos_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: cultivares
//   Policy "cultivares_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: culturas
//   Policy "culturas_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: culturas_fenologia
//   Policy "culturas_fenologia_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: custos_talhao
//   Policy "custos_talhao_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: devolucoes_compras
//   Policy "devolucoes_compras_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: divergencias_carregamento
//   Policy "divergencias_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: documentos_entidade
//   Policy "documentos_entidade_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: documentos_exportacao
//   Policy "documentos_exportacao_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: emissoes_carbono
//   Policy "emissoes_carbono_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: empresas
//   Policy "empresas_admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin_saas()
//   Policy "empresas_admin_saas" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin_saas()
//   Policy "empresas_read" (SELECT, PERMISSIVE) roles={public}
//     USING: (deleted_at IS NULL)
// Table: enderecos_entidade
//   Policy "enderecos_entidade_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: equipamentos
//   Policy "equipamentos_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: estoque_movimento
//   Policy "estoque_movimento_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: estufas
//   Policy "estufas_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: etiquetas_impressas
//   Policy "etiquetas_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: fazendas
//   Policy "fazendas_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: financeiro_lancamentos
//   Policy "financeiro_lancamentos_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: fornecedores
//   Policy "fornecedores_empresa_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: ((empresa_id = get_user_empresa_id()) AND (get_user_perfil() <> 'fornecedor'::text))
//     WITH CHECK: ((empresa_id = get_user_empresa_id()) AND (get_user_perfil() <> 'fornecedor'::text))
//   Policy "fornecedores_portal_read" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (id IN ( SELECT usuarios.fornecedor_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: frota_abastecimentos
//   Policy "frota_abastecimentos_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "frota_abastecimentos_empresa_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "frota_abastecimentos_empresa_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "frota_abastecimentos_empresa_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "frota_abastecimentos_empresa_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: frota_manutencoes
//   Policy "frota_manutencoes_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "frota_manutencoes_empresa_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "frota_manutencoes_empresa_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "frota_manutencoes_empresa_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "frota_manutencoes_empresa_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: frota_veiculos
//   Policy "frota_veiculos_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "frota_veiculos_empresa_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "frota_veiculos_empresa_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "frota_veiculos_empresa_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "frota_veiculos_empresa_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: frota_viagens
//   Policy "frota_viagens_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "frota_viagens_empresa_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "frota_viagens_empresa_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "frota_viagens_empresa_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "frota_viagens_empresa_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: funcionarios
//   Policy "funcionarios_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: graus_dia
//   Policy "graus_dia_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: historico_produtividade_talhao
//   Policy "historico_produtividade_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: invoices_exportacao
//   Policy "invoices_exportacao_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: lotes_estoque
//   Policy "lotes_estoque_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: lotes_mudas
//   Policy "lotes_mudas_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: moedas
//   Policy "moedas_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: monitoramento_pragas
//   Policy "monitoramento_pragas_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: nao_conformidades
//   Policy "nao_conformidades_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: navios
//   Policy "navios_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: operacao_insumos
//   Policy "operacao_insumos_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: operacoes_campo
//   Policy "operacoes_campo_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: packing_recepcoes
//   Policy "packing_recepcoes_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: pallets
//   Policy "pallets_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: patrimonio_bens
//   Policy "patrimonio_bens_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "patrimonio_bens_empresa_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "patrimonio_bens_empresa_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "patrimonio_bens_empresa_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "patrimonio_bens_empresa_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: perdas_estufa
//   Policy "perdas_estufa_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: planejamento_safra
//   Policy "planejamento_safra_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: plano_contas
//   Policy "plano_contas_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: planos
//   Policy "planos_admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin_saas()
//   Policy "planos_admin_saas" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin_saas()
//   Policy "planos_read" (SELECT, PERMISSIVE) roles={public}
//     USING: (deleted_at IS NULL)
// Table: pluviometria
//   Policy "pluviometria_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: portal_tokens
//   Policy "portal_tokens_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: portos
//   Policy "portos_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: produtos
//   Policy "produtos_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: receituarios_agronomicos
//   Policy "receituarios_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: replantios
//   Policy "replantios_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: requisicoes_internas
//   Policy "requisicoes_internas_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: residuos
//   Policy "residuos_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: rh_epi_entregas
//   Policy "rh_epi_entregas_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "rh_epi_entregas_empresa_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "rh_epi_entregas_empresa_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "rh_epi_entregas_empresa_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "rh_epi_entregas_empresa_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: rh_epis
//   Policy "rh_epis_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "rh_epis_empresa_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "rh_epis_empresa_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "rh_epis_empresa_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "rh_epis_empresa_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: rh_ferias_afastamentos
//   Policy "rh_ferias_afastamentos_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "rh_ferias_afastamentos_empresa_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "rh_ferias_afastamentos_empresa_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "rh_ferias_afastamentos_empresa_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "rh_ferias_afastamentos_empresa_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: rh_folha_pagamento
//   Policy "rh_folha_pagamento_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "rh_folha_pagamento_empresa_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "rh_folha_pagamento_empresa_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "rh_folha_pagamento_empresa_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "rh_folha_pagamento_empresa_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: rh_ponto
//   Policy "rh_ponto_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "rh_ponto_empresa_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "rh_ponto_empresa_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "rh_ponto_empresa_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "rh_ponto_empresa_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: rolagens_container
//   Policy "rolagens_container_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: romaneios_venda
//   Policy "romaneios_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: saas_faturas
//   Policy "saas_faturas" (SELECT, PERMISSIVE) roles={public}
//     USING: true
//   Policy "saas_faturas_admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin_saas()
//   Policy "saas_faturas_admin_saas" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin_saas()
// Table: safra_talhoes
//   Policy "safra_talhoes_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: safras
//   Policy "safras_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: sessoes_carregamento
//   Policy "sessoes_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: suporte_mensagens
//   Policy "suporte_mensagens_admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin_saas()
//   Policy "suporte_mensagens_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (ticket_id IN ( SELECT suporte_tickets.id    FROM suporte_tickets   WHERE (suporte_tickets.empresa_id = ( SELECT usuarios.empresa_id            FROM usuarios           WHERE (usuarios.id = auth.uid())))))
// Table: suporte_tickets
//   Policy "suporte_tickets_admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin_saas()
//   Policy "suporte_tickets_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: talhoes
//   Policy "talhoes_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: transplantio_itens
//   Policy "transplantio_itens_empresa_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "transplantio_itens_empresa_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (empresa_id = get_user_empresa_id())
//   Policy "transplantio_itens_empresa_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//   Policy "transplantio_itens_empresa_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: transplantios
//   Policy "transplantios_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: transportadoras
//   Policy "transportadoras_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: user_2fa_codes
//   Policy "user_2fa_codes_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin_saas()
//   Policy "user_2fa_codes_own" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (usuario_id = auth.uid())
// Table: usuarios
//   Policy "usuarios_admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin_saas()
//   Policy "usuarios_admin_saas" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin_saas()
//   Policy "usuarios_empresa_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((empresa_id = get_user_empresa_id()) AND (get_user_perfil() = ANY (ARRAY['admin'::text, 'admin_saas'::text])))
//   Policy "usuarios_empresa_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (is_admin_saas() OR (auth.uid() = id) OR ((empresa_id = get_user_empresa_id()) AND (get_user_perfil() <> 'fornecedor'::text)))
//   Policy "usuarios_empresa_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((empresa_id = get_user_empresa_id()) AND (get_user_perfil() = ANY (ARRAY['admin'::text, 'admin_saas'::text])))
//     WITH CHECK: ((empresa_id = get_user_empresa_id()) AND (get_user_perfil() = ANY (ARRAY['admin'::text, 'admin_saas'::text])))
//   Policy "usuarios_own" (SELECT, PERMISSIVE) roles={public}
//     USING: ((auth.uid() = id) OR ((auth.jwt() ->> 'role'::text) = 'admin_saas'::text))
// Table: vacaria_animais
//   Policy "vacaria_animais_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: vacaria_eventos_reprodutivos
//   Policy "vacaria_eventos_reprodutivos_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: vacaria_producao_leite
//   Policy "vacaria_producao_leite_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: vacaria_saude_animal
//   Policy "vacaria_saude_animal_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = get_user_empresa_id())
//     WITH CHECK: (empresa_id = get_user_empresa_id())
// Table: vendedores
//   Policy "vendedores_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))

// --- DATABASE FUNCTIONS ---
// FUNCTION ao_encerrar_safra()
//   CREATE OR REPLACE FUNCTION public.ao_encerrar_safra()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_produtividade numeric;
//     v_total_ton numeric := 0;
//     v_total_ha numeric := 0;
//     v_admin_id uuid;
//     v_produto_id uuid;
//     v_armazem_id uuid;
//     v_lote_id uuid;
//     v_cultura_nome text;
//     v_bm RECORD;
//     v_total_destinos numeric;
//     v_diferenca numeric;
//   BEGIN
//     IF NEW.status = 'encerrada' AND OLD.status != 'encerrada' THEN
//       UPDATE safras SET status = 'bloqueada' WHERE talhao_id = NEW.talhao_id AND id != NEW.id AND status != 'encerrada';
//
//       SELECT COALESCE(SUM(producao_liquida_ton), 0), COALESCE(SUM(area_colhida_ha), 0)
//       INTO v_total_ton, v_total_ha
//       FROM colheita_registros
//       WHERE safra_id = NEW.id AND deleted_at IS NULL;
//
//       IF v_total_ha > 0 THEN
//         v_produtividade := (v_total_ton * 1000) / v_total_ha;
//
//         INSERT INTO historico_produtividade_talhao (empresa_id, talhao_id, ano, produtividade_kg_ha)
//         SELECT DISTINCT NEW.empresa_id, t_id, NEW.ano_safra, v_produtividade
//         FROM (
//           SELECT talhao_id as t_id FROM safra_talhoes WHERE safra_id = NEW.id
//           UNION
//           SELECT NEW.talhao_id WHERE NEW.talhao_id IS NOT NULL
//         ) as t
//         WHERE t_id IS NOT NULL;
//
//         IF NEW.produtividade_planejada IS NOT NULL AND NEW.produtividade_planejada > 0 AND v_produtividade < NEW.produtividade_planejada THEN
//           FOR v_admin_id IN SELECT id FROM usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//               INSERT INTO alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//               VALUES (
//                   NEW.empresa_id, v_admin_id,
//                   'Desempenho Abaixo da Meta - ' || COALESCE(NEW.nome_safra, NEW.codigo_safra, NEW.id::text),
//                   'A produtividade final foi de ' || ROUND(v_produtividade, 2) || ' kg/ha, ficando abaixo da meta de ' || ROUND(NEW.produtividade_planejada, 2) || ' kg/ha.',
//                   'baixa_produtividade', false
//               );
//           END LOOP;
//         END IF;
//       END IF;
//
//       UPDATE talhoes SET status_atual = 'disponível'
//       WHERE id IN (
//         SELECT talhao_id FROM safra_talhoes WHERE safra_id = NEW.id
//         UNION
//         SELECT NEW.talhao_id WHERE NEW.talhao_id IS NOT NULL
//       );
//
//       IF v_total_ton > 0 THEN
//           SELECT c.nome INTO v_cultura_nome FROM cultivares cv JOIN culturas c ON cv.cultura_id = c.id WHERE cv.id = NEW.cultivar_id LIMIT 1;
//           IF v_cultura_nome IS NOT NULL THEN
//               SELECT id INTO v_produto_id FROM produtos WHERE empresa_id = NEW.empresa_id AND nome = v_cultura_nome LIMIT 1;
//               IF v_produto_id IS NULL THEN
//                   INSERT INTO produtos (empresa_id, nome, tipo, unidade_medida, status)
//                   VALUES (NEW.empresa_id, v_cultura_nome, 'produto_agricola', 'kg', 'ativo')
//                   RETURNING id INTO v_produto_id;
//               END IF;
//
//               IF NEW.fazenda_id IS NOT NULL THEN
//                   SELECT id INTO v_armazem_id FROM armazens WHERE empresa_id = NEW.empresa_id AND fazenda_id = NEW.fazenda_id AND deleted_at IS NULL LIMIT 1;
//               END IF;
//               IF v_armazem_id IS NULL THEN
//                   SELECT id INTO v_armazem_id FROM armazens WHERE empresa_id = NEW.empresa_id AND deleted_at IS NULL LIMIT 1;
//               END IF;
//
//               IF v_armazem_id IS NOT NULL THEN
//                   INSERT INTO lotes_estoque (empresa_id, produto_id, armazem_id, numero_lote, quantidade, data_entrada)
//                   VALUES (NEW.empresa_id, v_produto_id, v_armazem_id, 'SAFRA-' || COALESCE(NEW.codigo_safra, NEW.id::text), (v_total_ton * 1000), CURRENT_DATE)
//                   RETURNING id INTO v_lote_id;
//
//                   INSERT INTO estoque_movimento (empresa_id, lote_id, tipo_movimento, quantidade, motivo, created_at)
//                   VALUES (NEW.empresa_id, v_lote_id, 'entrada', (v_total_ton * 1000), 'Entrada de Safra Encerrada: ' || NEW.id, NOW());
//
//                   FOR v_admin_id IN SELECT id FROM usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//                       INSERT INTO alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//                       VALUES (NEW.empresa_id, v_admin_id, 'Entrada de Estoque - Safra', 'Lote da safra ' || COALESCE(NEW.nome_safra, NEW.codigo_safra, '') || ' gerado no estoque automaticamente (' || (v_total_ton * 1000)::text || ' kg).', 'entrada_estoque', false);
//                   END LOOP;
//               END IF;
//           END IF;
//       END IF;
//
//       -- NOVO: Check de Divergência de Massa (0.5%)
//       SELECT * INTO v_bm FROM public.balanco_massas WHERE safra_id = NEW.id LIMIT 1;
//       IF v_bm IS NOT NULL THEN
//           v_total_destinos := COALESCE(v_bm.exportacao_kg, 0) + COALESCE(v_bm.mercado_interno_kg, 0) +
//                               COALESCE(v_bm.doacao_kg, 0) + COALESCE(v_bm.descarte_qualidade_kg, 0) +
//                               COALESCE(v_bm.descarte_excesso_kg, 0) + COALESCE(v_bm.perda_campo_kg, 0) +
//                               COALESCE(v_bm.perda_packing_kg, 0);
//
//           v_diferenca := ABS(COALESCE(v_bm.quantidade_colhida_kg, 0) - v_total_destinos);
//
//           IF COALESCE(v_bm.quantidade_colhida_kg, 0) > 0 AND v_diferenca > (v_bm.quantidade_colhida_kg * 0.005) THEN
//               FOR v_admin_id IN SELECT id FROM usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//                   INSERT INTO alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//                   VALUES (
//                       NEW.empresa_id, v_admin_id,
//                       'Divergência de Balanço de Massa - ' || COALESCE(NEW.nome_safra, NEW.codigo_safra, NEW.id::text),
//                       'A safra foi encerrada com uma divergência de ' || ROUND(v_diferenca, 2) || ' kg entre o total colhido e os destinos registrados (acima de 0.5%).',
//                       'divergencia_massa', false
//                   );
//               END LOOP;
//           END IF;
//       END IF;
//
//       FOR v_admin_id IN SELECT id FROM usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//           INSERT INTO alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//           VALUES (NEW.empresa_id, v_admin_id, 'Safra Encerrada', 'A safra ' || COALESCE(NEW.nome_safra, NEW.codigo_safra, NEW.id::text) || ' foi encerrada e está bloqueada para edições.', 'safra_encerrada', false);
//       END LOOP;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION atualizar_quantidade_replantio_transplantio()
//   CREATE OR REPLACE FUNCTION public.atualizar_quantidade_replantio_transplantio()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       IF TG_OP = 'INSERT' THEN
//           UPDATE public.transplantios
//           SET quantidade_replantio = COALESCE(quantidade_replantio, 0) + NEW.quantidade_replantada
//           WHERE id = NEW.transplantio_id;
//       ELSIF TG_OP = 'UPDATE' THEN
//           UPDATE public.transplantios
//           SET quantidade_replantio = COALESCE(quantidade_replantio, 0) - OLD.quantidade_replantada + NEW.quantidade_replantada
//           WHERE id = NEW.transplantio_id;
//       ELSIF TG_OP = 'DELETE' THEN
//           UPDATE public.transplantios
//           SET quantidade_replantio = COALESCE(quantidade_replantio, 0) - OLD.quantidade_replantada
//           WHERE id = OLD.transplantio_id;
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION atualizar_quantidade_viva_lote()
//   CREATE OR REPLACE FUNCTION public.atualizar_quantidade_viva_lote()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       IF TG_OP = 'INSERT' THEN
//           UPDATE public.lotes_mudas
//           SET quantidade_viva = quantidade_viva - NEW.quantidade_perdida
//           WHERE id = NEW.lote_muda_id AND quantidade_viva >= NEW.quantidade_perdida;
//       ELSIF TG_OP = 'UPDATE' THEN
//           UPDATE public.lotes_mudas
//           SET quantidade_viva = quantidade_viva + OLD.quantidade_perdida - NEW.quantidade_perdida
//           WHERE id = NEW.lote_muda_id;
//       ELSIF TG_OP = 'DELETE' THEN
//           UPDATE public.lotes_mudas
//           SET quantidade_viva = quantidade_viva + OLD.quantidade_perdida
//           WHERE id = OLD.lote_muda_id;
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION atualizar_quantidade_viva_transplantio()
//   CREATE OR REPLACE FUNCTION public.atualizar_quantidade_viva_transplantio()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       IF TG_OP = 'INSERT' THEN
//           UPDATE public.lotes_mudas
//           SET quantidade_viva = quantidade_viva - (NEW.quantidade_transplantada + COALESCE(NEW.quantidade_replantio, 0)),
//               status = CASE WHEN quantidade_viva - (NEW.quantidade_transplantada + COALESCE(NEW.quantidade_replantio, 0)) <= 0 THEN 'transplantado' ELSE status END
//           WHERE id = NEW.lote_muda_id;
//       ELSIF TG_OP = 'UPDATE' THEN
//           UPDATE public.lotes_mudas
//           SET quantidade_viva = quantidade_viva + (OLD.quantidade_transplantada + COALESCE(OLD.quantidade_replantio, 0)) - (NEW.quantidade_transplantada + COALESCE(NEW.quantidade_replantio, 0)),
//               status = CASE WHEN quantidade_viva + (OLD.quantidade_transplantada + COALESCE(OLD.quantidade_replantio, 0)) - (NEW.quantidade_transplantada + COALESCE(NEW.quantidade_replantio, 0)) <= 0 THEN 'transplantado' ELSE 'pronto' END
//           WHERE id = NEW.lote_muda_id;
//       ELSIF TG_OP = 'DELETE' THEN
//           UPDATE public.lotes_mudas
//           SET quantidade_viva = quantidade_viva + (OLD.quantidade_transplantada + COALESCE(OLD.quantidade_replantio, 0)),
//               status = CASE WHEN quantidade_viva + (OLD.quantidade_transplantada + COALESCE(OLD.quantidade_replantio, 0)) > 0 AND status = 'transplantado' THEN 'pronto' ELSE status END
//           WHERE id = OLD.lote_muda_id;
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION atualizar_saldo_conta_bancaria()
//   CREATE OR REPLACE FUNCTION public.atualizar_saldo_conta_bancaria()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//       v_diff numeric := 0;
//   BEGIN
//       IF TG_OP = 'INSERT' THEN
//           IF NEW.status IN ('pago', 'recebido') AND NEW.conta_bancaria_id IS NOT NULL THEN
//               IF NEW.tipo IN ('receita', 'transferencia_entrada') THEN
//                   v_diff := NEW.valor;
//               ELSE
//                   v_diff := -NEW.valor;
//               END IF;
//               UPDATE public.contas_bancarias SET saldo_atual = COALESCE(saldo_atual, 0) + v_diff WHERE id = NEW.conta_bancaria_id;
//           END IF;
//       ELSIF TG_OP = 'UPDATE' THEN
//           IF OLD.status IN ('pago', 'recebido') AND OLD.conta_bancaria_id IS NOT NULL THEN
//               IF OLD.tipo IN ('receita', 'transferencia_entrada') THEN
//                   v_diff := -OLD.valor;
//               ELSE
//                   v_diff := OLD.valor;
//               END IF;
//               UPDATE public.contas_bancarias SET saldo_atual = COALESCE(saldo_atual, 0) + v_diff WHERE id = OLD.conta_bancaria_id;
//           END IF;
//
//           IF NEW.status IN ('pago', 'recebido') AND NEW.conta_bancaria_id IS NOT NULL THEN
//               IF NEW.tipo IN ('receita', 'transferencia_entrada') THEN
//                   v_diff := NEW.valor;
//               ELSE
//                   v_diff := -NEW.valor;
//               END IF;
//               UPDATE public.contas_bancarias SET saldo_atual = COALESCE(saldo_atual, 0) + v_diff WHERE id = NEW.conta_bancaria_id;
//           END IF;
//       ELSIF TG_OP = 'DELETE' THEN
//           IF OLD.status IN ('pago', 'recebido') AND OLD.conta_bancaria_id IS NOT NULL THEN
//               IF OLD.tipo IN ('receita', 'transferencia_entrada') THEN
//                   v_diff := -OLD.valor;
//               ELSE
//                   v_diff := OLD.valor;
//               END IF;
//               UPDATE public.contas_bancarias SET saldo_atual = COALESCE(saldo_atual, 0) + v_diff WHERE id = OLD.conta_bancaria_id;
//           END IF;
//       END IF;
//
//       RETURN NULL;
//   END;
//   $function$
//
// FUNCTION audit_clientes_changes()
//   CREATE OR REPLACE FUNCTION public.audit_clientes_changes()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     IF TG_OP = 'INSERT' THEN
//       INSERT INTO public.audit_logs (empresa_id, usuario_id, acao, tabela, registro_id, dados_novos)
//       VALUES (NEW.empresa_id, auth.uid(), 'INSERT', 'clientes', NEW.id, row_to_json(NEW));
//       RETURN NEW;
//     ELSIF TG_OP = 'UPDATE' THEN
//       INSERT INTO public.audit_logs (empresa_id, usuario_id, acao, tabela, registro_id, dados_anteriores, dados_novos)
//       VALUES (NEW.empresa_id, auth.uid(), 'UPDATE', 'clientes', NEW.id, row_to_json(OLD), row_to_json(NEW));
//       RETURN NEW;
//     ELSIF TG_OP = 'DELETE' THEN
//       INSERT INTO public.audit_logs (empresa_id, usuario_id, acao, tabela, registro_id, dados_anteriores)
//       VALUES (OLD.empresa_id, auth.uid(), 'DELETE', 'clientes', OLD.id, row_to_json(OLD));
//       RETURN OLD;
//     END IF;
//     RETURN NULL;
//   END;
//   $function$
//
// FUNCTION audit_lotes_estoque_updates()
//   CREATE OR REPLACE FUNCTION public.audit_lotes_estoque_updates()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     IF TG_OP = 'UPDATE' THEN
//       IF OLD.quantidade != NEW.quantidade THEN
//         INSERT INTO public.audit_logs (empresa_id, usuario_id, acao, tabela, registro_id, dados_anteriores, dados_novos)
//         VALUES (NEW.empresa_id, auth.uid(), 'UPDATE', 'lotes_estoque', NEW.id, row_to_json(OLD), row_to_json(NEW));
//       END IF;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION calcular_custo_por_muda()
//   CREATE OR REPLACE FUNCTION public.calcular_custo_por_muda()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       IF NEW.quantidade_mudas > 0 THEN
//           NEW.custo_por_muda := NEW.custo_total / NEW.quantidade_mudas;
//       ELSE
//           NEW.custo_por_muda := 0;
//       END IF;
//
//       IF TG_OP = 'INSERT' THEN
//           IF NEW.quantidade_viva IS NULL OR NEW.quantidade_viva = 0 THEN
//               NEW.quantidade_viva := NEW.quantidade_mudas;
//           END IF;
//       END IF;
//
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION calcular_custo_total_item_transplantio()
//   CREATE OR REPLACE FUNCTION public.calcular_custo_total_item_transplantio()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       NEW.custo_total := NEW.quantidade * NEW.custo_unitario;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION calcular_custo_transferido()
//   CREATE OR REPLACE FUNCTION public.calcular_custo_transferido()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//       v_custo_por_muda NUMERIC;
//   BEGIN
//       SELECT custo_por_muda INTO v_custo_por_muda FROM public.lotes_mudas WHERE id = NEW.lote_muda_id;
//       NEW.custo_transferido := (NEW.quantidade_transplantada + COALESCE(NEW.quantidade_replantio, 0)) * COALESCE(v_custo_por_muda, 0);
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION check_animal_vivo()
//   CREATE OR REPLACE FUNCTION public.check_animal_vivo()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//       v_status text;
//   BEGIN
//       SELECT status INTO v_status FROM public.vacaria_animais WHERE id = NEW.animal_id;
//       IF v_status IN ('morto', 'vendido') THEN
//           RAISE EXCEPTION 'Não é possível registrar eventos (saúde, produção, reprodução) para animais mortos ou vendidos.';
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION check_carencia_antes_colheita()
//   CREATE OR REPLACE FUNCTION public.check_carencia_antes_colheita()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//       v_safra_talhao uuid;
//       v_carencia_ativa boolean;
//       v_produto_nome text;
//       v_dias_restantes integer;
//   BEGIN
//       SELECT talhao_id INTO v_safra_talhao FROM public.safras WHERE id = NEW.safra_id;
//
//       IF v_safra_talhao IS NOT NULL THEN
//           SELECT
//               true, p.nome, (p.carencia_dias - (NEW.data_colheita - oc.data_conclusao))
//           INTO v_carencia_ativa, v_produto_nome, v_dias_restantes
//           FROM public.operacoes_campo oc
//           JOIN public.operacao_insumos oi ON oi.operacao_id = oc.id
//           JOIN public.produtos p ON oi.produto_id = p.id
//           WHERE oc.safra_id = NEW.safra_id
//             AND oc.status = 'concluída'
//             AND p.carencia_dias IS NOT NULL
//             AND p.carencia_dias > 0
//             AND oc.data_conclusao IS NOT NULL
//             AND (NEW.data_colheita - oc.data_conclusao) < p.carencia_dias
//           LIMIT 1;
//
//           IF v_carencia_ativa THEN
//               RAISE EXCEPTION 'Não é permitido registrar colheita. O produto % ainda está em período de carência (% dias restantes).', v_produto_nome, v_dias_restantes;
//           END IF;
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION check_contingency_stock_alert()
//   CREATE OR REPLACE FUNCTION public.check_contingency_stock_alert()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_total_replantado integer;
//     v_transplantio record;
//     v_admin_id uuid;
//     v_alerta_existente boolean;
//     v_limite integer;
//   BEGIN
//     -- We calculate the total replanted for this transplantio
//     SELECT COALESCE(SUM(quantidade_replantada), 0)
//     INTO v_total_replantado
//     FROM public.replantios
//     WHERE transplantio_id = NEW.transplantio_id AND deleted_at IS NULL;
//
//     -- Get transplantio details
//     SELECT t.quantidade_transplantada, t.empresa_id, s.id as safra_id,
//            COALESCE(s.nome_safra, s.codigo_safra, s.id::text) as safra_identificador,
//            th.nome as talhao_nome
//     INTO v_transplantio
//     FROM public.transplantios t
//     LEFT JOIN public.safras s ON t.safra_id = s.id
//     LEFT JOIN public.talhoes th ON t.talhao_id = th.id
//     WHERE t.id = NEW.transplantio_id;
//
//     IF FOUND AND COALESCE(v_transplantio.quantidade_transplantada, 0) > 0 THEN
//       v_limite := v_transplantio.quantidade_transplantada * 0.10;
//
//       IF v_total_replantado > v_limite THEN
//         -- Check if alert already exists to prevent spam
//         SELECT EXISTS (
//           SELECT 1 FROM public.alertas
//           WHERE empresa_id = v_transplantio.empresa_id
//             AND tipo = 'alerta_replantio'
//             AND lido = false
//             AND descricao LIKE '%' || NEW.transplantio_id::text || '%'
//         ) INTO v_alerta_existente;
//
//         IF NOT v_alerta_existente THEN
//           FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = v_transplantio.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//             INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//             VALUES (
//               v_transplantio.empresa_id,
//               v_admin_id,
//               'Alerta de Contingência: Alto Replantio',
//               'O volume de replantio (' || v_total_replantado || ' mudas) ultrapassou o limite de 10% do total transplantado na Safra ' || COALESCE(v_transplantio.safra_identificador, 'N/A') || ' - Talhão ' || COALESCE(v_transplantio.talhao_nome, 'N/A') || '. Motivo recente: ' || COALESCE(NEW.motivo, 'Não informado') || '. (Transplantio ID: ' || NEW.transplantio_id::text || ')',
//               'alerta_replantio',
//               false
//             );
//           END LOOP;
//         END IF;
//       END IF;
//     END IF;
//
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION check_daily_alerts()
//   CREATE OR REPLACE FUNCTION public.check_daily_alerts()
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_epi RECORD;
//     v_manut RECORD;
//     v_admin_id uuid;
//   BEGIN
//     FOR v_epi IN
//       SELECT ee.id, e.nome, ee.data_vencimento, ee.empresa_id, f.nome as func_nome
//       FROM public.rh_epi_entregas ee
//       JOIN public.rh_epis e ON ee.epi_id = e.id
//       JOIN public.funcionarios f ON ee.funcionario_id = f.id
//       WHERE ee.data_vencimento = CURRENT_DATE + INTERVAL '10 days'
//     LOOP
//       IF NOT EXISTS (SELECT 1 FROM public.alertas WHERE tipo = 'epi_vencimento' AND descricao LIKE '%' || v_epi.id::text || '%') THEN
//         FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = v_epi.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//           INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//           VALUES (v_epi.empresa_id, v_admin_id, 'EPI Vencendo', 'O EPI ' || v_epi.nome || ' do funcionário ' || v_epi.func_nome || ' vence em 10 dias (' || v_epi.data_vencimento || '). Ref: ' || v_epi.id::text, 'epi_vencimento', false);
//         END LOOP;
//       END IF;
//     END LOOP;
//
//     FOR v_manut IN
//       SELECT m.id, m.data_prevista, m.empresa_id, v.placa, v.modelo
//       FROM public.frota_manutencoes m
//       JOIN public.frota_veiculos v ON m.veiculo_id = v.id
//       WHERE m.tipo = 'preventiva' AND m.data_prevista = CURRENT_DATE + INTERVAL '15 days' AND m.data_realizada IS NULL
//     LOOP
//       IF NOT EXISTS (SELECT 1 FROM public.alertas WHERE tipo = 'manutencao_preventiva' AND descricao LIKE '%' || v_manut.id::text || '%') THEN
//         FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = v_manut.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//           INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//           VALUES (v_manut.empresa_id, v_admin_id, 'Manutenção Preventiva Agendada', 'O veículo ' || v_manut.modelo || ' (' || v_manut.placa || ') tem manutenção prevista para ' || v_manut.data_prevista || '. Ref: ' || v_manut.id::text, 'manutencao_preventiva', false);
//         END LOOP;
//       END IF;
//     END LOOP;
//   END;
//   $function$
//
// FUNCTION check_daily_alerts_compliance()
//   CREATE OR REPLACE FUNCTION public.check_daily_alerts_compliance()
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       r RECORD;
//       v_admin_id UUID;
//   BEGIN
//       FOR r IN SELECT * FROM public.certificacoes_auditorias WHERE status = 'agendada' AND data_agendada IN (CURRENT_DATE + 30, CURRENT_DATE + 15, CURRENT_DATE + 7) LOOP
//           FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = r.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//               INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//               VALUES (r.empresa_id, v_admin_id, 'Auditoria Próxima', 'Auditoria ' || r.tipo_auditoria || ' agendada para ' || r.data_agendada, 'auditoria_agendada', false);
//           END LOOP;
//       END LOOP;
//
//       FOR r IN SELECT * FROM public.nao_conformidades WHERE status IN ('aberta', 'em_correcao') AND prazo_correcao = CURRENT_DATE + 3 LOOP
//           FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = r.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//               INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//               VALUES (r.empresa_id, v_admin_id, 'Prazo de NC Vencendo', 'NC ' || r.id || ' vence em 3 dias.', 'nc_prazo', false);
//           END LOOP;
//       END LOOP;
//
//       FOR r IN SELECT * FROM public.residuos WHERE tipo_residuo = 'perigoso' AND data_vencimento_cdf IS NOT NULL AND data_vencimento_cdf <= CURRENT_DATE + 15 LOOP
//           FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = r.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//               INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//               VALUES (r.empresa_id, v_admin_id, 'Vencimento de CDF Próximo', 'O CDF do resíduo ' || r.descricao || ' vence em ' || r.data_vencimento_cdf, 'cdf_vencimento', false);
//           END LOOP;
//       END LOOP;
//   END;
//   $function$
//
// FUNCTION check_documentos_entidade_vencimento()
//   CREATE OR REPLACE FUNCTION public.check_documentos_entidade_vencimento()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_admin_id UUID;
//   BEGIN
//     IF NEW.gerar_alerta = true AND NEW.data_validade IS NOT NULL AND NEW.dias_antecedencia_alerta IS NOT NULL THEN
//       IF (NEW.data_validade - CURRENT_DATE) <= NEW.dias_antecedencia_alerta AND (NEW.data_validade - CURRENT_DATE) >= 0 THEN
//         FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//           INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//           VALUES (
//             NEW.empresa_id,
//             v_admin_id,
//             'Vencimento de Documento: ' || NEW.titulo,
//             'O documento ' || NEW.titulo || ' vence em ' || TO_CHAR(NEW.data_validade, 'DD/MM/YYYY') || '.',
//             'documento_vencimento',
//             false
//           );
//         END LOOP;
//       END IF;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION check_estoque_critico()
//   CREATE OR REPLACE FUNCTION public.check_estoque_critico()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_produto_id uuid;
//     v_empresa_id uuid;
//     v_total_estoque numeric;
//     v_estoque_minimo numeric;
//     v_nome_produto varchar;
//   BEGIN
//     IF TG_OP = 'DELETE' THEN
//       v_produto_id := OLD.produto_id;
//       v_empresa_id := OLD.empresa_id;
//     ELSE
//       v_produto_id := NEW.produto_id;
//       v_empresa_id := NEW.empresa_id;
//     END IF;
//
//     SELECT COALESCE(SUM(quantidade), 0) INTO v_total_estoque
//     FROM public.lotes_estoque
//     WHERE produto_id = v_produto_id AND empresa_id = v_empresa_id AND deleted_at IS NULL;
//
//     SELECT estoque_minimo, nome INTO v_estoque_minimo, v_nome_produto
//     FROM public.produtos
//     WHERE id = v_produto_id;
//
//     IF v_estoque_minimo IS NOT NULL AND v_total_estoque <= v_estoque_minimo THEN
//       IF NOT EXISTS (
//         SELECT 1 FROM public.alertas
//         WHERE empresa_id = v_empresa_id
//           AND tipo = 'estoque_critico'
//           AND lido = false
//           AND descricao LIKE '%' || v_produto_id::text || '%'
//       ) THEN
//         INSERT INTO public.alertas (empresa_id, titulo, descricao, tipo, lido)
//         VALUES (
//           v_empresa_id,
//           'Estoque Crítico: ' || v_nome_produto,
//           'O estoque do produto ' || v_nome_produto || ' (ID: ' || v_produto_id || ') está em ' || v_total_estoque || ', que é igual ou inferior ao mínimo de ' || v_estoque_minimo || '.',
//           'estoque_critico',
//           false
//         );
//       END IF;
//     END IF;
//
//     RETURN NULL;
//   END;
//   $function$
//
// FUNCTION check_frota_consumo()
//   CREATE OR REPLACE FUNCTION public.check_frota_consumo()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_last_km numeric;
//     v_km_diff numeric;
//     v_kml numeric;
//     v_avg_kml numeric;
//     v_admin_id uuid;
//   BEGIN
//     SELECT km_registro INTO v_last_km
//     FROM public.frota_abastecimentos
//     WHERE veiculo_id = NEW.veiculo_id AND id != NEW.id
//     ORDER BY km_registro DESC
//     LIMIT 1;
//
//     IF v_last_km IS NOT NULL AND NEW.km_registro > v_last_km THEN
//       v_km_diff := NEW.km_registro - v_last_km;
//       v_kml := v_km_diff / NEW.litros;
//
//       SELECT AVG((a1.km_registro - a2.km_registro) / a1.litros) INTO v_avg_kml
//       FROM public.frota_abastecimentos a1
//       JOIN public.frota_abastecimentos a2 ON a1.veiculo_id = a2.veiculo_id
//         AND a2.km_registro = (SELECT MAX(km_registro) FROM public.frota_abastecimentos WHERE veiculo_id = a1.veiculo_id AND km_registro < a1.km_registro)
//       WHERE a1.veiculo_id = NEW.veiculo_id AND a1.id != NEW.id;
//
//       IF v_avg_kml IS NOT NULL AND v_avg_kml > 0 THEN
//         IF ABS(v_kml - v_avg_kml) / v_avg_kml > 0.20 THEN
//           FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//             INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//             VALUES (NEW.empresa_id, v_admin_id, 'Anomalia de Consumo', 'Veículo ' || NEW.veiculo_id || ' registrou consumo de ' || ROUND(v_kml, 2) || ' Km/L, com desvio de >20% da média de ' || ROUND(v_avg_kml, 2) || ' Km/L.', 'frota_consumo', false);
//           END LOOP;
//         END IF;
//       END IF;
//     END IF;
//
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION check_lancamento_vencimento()
//   CREATE OR REPLACE FUNCTION public.check_lancamento_vencimento()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       IF NEW.status = 'pendente' AND NEW.data_vencimento IS NOT NULL AND NEW.data_vencimento < CURRENT_DATE THEN
//           NEW.status := 'atrasado';
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION check_limite_orcamentario()
//   CREATE OR REPLACE FUNCTION public.check_limite_orcamentario()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_total_custos numeric;
//     v_orcamento_total numeric;
//     v_empresa_id uuid;
//     v_safra_id uuid;
//     v_safra_identificador text;
//     v_admin_id uuid;
//     v_alerta_existente boolean;
//   BEGIN
//     IF TG_OP = 'DELETE' THEN
//       v_safra_id := OLD.safra_id;
//       v_empresa_id := OLD.empresa_id;
//     ELSE
//       v_safra_id := NEW.safra_id;
//       v_empresa_id := NEW.empresa_id;
//     END IF;
//
//     SELECT orcamento_total, COALESCE(nome_safra, codigo_safra, id::text)
//     INTO v_orcamento_total, v_safra_identificador
//     FROM public.safras
//     WHERE id = v_safra_id;
//
//     IF v_orcamento_total IS NULL OR v_orcamento_total <= 0 THEN
//       RETURN NULL;
//     END IF;
//
//     SELECT COALESCE(SUM(valor), 0)
//     INTO v_total_custos
//     FROM public.custos_talhao
//     WHERE safra_id = v_safra_id AND deleted_at IS NULL;
//
//     IF v_total_custos > v_orcamento_total THEN
//       SELECT EXISTS (
//         SELECT 1 FROM public.alertas
//         WHERE empresa_id = v_empresa_id
//           AND tipo = 'estouro_orcamento'
//           AND lido = false
//           AND descricao LIKE '%' || v_safra_id::text || '%'
//       ) INTO v_alerta_existente;
//
//       IF NOT v_alerta_existente THEN
//         FOR v_admin_id IN SELECT id FROM usuarios WHERE empresa_id = v_empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//           INSERT INTO alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//           VALUES (
//             v_empresa_id,
//             v_admin_id,
//             'Orçamento Excedido - ' || v_safra_identificador,
//             'O custo total acumulado (' || ROUND(v_total_custos, 2) || ') ultrapassou o limite orçamentário de ' || ROUND(v_orcamento_total, 2) || '. (Safra ID: ' || v_safra_id::text || ')',
//             'estouro_orcamento',
//             false
//           );
//         END LOOP;
//       END IF;
//     END IF;
//
//     RETURN NULL;
//   END;
//   $function$
//
// FUNCTION check_replantio_transplantio_empresa()
//   CREATE OR REPLACE FUNCTION public.check_replantio_transplantio_empresa()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_empresa_id uuid;
//   BEGIN
//     SELECT empresa_id INTO v_empresa_id FROM public.transplantios WHERE id = NEW.transplantio_id;
//     IF v_empresa_id IS NULL OR v_empresa_id != NEW.empresa_id THEN
//       RAISE EXCEPTION 'transplantio_id não pertence à mesma empresa_id do replantio.';
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION check_safra_encerrada()
//   CREATE OR REPLACE FUNCTION public.check_safra_encerrada()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_status varchar;
//     v_safra_id uuid;
//   BEGIN
//     IF TG_TABLE_NAME = 'safras' THEN
//       IF OLD.status = 'encerrada' AND NEW.status != 'encerrada' THEN
//         RAISE EXCEPTION 'Não é permitido reabrir uma safra encerrada.';
//       END IF;
//     ELSE
//       IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
//         v_safra_id := NEW.safra_id;
//       ELSE
//         v_safra_id := OLD.safra_id;
//       END IF;
//
//       SELECT status INTO v_status FROM safras WHERE id = v_safra_id;
//       IF v_status = 'encerrada' THEN
//         RAISE EXCEPTION 'Não é permitido criar, alterar ou deletar registros vinculados a uma safra encerrada.';
//       END IF;
//     END IF;
//
//     IF TG_OP = 'DELETE' THEN
//       RETURN OLD;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION create_saida_estoque_on_carregamento()
//   CREATE OR REPLACE FUNCTION public.create_saida_estoque_on_carregamento()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_pallet RECORD;
//     v_lote_id uuid;
//   BEGIN
//     IF NEW.status = 'concluido' AND OLD.status != 'concluido' THEN
//       FOR v_pallet IN SELECT * FROM public.pallets WHERE romaneio_id = NEW.romaneio_id AND deleted_at IS NULL LOOP
//         SELECT id INTO v_lote_id FROM public.lotes_estoque
//         WHERE produto_id = v_pallet.produto_id AND empresa_id = NEW.empresa_id AND quantidade >= COALESCE(v_pallet.peso_liquido_kg, 0)
//         ORDER BY data_entrada ASC LIMIT 1;
//
//         IF v_lote_id IS NOT NULL AND COALESCE(v_pallet.peso_liquido_kg, 0) > 0 THEN
//           UPDATE public.lotes_estoque SET quantidade = quantidade - v_pallet.peso_liquido_kg WHERE id = v_lote_id;
//           INSERT INTO public.estoque_movimento (empresa_id, lote_id, tipo_movimento, quantidade, motivo, created_at)
//           VALUES (NEW.empresa_id, v_lote_id, 'saída', v_pallet.peso_liquido_kg, 'Expedição - Romaneio ' || COALESCE((SELECT numero_romaneio FROM public.romaneios_venda WHERE id = NEW.romaneio_id), ''), NOW());
//         END IF;
//       END LOOP;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION generate_pallet_code()
//   CREATE OR REPLACE FUNCTION public.generate_pallet_code()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_count INT;
//     v_date_str TEXT;
//   BEGIN
//     IF NEW.codigo_pallet IS NULL THEN
//       v_date_str := to_char(NOW(), 'YYYYMMDD');
//       SELECT COUNT(*) INTO v_count FROM public.pallets WHERE empresa_id = NEW.empresa_id AND to_char(created_at, 'YYYYMMDD') = v_date_str;
//       NEW.codigo_pallet := 'PALLET-' || v_date_str || '-' || LPAD((v_count + 1)::TEXT, 4, '0');
//       IF NEW.codigo IS NULL THEN NEW.codigo := NEW.codigo_pallet; END IF;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION generate_romaneio_number()
//   CREATE OR REPLACE FUNCTION public.generate_romaneio_number()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     IF NEW.numero_romaneio IS NULL THEN
//       NEW.numero_romaneio := 'ROM-' || to_char(NOW(), 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 4));
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION gerar_alertas_fenologia(uuid)
//   CREATE OR REPLACE FUNCTION public.gerar_alertas_fenologia(p_empresa_id uuid)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     r RECORD;
//     v_data_esperada date;
//   BEGIN
//     -- RLS Security Check
//     IF p_empresa_id != public.get_user_empresa_id() AND NOT public.is_admin_saas() THEN
//       RAISE EXCEPTION 'Acesso negado';
//     END IF;
//
//     FOR r IN
//       SELECT
//         s.id as safra_id,
//         s.nome_safra,
//         s.data_plantio,
//         cf.estagio,
//         cf.dias_desde_plantio,
//         c.nome as cultura_nome
//       FROM public.safras s
//       JOIN public.cultivares cv ON s.cultivar_id = cv.id
//       JOIN public.culturas c ON cv.cultura_id = c.id
//       JOIN public.culturas_fenologia cf ON c.id = cf.cultura_id
//       WHERE s.empresa_id = p_empresa_id
//         AND s.data_plantio IS NOT NULL
//         AND s.status NOT IN ('encerrada', 'cancelada')
//         AND s.deleted_at IS NULL
//     LOOP
//       v_data_esperada := s.data_plantio + r.dias_desde_plantio;
//
//       IF CURRENT_DATE >= v_data_esperada THEN
//         IF NOT EXISTS (
//           SELECT 1 FROM public.alertas
//           WHERE empresa_id = p_empresa_id
//             AND tipo = 'manejo_fenologia'
//             AND descricao LIKE '%' || r.safra_id::text || '%'
//             AND descricao LIKE '%' || r.estagio || '%'
//         ) THEN
//           INSERT INTO public.alertas (empresa_id, titulo, descricao, tipo, lido)
//           VALUES (
//             p_empresa_id,
//             'Aviso de Manejo: ' || r.estagio,
//             'A safra ' || COALESCE(r.nome_safra, 'Sem nome') || ' atingiu o estágio "' || r.estagio || '" (Safra ID: ' || r.safra_id || '). Recomendado monitoramento.',
//             'manejo_fenologia',
//             false
//           );
//         END IF;
//       END IF;
//     END LOOP;
//   END;
//   $function$
//
// FUNCTION gerar_alertas_rh_frota(uuid)
//   CREATE OR REPLACE FUNCTION public.gerar_alertas_rh_frota(p_empresa_id uuid)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     r RECORD;
//     v_admin_id UUID;
//   BEGIN
//     IF p_empresa_id != public.get_user_empresa_id() AND NOT public.is_admin_saas() THEN
//       RAISE EXCEPTION 'Acesso negado';
//     END IF;
//
//     FOR r IN
//       SELECT e.*, ep.nome as epi_nome, f.nome as func_nome
//       FROM public.rh_epi_entregas e JOIN public.rh_epis ep ON e.epi_id = ep.id JOIN public.funcionarios f ON e.funcionario_id = f.id
//       WHERE e.empresa_id = p_empresa_id AND e.deleted_at IS NULL AND e.data_vencimento <= CURRENT_DATE + INTERVAL '10 days' AND e.data_vencimento >= CURRENT_DATE
//     LOOP
//       IF NOT EXISTS (SELECT 1 FROM public.alertas WHERE empresa_id = p_empresa_id AND tipo = 'vencimento_epi' AND descricao LIKE '%' || r.id::text || '%') THEN
//         FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = p_empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//           INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//           VALUES (p_empresa_id, v_admin_id, 'Vencimento de EPI Próximo', 'O EPI ' || r.epi_nome || ' de ' || r.func_nome || ' vence em ' || TO_CHAR(r.data_vencimento, 'DD/MM/YYYY') || ' (ID: ' || r.id || ').', 'vencimento_epi', false);
//         END LOOP;
//       END IF;
//     END LOOP;
//
//     FOR r IN
//       SELECT m.*, v.placa, v.modelo
//       FROM public.frota_manutencoes m JOIN public.frota_veiculos v ON m.veiculo_id = v.id
//       WHERE m.empresa_id = p_empresa_id AND m.deleted_at IS NULL AND m.tipo = 'preventiva' AND m.data_realizada IS NULL AND m.data_prevista <= CURRENT_DATE + INTERVAL '15 days' AND m.data_prevista >= CURRENT_DATE
//     LOOP
//       IF NOT EXISTS (SELECT 1 FROM public.alertas WHERE empresa_id = p_empresa_id AND tipo = 'manutencao_preventiva' AND descricao LIKE '%' || r.id::text || '%') THEN
//         FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = p_empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//           INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//           VALUES (p_empresa_id, v_admin_id, 'Manutenção Preventiva Próxima', 'Veículo ' || r.modelo || ' (' || r.placa || ') prevista para ' || TO_CHAR(r.data_prevista, 'DD/MM/YYYY') || ' (ID: ' || r.id || ').', 'manutencao_preventiva', false);
//         END LOOP;
//       END IF;
//     END LOOP;
//   END;
//   $function$
//
// FUNCTION get_portal_cliente_data(text)
//   CREATE OR REPLACE FUNCTION public.get_portal_cliente_data(p_token text)
//    RETURNS jsonb
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       v_token_record RECORD;
//       v_invoices JSONB;
//       v_documentos JSONB;
//       v_tracking JSONB;
//   BEGIN
//       SELECT * INTO v_token_record FROM public.portal_tokens WHERE token = p_token AND ativo = true AND deleted_at IS NULL AND data_expiracao > now();
//       IF NOT FOUND OR v_token_record.entidade_tipo != 'cliente' THEN RAISE EXCEPTION 'Acesso negado'; END IF;
//
//       IF 'invoices' = ANY(v_token_record.acessos_permitidos) THEN
//           SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_invoices
//           FROM (
//               SELECT * FROM public.invoices_exportacao WHERE cliente_id = v_token_record.entidade_id ORDER BY data_emissao DESC LIMIT 50
//           ) t;
//       ELSE v_invoices := '[]'::jsonb; END IF;
//
//       IF 'documentos' = ANY(v_token_record.acessos_permitidos) THEN
//           SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_documentos
//           FROM (
//               SELECT d.*, c.numero_container
//               FROM public.documentos_exportacao d
//               JOIN public.containers c ON d.container_id = c.id
//               WHERE c.id IN (SELECT container_id FROM public.invoices_exportacao WHERE cliente_id = v_token_record.entidade_id AND container_id IS NOT NULL)
//           ) t;
//       ELSE v_documentos := '[]'::jsonb; END IF;
//
//       IF 'tracking' = ANY(v_token_record.acessos_permitidos) THEN
//           SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_tracking
//           FROM (
//               SELECT c.*, b.numero_booking, b.data_eta, b.data_etd
//               FROM public.containers c
//               LEFT JOIN public.bookings b ON c.booking_id = b.id
//               WHERE c.id IN (SELECT container_id FROM public.invoices_exportacao WHERE cliente_id = v_token_record.entidade_id AND container_id IS NOT NULL)
//           ) t;
//       ELSE v_tracking := '[]'::jsonb; END IF;
//
//       RETURN jsonb_build_object(
//           'invoices', v_invoices,
//           'documentos', v_documentos,
//           'tracking', v_tracking
//       );
//   END;
//   $function$
//
// FUNCTION get_portal_data(text)
//   CREATE OR REPLACE FUNCTION public.get_portal_data(p_token text)
//    RETURNS jsonb
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       v_token record;
//       v_empresa record;
//       v_result jsonb := '{}'::jsonb;
//   BEGIN
//       SELECT * INTO v_token FROM public.portal_tokens
//       WHERE token = p_token AND ativo = true AND data_expiracao > now() AND deleted_at IS NULL;
//
//       IF NOT FOUND THEN
//           RETURN jsonb_build_object('success', false, 'error', 'Token inválido ou expirado');
//       END IF;
//
//       UPDATE public.portal_tokens SET ultimo_acesso = now() WHERE id = v_token.id;
//
//       INSERT INTO public.audit_logs (empresa_id, acao, tabela, registro_id, dados_novos)
//       VALUES (v_token.empresa_id, 'PORTAL_ACCESS', 'portal_tokens', v_token.id,
//               jsonb_build_object('entidade_tipo', v_token.entidade_tipo, 'entidade_id', v_token.entidade_id));
//
//       SELECT * INTO v_empresa FROM public.empresas WHERE id = v_token.empresa_id;
//
//       IF v_token.entidade_tipo = 'produtor' THEN
//           v_result := jsonb_build_object(
//               'conta_corrente', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
//                   SELECT * FROM public.conta_corrente_produtor
//                   WHERE empresa_id = v_token.empresa_id AND produtor_id = v_token.entidade_id
//                   ORDER BY data_movimento DESC LIMIT 100
//               ) t),
//               'pagamentos', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
//                   SELECT * FROM public.financeiro_lancamentos
//                   WHERE empresa_id = v_token.empresa_id AND fornecedor_id = v_token.entidade_id AND tipo IN ('despesa', 'pagamento')
//                   ORDER BY data_vencimento DESC LIMIT 100
//               ) t),
//               'entregas', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
//                   SELECT pr.* FROM public.packing_recepcoes pr
//                   LEFT JOIN public.colheita_registros cr ON cr.id = pr.lote_producao_id
//                   WHERE pr.empresa_id = v_token.empresa_id
//                   AND (pr.responsavel_id = v_token.entidade_id OR cr.responsavel_id = v_token.entidade_id)
//                   ORDER BY pr.data_recepcao DESC LIMIT 50
//               ) t)
//           );
//       ELSIF v_token.entidade_tipo = 'cliente' THEN
//           v_result := jsonb_build_object(
//               'invoices', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
//                   SELECT * FROM public.invoices_exportacao
//                   WHERE empresa_id = v_token.empresa_id AND cliente_id = v_token.entidade_id
//                   ORDER BY data_emissao DESC LIMIT 50
//               ) t),
//               'containers', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
//                   SELECT c.*, b.numero_booking, b.data_eta, b.data_etd
//                   FROM public.containers c
//                   LEFT JOIN public.bookings b ON b.id = c.booking_id
//                   WHERE c.empresa_id = v_token.empresa_id
//                   AND c.id IN (SELECT container_id FROM public.invoices_exportacao WHERE cliente_id = v_token.entidade_id AND container_id IS NOT NULL)
//                   ORDER BY c.created_at DESC LIMIT 50
//               ) t),
//               'documentos', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
//                   SELECT d.* FROM public.documentos_exportacao d
//                   WHERE d.empresa_id = v_token.empresa_id
//                   AND d.container_id IN (SELECT container_id FROM public.invoices_exportacao WHERE cliente_id = v_token.entidade_id AND container_id IS NOT NULL)
//                   ORDER BY d.created_at DESC LIMIT 50
//               ) t)
//           );
//       ELSIF v_token.entidade_tipo = 'fornecedor' THEN
//           v_result := jsonb_build_object(
//               'pedidos', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
//                   SELECT cp.*, p.nome as produto_nome FROM public.compras_pedido cp
//                   LEFT JOIN public.produtos p ON p.id = cp.produto_id
//                   WHERE cp.empresa_id = v_token.empresa_id AND cp.fornecedor_id = v_token.entidade_id
//                   ORDER BY cp.data_pedido DESC LIMIT 50
//               ) t),
//               'pagamentos', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
//                   SELECT * FROM public.financeiro_lancamentos
//                   WHERE empresa_id = v_token.empresa_id AND fornecedor_id = v_token.entidade_id AND tipo IN ('despesa', 'pagamento')
//                   ORDER BY data_vencimento DESC LIMIT 50
//               ) t)
//           );
//       ELSIF v_token.entidade_tipo = 'despachante' THEN
//           v_result := jsonb_build_object(
//               'containers', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
//                   SELECT c.*, b.numero_booking, b.data_eta, b.data_etd
//                   FROM public.containers c
//                   LEFT JOIN public.bookings b ON b.id = c.booking_id
//                   WHERE c.empresa_id = v_token.empresa_id AND c.status != 'entregue'
//                   ORDER BY c.created_at DESC LIMIT 50
//               ) t),
//               'documentos', (SELECT COALESCE(jsonb_agg(t), '[]'::jsonb) FROM (
//                   SELECT * FROM public.documentos_exportacao
//                   WHERE empresa_id = v_token.empresa_id AND status != 'valido'
//                   ORDER BY created_at DESC LIMIT 50
//               ) t)
//           );
//       END IF;
//
//       RETURN jsonb_build_object(
//           'success', true,
//           'tokenInfo', jsonb_build_object(
//               'entidade_tipo', v_token.entidade_tipo,
//               'nome_entidade', v_token.nome_entidade,
//               'acessos_permitidos', v_token.acessos_permitidos,
//               'empresa_nome', v_empresa.nome
//           ),
//           'data', v_result
//       );
//   END;
//   $function$
//
// FUNCTION get_portal_despachante_data(text)
//   CREATE OR REPLACE FUNCTION public.get_portal_despachante_data(p_token text)
//    RETURNS jsonb
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       v_token_record RECORD;
//       v_containers JSONB;
//       v_documentos JSONB;
//   BEGIN
//       SELECT * INTO v_token_record FROM public.portal_tokens WHERE token = p_token AND ativo = true AND deleted_at IS NULL AND data_expiracao > now();
//       IF NOT FOUND OR v_token_record.entidade_tipo != 'despachante' THEN RAISE EXCEPTION 'Acesso negado'; END IF;
//
//       IF 'containers' = ANY(v_token_record.acessos_permitidos) THEN
//           SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_containers
//           FROM (
//               SELECT c.*, b.numero_booking, b.data_eta, b.data_etd
//               FROM public.containers c
//               LEFT JOIN public.bookings b ON c.booking_id = b.id
//               WHERE c.empresa_id = v_token_record.empresa_id AND c.status != 'concluido'
//               ORDER BY c.created_at DESC LIMIT 100
//           ) t;
//       ELSE v_containers := '[]'::jsonb; END IF;
//
//       IF 'documentos' = ANY(v_token_record.acessos_permitidos) THEN
//           SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_documentos
//           FROM (
//               SELECT d.*, c.numero_container
//               FROM public.documentos_exportacao d
//               JOIN public.containers c ON d.container_id = c.id
//               WHERE d.empresa_id = v_token_record.empresa_id AND d.status != 'valido'
//           ) t;
//       ELSE v_documentos := '[]'::jsonb; END IF;
//
//       RETURN jsonb_build_object(
//           'containers', v_containers,
//           'documentos', v_documentos
//       );
//   END;
//   $function$
//
// FUNCTION get_portal_fornecedor_data(text)
//   CREATE OR REPLACE FUNCTION public.get_portal_fornecedor_data(p_token text)
//    RETURNS jsonb
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       v_token_record RECORD;
//       v_pedidos JSONB;
//       v_pagamentos JSONB;
//   BEGIN
//       SELECT * INTO v_token_record FROM public.portal_tokens WHERE token = p_token AND ativo = true AND deleted_at IS NULL AND data_expiracao > now();
//       IF NOT FOUND OR v_token_record.entidade_tipo != 'fornecedor' THEN RAISE EXCEPTION 'Acesso negado'; END IF;
//
//       IF 'pedidos' = ANY(v_token_record.acessos_permitidos) THEN
//           SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_pedidos
//           FROM (
//               SELECT cp.*, p.nome as produto_nome
//               FROM public.compras_pedido cp
//               JOIN public.produtos p ON cp.produto_id = p.id
//               WHERE cp.fornecedor_id = v_token_record.entidade_id ORDER BY cp.created_at DESC LIMIT 50
//           ) t;
//       ELSE v_pedidos := '[]'::jsonb; END IF;
//
//       IF 'pagamentos' = ANY(v_token_record.acessos_permitidos) THEN
//           SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_pagamentos
//           FROM (
//               SELECT * FROM public.financeiro_lancamentos
//               WHERE fornecedor_id = v_token_record.entidade_id AND tipo = 'despesa' ORDER BY data_vencimento DESC LIMIT 50
//           ) t;
//       ELSE v_pagamentos := '[]'::jsonb; END IF;
//
//       RETURN jsonb_build_object(
//           'pedidos', v_pedidos,
//           'pagamentos', v_pagamentos
//       );
//   END;
//   $function$
//
// FUNCTION get_portal_produtor_data(text)
//   CREATE OR REPLACE FUNCTION public.get_portal_produtor_data(p_token text)
//    RETURNS jsonb
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       v_token_record RECORD;
//       v_conta_corrente JSONB;
//       v_entregas JSONB;
//       v_financeiro JSONB;
//   BEGIN
//       SELECT * INTO v_token_record FROM public.portal_tokens WHERE token = p_token AND ativo = true AND deleted_at IS NULL AND data_expiracao > now();
//       IF NOT FOUND OR v_token_record.entidade_tipo != 'produtor' THEN RAISE EXCEPTION 'Acesso negado'; END IF;
//
//       IF 'extrato' = ANY(v_token_record.acessos_permitidos) THEN
//           SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_conta_corrente
//           FROM (SELECT * FROM public.conta_corrente_produtor WHERE produtor_id = v_token_record.entidade_id ORDER BY data_movimento DESC LIMIT 50) t;
//       ELSE v_conta_corrente := '[]'::jsonb; END IF;
//
//       IF 'entregas' = ANY(v_token_record.acessos_permitidos) THEN
//           SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_entregas
//           FROM (
//               SELECT pr.*, cr.data_colheita, s.nome_safra
//               FROM public.packing_recepcoes pr
//               JOIN public.colheita_registros cr ON pr.lote_producao_id = cr.id
//               JOIN public.safras s ON pr.safra_id = s.id
//               WHERE cr.responsavel_id IN (SELECT id FROM public.usuarios WHERE fornecedor_id = v_token_record.entidade_id)
//               ORDER BY pr.data_recepcao DESC LIMIT 50
//           ) t;
//       ELSE v_entregas := '[]'::jsonb; END IF;
//
//       IF 'financeiro' = ANY(v_token_record.acessos_permitidos) THEN
//           SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_financeiro
//           FROM (
//               SELECT id, data_lancamento as data, valor, descricao, status, 'lancamento' as tipo
//               FROM public.financeiro_lancamentos
//               WHERE fornecedor_id = v_token_record.entidade_id
//               UNION ALL
//               SELECT id, data_adiantamento as data, valor_brl as valor, numero_adiantamento as descricao, status, 'adiantamento' as tipo
//               FROM public.adiantamentos_internacionais
//               WHERE cliente_id = v_token_record.entidade_id
//               ORDER BY data DESC LIMIT 50
//           ) t;
//       ELSE v_financeiro := '[]'::jsonb; END IF;
//
//       RETURN jsonb_build_object(
//           'conta_corrente', v_conta_corrente,
//           'entregas', v_entregas,
//           'financeiro', v_financeiro
//       );
//   END;
//   $function$
//
// FUNCTION get_user_empresa_id()
//   CREATE OR REPLACE FUNCTION public.get_user_empresa_id()
//    RETURNS uuid
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     v_empresa_id uuid;
//   BEGIN
//     SELECT empresa_id INTO v_empresa_id FROM public.usuarios WHERE id = auth.uid();
//     RETURN v_empresa_id;
//   END;
//   $function$
//
// FUNCTION get_user_perfil()
//   CREATE OR REPLACE FUNCTION public.get_user_perfil()
//    RETURNS text
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//   DECLARE
//     v_perfil text;
//   BEGIN
//     SELECT perfil INTO v_perfil FROM public.usuarios WHERE id = auth.uid();
//     RETURN v_perfil;
//   END;
//   $function$
//
// FUNCTION is_admin_saas()
//   CREATE OR REPLACE FUNCTION public.is_admin_saas()
//    RETURNS boolean
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     RETURN EXISTS (
//       SELECT 1 FROM public.usuarios
//       WHERE id = auth.uid() AND perfil = 'admin_saas'
//     );
//   END;
//   $function$
//
// FUNCTION on_account_sale_settled()
//   CREATE OR REPLACE FUNCTION public.on_account_sale_settled()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       IF NEW.status = 'liquidado' AND OLD.status != 'liquidado' THEN
//           IF NEW.invoice_id IS NOT NULL THEN
//               UPDATE public.invoices_exportacao
//               SET status = 'paga'
//               WHERE id = NEW.invoice_id AND status != 'paga';
//           END IF;
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION on_adiantamento_created()
//   CREATE OR REPLACE FUNCTION public.on_adiantamento_created()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//       v_admin_id UUID;
//   BEGIN
//       IF NEW.data_prevista_reembolso IS NOT NULL THEN
//           FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//               INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido, created_at)
//               VALUES (
//                   NEW.empresa_id,
//                   v_admin_id,
//                   'Reembolso de Adiantamento Previsto',
//                   'O adiantamento ' || NEW.numero_adiantamento || ' tem reembolso previsto para ' || TO_CHAR(NEW.data_prevista_reembolso, 'DD/MM/YYYY') || '.',
//                   'financeiro',
//                   false,
//                   NOW()
//               );
//           END LOOP;
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION processa_aprovacao_requisicao_interna()
//   CREATE OR REPLACE FUNCTION public.processa_aprovacao_requisicao_interna()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//       v_lote RECORD;
//       v_qtd_restante NUMERIC;
//       v_qtd_deduzir NUMERIC;
//       v_estoque_total NUMERIC;
//   BEGIN
//       IF NEW.status = 'aprovado' AND OLD.status = 'pendente' THEN
//           v_qtd_restante := NEW.quantidade;
//
//           SELECT COALESCE(SUM(quantidade), 0) INTO v_estoque_total
//           FROM public.lotes_estoque
//           WHERE produto_id = NEW.produto_id
//             AND empresa_id = NEW.empresa_id
//             AND deleted_at IS NULL;
//
//           IF v_estoque_total < v_qtd_restante THEN
//               RAISE EXCEPTION 'Estoque insuficiente para aprovar a requisição.';
//           END IF;
//
//           FOR v_lote IN
//               SELECT * FROM public.lotes_estoque
//               WHERE produto_id = NEW.produto_id
//                 AND empresa_id = NEW.empresa_id
//                 AND quantidade > 0
//                 AND deleted_at IS NULL
//               ORDER BY data_validade ASC NULLS LAST, data_entrada ASC
//           LOOP
//               IF v_qtd_restante <= 0 THEN
//                   EXIT;
//               END IF;
//
//               IF v_lote.quantidade >= v_qtd_restante THEN
//                   v_qtd_deduzir := v_qtd_restante;
//               ELSE
//                   v_qtd_deduzir := v_lote.quantidade;
//               END IF;
//
//               UPDATE public.lotes_estoque
//               SET quantidade = quantidade - v_qtd_deduzir,
//                   updated_at = NOW()
//               WHERE id = v_lote.id;
//
//               INSERT INTO public.estoque_movimento (
//                   empresa_id, lote_id, tipo_movimento, quantidade, motivo, created_at
//               ) VALUES (
//                   NEW.empresa_id, v_lote.id, 'saída', v_qtd_deduzir, 'Requisição Interna: ' || NEW.id, NOW()
//               );
//
//               v_qtd_restante := v_qtd_restante - v_qtd_deduzir;
//           END LOOP;
//
//           IF v_qtd_restante > 0 THEN
//               RAISE EXCEPTION 'Erro interno: Não foi possível deduzir os lotes.';
//           END IF;
//
//           NEW.data_aprovacao := NOW();
//       END IF;
//
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION processa_conclusao_operacao()
//   CREATE OR REPLACE FUNCTION public.processa_conclusao_operacao()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//       v_insumo RECORD;
//       v_talhao_id uuid;
//       v_centro_custo_id uuid;
//       v_observacoes text;
//   BEGIN
//       IF NEW.status = 'concluída' AND OLD.status != 'concluída' THEN
//           IF NEW.data_conclusao IS NULL THEN
//               NEW.data_conclusao := CURRENT_DATE;
//           END IF;
//
//           SELECT talhao_id INTO v_talhao_id FROM public.safras WHERE id = NEW.safra_id;
//
//           SELECT id INTO v_centro_custo_id FROM public.centros_custo WHERE empresa_id = NEW.empresa_id AND nome = 'Operações de Campo' LIMIT 1;
//           IF v_centro_custo_id IS NULL THEN
//              INSERT INTO public.centros_custo (empresa_id, nome, codigo) VALUES (NEW.empresa_id, 'Operações de Campo', 'OPC') RETURNING id INTO v_centro_custo_id;
//           END IF;
//
//           FOR v_insumo IN SELECT * FROM public.operacao_insumos WHERE operacao_id = NEW.id
//           LOOP
//               IF v_insumo.lote_id IS NOT NULL THEN
//                   UPDATE public.lotes_estoque
//                   SET quantidade = quantidade - v_insumo.quantidade_utilizada,
//                       updated_at = NOW()
//                   WHERE id = v_insumo.lote_id AND quantidade >= v_insumo.quantidade_utilizada;
//
//                   IF NOT FOUND THEN
//                       RAISE EXCEPTION 'Estoque insuficiente no lote % para a operação', v_insumo.lote_id;
//                   END IF;
//
//                   INSERT INTO public.estoque_movimento (
//                       empresa_id, lote_id, tipo_movimento, quantidade, motivo, created_at
//                   ) VALUES (
//                       NEW.empresa_id, v_insumo.lote_id, 'saída', v_insumo.quantidade_utilizada, 'Operação de Campo: ' || NEW.id, NOW()
//                   );
//               END IF;
//
//               INSERT INTO public.custos_talhao (
//                   empresa_id, talhao_id, safra_id, centro_custo_id, descricao, valor, data_lancamento
//               )
//               SELECT
//                   NEW.empresa_id, v_talhao_id, NEW.safra_id, v_centro_custo_id,
//                   'Insumo Operação: ' || p.nome,
//                   (p.preco_unitario * v_insumo.quantidade_utilizada),
//                   NEW.data_conclusao
//               FROM public.produtos p WHERE p.id = v_insumo.produto_id;
//           END LOOP;
//
//           v_observacoes := 'Operação: ' || NEW.tipo_operacao || COALESCE(' - ' || NEW.observacoes, '');
//           INSERT INTO public.caderno_campo (
//               empresa_id, talhao_id, data, observacoes, responsavel_id
//           ) VALUES (
//               NEW.empresa_id, v_talhao_id, NEW.data_conclusao, v_observacoes, NEW.responsavel_id
//           );
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION recalculate_romaneio_totals()
//   CREATE OR REPLACE FUNCTION public.recalculate_romaneio_totals()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     IF TG_OP = 'UPDATE' THEN
//       IF OLD.romaneio_id IS DISTINCT FROM NEW.romaneio_id THEN
//         IF OLD.romaneio_id IS NOT NULL THEN
//           UPDATE public.romaneios_venda SET total_pallets = (SELECT COUNT(*) FROM public.pallets WHERE romaneio_id = OLD.romaneio_id AND deleted_at IS NULL), peso_total_kg = (SELECT COALESCE(SUM(peso_liquido_kg), 0) FROM public.pallets WHERE romaneio_id = OLD.romaneio_id AND deleted_at IS NULL) WHERE id = OLD.romaneio_id;
//         END IF;
//         IF NEW.romaneio_id IS NOT NULL THEN
//           UPDATE public.romaneios_venda SET total_pallets = (SELECT COUNT(*) FROM public.pallets WHERE romaneio_id = NEW.romaneio_id AND deleted_at IS NULL), peso_total_kg = (SELECT COALESCE(SUM(peso_liquido_kg), 0) FROM public.pallets WHERE romaneio_id = NEW.romaneio_id AND deleted_at IS NULL) WHERE id = NEW.romaneio_id;
//         END IF;
//       END IF;
//     ELSIF TG_OP = 'INSERT' THEN
//       IF NEW.romaneio_id IS NOT NULL THEN
//         UPDATE public.romaneios_venda SET total_pallets = (SELECT COUNT(*) FROM public.pallets WHERE romaneio_id = NEW.romaneio_id AND deleted_at IS NULL), peso_total_kg = (SELECT COALESCE(SUM(peso_liquido_kg), 0) FROM public.pallets WHERE romaneio_id = NEW.romaneio_id AND deleted_at IS NULL) WHERE id = NEW.romaneio_id;
//       END IF;
//     ELSIF TG_OP = 'DELETE' THEN
//       IF OLD.romaneio_id IS NOT NULL THEN
//         UPDATE public.romaneios_venda SET total_pallets = (SELECT COUNT(*) FROM public.pallets WHERE romaneio_id = OLD.romaneio_id AND deleted_at IS NULL), peso_total_kg = (SELECT COALESCE(SUM(peso_liquido_kg), 0) FROM public.pallets WHERE romaneio_id = OLD.romaneio_id AND deleted_at IS NULL) WHERE id = OLD.romaneio_id;
//       END IF;
//     END IF;
//     RETURN NULL;
//   END;
//   $function$
//
// FUNCTION set_account_sales_updated_at()
//   CREATE OR REPLACE FUNCTION public.set_account_sales_updated_at()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       NEW.updated_at = NOW();
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION set_atualizado_em()
//   CREATE OR REPLACE FUNCTION public.set_atualizado_em()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       NEW.updated_at = NOW();
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION set_updated_at()
//   CREATE OR REPLACE FUNCTION public.set_updated_at()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       NEW.updated_at = NOW();
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION transplantio_automations()
//   CREATE OR REPLACE FUNCTION public.transplantio_automations()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//     v_centro_custo_id uuid;
//   BEGIN
//     -- Execute only when confirmado becomes true
//     IF NEW.confirmado = true AND (TG_OP = 'INSERT' OR OLD.confirmado = false) THEN
//
//       -- 1. Cost Transfer
//       IF NEW.custo_transferido > 0 THEN
//         -- Try to find centro de custo
//         SELECT id INTO v_centro_custo_id FROM public.centros_custo WHERE empresa_id = NEW.empresa_id AND nome = 'Mudas / Viveiro' LIMIT 1;
//
//         IF v_centro_custo_id IS NULL THEN
//           INSERT INTO public.centros_custo (empresa_id, nome, codigo)
//           VALUES (NEW.empresa_id, 'Mudas / Viveiro', 'MUD')
//           RETURNING id INTO v_centro_custo_id;
//         END IF;
//
//         INSERT INTO public.custos_talhao (
//           empresa_id, talhao_id, safra_id, centro_custo_id, descricao, valor, data_lancamento
//         ) VALUES (
//           NEW.empresa_id, NEW.talhao_id, NEW.safra_id, v_centro_custo_id,
//           'Custo Transferido - Lote de Mudas (Transplantio)',
//           NEW.custo_transferido,
//           NEW.data_transplantio
//         );
//       END IF;
//
//       -- 2. Status Progression
//       IF NEW.safra_id IS NOT NULL THEN
//         UPDATE public.safras SET status = 'em_plantio' WHERE id = NEW.safra_id AND status = 'planejada';
//       END IF;
//
//     END IF;
//
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION trg_rateio_custo_talhao()
//   CREATE OR REPLACE FUNCTION public.trg_rateio_custo_talhao()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//       r RECORD;
//   BEGIN
//       FOR r IN SELECT * FROM public.cooperados_contratos WHERE safra_id = NEW.safra_id AND (talhao_id IS NULL OR talhao_id = NEW.talhao_id) AND deleted_at IS NULL LOOP
//           INSERT INTO public.conta_corrente_produtor (
//               empresa_id, produtor_id, safra_id, tipo_movimento, data_movimento, descricao, valor, saldo
//           ) VALUES (
//               NEW.empresa_id, r.fornecedor_id, NEW.safra_id, 'rateio_custo', NEW.data_lancamento, 'Rateio de Custo Automático: ' || NEW.descricao, -(ROUND((NEW.valor * r.percentual_participacao / 100.0), 4)), 0
//           );
//       END LOOP;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION trg_rateio_receita_account_sales()
//   CREATE OR REPLACE FUNCTION public.trg_rateio_receita_account_sales()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//       v_total_peso numeric := 0;
//       r RECORD;
//   BEGIN
//       IF NEW.status = 'liquidado' AND OLD.status != 'liquidado' THEN
//           IF NEW.container_id IS NOT NULL THEN
//               SELECT COALESCE(SUM(peso_liquido_kg), 0) INTO v_total_peso
//               FROM public.pallets
//               WHERE romaneio_id IN (SELECT id FROM public.romaneios_venda WHERE container_id = NEW.container_id)
//                 AND deleted_at IS NULL;
//
//               IF v_total_peso > 0 THEN
//                   FOR r IN
//                       SELECT produtor_id, safra_id, COALESCE(SUM(peso_liquido_kg), 0) as peso_produtor
//                       FROM public.pallets
//                       WHERE romaneio_id IN (SELECT id FROM public.romaneios_venda WHERE container_id = NEW.container_id)
//                         AND produtor_id IS NOT NULL AND deleted_at IS NULL
//                       GROUP BY produtor_id, safra_id
//                   LOOP
//                       INSERT INTO public.conta_corrente_produtor (
//                           empresa_id, produtor_id, safra_id, tipo_movimento, data_movimento, descricao, valor, saldo
//                       ) VALUES (
//                           NEW.empresa_id, r.produtor_id, r.safra_id, 'rateio_receita', NEW.data_venda, 'Rateio Receita Venda Container (Acc Sales)', ROUND((NEW.valor_liquido * r.peso_produtor / v_total_peso), 4), 0
//                       );
//                   END LOOP;
//               END IF;
//           END IF;
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION update_balanco_massas_on_harvest()
//   CREATE OR REPLACE FUNCTION public.update_balanco_massas_on_harvest()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//       v_kg_colhidos numeric;
//       v_perdas_kg numeric;
//   BEGIN
//       v_kg_colhidos := COALESCE(NEW.producao_liquida_ton, 0) * 1000;
//       v_perdas_kg := COALESCE(NEW.perdas_ton, 0) * 1000;
//
//       INSERT INTO public.balanco_massas (empresa_id, safra_id, quantidade_colhida_kg, perda_campo_kg)
//       VALUES (NEW.empresa_id, NEW.safra_id, v_kg_colhidos, v_perdas_kg)
//       ON CONFLICT (safra_id)
//       DO UPDATE SET
//           quantidade_colhida_kg = COALESCE(public.balanco_massas.quantidade_colhida_kg, 0) + EXCLUDED.quantidade_colhida_kg,
//           perda_campo_kg = COALESCE(public.balanco_massas.perda_campo_kg, 0) + EXCLUDED.perda_campo_kg;
//
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION update_balanco_massas_on_pallet()
//   CREATE OR REPLACE FUNCTION public.update_balanco_massas_on_pallet()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//       v_safra_id uuid;
//   BEGIN
//       IF NEW.status = 'embarcado' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'embarcado') THEN
//           v_safra_id := NEW.safra_id;
//
//           IF v_safra_id IS NOT NULL THEN
//               INSERT INTO public.balanco_massas (empresa_id, safra_id, exportacao_kg, mercado_interno_kg)
//               VALUES (
//                   NEW.empresa_id,
//                   v_safra_id,
//                   CASE WHEN NEW.destino = 'exportacao' THEN NEW.peso_kg ELSE 0 END,
//                   CASE WHEN NEW.destino != 'exportacao' THEN NEW.peso_kg ELSE 0 END
//               )
//               ON CONFLICT (safra_id)
//               DO UPDATE SET
//                   exportacao_kg = COALESCE(public.balanco_massas.exportacao_kg, 0) + EXCLUDED.exportacao_kg,
//                   mercado_interno_kg = COALESCE(public.balanco_massas.mercado_interno_kg, 0) + EXCLUDED.mercado_interno_kg;
//           END IF;
//       ELSIF TG_OP = 'UPDATE' AND OLD.status = 'embarcado' AND (NEW.status IS DISTINCT FROM 'embarcado') THEN
//           v_safra_id := OLD.safra_id;
//           IF v_safra_id IS NOT NULL THEN
//               IF OLD.destino = 'exportacao' THEN
//                   UPDATE public.balanco_massas
//                   SET exportacao_kg = COALESCE(exportacao_kg, 0) - COALESCE(OLD.peso_kg, 0)
//                   WHERE safra_id = v_safra_id;
//               ELSE
//                   UPDATE public.balanco_massas
//                   SET mercado_interno_kg = COALESCE(mercado_interno_kg, 0) - COALESCE(OLD.peso_kg, 0)
//                   WHERE safra_id = v_safra_id;
//               END IF;
//           END IF;
//       END IF;
//
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION update_status_on_session_concluido()
//   CREATE OR REPLACE FUNCTION public.update_status_on_session_concluido()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     IF NEW.status = 'concluido' AND OLD.status != 'concluido' THEN
//       UPDATE public.pallets SET status = 'carregado' WHERE romaneio_id = NEW.romaneio_id;
//       UPDATE public.romaneios_venda SET status = 'carregado' WHERE id = NEW.romaneio_id;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION vacaria_atualiza_peso()
//   CREATE OR REPLACE FUNCTION public.vacaria_atualiza_peso()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       IF NEW.tipo = 'pesagem' AND NEW.peso_kg IS NOT NULL THEN
//           UPDATE public.vacaria_animais SET peso_atual = NEW.peso_kg, data_ultima_pesagem = NEW.data_registro WHERE id = NEW.animal_id;
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION vacaria_previsao_parto()
//   CREATE OR REPLACE FUNCTION public.vacaria_previsao_parto()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       IF NEW.tipo IN ('cobricao', 'inseminacao') THEN
//           NEW.previsao_parto := NEW.data_evento + INTERVAL '283 days';
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION vacaria_queda_producao_alerta()
//   CREATE OR REPLACE FUNCTION public.vacaria_queda_producao_alerta()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//       v_media_7d NUMERIC;
//       v_admin_id UUID;
//       v_brinco TEXT;
//   BEGIN
//       SELECT AVG(volume_litros) INTO v_media_7d
//       FROM public.vacaria_producao_leite
//       WHERE animal_id = NEW.animal_id
//         AND data_ordenha >= NEW.data_ordenha - INTERVAL '7 days'
//         AND data_ordenha < NEW.data_ordenha
//         AND deleted_at IS NULL;
//
//       IF v_media_7d IS NOT NULL AND v_media_7d > 0 THEN
//           IF NEW.volume_litros < (v_media_7d * 0.8) THEN
//               SELECT brinco INTO v_brinco FROM public.vacaria_animais WHERE id = NEW.animal_id;
//               FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
//                   INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
//                   VALUES (
//                       NEW.empresa_id, v_admin_id,
//                       'Queda de Produção - ' || COALESCE(v_brinco, 'Desconhecido'),
//                       'O animal ' || COALESCE(v_brinco, '') || ' apresentou uma queda de produção superior a 20%. Média 7d: ' || ROUND(v_media_7d, 2) || 'L, Hoje: ' || NEW.volume_litros || 'L.',
//                       'queda_producao', false
//                   );
//               END LOOP;
//           END IF;
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION validar_token_portal(text)
//   CREATE OR REPLACE FUNCTION public.validar_token_portal(p_token text)
//    RETURNS jsonb
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       v_token_record RECORD;
//       v_empresa RECORD;
//   BEGIN
//       SELECT * INTO v_token_record
//       FROM public.portal_tokens
//       WHERE token = p_token AND ativo = true AND deleted_at IS NULL;
//
//       IF NOT FOUND THEN
//           RETURN jsonb_build_object('valido', false, 'erro', 'Token inválido ou inativo');
//       END IF;
//
//       IF v_token_record.data_expiracao < now() THEN
//           RETURN jsonb_build_object('valido', false, 'erro', 'Token expirado');
//       END IF;
//
//       -- Update last access
//       UPDATE public.portal_tokens
//       SET ultimo_acesso = now()
//       WHERE id = v_token_record.id;
//
//       -- Audit log
//       INSERT INTO public.audit_logs (empresa_id, acao, tabela, registro_id, dados_novos, usuario_id)
//       VALUES (
//           v_token_record.empresa_id,
//           'ACESSO_PORTAL',
//           'portal_tokens',
//           v_token_record.id,
//           jsonb_build_object('entidade_tipo', v_token_record.entidade_tipo, 'entidade_id', v_token_record.entidade_id),
//           NULL
//       );
//
//       -- Get company name
//       SELECT nome INTO v_empresa FROM public.empresas WHERE id = v_token_record.empresa_id;
//
//       RETURN jsonb_build_object(
//           'valido', true,
//           'token_info', row_to_json(v_token_record),
//           'empresa_nome', v_empresa.nome
//       );
//   END;
//   $function$
//
// FUNCTION verificar_carencia_safra(uuid, date)
//   CREATE OR REPLACE FUNCTION public.verificar_carencia_safra(p_safra_id uuid, p_data_colheita date)
//    RETURNS jsonb
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       v_carencia_ativa boolean := false;
//       v_produto_nome text;
//       v_dias_restantes integer;
//   BEGIN
//       SELECT
//           true, p.nome, (p.carencia_dias - (p_data_colheita - oc.data_conclusao))
//       INTO v_carencia_ativa, v_produto_nome, v_dias_restantes
//       FROM public.operacoes_campo oc
//       JOIN public.operacao_insumos oi ON oi.operacao_id = oc.id
//       JOIN public.produtos p ON oi.produto_id = p.id
//       WHERE oc.safra_id = p_safra_id
//         AND oc.status = 'concluída'
//         AND p.carencia_dias IS NOT NULL
//         AND p.carencia_dias > 0
//         AND oc.data_conclusao IS NOT NULL
//         AND (p_data_colheita - oc.data_conclusao) < p.carencia_dias
//       ORDER BY (p.carencia_dias - (p_data_colheita - oc.data_conclusao)) DESC
//       LIMIT 1;
//
//       IF v_carencia_ativa THEN
//           RETURN json_build_object('ativa', true, 'produto', v_produto_nome, 'dias', v_dias_restantes)::jsonb;
//       ELSE
//           RETURN json_build_object('ativa', false)::jsonb;
//       END IF;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: account_sales
//   trg_account_sales_updated_at: CREATE TRIGGER trg_account_sales_updated_at BEFORE UPDATE ON public.account_sales FOR EACH ROW EXECUTE FUNCTION set_account_sales_updated_at()
//   trg_on_account_sale_settled: CREATE TRIGGER trg_on_account_sale_settled AFTER UPDATE ON public.account_sales FOR EACH ROW EXECUTE FUNCTION on_account_sale_settled()
//   trg_rateio_receita: CREATE TRIGGER trg_rateio_receita AFTER UPDATE ON public.account_sales FOR EACH ROW EXECUTE FUNCTION trg_rateio_receita_account_sales()
// Table: adiantamentos_internacionais
//   trg_on_adiantamento_created: CREATE TRIGGER trg_on_adiantamento_created AFTER INSERT ON public.adiantamentos_internacionais FOR EACH ROW EXECUTE FUNCTION on_adiantamento_created()
// Table: certificacoes_auditorias
//   trg_certificacoes_auditorias_updated_at: CREATE TRIGGER trg_certificacoes_auditorias_updated_at BEFORE UPDATE ON public.certificacoes_auditorias FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: certificacoes_itens_auditoria
//   trg_certificacoes_itens_auditoria_updated_at: CREATE TRIGGER trg_certificacoes_itens_auditoria_updated_at BEFORE UPDATE ON public.certificacoes_itens_auditoria FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: certificacoes_itens_modelo
//   trg_certificacoes_itens_modelo_updated_at: CREATE TRIGGER trg_certificacoes_itens_modelo_updated_at BEFORE UPDATE ON public.certificacoes_itens_modelo FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: certificacoes_modelos
//   trg_certificacoes_modelos_updated_at: CREATE TRIGGER trg_certificacoes_modelos_updated_at BEFORE UPDATE ON public.certificacoes_modelos FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: clientes
//   audit_clientes: CREATE TRIGGER audit_clientes AFTER INSERT OR DELETE OR UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION audit_clientes_changes()
// Table: colheita_registros
//   trg_block_update_colheitas: CREATE TRIGGER trg_block_update_colheitas BEFORE INSERT OR DELETE OR UPDATE ON public.colheita_registros FOR EACH ROW EXECUTE FUNCTION check_safra_encerrada()
//   trg_check_carencia: CREATE TRIGGER trg_check_carencia BEFORE INSERT ON public.colheita_registros FOR EACH ROW EXECUTE FUNCTION check_carencia_antes_colheita()
//   trg_update_mass_balance_on_harvest: CREATE TRIGGER trg_update_mass_balance_on_harvest AFTER INSERT ON public.colheita_registros FOR EACH ROW EXECUTE FUNCTION update_balanco_massas_on_harvest()
// Table: compras_cotacao_fornecedores
//   trigger_compras_cotacao_fornecedores_updated_at: CREATE TRIGGER trigger_compras_cotacao_fornecedores_updated_at BEFORE UPDATE ON public.compras_cotacao_fornecedores FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: compras_cotacoes
//   trigger_compras_cotacoes_updated_at: CREATE TRIGGER trigger_compras_cotacoes_updated_at BEFORE UPDATE ON public.compras_cotacoes FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: culturas_fenologia
//   trigger_culturas_fenologia_updated_at: CREATE TRIGGER trigger_culturas_fenologia_updated_at BEFORE UPDATE ON public.culturas_fenologia FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: custos_talhao
//   trg_rateio_custo: CREATE TRIGGER trg_rateio_custo AFTER INSERT ON public.custos_talhao FOR EACH ROW EXECUTE FUNCTION trg_rateio_custo_talhao()
//   trigger_check_limite_orcamentario: CREATE TRIGGER trigger_check_limite_orcamentario AFTER INSERT OR UPDATE ON public.custos_talhao FOR EACH ROW EXECUTE FUNCTION check_limite_orcamentario()
// Table: documentos_entidade
//   trg_check_documentos_entidade_vencimento: CREATE TRIGGER trg_check_documentos_entidade_vencimento AFTER INSERT OR UPDATE ON public.documentos_entidade FOR EACH ROW EXECUTE FUNCTION check_documentos_entidade_vencimento()
// Table: documentos_exportacao
//   trigger_documentos_exportacao_updated_at: CREATE TRIGGER trigger_documentos_exportacao_updated_at BEFORE UPDATE ON public.documentos_exportacao FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: emissoes_carbono
//   trg_emissoes_carbono_updated_at: CREATE TRIGGER trg_emissoes_carbono_updated_at BEFORE UPDATE ON public.emissoes_carbono FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: empresas
//   trigger_empresas_updated_at: CREATE TRIGGER trigger_empresas_updated_at BEFORE UPDATE ON public.empresas FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: estufas
//   trg_estufas_updated_at: CREATE TRIGGER trg_estufas_updated_at BEFORE UPDATE ON public.estufas FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: fazendas
//   trigger_fazendas_updated_at: CREATE TRIGGER trigger_fazendas_updated_at BEFORE UPDATE ON public.fazendas FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: financeiro_lancamentos
//   trg_atualizar_saldo_conta_bancaria: CREATE TRIGGER trg_atualizar_saldo_conta_bancaria AFTER INSERT OR DELETE OR UPDATE ON public.financeiro_lancamentos FOR EACH ROW EXECUTE FUNCTION atualizar_saldo_conta_bancaria()
//   trg_check_lancamento_vencimento: CREATE TRIGGER trg_check_lancamento_vencimento BEFORE INSERT OR UPDATE ON public.financeiro_lancamentos FOR EACH ROW EXECUTE FUNCTION check_lancamento_vencimento()
// Table: frota_abastecimentos
//   on_frota_abastecimentos_insert: CREATE TRIGGER on_frota_abastecimentos_insert AFTER INSERT ON public.frota_abastecimentos FOR EACH ROW EXECUTE FUNCTION check_frota_consumo()
//   trg_check_frota_consumo: CREATE TRIGGER trg_check_frota_consumo AFTER INSERT ON public.frota_abastecimentos FOR EACH ROW EXECUTE FUNCTION check_frota_consumo()
// Table: lotes_estoque
//   trg_audit_lotes_estoque: CREATE TRIGGER trg_audit_lotes_estoque AFTER UPDATE ON public.lotes_estoque FOR EACH ROW EXECUTE FUNCTION audit_lotes_estoque_updates()
//   trigger_check_estoque_critico: CREATE TRIGGER trigger_check_estoque_critico AFTER INSERT OR DELETE OR UPDATE ON public.lotes_estoque FOR EACH ROW EXECUTE FUNCTION check_estoque_critico()
// Table: lotes_mudas
//   trg_calcular_custo_por_muda: CREATE TRIGGER trg_calcular_custo_por_muda BEFORE INSERT OR UPDATE ON public.lotes_mudas FOR EACH ROW EXECUTE FUNCTION calcular_custo_por_muda()
//   trg_lotes_mudas_updated_at: CREATE TRIGGER trg_lotes_mudas_updated_at BEFORE UPDATE ON public.lotes_mudas FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: monitoramento_pragas
//   trg_block_update_monitoramento: CREATE TRIGGER trg_block_update_monitoramento BEFORE INSERT OR DELETE OR UPDATE ON public.monitoramento_pragas FOR EACH ROW EXECUTE FUNCTION check_safra_encerrada()
// Table: nao_conformidades
//   trg_nao_conformidades_updated_at: CREATE TRIGGER trg_nao_conformidades_updated_at BEFORE UPDATE ON public.nao_conformidades FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: navios
//   trg_navios_updated_at: CREATE TRIGGER trg_navios_updated_at BEFORE UPDATE ON public.navios FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: operacoes_campo
//   trg_block_update_operacoes: CREATE TRIGGER trg_block_update_operacoes BEFORE INSERT OR DELETE OR UPDATE ON public.operacoes_campo FOR EACH ROW EXECUTE FUNCTION check_safra_encerrada()
//   trigger_conclusao_operacao: CREATE TRIGGER trigger_conclusao_operacao BEFORE UPDATE ON public.operacoes_campo FOR EACH ROW EXECUTE FUNCTION processa_conclusao_operacao()
//   trigger_operacoes_campo_updated_at: CREATE TRIGGER trigger_operacoes_campo_updated_at BEFORE UPDATE ON public.operacoes_campo FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: pallets
//   trg_generate_pallet_code: CREATE TRIGGER trg_generate_pallet_code BEFORE INSERT ON public.pallets FOR EACH ROW EXECUTE FUNCTION generate_pallet_code()
//   trg_recalculate_romaneio_totals: CREATE TRIGGER trg_recalculate_romaneio_totals AFTER INSERT OR DELETE OR UPDATE ON public.pallets FOR EACH ROW EXECUTE FUNCTION recalculate_romaneio_totals()
//   trg_update_balanco_massas_pallet: CREATE TRIGGER trg_update_balanco_massas_pallet AFTER INSERT OR UPDATE ON public.pallets FOR EACH ROW EXECUTE FUNCTION update_balanco_massas_on_pallet()
// Table: perdas_estufa
//   trg_atualizar_quantidade_viva_lote: CREATE TRIGGER trg_atualizar_quantidade_viva_lote AFTER INSERT OR DELETE OR UPDATE ON public.perdas_estufa FOR EACH ROW EXECUTE FUNCTION atualizar_quantidade_viva_lote()
//   trg_perdas_estufa_updated_at: CREATE TRIGGER trg_perdas_estufa_updated_at BEFORE UPDATE ON public.perdas_estufa FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: planos
//   trigger_planos_updated_at: CREATE TRIGGER trigger_planos_updated_at BEFORE UPDATE ON public.planos FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: portos
//   trg_portos_updated_at: CREATE TRIGGER trg_portos_updated_at BEFORE UPDATE ON public.portos FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: replantios
//   trg_atualizar_quantidade_replantio: CREATE TRIGGER trg_atualizar_quantidade_replantio AFTER INSERT OR DELETE OR UPDATE ON public.replantios FOR EACH ROW EXECUTE FUNCTION atualizar_quantidade_replantio_transplantio()
//   trg_check_replantio_transplantio_empresa: CREATE TRIGGER trg_check_replantio_transplantio_empresa BEFORE INSERT OR UPDATE ON public.replantios FOR EACH ROW EXECUTE FUNCTION check_replantio_transplantio_empresa()
//   trigger_contingency_stock_alert: CREATE TRIGGER trigger_contingency_stock_alert AFTER INSERT OR UPDATE ON public.replantios FOR EACH ROW EXECUTE FUNCTION check_contingency_stock_alert()
//   trigger_replantios_updated_at: CREATE TRIGGER trigger_replantios_updated_at BEFORE UPDATE ON public.replantios FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: requisicoes_internas
//   trigger_aprovar_requisicao_interna: CREATE TRIGGER trigger_aprovar_requisicao_interna BEFORE UPDATE ON public.requisicoes_internas FOR EACH ROW EXECUTE FUNCTION processa_aprovacao_requisicao_interna()
//   trigger_requisicoes_internas_updated_at: CREATE TRIGGER trigger_requisicoes_internas_updated_at BEFORE UPDATE ON public.requisicoes_internas FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: residuos
//   trg_residuos_updated_at: CREATE TRIGGER trg_residuos_updated_at BEFORE UPDATE ON public.residuos FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: rolagens_container
//   trigger_rolagens_container_updated_at: CREATE TRIGGER trigger_rolagens_container_updated_at BEFORE UPDATE ON public.rolagens_container FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: romaneios_venda
//   trg_generate_romaneio_number: CREATE TRIGGER trg_generate_romaneio_number BEFORE INSERT ON public.romaneios_venda FOR EACH ROW EXECUTE FUNCTION generate_romaneio_number()
// Table: safras
//   trg_block_update_safras: CREATE TRIGGER trg_block_update_safras BEFORE UPDATE ON public.safras FOR EACH ROW WHEN (((old.status)::text = 'encerrada'::text)) EXECUTE FUNCTION check_safra_encerrada()
//   trigger_encerrar_safra: CREATE TRIGGER trigger_encerrar_safra AFTER UPDATE ON public.safras FOR EACH ROW EXECUTE FUNCTION ao_encerrar_safra()
//   trigger_safras_updated_at: CREATE TRIGGER trigger_safras_updated_at BEFORE UPDATE ON public.safras FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: sessoes_carregamento
//   trg_saida_estoque_carregamento: CREATE TRIGGER trg_saida_estoque_carregamento AFTER UPDATE ON public.sessoes_carregamento FOR EACH ROW EXECUTE FUNCTION create_saida_estoque_on_carregamento()
//   trg_update_status_on_session_concluido: CREATE TRIGGER trg_update_status_on_session_concluido AFTER UPDATE ON public.sessoes_carregamento FOR EACH ROW EXECUTE FUNCTION update_status_on_session_concluido()
// Table: talhoes
//   trigger_talhoes_updated_at: CREATE TRIGGER trigger_talhoes_updated_at BEFORE UPDATE ON public.talhoes FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: transplantio_itens
//   trg_calcular_custo_total_item_transplantio: CREATE TRIGGER trg_calcular_custo_total_item_transplantio BEFORE INSERT OR UPDATE ON public.transplantio_itens FOR EACH ROW EXECUTE FUNCTION calcular_custo_total_item_transplantio()
// Table: transplantios
//   trg_atualizar_quantidade_viva_transplantio: CREATE TRIGGER trg_atualizar_quantidade_viva_transplantio AFTER INSERT OR DELETE OR UPDATE ON public.transplantios FOR EACH ROW EXECUTE FUNCTION atualizar_quantidade_viva_transplantio()
//   trg_calcular_custo_transferido: CREATE TRIGGER trg_calcular_custo_transferido BEFORE INSERT OR UPDATE ON public.transplantios FOR EACH ROW EXECUTE FUNCTION calcular_custo_transferido()
//   trg_transplantio_automations: CREATE TRIGGER trg_transplantio_automations AFTER INSERT OR UPDATE ON public.transplantios FOR EACH ROW EXECUTE FUNCTION transplantio_automations()
//   trg_transplantios_updated_at: CREATE TRIGGER trg_transplantios_updated_at BEFORE UPDATE ON public.transplantios FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: usuarios
//   trigger_usuarios_updated_at: CREATE TRIGGER trigger_usuarios_updated_at BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: vacaria_eventos_reprodutivos
//   trg_check_animal_vivo_reproducao: CREATE TRIGGER trg_check_animal_vivo_reproducao BEFORE INSERT OR UPDATE ON public.vacaria_eventos_reprodutivos FOR EACH ROW EXECUTE FUNCTION check_animal_vivo()
//   trg_vacaria_previsao_parto: CREATE TRIGGER trg_vacaria_previsao_parto BEFORE INSERT OR UPDATE ON public.vacaria_eventos_reprodutivos FOR EACH ROW EXECUTE FUNCTION vacaria_previsao_parto()
// Table: vacaria_producao_leite
//   trg_check_animal_vivo_producao: CREATE TRIGGER trg_check_animal_vivo_producao BEFORE INSERT OR UPDATE ON public.vacaria_producao_leite FOR EACH ROW EXECUTE FUNCTION check_animal_vivo()
//   trg_vacaria_queda_producao_alerta: CREATE TRIGGER trg_vacaria_queda_producao_alerta AFTER INSERT ON public.vacaria_producao_leite FOR EACH ROW EXECUTE FUNCTION vacaria_queda_producao_alerta()
// Table: vacaria_saude_animal
//   trg_check_animal_vivo_saude: CREATE TRIGGER trg_check_animal_vivo_saude BEFORE INSERT OR UPDATE ON public.vacaria_saude_animal FOR EACH ROW EXECUTE FUNCTION check_animal_vivo()
//   trg_vacaria_atualiza_peso: CREATE TRIGGER trg_vacaria_atualiza_peso AFTER INSERT OR UPDATE ON public.vacaria_saude_animal FOR EACH ROW EXECUTE FUNCTION vacaria_atualiza_peso()

// --- INDEXES ---
// Table: adiantamentos_internacionais
//   CREATE UNIQUE INDEX adiantamentos_internacionais_empresa_id_numero_adiantamento_key ON public.adiantamentos_internacionais USING btree (empresa_id, numero_adiantamento)
// Table: audit_logs
//   CREATE INDEX idx_audit_logs_empresa ON public.audit_logs USING btree (empresa_id)
// Table: balanco_massas
//   CREATE UNIQUE INDEX balanco_massas_safra_id_key ON public.balanco_massas USING btree (safra_id)
// Table: bookings
//   CREATE UNIQUE INDEX bookings_empresa_id_numero_booking_key ON public.bookings USING btree (empresa_id, numero_booking)
// Table: colheita_registros
//   CREATE UNIQUE INDEX idx_colheita_lote_producao_uniq ON public.colheita_registros USING btree (lote_producao) WHERE (lote_producao IS NOT NULL)
//   CREATE INDEX idx_colheita_safra_id ON public.colheita_registros USING btree (safra_id)
// Table: compras_requisicao
//   CREATE INDEX idx_compras_requisicao_status ON public.compras_requisicao USING btree (status) WHERE (deleted_at IS NULL)
// Table: cooperados_contratos
//   CREATE INDEX idx_coop_contratos_empresa ON public.cooperados_contratos USING btree (empresa_id)
// Table: culturas_fenologia
//   CREATE INDEX idx_culturas_fenologia_cultura_id ON public.culturas_fenologia USING btree (cultura_id) WHERE (deleted_at IS NULL)
// Table: custos_talhao
//   CREATE INDEX idx_custos_talhao_safra_id ON public.custos_talhao USING btree (safra_id)
// Table: empresas
//   CREATE UNIQUE INDEX empresas_cnpj_key ON public.empresas USING btree (cnpj)
//   CREATE UNIQUE INDEX empresas_slug_key ON public.empresas USING btree (slug)
//   CREATE INDEX idx_empresas_slug ON public.empresas USING btree (slug) WHERE (deleted_at IS NULL)
// Table: financeiro_lancamentos
//   CREATE INDEX idx_financeiro_lancamentos_invoice_id ON public.financeiro_lancamentos USING btree (invoice_id)
// Table: frota_veiculos
//   CREATE UNIQUE INDEX frota_veiculos_empresa_id_placa_key ON public.frota_veiculos USING btree (empresa_id, placa)
// Table: graus_dia
//   CREATE UNIQUE INDEX graus_dia_safra_id_data_key ON public.graus_dia USING btree (safra_id, data)
// Table: invoices_exportacao
//   CREATE UNIQUE INDEX invoices_exportacao_empresa_id_numero_invoice_key ON public.invoices_exportacao USING btree (empresa_id, numero_invoice)
// Table: lotes_estoque
//   CREATE INDEX idx_lotes_estoque_armazem ON public.lotes_estoque USING btree (armazem_id) WHERE (deleted_at IS NULL)
//   CREATE INDEX idx_lotes_estoque_produto ON public.lotes_estoque USING btree (produto_id) WHERE (deleted_at IS NULL)
// Table: operacoes_campo
//   CREATE INDEX idx_operacoes_safra ON public.operacoes_campo USING btree (safra_id) WHERE (deleted_at IS NULL)
//   CREATE INDEX idx_operacoes_status ON public.operacoes_campo USING btree (status) WHERE (deleted_at IS NULL)
// Table: packing_recepcoes
//   CREATE INDEX idx_packing_recepcoes_status ON public.packing_recepcoes USING btree (status)
// Table: pallets
//   CREATE UNIQUE INDEX pallets_codigo_pallet_key ON public.pallets USING btree (codigo_pallet)
// Table: patrimonio_bens
//   CREATE UNIQUE INDEX patrimonio_bens_empresa_id_codigo_qr_key ON public.patrimonio_bens USING btree (empresa_id, codigo_qr)
// Table: planos
//   CREATE UNIQUE INDEX planos_nome_key ON public.planos USING btree (nome)
// Table: portal_tokens
//   CREATE UNIQUE INDEX portal_tokens_token_key ON public.portal_tokens USING btree (token)
// Table: replantios
//   CREATE INDEX idx_replantios_empresa ON public.replantios USING btree (empresa_id)
//   CREATE INDEX idx_replantios_talhao ON public.replantios USING btree (talhao_id)
//   CREATE INDEX idx_replantios_transplantio ON public.replantios USING btree (transplantio_id)
// Table: romaneios_venda
//   CREATE UNIQUE INDEX romaneios_venda_empresa_id_numero_romaneio_key ON public.romaneios_venda USING btree (empresa_id, numero_romaneio)
// Table: safra_talhoes
//   CREATE UNIQUE INDEX safra_talhoes_safra_id_talhao_id_key ON public.safra_talhoes USING btree (safra_id, talhao_id)
// Table: safras
//   CREATE INDEX idx_safras_status ON public.safras USING btree (status) WHERE (deleted_at IS NULL)
//   CREATE INDEX idx_safras_status_deleted_at ON public.safras USING btree (status, deleted_at)
//   CREATE INDEX idx_safras_talhao ON public.safras USING btree (talhao_id) WHERE (deleted_at IS NULL)
//   CREATE UNIQUE INDEX safras_empresa_fazenda_cultivar_ano_idx ON public.safras USING btree (empresa_id, fazenda_id, cultivar_id, ano_safra) WHERE ((fazenda_id IS NOT NULL) AND (ano_safra IS NOT NULL))
// Table: usuarios
//   CREATE INDEX idx_usuarios_empresa ON public.usuarios USING btree (empresa_id) WHERE (deleted_at IS NULL)
// Table: vacaria_animais
//   CREATE INDEX idx_vacaria_animais_empresa ON public.vacaria_animais USING btree (empresa_id)
// Table: vacaria_eventos_reprodutivos
//   CREATE INDEX idx_vacaria_eventos_animal ON public.vacaria_eventos_reprodutivos USING btree (animal_id)
// Table: vacaria_producao_leite
//   CREATE INDEX idx_vacaria_producao_animal ON public.vacaria_producao_leite USING btree (animal_id)
// Table: vacaria_saude_animal
//   CREATE INDEX idx_vacaria_saude_animal ON public.vacaria_saude_animal USING btree (animal_id)
