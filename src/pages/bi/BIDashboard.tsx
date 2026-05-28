import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProductionBI from './ProductionBI'
import LogisticsBI from './LogisticsBI'
import FinanceBI from './FinanceBI'
import QualityBI from './QualityBI'
import EsgBI from './EsgBI'
import PredictiveBI from './PredictiveBI'

export default function BIDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Advanced BI & Predictive Analytics</h1>
        <p className="text-muted-foreground mt-1">Data-driven decisions for all operations.</p>
      </div>

      <Tabs defaultValue="production" className="w-full">
        <TabsList className="mb-4 flex flex-wrap gap-2 h-auto bg-card">
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="logistics">Export & Logistics</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="quality">Quality & Shelf Life</TabsTrigger>
          <TabsTrigger value="esg">Carbon & ESG</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Models</TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="mt-4">
          <ProductionBI />
        </TabsContent>
        <TabsContent value="logistics" className="mt-4">
          <LogisticsBI />
        </TabsContent>
        <TabsContent value="finance" className="mt-4">
          <FinanceBI />
        </TabsContent>
        <TabsContent value="quality" className="mt-4">
          <QualityBI />
        </TabsContent>
        <TabsContent value="esg" className="mt-4">
          <EsgBI />
        </TabsContent>
        <TabsContent value="predictive" className="mt-4">
          <PredictiveBI />
        </TabsContent>
      </Tabs>
    </div>
  )
}
