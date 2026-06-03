import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Star, Clock } from "lucide-react"

export default async function MasterDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // ✅ Заменяем .single() на .maybeSingle()
  const { data: master } = await supabase
    .from("masters")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  if (!master) redirect("/")

  // Статистика
  const { count: activeBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("master_id", user.id)
    .in("status", ["pending", "confirmed"])

  const { count: reviewsCount } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("master_id", user.id)
    .eq("is_approved", true)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-rose-600">Личный кабинет мастера</h1>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline">На сайт</Button>
              </Link>
              <form action="/auth/logout" method="post">
                <Button variant="outline">Выйти</Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Активные записи</CardTitle>
              <Calendar className="w-4 h-4 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeBookings || 0}</div>
              <Link href="/master/bookings" className="text-xs text-rose-600 hover:underline mt-1 inline-block">
                Посмотреть записи
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Отзывы</CardTitle>
              <Star className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{reviewsCount || 0}</div>
              <Link href="/master/reviews" className="text-xs text-rose-600 hover:underline mt-1 inline-block">
                Посмотреть отзывы
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Рабочие часы</CardTitle>
              <Clock className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <Link href="/master/working-hours" className="text-xs text-rose-600 hover:underline mt-1 inline-block">
                Управлять часами
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}