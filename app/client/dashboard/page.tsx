import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Clock, User, MessageSquare } from "lucide-react"
import { revalidatePath } from "next/cache"

export const dynamic = 'force-dynamic'

async function cancelBooking(formData: FormData) {
  "use server"
  const bookingId = formData.get("bookingId") as string
  const supabase = await createClient()
  
  await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("client_id", (await supabase.auth.getUser()).data.user?.id)
  
  revalidatePath("/client/dashboard")
}

export default async function ClientDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login?redirect=/client/dashboard")
  }

  // ✅ Исправлено: получаем профиль
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  // ✅ Если профиля нет, создаём его
  if (!profile) {
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      name: user.email?.split('@')[0] || 'Клиент',
      role: 'client'
    })
    
    if (error) {
      // Если ошибка "duplicate key", значит профиль всё-таки есть, но мы его не получили
      if (error.code === '23505') {
        // Просто продолжаем, ничего не делаем
        console.log('Профиль уже существует')
      } else {
        console.error("Ошибка создания профиля:", error)
        redirect("/")
      }
    }
  }

  // Загружаем все записи клиента
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      master:masters(name, specialty),
      service:services(name, price, duration_minutes)
    `)
    .eq("client_id", user.id)
    .order("booking_date", { ascending: false })
    .order("booking_time", { ascending: false })

  // Разделяем на активные и завершённые
  const activeBookings = bookings?.filter(b => 
    b.status === "pending" || b.status === "confirmed"
  ) || []
  
  const completedBookings = bookings?.filter(b => 
    b.status === "completed" || b.status === "cancelled"
  ) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-rose-600">Личный кабинет</h1>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline">На сайт</Button>
              </Link>
              <Link href="/client/profile">
                <Button variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  Профиль
                </Button>
              </Link>
              <form action="/auth/logout" method="post">
                <Button variant="outline">Выйти</Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Активные записи</CardTitle>
              <Calendar className="w-4 h-4 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeBookings.length}</div>
              <p className="text-xs text-gray-500 mt-1">Ожидают или подтверждены</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Завершённые записи</CardTitle>
              <Clock className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedBookings.length}</div>
              <p className="text-xs text-gray-500 mt-1">Выполненные или отменённые</p>
            </CardContent>
          </Card>
        </div>

        {/* Активные записи */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Активные записи</CardTitle>
          </CardHeader>
          <CardContent>
            {activeBookings.length > 0 ? (
              activeBookings.map((b: any) => (
                <div key={b.id} className="p-4 bg-white border rounded-lg mb-3">
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="font-semibold">{b.master?.name}</p>
                      <p className="text-sm text-gray-600">{b.master?.specialty}</p>
                      <p className="text-sm font-medium">{b.service?.name}</p>
                      <p className="text-sm text-rose-600">{b.service?.price} ₽</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Дата и время</p>
                      <p className="font-medium">{new Date(b.booking_date).toLocaleDateString("ru-RU")}</p>
                      <p className="font-medium">{b.booking_time.slice(0, 5)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Статус</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        b.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
                      }`}>
                        {b.status === "pending" ? "Ожидает" : "Подтверждена"}
                      </span>
                    </div>
                    <div>
                      {b.status === "pending" || b.status === "confirmed" ? (
                        <form action={cancelBooking}>
                          <input type="hidden" name="bookingId" value={b.id} />
                          <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                            Отменить
                          </Button>
                        </form>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">У вас нет активных записей</p>
            )}
          </CardContent>
        </Card>

        {/* Завершённые записи */}
        <Card>
          <CardHeader>
            <CardTitle>Завершённые записи</CardTitle>
          </CardHeader>
          <CardContent>
            {completedBookings.length > 0 ? (
              completedBookings.map((b: any) => (
                <div key={b.id} className="p-4 bg-white border rounded-lg mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{b.master?.name}</p>
                    <p className="text-sm text-gray-600">{b.service?.name}</p>
                    <p className="text-sm text-gray-500">{new Date(b.booking_date).toLocaleDateString("ru-RU")}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      b.status === "completed" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {b.status === "completed" ? "Выполнена" : "Отменена"}
                    </span>
                  </div>
                  {b.status === "completed" && (
                    <Link href={`/reviews/new?bookingId=${b.id}`}>
                      <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Оставить отзыв
                      </Button>
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">У вас нет завершённых записей</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}