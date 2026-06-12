"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"

interface YandexRatingProps {
  oid: string
}

interface RatingData {
  rating: number
  reviews: number
}

export function YandexRating({ oid }: YandexRatingProps) {
  const [data, setData] = useState<RatingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(
          `https://api-maps.yandex.ru/2.1/companies/?oid=${oid}&lang=ru_RU&format=json`
        )
        const json = await response.json()
        const props = json?.properties
        if (props) {
          setData({
            rating: props.rating || 0,
            reviews: props.reviews || 0,
          })
        }
      } catch (error) {
        console.error("Ошибка получения рейтинга:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRating()
  }, [oid])

  if (loading || !data) {
    return <div className="w-24 h-24 bg-gray-200 rounded animate-pulse" />
  }

  const fullStars = Math.floor(data.rating)
  const hasHalfStar = data.rating % 1 >= 0.5

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < fullStars
                    ? "fill-yellow-400 text-yellow-400"
                    : i === fullStars && hasHalfStar
                    ? "fill-yellow-400 text-yellow-400" // Можно реализовать половинную звезду
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xl font-bold text-gray-900">{data.rating}</span>
        </div>
        <span className="text-sm text-gray-600">{data.reviews} отзывов</span>
      </div>
    </div>
  )
}