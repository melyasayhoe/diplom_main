import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, ArrowLeft } from "lucide-react"

export default async function ServicesPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("category", { ascending: true })

  // Group services by category
  const servicesByCategory: Record<string, typeof services> = {}
  services?.forEach((service) => {
    if (!servicesByCategory[service.category]) {
      servicesByCategory[service.category] = []
    }
    servicesByCategory[service.category].push(service)
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        <h1 className="text-4xl font-bold mb-4">Наши услуги</h1>
        <p className="text-gray-600 mb-8">
          Полный спектр парикмахерских услуг с использованием профессиональной косметики
        </p>

        <div className="space-y-12">
          {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-6 text-rose-600">{category}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {categoryServices.map((service) => (
                  <Card key={service.id} className="hover:shadow-xl transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-xl flex-1">{service.name}</h3>
                        <span className="font-bold text-2xl text-rose-600 ml-4">{service.price} ₽</span>
                      </div>

                      {service.description && (
                        <p className="text-gray-700 mb-4 leading-relaxed">{service.description}</p>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b">
                        <Clock className="w-4 h-4" />
                        <span>Длительность: {service.duration_minutes} минут</span>
                      </div>

                      <Link href={`/booking?service=${service.id}`}>
                        <Button className="w-full bg-rose-600 hover:bg-rose-700">Записаться</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-rose-50 border-rose-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">Не нашли нужную услугу?</h3>
              <p className="text-gray-700 mb-4">Свяжитесь с нами, и мы подберем индивидуальное решение для вас</p>
              <Link href="/booking">
                <Button className="bg-rose-600 hover:bg-rose-700">Связаться с нами</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
