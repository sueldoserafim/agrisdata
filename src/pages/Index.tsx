import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { KPICards } from '@/components/dashboard/KPICards'
import { OverviewChart } from '@/components/dashboard/OverviewChart'
import { DiagnosisChart } from '@/components/dashboard/DiagnosisChart'
import { ScheduleTimeline } from '@/components/dashboard/ScheduleTimeline'
import { LatestVisits } from '@/components/dashboard/LatestVisits'
import { CheckCircle2, Stethoscope, Users, Activity } from 'lucide-react'

export default function Index() {
  return (
    <div className="space-y-6 pb-10">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none p-0 h-auto space-x-6">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 font-semibold"
          >
            <Activity className="size-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 text-muted-foreground"
          >
            <CheckCircle2 className="size-4 mr-2" />
            Medical Reports
          </TabsTrigger>
          <TabsTrigger
            value="patients"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 text-muted-foreground"
          >
            <Users className="size-4 mr-2" />
            Patients Overview
          </TabsTrigger>
          <TabsTrigger
            value="diagnose"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-3 text-muted-foreground"
          >
            <Stethoscope className="size-4 mr-2" />
            Diagnose
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6 animate-fade-in-up">
          <KPICards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <OverviewChart />
            <DiagnosisChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ScheduleTimeline />
            <LatestVisits />
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="p-8 text-center text-muted-foreground bg-white rounded-2xl shadow-subtle">
            Medical Reports content will appear here.
          </div>
        </TabsContent>

        <TabsContent value="patients" className="mt-6">
          <div className="p-8 text-center text-muted-foreground bg-white rounded-2xl shadow-subtle">
            Detailed Patients Overview content will appear here.
          </div>
        </TabsContent>

        <TabsContent value="diagnose" className="mt-6">
          <div className="p-8 text-center text-muted-foreground bg-white rounded-2xl shadow-subtle">
            Diagnose tools and metrics will appear here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
