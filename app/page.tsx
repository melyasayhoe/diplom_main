import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Clock, Award, Heart } from "lucide-react"
import { YandexRating } from "@/components/YandexRating"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch top-rated masters
  const { data: masters } = await supabase
    .from("masters")
    .select("*")
    .eq("is_active", true)
    .order("rating", { ascending: false })
    .limit(4)

  // Fetch service categories
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("category", { ascending: true })

  const categories = services ? Array.from(new Set(services.map((s) => s.category))) : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-rose-600">
              Салон красоты Багира
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/booking" className="text-gray-700 hover:text-rose-600 transition-colors">
                Онлайн запись
              </Link>
              <Link href="/masters" className="text-gray-700 hover:text-rose-600 transition-colors">
                Мастера
              </Link>
              <Link href="/services" className="text-gray-700 hover:text-rose-600 transition-colors">
                Услуги
              </Link>
              <Link href="/reviews" className="text-gray-700 hover:text-rose-600 transition-colors">
                Отзывы
              </Link>
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Админ
                </Button>
              </Link>
              {user ? (
                <>
                  <Link href="/client/dashboard">
                    <Button variant="outline" size="sm">
                      Личный кабинет
                    </Button>
                  </Link>
                  <form action="/auth/logout" method="post">
                    <Button variant="outline" size="sm">
                      Выйти
                    </Button>
                  </form>
                </>
              ) : (
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Войти
                  </Button>
                </Link>
              )}
            </div>
            <Link href="/booking">
              <Button className="bg-rose-600 hover:bg-rose-700">Записаться</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Ваша красота — наша забота
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Профессиональные услуги салона красоты с онлайн-записью. Опытные мастера, современные техники, индивидуальный
            подход к каждому клиенту.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                Записаться онлайн
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline">
                Посмотреть услуги
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Онлайн запись 24/7</h3>
                <p className="text-sm text-gray-600">Удобная запись в любое время без звонков</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Опытные мастера</h3>
                <p className="text-sm text-gray-600">Профессионалы с многолетним стажем</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Высокий рейтинг</h3>
                <p className="text-sm text-gray-600">Более 450 довольных клиентов</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Индивидуальный подход</h3>
                <p className="text-sm text-gray-600">Учитываем все ваши пожелания</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Наши услуги</h2>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {categories.map((category) => (
              <Link key={category} href={`/services?category=${category}`}>
                <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full border-2 hover:border-rose-600">
                  <CardContent className="pt-6 text-center">
                    <h3 className="font-semibold text-lg text-rose-600">{category}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/services">
              <Button variant="outline" size="lg">
                Все услуги и цены
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Masters Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Наши мастера</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {masters?.map((master) => (
              <Card key={master.id} className="hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-rose-200 to-rose-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl text-white font-bold">{master.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-center mb-1">{master.name}</h3>
                  <p className="text-sm text-gray-600 text-center mb-3">{master.specialty}</p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{master.rating}</span>
                    <span className="text-sm text-gray-500">({master.total_reviews})</span>
                  </div>
                  <Link href={`/masters/${master.id}`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      Подробнее
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/masters">
              <Button variant="outline" size="lg">
                Все мастера
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Отзывы клиентов</h2>
          <div className="flex justify-center">
            {/* Виджет с уникальным стилем для устранения серого фона */}
            <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-xs overflow-hidden relative">
              <div className="absolute inset-0 bg-white z-0"></div>
              <div className="relative z-10 w-full h-[150px]">
                <iframe
                  src="https://yandex.ru/maps-reviews-widget/1738198957"
                  className="w-full h-full border-none"
                  style={{
                    backgroundColor: 'transparent',
                    mixBlendMode: 'multiply',
                  }}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link href="https://yandex.ru/maps/org/bagira/1738198957/reviews/" target="_blank" className="text-rose-600 hover:text-rose-700">
              Все отзывы на Яндекс.Картах
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-6">Готовы к преображению?</h2>
          <p className="text-xl mb-8 text-rose-50">
            Запишитесь онлайн прямо сейчас и получите скидку 10% на первое посещение
          </p>
          <Link href="/booking">
            <Button size="lg" variant="secondary" className="bg-white text-rose-600 hover:bg-rose-50">
              Записаться сейчас
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Салон Красоты</h3>
              <p className="text-sm">Профессиональные услуги парикмахера для вашей красоты и уверенности</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Навигация</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/booking" className="hover:text-white">
                    Онлайн запись
                  </Link>
                </li>
                <li>
                  <Link href="/masters" className="hover:text-white">
                    Мастера
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-white">
                    Услуги
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="hover:text-white">
                    Отзывы
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm">
                <li>+7 (900) 557-39-00</li>
                <li>info@salon.ru</li>
                <li>г. Вологда, ул. Северная, 10Б</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Часы работы</h4>
              <ul className="space-y-2 text-sm">
                <li>Пн-Сб: 9:00 - 19:00</li>
                <li>Воскресенье: выходной</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 Салон Красоты Багира. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}