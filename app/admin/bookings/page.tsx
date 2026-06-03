import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BookingStatusButton } from "@/components/booking-status-button"

export default async function AdminBookingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      `
      *,
      master:masters(name),
      service:services(name, price)
    `,
    )
    .order("booking_date", { ascending: false })
    .order("booking_time", { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600">
              <ArrowLeft className="w-4 h-4" />
              Панель управления
            </Link>
            <h1 className="text-xl font-bold">Управление записями</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Все записи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookings && bookings.length > 0 ? (
                bookings.map((booking: any) => (
                  <div key={booking.id} className="p-4 bg-white border rounded-lg">
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      <div>
                        <p className="font-semibold">{booking.client_name}</p>
                        <p className="text-sm text-gray-600">{booking.client_phone}</p>
                        <p className="text-sm text-gray-600">{booking.client_email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Мастер</p>
                        <p className="font-medium">{booking.master?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Услуга</p>
                        <p className="font-medium">{booking.service?.name}</p>
                        <p className="text-sm text-rose-600">{booking.service?.price} ₽</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Дата и время</p>
                        <p className="font-medium">{new Date(booking.booking_date).toLocaleDateString("ru-RU")}</p>
                        <p className="font-medium">{booking.booking_time.slice(0, 5)}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <BookingStatusButton bookingId={booking.id} currentStatus={booking.status} />
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600">Комментарий:</p>
                        <p className="text-sm">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Нет записей</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
