"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"

interface ReviewApprovalButtonProps {
  reviewId: string
  isApproved: boolean
}

export function ReviewApprovalButton({ reviewId, isApproved }: ReviewApprovalButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("reviews").update({ is_approved: true }).eq("id", reviewId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("[v0] Error approving review:", error)
      alert("Ошибка при одобрении отзыва")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    if (!confirm("Вы уверены, что хотите удалить этот отзыв?")) {
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("[v0] Error deleting review:", error)
      alert("Ошибка при удалении отзыва")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnapprove = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("reviews").update({ is_approved: false }).eq("id", reviewId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("[v0] Error unapproving review:", error)
      alert("Ошибка при снятии публикации отзыва")
    } finally {
      setIsLoading(false)
    }
  }

  if (isApproved) {
    return (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={handleUnapprove} disabled={isLoading}>
          Снять публикацию
        </Button>
        <Button size="sm" variant="destructive" onClick={handleReject} disabled={isLoading}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleApprove} disabled={isLoading}>
        <Check className="w-4 h-4 mr-1" />
        Одобрить
      </Button>
      <Button size="sm" variant="destructive" onClick={handleReject} disabled={isLoading}>
        <X className="w-4 h-4 mr-1" />
        Отклонить
      </Button>
    </div>
  )
}
