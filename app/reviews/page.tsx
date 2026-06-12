import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ReviewsPage() {
  const yandexUrl = "https://yandex.ru/maps/org/bagira/1738198957/reviews/"

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Отзывы наших клиентов</h1>
        
        {/* Карточка со ссылкой */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-gray-600 mb-8">
              Чтобы посмотреть реальные отзывы наших клиентов, перейдите на страницу нашего салона на Яндекс.Картах.
            </p>
            <Link href={yandexUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                Смотреть отзывы на Яндекс.Картах
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}