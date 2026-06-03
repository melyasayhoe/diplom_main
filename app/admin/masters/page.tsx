import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { ArrowLeft, User, Plus, Pencil, Trash2 } from "lucide-react"

// Server Action: Добавить мастера
async function createMaster(formData: FormData) {
  "use server"
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const specialty = formData.get("specialty") as string
  const bio = formData.get("bio") as string
  const experience_years = parseInt(formData.get("experience_years") as string)
  const is_active = formData.get("is_active") === "on"

  const { error } = await supabase.from("masters").insert({
    name,
    specialty,
    bio,
    experience_years,
    is_active,
    rating: 0,
    total_reviews: 0
  })

  if (error) console.error("Error adding master:", error)
  revalidatePath("/admin/masters")
}

// Server Action: Обновить мастера
async function updateMaster(formData: FormData) {
  "use server"
  const supabase = await createClient()
  
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const specialty = formData.get("specialty") as string
  const bio = formData.get("bio") as string
  const experience_years = parseInt(formData.get("experience_years") as string)
  const is_active = formData.get("is_active") === "on"

  const { error } = await supabase.from("masters").update({
    name,
    specialty,
    bio,
    experience_years,
    is_active
  }).eq("id", id)

  if (error) console.error("Error updating master:", error)
  revalidatePath("/admin/masters")
}

// Server Action: Удалить мастера
async function deleteMaster(id: string) {
  "use server"
  const supabase = await createClient()
  
  const { error } = await supabase.from("masters").delete().eq("id", id)
  
  if (error) console.error("Error deleting master:", error)
  revalidatePath("/admin/masters")
}

export default async function AdminMastersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Проверяем админа (опционально, если есть admin_users)
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!adminUser) redirect("/")

  const { data: masters } = await supabase
    .from("masters")
    .select("*")
    .order("name")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="/admin" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600">
              <ArrowLeft className="w-4 h-4" />
              Панель управления
            </a>
            <h1 className="text-xl font-bold">Управление мастерами</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Все мастера</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-rose-600 hover:bg-rose-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить мастера
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <form action={createMaster}>
                  <DialogHeader>
                    <DialogTitle>Новый мастер</DialogTitle>
                    <DialogDescription>Заполните данные нового мастера</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Специальность</Label>
                      <Input id="specialty" name="specialty" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Биография</Label>
                      <Textarea id="bio" name="bio" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience_years">Опыт (лет)</Label>
                      <Input id="experience_years" name="experience_years" type="number" required />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="is_active" name="is_active" defaultChecked />
                      <Label htmlFor="is_active">Активен</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-rose-600 hover:bg-rose-700">Сохранить</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {masters && masters.length > 0 ? (
                masters.map((master: any) => (
                  <div key={master.id} className="p-4 bg-white border rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{master.name}</p>
                        <p className="text-sm text-gray-600">{master.specialty}</p>
                        <p className="text-xs text-gray-500">Опыт: {master.experience_years} лет</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {/* Кнопка редактирования */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <form action={updateMaster}>
                            <input type="hidden" name="id" value={master.id} />
                            <DialogHeader>
                              <DialogTitle>Редактировать мастера</DialogTitle>
                              <DialogDescription>Измените данные мастера</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Имя</Label>
                                <Input name="name" defaultValue={master.name} required />
                              </div>
                              <div className="space-y-2">
                                <Label>Специальность</Label>
                                <Input name="specialty" defaultValue={master.specialty} required />
                              </div>
                              <div className="space-y-2">
                                <Label>Биография</Label>
                                <Textarea name="bio" defaultValue={master.bio} />
                              </div>
                              <div className="space-y-2">
                                <Label>Опыт (лет)</Label>
                                <Input name="experience_years" type="number" defaultValue={master.experience_years} required />
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="edit_is_active" name="is_active" defaultChecked={master.is_active} />
                                <Label htmlFor="edit_is_active">Активен</Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" className="bg-rose-600 hover:bg-rose-700">Сохранить</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      {/* Кнопка удаления */}
                      <form action={deleteMaster}>
                        <input type="hidden" name="id" value={master.id} />
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Мастера не найдены</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}