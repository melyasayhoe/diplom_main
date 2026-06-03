import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

async function updateProfile(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const user = (await supabase.auth.getUser()).data.user
  if (!user) return

  const name = formData.get("name") as string
  const phone = formData.get("phone") as string

  await supabase
    .from("profiles")
    .update({ name, phone })
    .eq("id", user.id)

  revalidatePath("/client/profile")
}

export default async function ClientProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login?redirect=/client/profile")
  }

  // ✅ Используем maybeSingle(), чтобы избежать ошибки, если профиля вдруг нет
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  // ✅ Если профиля нет, создаём его прямо здесь
  if (!profile) {
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      name: user.email?.split('@')[0] || 'Клиент',
      role: 'client'
    })
    
    if (error && error.code !== '23505') { // Игнорируем duplicate key, если профиль уже есть
      console.error("Ошибка создания профиля:", error)
      redirect("/")
    }
  }

  // ✅ Если роль не 'client', выкидываем на главную (это не твой кабинет)
  if (profile?.role !== "client") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/client/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600">
              <ArrowLeft className="w-4 h-4" />
              Личный кабинет
            </Link>
            <h1 className="text-xl font-bold">Мой профиль</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Редактирование профиля</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateProfile} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email || ''} disabled className="bg-gray-100" />
              </div>
              <div>
                <Label htmlFor="name">Имя</Label>
                <Input id="name" name="name" defaultValue={profile?.name || ''} required />
              </div>
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input id="phone" name="phone" defaultValue={profile?.phone || ''} />
              </div>
              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">Сохранить</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}