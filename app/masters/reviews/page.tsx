import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function MasterReviewsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: master } = await supabase
    .from("masters")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!master) redirect("/")

  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      client:clients(name)
    `)
    .eq("master_id", user.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/master/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600">
              <ArrowLeft className="w-4 h-4" />
              Личный кабинет
            </Link>
            <h1 className="text-xl font-bold">Отзывы о вас</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Отзывы</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews && reviews.length > 0 ? (
              reviews.map((r: any) => (
                <div key={r.id} className="p-4 bg-white border rounded-lg mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{r.client?.name || r.client_name}</p>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < r.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{r.comment}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(r.created_at).toLocaleDateString("ru-RU")}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">У вас пока нет отзывов</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}