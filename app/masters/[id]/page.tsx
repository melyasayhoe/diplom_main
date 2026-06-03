import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Star } from "lucide-react"

export default async function MasterDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { id } = await params

  // 1. Загружаем данные мастера
  const { data: master, error } = await supabase
    .from("masters")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !master) {
    notFound() // Показывает страницу 404, если мастер не найден
  }

  // 2. Загружаем услуги, которые предоставляет этот мастер
  const { data: services } = await supabase
    .from("master_services")
    .select(`
      service:services(id, name, description, duration_minutes, price, category)
    `)
    .eq("master_id", id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link href="/masters" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Назад к мастерам
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Левая колонка: информация о мастере */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-rose-200 to-rose-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl text-white font-bold">
                    {master.name.charAt(0)}
                  </span>
                </div>
                <h1 className="text-2xl font-bold">{master.name}</h1>
                <p className="text-rose-600 font-semibold">{master.specialty}</p>
                <div className="flex justify-center items-center gap-1 mt-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{master.rating}</span>
                  <span className="text-sm text-gray-500">({master.total_reviews})</span>
                </div>
                <p className="text-sm text-gray-600 mt-4">{master.bio}</p>
                <p className="text-sm text-gray-500 mt-2">Опыт: {master.experience_years} лет</p>
              </CardContent>
            </Card>
          </div>

          {/* Правая колонка: список услуг */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Услуги мастера</h2>
            <div className="space-y-4">
              {services && services.length > 0 ? (
                services.map((item: any) => (
                  <Card key={item.service.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{item.service.name}</h3>
                          <p className="text-gray-600 text-sm">{item.service.description}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.service.duration_minutes} мин
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-rose-600">{item.service.price} ₽</p>
                          <Link href={`/booking?master=${master.id}&service=${item.service.id}`}>
                            <Button size="sm" className="mt-2 bg-rose-600 hover:bg-rose-700">
                              Записаться
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  У этого мастера пока нет услуг.
                </p>
              )}
            </div>

            <div className="mt-8 text-center">
              <Link href="/booking">
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                  Записаться онлайн
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}