-- Seed Admin User
DO $$
DECLARE
  new_user_id uuid;
  default_empresa_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sueldo@suportesigma.com') THEN
    new_user_id := gen_random_uuid();
    
    SELECT id INTO default_empresa_id FROM public.empresas LIMIT 1;
    IF default_empresa_id IS NULL THEN
      default_empresa_id := gen_random_uuid();
      INSERT INTO public.empresas (id, nome, slug, ativo) VALUES (default_empresa_id, 'Empresa Padrão', 'empresa-padrao', true);
    END IF;

    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'sueldo@suportesigma.com',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin Sueldo"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.usuarios (id, empresa_id, email, nome, perfil, ativo)
    VALUES (new_user_id, default_empresa_id, 'sueldo@suportesigma.com', 'Administrador Sueldo', 'admin', true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Add new columns to Vendedores
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS cpf_cnpj TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS rg TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS data_nascimento DATE;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS foto_url TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS tipo_mercado TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS tipo_vinculo TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS telefone_secundario TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS email_corporativo TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS email_pessoal TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS comissao_interna NUMERIC;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS comissao_exportacao NUMERIC;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS comissao_fixa NUMERIC;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS meta_mensal NUMERIC;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS moeda_padrao TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS frequencia_pagamento TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS regioes_atuacao TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS paises_atuacao TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS banco_nome TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS banco_codigo TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS agencia TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS agencia_digito TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS conta TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS conta_digito TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS tipo_conta TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS chave_pix_tipo TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS chave_pix TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS conta_principal BOOLEAN DEFAULT true;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS conta_ativa BOOLEAN DEFAULT true;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS supervisor_id UUID REFERENCES public.vendedores(id);
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS nivel_autonomia TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS acesso_crm BOOLEAN DEFAULT false;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS data_contratacao DATE;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS data_desligamento DATE;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ativo';
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS idiomas TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS experiencia_anos INTEGER;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS cep TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS logradouro TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS numero TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS complemento TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS bairro TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS cidade TEXT;
ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS estado TEXT;

-- Add new columns to Clientes
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS nome_fantasia TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS tipo_cliente TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS tipo_pessoa TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS indicador_ie TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS inscricao_estadual TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS inscricao_municipal TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS vendedor_id UUID REFERENCES public.vendedores(id);
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS limite_credito NUMERIC;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS acesso_portal BOOLEAN DEFAULT false;

-- Add cliente_id to usuarios
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL;

-- Create Auxiliary Tables
CREATE TABLE IF NOT EXISTS public.enderecos_entidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  entidade_id UUID NOT NULL,
  entidade_tipo TEXT NOT NULL,
  tipo_endereco TEXT NOT NULL,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  pais TEXT,
  receiver TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contatos_entidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  entidade_id UUID NOT NULL,
  entidade_tipo TEXT NOT NULL,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  cargo TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contas_bancarias_entidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  entidade_id UUID NOT NULL,
  entidade_tipo TEXT NOT NULL,
  banco_nome TEXT,
  banco_codigo TEXT,
  agencia TEXT,
  conta TEXT,
  tipo_conta TEXT,
  swift TEXT,
  iban TEXT,
  chave_pix_tipo TEXT,
  chave_pix TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.documentos_entidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  entidade_id UUID NOT NULL,
  entidade_tipo TEXT NOT NULL,
  tipo_documento TEXT,
  numero_documento TEXT,
  titulo TEXT NOT NULL,
  arquivo_url TEXT,
  data_emissao DATE,
  data_validade DATE,
  gerar_alerta BOOLEAN DEFAULT false,
  dias_antecedencia_alerta INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.enderecos_entidade ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "enderecos_entidade_empresa" ON public.enderecos_entidade;
CREATE POLICY "enderecos_entidade_empresa" ON public.enderecos_entidade FOR ALL TO authenticated
USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

ALTER TABLE public.contatos_entidade ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contatos_entidade_empresa" ON public.contatos_entidade;
CREATE POLICY "contatos_entidade_empresa" ON public.contatos_entidade FOR ALL TO authenticated
USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

ALTER TABLE public.contas_bancarias_entidade ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contas_bancarias_entidade_empresa" ON public.contas_bancarias_entidade;
CREATE POLICY "contas_bancarias_entidade_empresa" ON public.contas_bancarias_entidade FOR ALL TO authenticated
USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

ALTER TABLE public.documentos_entidade ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "documentos_entidade_empresa" ON public.documentos_entidade;
CREATE POLICY "documentos_entidade_empresa" ON public.documentos_entidade FOR ALL TO authenticated
USING (empresa_id = public.get_user_empresa_id()) WITH CHECK (empresa_id = public.get_user_empresa_id());

-- Triggers
CREATE OR REPLACE FUNCTION public.check_documentos_entidade_vencimento()
RETURNS TRIGGER AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  IF NEW.gerar_alerta = true AND NEW.data_validade IS NOT NULL AND NEW.dias_antecedencia_alerta IS NOT NULL THEN
    IF (NEW.data_validade - CURRENT_DATE) <= NEW.dias_antecedencia_alerta AND (NEW.data_validade - CURRENT_DATE) >= 0 THEN
      FOR v_admin_id IN SELECT id FROM public.usuarios WHERE empresa_id = NEW.empresa_id AND perfil IN ('admin', 'gerente') AND ativo = true LOOP
        INSERT INTO public.alertas (empresa_id, usuario_id, titulo, descricao, tipo, lido)
        VALUES (
          NEW.empresa_id, 
          v_admin_id, 
          'Vencimento de Documento: ' || NEW.titulo, 
          'O documento ' || NEW.titulo || ' vence em ' || TO_CHAR(NEW.data_validade, 'DD/MM/YYYY') || '.', 
          'documento_vencimento', 
          false
        );
      END LOOP;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_documentos_entidade_vencimento ON public.documentos_entidade;
CREATE TRIGGER trg_check_documentos_entidade_vencimento
AFTER INSERT OR UPDATE ON public.documentos_entidade
FOR EACH ROW
EXECUTE FUNCTION public.check_documentos_entidade_vencimento();

-- Storage Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('documentos', 'documentos', true) ON CONFLICT (id) DO NOTHING;
