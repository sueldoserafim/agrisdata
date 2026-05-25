import { HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function TalhaoInstructionsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="size-4" />
          Ajuda
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Guia de Preenchimento</SheetTitle>
          <SheetDescription>Instruções sobre como preencher os dados do talhão.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 text-sm">
          <div>
            <h4 className="font-semibold text-foreground">Geral</h4>
            <p className="text-muted-foreground mt-1">
              Selecione a fazenda e insira o nome do talhão e seu código interno.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Dimensões</h4>
            <p className="text-muted-foreground mt-1">
              Informe a área total e a área plantável. A área plantável não pode exceder a área
              total disponível do talhão.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Localização e Solo</h4>
            <p className="text-muted-foreground mt-1">
              Forneça as coordenadas geográficas, o tipo predominante de solo e a declividade. Estes
              dados auxiliam diretamente no planejamento do plantio e das operações.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
