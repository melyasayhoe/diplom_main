import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Users, Scissors, Star, TrendingUp, Clock } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

  if (!adminUser) {
    redirect("/auth/login")
  }

  // Get statistics
  const { count: totalBookings } = await supabase.from("bookings").select("*", { count: "exact", head: true })

  const { count: todayBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("booking_date", new Date().toISOString().split("T")[0])
    .in("status", ["pending", "confirmed"])

  const { count: pendingBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: totalMasters } = await supabase
    .from("masters")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  const { count: totalServices } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  const { count: pendingReviews } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("is_approved", false)

  // Get recent bookings
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select(
      `
      *,
      master:masters(name),
      service:services(name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(5)

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-rose-600">Панель администратора</h1>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  На сайт
                </Button>
              </Link>
              <form action={handleSignOut}>
                <Button variant="outline" size="sm" type="submit">
                  Выйти
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Записей сегодня</CardTitle>
              <Calendar className="w-4 h-4 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{todayBookings || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Подтвержденных и ожидающих</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ожидают подтверждения</CardTitle>
              <Clock className="w-4 h-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingBookings || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Новых записей</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Всего записей</CardTitle>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalBookings || 0}</div>
              <p className="text-xs text-gray-500 mt-1">За все время</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Активных мастеров</CardTitle>
              <Users className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalMasters || 0}</div>
              <Link href="/admin/masters" className="text-xs text-rose-600 hover:underline mt-1 inline-block">
                Управление мастерами
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Активных услуг</CardTitle>
              <Scissors className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalServices || 0}</div>
              <Link href="/admin/services" className="text-xs text-rose-600 hover:underline mt-1 inline-block">
                Управление услугами
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Отзывов на модерации</CardTitle>
              <Star className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingReviews || 0}</div>
              <Link href="/admin/reviews" className="text-xs text-rose-600 hover:underline mt-1 inline-block">
                Модерация отзывов
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/admin/bookings">
                <Button className="w-full bg-rose-600 hover:bg-rose-700">Управление записями</Button>
              </Link>
              <Link href="/admin/masters">
                <Button variant="outline" className="w-full bg-transparent">
                  Мастера
                </Button>
              </Link>
              <Link href="/admin/services">
                <Button variant="outline" className="w-full bg-transparent">
                  Услуги
                </Button>
              </Link>
              <Link href="/admin/reviews">
                <Button variant="outline" className="w-full bg-transparent">
                  Отзывы
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Последние записи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings && recentBookings.length > 0 ? (
                recentBookings.map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">{booking.client_name}</p>
                      <p className="text-sm text-gray-600">
                        {booking.master?.name} - {booking.service?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.booking_date).toLocaleDateString("ru-RU")} в{" "}
                        {booking.booking_time.slice(0, 5)}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status === "pending"
                          ? "Ожидает"
                          : booking.status === "confirmed"
                            ? "Подтверждена"
                            : booking.status === "completed"
                              ? "Завершена"
                              : "Отменена"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">Нет записей</p>
              )}
            </div>
            {recentBookings && recentBookings.length > 0 && (
              <div className="mt-4 text-center">
                <Link href="/admin/bookings">
                  <Button variant="outline">Посмотреть все записи</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
