import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, ArrowLeft } from "lucide-react"

export default async function ReviewsPage() {
  const supabase = await createClient()

  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      *,
      master:masters(name, specialty)
    `,
    )
    .eq("is_approved", true)
    .order("created_at", { ascending: false })

  // Calculate average rating
  const avgRating =
    reviews && reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0.0"

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        <h1 className="text-4xl font-bold mb-4">Отзывы клиентов</h1>
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-bold">{avgRating}</span>
          </div>
          <p className="text-gray-600">на основе {reviews?.length || 0} отзывов</p>
        </div>

        <div className="mb-8">
          <Link href="/reviews/new">
            <Button className="bg-rose-600 hover:bg-rose-700">Оставить отзыв</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews && reviews.length > 0 ? (
            reviews.map((review: any) => (
              <Card key={review.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic leading-relaxed">"{review.comment}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold mb-1">{review.client_name}</p>
                    <p className="text-sm text-gray-600 mb-1">Мастер: {review.master?.name}</p>
                    <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString("ru-RU")}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 mb-4">Пока нет отзывов. Будьте первым!</p>
              <Link href="/reviews/new">
                <Button className="bg-rose-600 hover:bg-rose-700">Оставить первый отзыв</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
