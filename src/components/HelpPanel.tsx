import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet'
import { HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HelpPanelProps {
  title: string
  children: React.ReactNode
}

export function HelpPanel({ title, children }: HelpPanelProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary transition-colors duration-200"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>Como funciona este módulo</SheetDescription>
        </SheetHeader>
        <div className="mt-6 text-sm text-foreground/80 space-y-4">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
