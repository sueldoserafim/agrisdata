import { Lock } from 'lucide-react'
import { useEmpresa } from '@/hooks/use-empresa'

export default function SemAcesso() {
  const { empresa } = useEmpresa()

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Lock className="w-16 h-16 text-red-500" />
      <h1 className="text-2xl font-bold">Este módulo não está disponível no seu plano</h1>
      <p className="text-gray-600">Plano atual: {empresa?.plano_nome || 'Nenhum'}</p>
      <button className="px-4 py-2 bg-blue-500 text-white rounded">Falar com suporte</button>
    </div>
  )
}
