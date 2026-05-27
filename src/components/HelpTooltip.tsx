import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function HelpTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-muted-foreground cursor-pointer inline-block ml-1 align-text-bottom" />
      </TooltipTrigger>
      <TooltipContent className="max-w-[250px] z-50">
        <p className="text-sm font-normal leading-relaxed">{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}
