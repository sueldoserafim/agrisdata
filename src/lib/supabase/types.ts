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
      clientes: {
        Row: {
          cnpj_cpf: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          empresa_id: string
          id: string
          nome: string
          pais: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cnpj_cpf?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          empresa_id: string
          id?: string
          nome: string
          pais?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cnpj_cpf?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          pais?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'clientes_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
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
      containers: {
        Row: {
          created_at: string
          cut_off: string | null
          data_embarque: string | null
          deleted_at: string | null
          destino: string | null
          empresa_id: string
          id: string
          numero_container: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cut_off?: string | null
          data_embarque?: string | null
          deleted_at?: string | null
          destino?: string | null
          empresa_id: string
          id?: string
          numero_container: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cut_off?: string | null
          data_embarque?: string | null
          deleted_at?: string | null
          destino?: string | null
          empresa_id?: string
          id?: string
          numero_container?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'containers_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
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
          created_at: string
          data_vencimento: string | null
          deleted_at: string | null
          descricao: string
          empresa_id: string
          id: string
          status: string | null
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          created_at?: string
          data_vencimento?: string | null
          deleted_at?: string | null
          descricao: string
          empresa_id: string
          id?: string
          status?: string | null
          tipo: string
          updated_at?: string
          valor: number
        }
        Update: {
          created_at?: string
          data_vencimento?: string | null
          deleted_at?: string | null
          descricao?: string
          empresa_id?: string
          id?: string
          status?: string | null
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: 'financeiro_lancamentos_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      fornecedores: {
        Row: {
          cnpj: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
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
          email?: string | null
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
          email?: string | null
          empresa_id?: string
          id?: string
          nome?: string
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
          colheita_id: string
          created_at: string | null
          data_recepcao: string
          deleted_at: string | null
          empresa_id: string
          id: string
          quantidade_ton: number
          safra_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          colheita_id: string
          created_at?: string | null
          data_recepcao?: string
          deleted_at?: string | null
          empresa_id: string
          id?: string
          quantidade_ton: number
          safra_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          colheita_id?: string
          created_at?: string | null
          data_recepcao?: string
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          quantidade_ton?: number
          safra_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'packing_recepcoes_colheita_id_fkey'
            columns: ['colheita_id']
            isOneToOne: false
            referencedRelation: 'colheita_registros'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'packing_recepcoes_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
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
          codigo: string
          conformidade_percentual: number | null
          created_at: string
          deleted_at: string | null
          destino: string | null
          empresa_id: string
          id: string
          peso_kg: number | null
          safra_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          codigo: string
          conformidade_percentual?: number | null
          created_at?: string
          deleted_at?: string | null
          destino?: string | null
          empresa_id: string
          id?: string
          peso_kg?: number | null
          safra_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          codigo?: string
          conformidade_percentual?: number | null
          created_at?: string
          deleted_at?: string | null
          destino?: string | null
          empresa_id?: string
          id?: string
          peso_kg?: number | null
          safra_id?: string | null
          status?: string | null
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
            foreignKeyName: 'pallets_safra_id_fkey'
            columns: ['safra_id']
            isOneToOne: false
            referencedRelation: 'safras'
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
      vendedores: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          email: string | null
          empresa_id: string
          id: string
          nome: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          empresa_id: string
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vendedores_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gerar_alertas_fenologia: {
        Args: { p_empresa_id: string }
        Returns: undefined
      }
      get_user_empresa_id: { Args: never; Returns: string }
      get_user_perfil: { Args: never; Returns: string }
      is_admin_saas: { Args: never; Returns: boolean }
      verificar_carencia_safra: {
        Args: { p_data_colheita: string; p_safra_id: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
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
//   colheita_id: uuid (not null)
//   safra_id: uuid (not null)
//   quantidade_ton: numeric (not null)
//   data_recepcao: timestamp with time zone (not null, default: now())
//   status: text (nullable, default: 'pendente'::text)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)
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
// Table: vendedores
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome: character varying (not null)
//   email: character varying (nullable)
//   telefone: character varying (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   deleted_at: timestamp with time zone (nullable)

// --- CONSTRAINTS ---
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
// Table: clientes
//   FOREIGN KEY clientes_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY clientes_pkey: PRIMARY KEY (id)
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
// Table: containers
//   FOREIGN KEY containers_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY containers_pkey: PRIMARY KEY (id)
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
// Table: empresas
//   UNIQUE empresas_cnpj_key: UNIQUE (cnpj)
//   PRIMARY KEY empresas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY empresas_plano_id_fkey: FOREIGN KEY (plano_id) REFERENCES planos(id)
//   UNIQUE empresas_slug_key: UNIQUE (slug)
// Table: equipamentos
//   FOREIGN KEY equipamentos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY equipamentos_pkey: PRIMARY KEY (id)
// Table: estoque_movimento
//   FOREIGN KEY estoque_movimento_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY estoque_movimento_lote_id_fkey: FOREIGN KEY (lote_id) REFERENCES lotes_estoque(id) ON DELETE CASCADE
//   PRIMARY KEY estoque_movimento_pkey: PRIMARY KEY (id)
// Table: fazendas
//   FOREIGN KEY fazendas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY fazendas_pkey: PRIMARY KEY (id)
// Table: financeiro_lancamentos
//   FOREIGN KEY financeiro_lancamentos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY financeiro_lancamentos_pkey: PRIMARY KEY (id)
// Table: fornecedores
//   FOREIGN KEY fornecedores_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY fornecedores_pkey: PRIMARY KEY (id)
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
// Table: lotes_estoque
//   FOREIGN KEY lotes_estoque_armazem_id_fkey: FOREIGN KEY (armazem_id) REFERENCES armazens(id) ON DELETE CASCADE
//   FOREIGN KEY lotes_estoque_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY lotes_estoque_pkey: PRIMARY KEY (id)
//   FOREIGN KEY lotes_estoque_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
// Table: monitoramento_pragas
//   FOREIGN KEY monitoramento_pragas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY monitoramento_pragas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY monitoramento_pragas_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id) ON DELETE SET NULL
//   FOREIGN KEY monitoramento_pragas_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE CASCADE
//   FOREIGN KEY monitoramento_pragas_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE CASCADE
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
//   FOREIGN KEY packing_recepcoes_colheita_id_fkey: FOREIGN KEY (colheita_id) REFERENCES colheita_registros(id) ON DELETE CASCADE
//   FOREIGN KEY packing_recepcoes_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY packing_recepcoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY packing_recepcoes_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE CASCADE
// Table: pallets
//   FOREIGN KEY pallets_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY pallets_pkey: PRIMARY KEY (id)
//   FOREIGN KEY pallets_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE SET NULL
// Table: planejamento_safra
//   FOREIGN KEY planejamento_safra_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY planejamento_safra_pkey: PRIMARY KEY (id)
//   FOREIGN KEY planejamento_safra_responsavel_id_fkey: FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
//   FOREIGN KEY planejamento_safra_safra_id_fkey: FOREIGN KEY (safra_id) REFERENCES safras(id) ON DELETE CASCADE
// Table: planos
//   UNIQUE planos_nome_key: UNIQUE (nome)
//   PRIMARY KEY planos_pkey: PRIMARY KEY (id)
// Table: pluviometria
//   FOREIGN KEY pluviometria_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY pluviometria_pkey: PRIMARY KEY (id)
//   FOREIGN KEY pluviometria_talhao_id_fkey: FOREIGN KEY (talhao_id) REFERENCES talhoes(id) ON DELETE CASCADE
// Table: produtos
//   FOREIGN KEY produtos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY produtos_pkey: PRIMARY KEY (id)
// Table: receituarios_agronomicos
//   FOREIGN KEY receituarios_agronomicos_cultura_id_fkey: FOREIGN KEY (cultura_id) REFERENCES culturas(id)
//   FOREIGN KEY receituarios_agronomicos_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY receituarios_agronomicos_pkey: PRIMARY KEY (id)
// Table: requisicoes_internas
//   FOREIGN KEY requisicoes_internas_aprovador_id_fkey: FOREIGN KEY (aprovador_id) REFERENCES usuarios(id) ON DELETE SET NULL
//   FOREIGN KEY requisicoes_internas_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY requisicoes_internas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY requisicoes_internas_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
//   CHECK requisicoes_internas_quantidade_check: CHECK ((quantidade > (0)::numeric))
//   FOREIGN KEY requisicoes_internas_solicitante_id_fkey: FOREIGN KEY (solicitante_id) REFERENCES usuarios(id) ON DELETE SET NULL
//   CHECK requisicoes_internas_status_check: CHECK (((status)::text = ANY ((ARRAY['pendente'::character varying, 'aprovado'::character varying, 'recusado'::character varying])::text[])))
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
// Table: transportadoras
//   FOREIGN KEY transportadoras_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY transportadoras_pkey: PRIMARY KEY (id)
// Table: user_2fa_codes
//   PRIMARY KEY user_2fa_codes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY user_2fa_codes_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
// Table: usuarios
//   FOREIGN KEY usuarios_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY usuarios_fornecedor_id_fkey: FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE SET NULL
//   PRIMARY KEY usuarios_pkey: PRIMARY KEY (id)
// Table: vendedores
//   FOREIGN KEY vendedores_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY vendedores_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
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
// Table: caderno_campo
//   Policy "caderno_campo_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: carregamentos
//   Policy "carregamentos_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: centros_custo
//   Policy "centros_custo_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
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
// Table: containers
//   Policy "containers_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
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
// Table: empresas
//   Policy "empresas_admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin_saas()
//   Policy "empresas_admin_saas" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin_saas()
//   Policy "empresas_read" (SELECT, PERMISSIVE) roles={public}
//     USING: (deleted_at IS NULL)
// Table: equipamentos
//   Policy "equipamentos_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: estoque_movimento
//   Policy "estoque_movimento_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
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
// Table: funcionarios
//   Policy "funcionarios_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: graus_dia
//   Policy "graus_dia_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: historico_produtividade_talhao
//   Policy "historico_produtividade_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: lotes_estoque
//   Policy "lotes_estoque_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: monitoramento_pragas
//   Policy "monitoramento_pragas_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
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
// Table: planejamento_safra
//   Policy "planejamento_safra_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
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
// Table: produtos
//   Policy "produtos_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: receituarios_agronomicos
//   Policy "receituarios_empresa" (ALL, PERMISSIVE) roles={public}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
// Table: requisicoes_internas
//   Policy "requisicoes_internas_empresa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
//     WITH CHECK: (empresa_id = ( SELECT usuarios.empresa_id    FROM usuarios   WHERE (usuarios.id = auth.uid())))
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
// FUNCTION set_atualizado_em()
//   CREATE OR REPLACE FUNCTION public.set_atualizado_em()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     NEW.updated_at = NOW();
//     RETURN NEW;
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
//   trigger_check_limite_orcamentario: CREATE TRIGGER trigger_check_limite_orcamentario AFTER INSERT OR UPDATE ON public.custos_talhao FOR EACH ROW EXECUTE FUNCTION check_limite_orcamentario()
// Table: empresas
//   trigger_empresas_updated_at: CREATE TRIGGER trigger_empresas_updated_at BEFORE UPDATE ON public.empresas FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: fazendas
//   trigger_fazendas_updated_at: CREATE TRIGGER trigger_fazendas_updated_at BEFORE UPDATE ON public.fazendas FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: lotes_estoque
//   trg_audit_lotes_estoque: CREATE TRIGGER trg_audit_lotes_estoque AFTER UPDATE ON public.lotes_estoque FOR EACH ROW EXECUTE FUNCTION audit_lotes_estoque_updates()
//   trigger_check_estoque_critico: CREATE TRIGGER trigger_check_estoque_critico AFTER INSERT OR DELETE OR UPDATE ON public.lotes_estoque FOR EACH ROW EXECUTE FUNCTION check_estoque_critico()
// Table: monitoramento_pragas
//   trg_block_update_monitoramento: CREATE TRIGGER trg_block_update_monitoramento BEFORE INSERT OR DELETE OR UPDATE ON public.monitoramento_pragas FOR EACH ROW EXECUTE FUNCTION check_safra_encerrada()
// Table: operacoes_campo
//   trg_block_update_operacoes: CREATE TRIGGER trg_block_update_operacoes BEFORE INSERT OR DELETE OR UPDATE ON public.operacoes_campo FOR EACH ROW EXECUTE FUNCTION check_safra_encerrada()
//   trigger_conclusao_operacao: CREATE TRIGGER trigger_conclusao_operacao BEFORE UPDATE ON public.operacoes_campo FOR EACH ROW EXECUTE FUNCTION processa_conclusao_operacao()
//   trigger_operacoes_campo_updated_at: CREATE TRIGGER trigger_operacoes_campo_updated_at BEFORE UPDATE ON public.operacoes_campo FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: pallets
//   trg_update_balanco_massas_pallet: CREATE TRIGGER trg_update_balanco_massas_pallet AFTER INSERT OR UPDATE ON public.pallets FOR EACH ROW EXECUTE FUNCTION update_balanco_massas_on_pallet()
// Table: planos
//   trigger_planos_updated_at: CREATE TRIGGER trigger_planos_updated_at BEFORE UPDATE ON public.planos FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: requisicoes_internas
//   trigger_aprovar_requisicao_interna: CREATE TRIGGER trigger_aprovar_requisicao_interna BEFORE UPDATE ON public.requisicoes_internas FOR EACH ROW EXECUTE FUNCTION processa_aprovacao_requisicao_interna()
//   trigger_requisicoes_internas_updated_at: CREATE TRIGGER trigger_requisicoes_internas_updated_at BEFORE UPDATE ON public.requisicoes_internas FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: safras
//   trg_block_update_safras: CREATE TRIGGER trg_block_update_safras BEFORE UPDATE ON public.safras FOR EACH ROW WHEN (((old.status)::text = 'encerrada'::text)) EXECUTE FUNCTION check_safra_encerrada()
//   trigger_encerrar_safra: CREATE TRIGGER trigger_encerrar_safra AFTER UPDATE ON public.safras FOR EACH ROW EXECUTE FUNCTION ao_encerrar_safra()
//   trigger_safras_updated_at: CREATE TRIGGER trigger_safras_updated_at BEFORE UPDATE ON public.safras FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: talhoes
//   trigger_talhoes_updated_at: CREATE TRIGGER trigger_talhoes_updated_at BEFORE UPDATE ON public.talhoes FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()
// Table: usuarios
//   trigger_usuarios_updated_at: CREATE TRIGGER trigger_usuarios_updated_at BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION set_atualizado_em()

// --- INDEXES ---
// Table: audit_logs
//   CREATE INDEX idx_audit_logs_empresa ON public.audit_logs USING btree (empresa_id)
// Table: balanco_massas
//   CREATE UNIQUE INDEX balanco_massas_safra_id_key ON public.balanco_massas USING btree (safra_id)
// Table: colheita_registros
//   CREATE UNIQUE INDEX idx_colheita_lote_producao_uniq ON public.colheita_registros USING btree (lote_producao) WHERE (lote_producao IS NOT NULL)
//   CREATE INDEX idx_colheita_safra_id ON public.colheita_registros USING btree (safra_id)
// Table: compras_requisicao
//   CREATE INDEX idx_compras_requisicao_status ON public.compras_requisicao USING btree (status) WHERE (deleted_at IS NULL)
// Table: culturas_fenologia
//   CREATE INDEX idx_culturas_fenologia_cultura_id ON public.culturas_fenologia USING btree (cultura_id) WHERE (deleted_at IS NULL)
// Table: custos_talhao
//   CREATE INDEX idx_custos_talhao_safra_id ON public.custos_talhao USING btree (safra_id)
// Table: empresas
//   CREATE UNIQUE INDEX empresas_cnpj_key ON public.empresas USING btree (cnpj)
//   CREATE UNIQUE INDEX empresas_slug_key ON public.empresas USING btree (slug)
//   CREATE INDEX idx_empresas_slug ON public.empresas USING btree (slug) WHERE (deleted_at IS NULL)
// Table: graus_dia
//   CREATE UNIQUE INDEX graus_dia_safra_id_data_key ON public.graus_dia USING btree (safra_id, data)
// Table: lotes_estoque
//   CREATE INDEX idx_lotes_estoque_armazem ON public.lotes_estoque USING btree (armazem_id) WHERE (deleted_at IS NULL)
//   CREATE INDEX idx_lotes_estoque_produto ON public.lotes_estoque USING btree (produto_id) WHERE (deleted_at IS NULL)
// Table: operacoes_campo
//   CREATE INDEX idx_operacoes_safra ON public.operacoes_campo USING btree (safra_id) WHERE (deleted_at IS NULL)
//   CREATE INDEX idx_operacoes_status ON public.operacoes_campo USING btree (status) WHERE (deleted_at IS NULL)
// Table: packing_recepcoes
//   CREATE INDEX idx_packing_recepcoes_status ON public.packing_recepcoes USING btree (status)
// Table: planos
//   CREATE UNIQUE INDEX planos_nome_key ON public.planos USING btree (nome)
// Table: safra_talhoes
//   CREATE UNIQUE INDEX safra_talhoes_safra_id_talhao_id_key ON public.safra_talhoes USING btree (safra_id, talhao_id)
// Table: safras
//   CREATE INDEX idx_safras_status ON public.safras USING btree (status) WHERE (deleted_at IS NULL)
//   CREATE INDEX idx_safras_status_deleted_at ON public.safras USING btree (status, deleted_at)
//   CREATE INDEX idx_safras_talhao ON public.safras USING btree (talhao_id) WHERE (deleted_at IS NULL)
//   CREATE UNIQUE INDEX safras_empresa_fazenda_cultivar_ano_idx ON public.safras USING btree (empresa_id, fazenda_id, cultivar_id, ano_safra) WHERE ((fazenda_id IS NOT NULL) AND (ano_safra IS NOT NULL))
// Table: usuarios
//   CREATE INDEX idx_usuarios_empresa ON public.usuarios USING btree (empresa_id) WHERE (deleted_at IS NULL)
