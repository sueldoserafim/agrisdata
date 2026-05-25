import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { HelpCircle, Info } from 'lucide-react'

export function TalhaoInstructionsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Ajuda</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Guia de Preenchimento
          </SheetTitle>
          <SheetDescription>
            Siga as instruções detalhadas abaixo para garantir o cadastro correto do talhão.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 text-sm">
          <div>
            <h4 className="font-medium text-foreground mb-1">Dados Gerais</h4>
            <p className="text-muted-foreground">
              O <strong>Código do Talhão</strong> deve ser único dentro da fazenda selecionada. Ele
              é utilizado para evitar conflitos de identificação em relatórios e integrações.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">Dimensões</h4>
            <p className="text-muted-foreground">
              A <strong>Área Plantável</strong> não pode exceder a <strong>Área Total (ha)</strong>.
              Preencha esses campos corretamente (valores decimais são suportados e encorajados para
              maior precisão), pois são a base para os cálculos de estimativa de produtividade e
              insumos.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">Irrigação</h4>
            <p className="text-muted-foreground">
              Se a opção <strong>Tem Irrigação</strong> estiver ativa, é obrigatório especificar o{' '}
              <strong>Tipo de Irrigação</strong> utilizado no talhão (exemplo: Gotejamento, Pivô
              Central, Aspersão).
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">Coordenadas</h4>
            <p className="text-muted-foreground">
              As coordenadas geográficas devem ser informadas no formato decimal. A{' '}
              <strong>Latitude</strong> deve possuir um valor entre -90 e 90, e a{' '}
              <strong>Longitude</strong> entre -180 e 180.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">Certificações</h4>
            <p className="text-muted-foreground">
              O <strong>Número GLOBALG.A.P.</strong> e a <strong>Referência CAR</strong> (Cadastro
              Ambiental Rural) são essenciais para manter o compliance agrícola, auditorias e
              facilitar processos de exportação.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
