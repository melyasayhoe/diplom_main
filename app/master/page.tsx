import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, ArrowLeft } from "lucide-react"

export default async function MastersPage() {
  const supabase = await createClient()

  const { data: masters } = await supabase
    .from("masters")
    .select("*")
    .eq("is_active", true)
    .order("rating", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        <h1 className="text-4xl font-bold mb-4">Наши мастера</h1>
        <p className="text-gray-600 mb-8">Профессиональные специалисты с многолетним опытом работы</p>

        <div className="grid md:grid-cols-3 gap-8">
          {masters?.map((master) => (
            <Card key={master.id} className="hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-32 h-32 bg-gradient-to-br from-rose-200 to-rose-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-5xl text-white font-bold">{master.name.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-xl text-center mb-2">{master.name}</h3>
                <p className="text-sm text-gray-600 text-center mb-4">{master.specialty}</p>

                {master.bio && <p className="text-sm text-gray-700 mb-4 line-clamp-3">{master.bio}</p>}

                <div className="flex items-center justify-center gap-2 mb-4 pb-4 border-b">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">{master.rating}</span>
                  <span className="text-sm text-gray-500">({master.total_reviews} отзывов)</span>
                </div>

                {master.experience_years && (
                  <p className="text-sm text-center text-gray-600 mb-4">Опыт работы: {master.experience_years} лет</p>
                )}

                <Link href={`/masters/${master.id}`}>
                  <Button variant="outline" className="w-full mb-2 bg-transparent">
                    Подробнее
                  </Button>
                </Link>
                <Link href={`/booking?master=${master.id}`}>
                  <Button className="w-full bg-rose-600 hover:bg-rose-700">Записаться</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
