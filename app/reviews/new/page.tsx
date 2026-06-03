"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewReviewPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [selectedBookingId, setSelectedBookingId] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login?redirect=/reviews/new")
        return
      }
      setUser(user)
      loadBookings(user.id)
    }
    checkAuth()
  }, [])

  const loadBookings = async (userId: string) => {
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select(`
        *,
        master:masters(name),
        service:services(name)
      `)
      .eq("client_id", userId)
      .eq("status", "completed")
      .order("booking_date", { ascending: false })
    setBookings(bookingsData || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBookingId) return
    setLoading(true)

    const selectedBooking = bookings.find(b => b.id === selectedBookingId)

    const { error } = await supabase.from("reviews").insert({
      booking_id: selectedBookingId,
      master_id: selectedBooking?.master_id,
      client_id: user.id,
      client_name: selectedBooking?.client_name || "Клиент",
      rating,
      comment,
      is_approved: false
    })

    if (error) {
      alert("Ошибка при создании отзыва: " + error.message)
    } else {
      alert("Отзыв отправлен на модерацию!")
      router.push("/")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Оставить отзыв</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-gray-600">У вас нет завершённых записей, на которые можно оставить отзыв.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Выберите запись</Label>
                  <Select value={selectedBookingId} onValueChange={setSelectedBookingId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите запись" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookings.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.master?.name} — {b.service?.name} ({new Date(b.booking_date).toLocaleDateString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Оценка</Label>
                  <Select value={rating.toString()} onValueChange={(v) => setRating(Number(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Оценка" />
                    </SelectTrigger>
                    <SelectContent>
                      {[5,4,3,2,1].map((r) => (
                        <SelectItem key={r} value={r.toString()}>{r} ★</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Комментарий</Label>
                  <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700">
                  {loading ? "Отправка..." : "Отправить отзыв"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}