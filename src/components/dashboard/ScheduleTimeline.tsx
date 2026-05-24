import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

const appointments = [
  {
    id: 1,
    title: 'Pre-op Consultation',
    startHour: 1.5, // Relative to 08:00
    width: 2,
    count: 2,
    avatars: [1, 2],
    top: 20,
  },
  {
    id: 2,
    title: 'Blood Pressure Follow-up',
    startHour: 3.5,
    width: 2.5,
    count: 4,
    avatars: [3, 4, 5],
    top: 80,
  },
  {
    id: 3,
    title: 'Migraine Evaluation',
    startHour: 6,
    width: 2,
    count: 6,
    avatars: [6, 7, 8],
    isWarning: true,
    top: 50,
  },
]

export function ScheduleTimeline() {
  return (
    <Card className="shadow-subtle border-none rounded-2xl col-span-1 lg:col-span-2 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
        <CardTitle className="text-lg font-semibold">Today Schedule</CardTitle>
        <Select defaultValue="today">
          <SelectTrigger className="w-[180px] h-9 rounded-full border-muted bg-muted/30">
            <SelectValue placeholder="Select Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">September 11, 2024</SelectItem>
            <SelectItem value="tomorrow">September 12, 2024</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative w-full overflow-x-auto pb-4">
          <div className="min-w-[700px] relative h-[140px] mt-6">
            {/* Grid lines and time labels */}
            <div className="flex justify-between absolute inset-0 z-0 text-xs text-muted-foreground font-medium">
              {hours.map((hour, i) => (
                <div key={hour} className="flex flex-col items-center w-0">
                  <span className="-ml-6 mb-4">{hour}</span>
                  <div className="h-full border-l border-dashed border-border opacity-50" />
                </div>
              ))}
            </div>

            {/* Current time indicator */}
            <div
              className="absolute top-8 bottom-0 z-10 border-l-2 border-primary"
              style={{ left: '48%' }}
            >
              <div className="absolute -top-1 -left-1.5 size-3 rounded-full bg-primary" />
            </div>

            {/* Appointments */}
            <div className="absolute top-12 left-0 right-0 h-full z-20">
              {appointments.map((apt) => (
                <Tooltip key={apt.id}>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute h-10 bg-white shadow-sm border border-border/50 rounded-full flex items-center p-1 px-2 cursor-pointer hover:shadow-md transition-shadow"
                      style={{
                        left: `${(apt.startHour / 8) * 100}%`,
                        width: `${(apt.width / 8) * 100}%`,
                        top: `${apt.top}px`,
                      }}
                    >
                      <div className="flex -space-x-2 mr-3">
                        {apt.avatars.map((seed, i) => (
                          <Avatar key={i} className="size-7 border-2 border-white">
                            <AvatarImage
                              src={`https://img.usecurling.com/ppl/thumbnail?seed=${seed}`}
                            />
                          </Avatar>
                        ))}
                        <div
                          className={`size-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white z-10 ${apt.isWarning ? 'bg-warning' : 'bg-primary'}`}
                        >
                          +{apt.count}
                        </div>
                      </div>
                      <span className="text-sm font-medium truncate">{apt.title}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{apt.title}</p>
                    <p className="text-xs text-muted-foreground">{apt.count} patients waiting</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
