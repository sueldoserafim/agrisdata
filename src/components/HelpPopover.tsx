import { HelpCircle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

export function HelpPopover({ title, content }: { title?: string; content: ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="size-5 rounded-full ml-1.5 text-muted-foreground/70 hover:text-foreground hover:bg-muted/50"
        >
          <HelpCircle className="size-4" />
          <span className="sr-only">Informações detalhadas sobre {title || 'este campo'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 z-50 text-sm leading-relaxed p-4 shadow-md"
        side="top"
        align="start"
      >
        {title && <h4 className="font-semibold mb-2 text-foreground">{title}</h4>}
        <div className="text-muted-foreground/90 space-y-2">{content}</div>
      </PopoverContent>
    </Popover>
  )
}
