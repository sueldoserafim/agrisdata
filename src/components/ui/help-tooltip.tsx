import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function HelpTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 text-muted-foreground ml-1 inline-block cursor-help align-text-bottom" />
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs text-sm">
        {text}
      </TooltipContent>
    </Tooltip>
  )
}
