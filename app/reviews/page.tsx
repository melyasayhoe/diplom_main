import { getYandexReviews } from "@/lib/yandex"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ReviewsPage() {
  const reviews = await getYandexReviews()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Отзывы наших клиентов</h1>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Не удалось загрузить отзывы. Проверьте подключение к API Яндекс.Карт.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review: any, index: number) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
                  <div className="border-t pt-3">
                    <p className="font-semibold">{review.authorName || "Аноним"}</p>
                    <p className="text-sm text-gray-600">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString("ru-RU") : ""}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}