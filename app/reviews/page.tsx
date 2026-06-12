import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ReviewsPage() {
  const oid = "1738198957"

  if (!oid) {
    return <div className="text-center py-12">Не удалось загрузить отзывы. Проверьте ID заведения.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Отзывы наших клиентов</h1>
        
        {/* Прямой виджет отзывов от Яндекса */}
        <div className="bg-white rounded-lg shadow-sm p-4 overflow-hidden">
          <iframe 
            src={`https://yandex.ru/maps-reviews-widget/${oid}`} 
            width="100%" 
            height="600" 
            frameBorder="0" 
            allowFullScreen
            className="w-full h-[600px]"
            title="Отзывы на Яндекс.Картах"
          ></iframe>
        </div>
      </div>
    </div>
  )
}