import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ReviewsPage() {
  const oid = process.env.NEXT_PUBLIC_YANDEX_MAPS_OID

  if (!oid) {
    return <div className="text-center py-12">Не удалось найти отзывы. ID заведения не указан.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Отзывы наших клиентов</h1>
        
        {/* Виджет Яндекс.Карт */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <iframe 
            src={`https://yandex.ru/maps-reviews-widget/${oid}`} 
            width="100%" 
            height="600" 
            frameBorder="0" 
            allowFullScreen 
            title="Отзывы на Яндекс.Картах"
          ></iframe>
        </div>
      </div>
    </div>
  )
}