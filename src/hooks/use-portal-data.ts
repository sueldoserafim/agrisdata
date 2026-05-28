import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export function usePortalData(token: string) {
  const [data, setData] = useState<any>(null)
  const [info, setInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      if (!token) {
        setError('Token não fornecido')
        setLoading(false)
        return
      }

      try {
        const { data: result, error: rpcError } = await supabase.rpc('get_portal_data', {
          p_token: token
        })

        if (rpcError) throw rpcError

        if (!result.success) {
          throw new Error(result.error || 'Erro ao carregar dados do portal')
        }

        setInfo(result.tokenInfo)
        setData(result.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token])

  return { data, info, loading, error }
}
