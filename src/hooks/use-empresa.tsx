import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

interface EmpresaContextType {
  empresa: {
    id: string
    nome: string
    cnpj: string | null
    plano_id: string | null
    plano_nome: string | null
  } | null
  usuario: { id: string; nome: string | null; email: string; perfil: string | null } | null
  modulosHabilitados: string[]
  temModulo: (modulo: string | null) => boolean
  recarregarEmpresa: () => Promise<void>
  loading: boolean
}

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined)

export const useEmpresa = () => {
  const context = useContext(EmpresaContext)
  if (!context) {
    throw new Error('useEmpresa deve ser usado dentro de EmpresaProvider')
  }
  return context
}

const CORE_MODULES = ['dashboard', 'profile', 'support', 'settings']
const FALLBACK_MODULES = ['dashboard', 'caderno_campo']

export const EmpresaProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [empresa, setEmpresa] = useState<EmpresaContextType['empresa']>(null)
  const [usuario, setUsuario] = useState<EmpresaContextType['usuario']>(null)
  const [modulosHabilitados, setModulosHabilitados] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const carregarDados = useCallback(async () => {
    if (!user) {
      setEmpresa(null)
      setUsuario(null)
      setModulosHabilitados([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('id, nome, email, perfil, empresa_id')
        .eq('id', user.id)
        .single()

      if (userError || !userData) {
        console.error('Erro ao carregar usuário:', userError)
        setLoading(false)
        return
      }

      setUsuario({
        id: userData.id,
        nome: userData.nome,
        email: userData.email,
        perfil: userData.perfil,
      })

      if (userData.empresa_id) {
        const { data: empresaData, error: empresaError } = await supabase
          .from('empresas')
          .select('id, nome, cnpj, plano_id, modulos_habilitados, planos(nome)')
          .eq('id', userData.empresa_id)
          .single()

        if (empresaError || !empresaData) {
          console.error('Erro ao carregar empresa:', empresaError)
        } else {
          setEmpresa({
            id: empresaData.id,
            nome: empresaData.nome,
            cnpj: empresaData.cnpj,
            plano_id: empresaData.plano_id,
            plano_nome: (empresaData.planos as any)?.nome || null,
          })

          let modulos = empresaData.modulos_habilitados || []
          if (modulos.length === 0) {
            modulos = FALLBACK_MODULES
          }
          setModulosHabilitados(modulos)
        }
      }
    } catch (error) {
      console.error('Erro inesperado ao carregar contexto de empresa:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const temModulo = useCallback(
    (modulo: string | null) => {
      if (!modulo) return true
      if (CORE_MODULES.includes(modulo)) return true
      return modulosHabilitados.includes(modulo)
    },
    [modulosHabilitados],
  )

  const recarregarEmpresa = async () => {
    await carregarDados()
  }

  return (
    <EmpresaContext.Provider
      value={{ empresa, usuario, modulosHabilitados, temModulo, recarregarEmpresa, loading }}
    >
      {children}
    </EmpresaContext.Provider>
  )
}
