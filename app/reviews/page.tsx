import { Card, CardContent } from "@/components/ui/card"

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Отзывы наших клиентов</h1>
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <div
              style={{
                width: '100%',
                height: '600px',
                overflow: 'hidden',
                position: 'relative',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <iframe
                src="https://yandex.ru/maps-reviews-widget/1738198957?comments"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}