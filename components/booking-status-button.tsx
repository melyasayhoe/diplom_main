"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface BookingStatusButtonProps {
  bookingId: string
  currentStatus: string
}

export function BookingStatusButton({ bookingId, currentStatus }: BookingStatusButtonProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", bookingId)

      if (error) throw error

      setStatus(newStatus)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating booking status:", error)
      alert("Ошибка при обновлении статуса")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isLoading}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Ожидает</SelectItem>
        <SelectItem value="confirmed">Подтверждена</SelectItem>
        <SelectItem value="completed">Завершена</SelectItem>
        <SelectItem value="cancelled">Отменена</SelectItem>
      </SelectContent>
    </Select>
  )
}
