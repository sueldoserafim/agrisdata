import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cloud, Droplets, Wind, CloudRain, Sun } from 'lucide-react'

export function WeatherWidget({
  latitude,
  longitude,
}: {
  latitude?: number | null
  longitude?: number | null
}) {
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!latitude || !longitude) {
      setLoading(false)
      return
    }

    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`,
        )
        const data = await res.json()
        setWeather(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [latitude, longitude])

  if (!latitude || !longitude) {
    return (
      <Card className="shadow-subtle border-none h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-500" /> Clima Local
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center p-6 text-muted-foreground h-[120px]">
            <p>Configure as coordenadas da fazenda para ver os dados climáticos em tempo real.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading)
    return <Card className="shadow-subtle border-none h-[220px] animate-pulse bg-muted/20" />

  if (!weather) return null

  return (
    <Card className="shadow-subtle border-none h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-500" /> Clima e Planejamento
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col md:flex-row gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-xl">
            <Sun className="w-6 h-6 text-yellow-500 mb-1" />
            <span className="text-2xl font-bold">{weather.current?.temperature_2m}°C</span>
            <span className="text-xs text-muted-foreground">Temperatura</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-xl">
            <Droplets className="w-6 h-6 text-blue-400 mb-1" />
            <span className="text-2xl font-bold">{weather.current?.relative_humidity_2m}%</span>
            <span className="text-xs text-muted-foreground">Umidade</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-xl">
            <Wind className="w-6 h-6 text-slate-400 mb-1" />
            <span className="text-2xl font-bold">{weather.current?.wind_speed_10m} km/h</span>
            <span className="text-xs text-muted-foreground">Vento</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-xl">
            <CloudRain className="w-6 h-6 text-indigo-400 mb-1" />
            <span className="text-2xl font-bold">
              {weather.current?.precipitation_probability}%
            </span>
            <span className="text-xs text-muted-foreground">Chuva (Prob.)</span>
          </div>
        </div>

        <div className="w-full md:w-[350px]">
          <h4 className="text-sm font-semibold mb-3">Previsão 5 Dias (Manejo)</h4>
          <div className="grid grid-cols-5 gap-2">
            {weather.daily?.time?.slice(1, 6).map((time: string, i: number) => {
              const date = new Date(time + 'T12:00:00')
              const day = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
              const prob = weather.daily.precipitation_probability_max[i + 1]
              return (
                <div
                  key={time}
                  className="flex flex-col items-center text-center py-2 px-1 rounded-lg bg-background border shadow-sm"
                >
                  <span className="text-[10px] font-bold uppercase mb-1">{day}</span>
                  <div className="flex items-center gap-1 text-[10px] text-indigo-500 font-semibold mb-1">
                    <CloudRain className="w-3 h-3" /> {prob}%
                  </div>
                  <div className="text-xs font-bold text-foreground">
                    {weather.daily.temperature_2m_max[i + 1]}°
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {weather.daily.temperature_2m_min[i + 1]}°
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
