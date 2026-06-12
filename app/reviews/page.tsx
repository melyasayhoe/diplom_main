"use client"

import Script from "next/script"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReviewsPage() {
  const oid = process.env.NEXT_PUBLIC_YANDEX_MAPS_OID
  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY

  if (!oid || !apiKey) {
    return <div className="text-center py-12">Не удалось загрузить отзывы. Проверьте настройки API.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Отзывы наших клиентов</h1>
        
        {/* Контейнер для виджета */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div 
            id="ymaps-review-widget" 
            className="w-full h-[600px]"
          ></div>
        </div>

        {/* Загрузка API Яндекс.Карт */}
        <Script
          src={`https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${apiKey}`}
          strategy="afterInteractive"
          onLoad={() => {
            // Инициализация виджета после загрузки API
            if (window.ymaps) {
              window.ymaps.ready(() => {
                new window.ymaps.ReviewsWidget({
                  container: document.getElementById('ymaps-review-widget'),
                  oid: oid,
                  params: {
                    lang: 'ru',
                    height: '100%',
                    width: '100%'
                  }
                })
              })
            }
          }}
        />
      </div>
    </div>
  )
}