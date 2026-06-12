import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Отзывы наших клиентов</h1>
        
        <div className="flex justify-center">
          <div 
            style={{
              width: '100%',
              maxWidth: '560px',
              height: '800px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <iframe 
              style={{
                width: '100%',
                height: '100%',
                border: '1px solid #e6e6e6',
                borderRadius: '8px',
                boxSizing: 'border-box'
              }} 
              src="https://yandex.ru/maps-reviews-widget/1738198957?comments"
              allowFullScreen
            ></iframe>
            
            <a 
              href="https://yandex.ru/maps/org/bagira/1738198957/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                boxSizing: 'border-box',
                textDecoration: 'none',
                color: '#b3b3b3',
                fontSize: '10px',
                fontFamily: 'YS Text, sans-serif',
                padding: '0 20px',
                position: 'absolute',
                bottom: '8px',
                width: '100%',
                textAlign: 'center',
                left: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
                maxHeight: '14px',
                whiteSpace: 'nowrap',
                padding: '0 16px'
              }}
            >
              Багира на карте Вологды — Яндекс Карты
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}