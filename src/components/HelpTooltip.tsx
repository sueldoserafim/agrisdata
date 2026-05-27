import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

export function HelpTooltip({ content }: { content: string }) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger
          type="button"
          className="cursor-help ml-1.5 inline-flex items-center text-muted-foreground/70 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-full"
        >
          <HelpCircle className="size-4" />
          <span className="sr-only">Ajuda: {content}</span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[280px] text-sm leading-relaxed z-50 p-3 shadow-md border-border">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
