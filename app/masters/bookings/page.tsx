import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function MasterBookingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: master } = await supabase
    .from("masters")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!master) redirect("/")

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      service:services(name, price)
    `)
    .eq("master_id", user.id)
    .in("status", ["pending", "confirmed"])
    .order("booking_date", { ascending: true })
    .order("booking_time", { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/master/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600">
              <ArrowLeft className="w-4 h-4" />
              Личный кабинет
            </Link>
            <h1 className="text-xl font-bold">Активные записи</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Активные записи</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings && bookings.length > 0 ? (
              bookings.map((b: any) => (
                <div key={b.id} className="p-4 bg-white border rounded-lg mb-3">
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="font-semibold">{b.client_name}</p>
                      <p className="text-sm text-gray-600">{b.client_phone}</p>
                      <p className="text-sm text-gray-600">{b.client_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Услуга</p>
                      <p className="font-medium">{b.service?.name}</p>
                      <p className="text-sm text-rose-600">{b.service?.price} ₽</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Дата и время</p>
                      <p className="font-medium">{new Date(b.booking_date).toLocaleDateString("ru-RU")}</p>
                      <p className="font-medium">{b.booking_time.slice(0, 5)}</p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        b.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
                      }`}>
                        {b.status === "pending" ? "Ожидает" : "Подтверждена"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Нет активных записей</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}