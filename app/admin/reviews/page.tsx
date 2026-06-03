import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Star } from "lucide-react"
import { ReviewApprovalButton } from "@/components/review-approval-button"

export default async function AdminReviewsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get all reviews (pending and approved)
  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      *,
      master:masters(name, specialty)
    `,
    )
    .order("created_at", { ascending: false })

  const pendingReviews = reviews?.filter((r) => !r.is_approved) || []
  const approvedReviews = reviews?.filter((r) => r.is_approved) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600">
              <ArrowLeft className="w-4 h-4" />
              Панель управления
            </Link>
            <h1 className="text-xl font-bold">Управление отзывами</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Ожидают модерации ({pendingReviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingReviews.length > 0 ? (
              <div className="space-y-4">
                {pendingReviews.map((review: any) => (
                  <div key={review.id} className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="font-semibold mb-1">{review.client_name}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          Мастер: {review.master?.name} ({review.master?.specialty})
                        </p>
                        <p className="text-gray-700 italic">"{review.comment}"</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(review.created_at).toLocaleDateString("ru-RU")}
                        </p>
                      </div>
                      <div className="ml-4">
                        <ReviewApprovalButton reviewId={review.id} isApproved={review.is_approved} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Нет отзывов на модерации</p>
            )}
          </CardContent>
        </Card>

        {/* Approved Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Опубликованные отзывы ({approvedReviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {approvedReviews.length > 0 ? (
              <div className="space-y-4">
                {approvedReviews.map((review: any) => (
                  <div key={review.id} className="p-4 bg-white border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="font-semibold mb-1">{review.client_name}</p>
                        <p className="text-sm text-gray-600 mb-2">Мастер: {review.master?.name}</p>
                        <p className="text-gray-700 italic">"{review.comment}"</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(review.created_at).toLocaleDateString("ru-RU")}
                        </p>
                      </div>
                      <div className="ml-4">
                        <ReviewApprovalButton reviewId={review.id} isApproved={review.is_approved} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Нет опубликованных отзывов</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
