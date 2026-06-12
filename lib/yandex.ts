export async function getYandexReviews() {
    const oid = process.env.NEXT_PUBLIC_YANDEX_MAPS_OID
    const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY
  
    if (!apiKey || !oid) {
      console.error("❌ Не указан API-ключ или OID Яндекс.Карт")
      return []
    }
  
    try {
      const response = await fetch(
        `https://api-maps.yandex.ru/2.1/companies/?oid=${oid}&apikey=${apiKey}&lang=ru_RU&format=json`
      )
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const data = await response.json()
      
      // API возвращает объект, где отзывы лежат в properties.reviews
      const reviews = data?.properties?.reviews || []
      return reviews
    } catch (error) {
      console.error("Ошибка загрузки отзывов с Яндекс.Карт:", error)
      return []
    }
  }