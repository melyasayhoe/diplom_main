import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, ArrowLeft, Clock } from "lucide-react"
import { notFound } from "next/navigation"

export default async function MasterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch master details
  const { data: master } = await supabase.from("masters").select("*").eq("id", id).eq("is_active", true).single()

  if (!master) {
    notFound()
  }

  // Fetch master's services
  const { data: masterServices } = await supabase
    .from("master_services")
    .select(
      `
      service:services(*)
    `,
    )
    .eq("master_id", id)

  const services = masterServices?.map((ms: any) => ms.service) || []

  // Fetch reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("master_id", id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/masters" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Все мастера
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Master Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="pt-6">
                <div className="w-40 h-40 bg-gradient-to-br from-rose-200 to-rose-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-6xl text-white font-bold">{master.name.charAt(0)}</span>
                </div>
                <h1 className="font-bold text-2xl text-center mb-2">{master.name}</h1>
                <p className="text-center text-gray-600 mb-4">{master.specialty}</p>

                <div className="flex items-center justify-center gap-2 mb-6 pb-6 border-b">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-2xl">{master.rating}</span>
                  <span className="text-gray-500">({master.total_reviews})</span>
                </div>

                {master.experience_years && (
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600">Опыт работы</p>
                    <p className="font-bold text-lg">{master.experience_years} лет</p>
                  </div>
                )}

                <Link href={`/booking?master=${master.id}`}>
                  <Button className="w-full bg-rose-600 hover:bg-rose-700">Записаться к мастеру</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {master.bio && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-3">О мастере</h2>
                  <p className="text-gray-700 leading-relaxed">{master.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Услуги</h2>
                <div className="space-y-3">
                  {services.map((service: any) => (
                    <div key={service.id} className="flex items-center justify-between p-4 bg-rose-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {service.duration_minutes} минут
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-xl text-rose-600">{service.price} ₽</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {reviews && reviews.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Отзывы клиентов</h2>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="pb-4 border-b last:border-b-0">
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-2 italic">"{review.comment}"</p>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm">{review.client_name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString("ru-RU")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
