import { useParams } from 'react-router-dom'
import ProdutorPortal from './ProdutorPortal'
import ClientePortal from './ClientePortal'
import FornecedorPortal from './FornecedorPortal'
import DespachantePortal from './DespachantePortal'

export default function PortalApp() {
  const { tipo } = useParams<{ tipo: string }>()

  switch (tipo) {
    case 'produtor':
      return <ProdutorPortal />
    case 'cliente':
      return <ClientePortal />
    case 'fornecedor':
      return <FornecedorPortal />
    case 'despachante':
      return <DespachantePortal />
    default:
      return (
        <div className="text-center p-12 text-slate-500">
          <h2 className="text-xl font-bold mb-2">Portal Inválido</h2>
          <p>O tipo de portal solicitado não existe.</p>
        </div>
      )
  }
}
