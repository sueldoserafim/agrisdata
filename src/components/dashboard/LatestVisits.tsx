import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const visits = [
  {
    id: 1,
    name: 'Esther Howard',
    specialty: 'Dermatology',
    time: '8:44',
    day: 'Today',
    seed: 12,
    gender: 'female',
  },
  {
    id: 2,
    name: 'Eleanor Pena',
    specialty: 'Gastroenterology',
    time: '8:54',
    day: 'Today',
    seed: 15,
    gender: 'female',
  },
  {
    id: 3,
    name: 'Brooklyn Simmons',
    specialty: 'Ophthalmology',
    time: '7:39',
    day: 'Today',
    seed: 18,
    gender: 'male',
  },
  {
    id: 4,
    name: 'Wade Warren',
    specialty: 'Cardiology',
    time: '16:02',
    day: 'Yesterday',
    seed: 20,
    gender: 'male',
  },
]

export function LatestVisits() {
  return (
    <Card className="shadow-subtle border-none rounded-2xl flex flex-col">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-lg font-semibold">Latest Visits</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-1">
        <div className="space-y-6">
          {visits.map((visit) => (
            <div key={visit.id} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <Avatar className="size-10 border border-border shadow-sm group-hover:scale-105 transition-transform">
                  <AvatarImage
                    src={`https://img.usecurling.com/ppl/thumbnail?gender=${visit.gender}&seed=${visit.seed}`}
                  />
                  <AvatarFallback>{visit.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {visit.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{visit.specialty}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{visit.day}</p>
                <p className="text-sm font-medium mt-0.5">{visit.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
