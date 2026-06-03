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
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react"

// Server Action: Добавить услугу
async function createService(formData: FormData) {
  "use server"
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const duration_minutes = parseInt(formData.get("duration_minutes") as string)
  const price = parseFloat(formData.get("price") as string)
  const category = formData.get("category") as string
  const is_active = formData.get("is_active") === "on"

  const { error } = await supabase.from("services").insert({
    name,
    description,
    duration_minutes,
    price,
    category,
    is_active
  })

  if (error) console.error("Error adding service:", error)
  revalidatePath("/admin/services")
}

// Server Action: Обновить услугу
async function updateService(formData: FormData) {
  "use server"
  const supabase = await createClient()
  
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const duration_minutes = parseInt(formData.get("duration_minutes") as string)
  const price = parseFloat(formData.get("price") as string)
  const category = formData.get("category") as string
  const is_active = formData.get("is_active") === "on"

  const { error } = await supabase.from("services").update({
    name,
    description,
    duration_minutes,
    price,
    category,
    is_active
  }).eq("id", id)

  if (error) console.error("Error updating service:", error)
  revalidatePath("/admin/services")
}

// Server Action: Удалить услугу
async function deleteService(id: string) {
  "use server"
  const supabase = await createClient()
  
  const { error } = await supabase.from("services").delete().eq("id", id)
  
  if (error) console.error("Error deleting service:", error)
  revalidatePath("/admin/services")
}

export default async function AdminServicesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Проверяем админа
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!adminUser) redirect("/")

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("category")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="/admin" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600">
              <ArrowLeft className="w-4 h-4" />
              Панель управления
            </a>
            <h1 className="text-xl font-bold">Управление услугами</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Все услуги</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-rose-600 hover:bg-rose-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить услугу
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <form action={createService}>
                  <DialogHeader>
                    <DialogTitle>Новая услуга</DialogTitle>
                    <DialogDescription>Заполните данные новой услуги</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Название</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Описание</Label>
                      <Textarea id="description" name="description" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration_minutes">Длительность (мин)</Label>
                      <Input id="duration_minutes" name="duration_minutes" type="number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Цена (₽)</Label>
                      <Input id="price" name="price" type="number" step="0.01" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Категория</Label>
                      <Input id="category" name="category" required />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="is_active" name="is_active" defaultChecked />
                      <Label htmlFor="is_active">Активна</Label>
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
              {services && services.length > 0 ? (
                services.map((service: any) => (
                  <div key={service.id} className="p-4 bg-white border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.category}</p>
                      <p className="text-xs text-gray-500">{service.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{service.price} ₽</p>
                        <p className="text-xs text-gray-500">{service.duration_minutes} мин</p>
                      </div>
                      <div className="flex gap-2">
                        {/* Редактирование */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <form action={updateService}>
                              <input type="hidden" name="id" value={service.id} />
                              <DialogHeader>
                                <DialogTitle>Редактировать услугу</DialogTitle>
                                <DialogDescription>Измените данные услуги</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Название</Label>
                                  <Input name="name" defaultValue={service.name} required />
                                </div>
                                <div className="space-y-2">
                                  <Label>Описание</Label>
                                  <Textarea name="description" defaultValue={service.description} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Длительность (мин)</Label>
                                  <Input name="duration_minutes" type="number" defaultValue={service.duration_minutes} required />
                                </div>
                                <div className="space-y-2">
                                  <Label>Цена (₽)</Label>
                                  <Input name="price" type="number" step="0.01" defaultValue={service.price} required />
                                </div>
                                <div className="space-y-2">
                                  <Label>Категория</Label>
                                  <Input name="category" defaultValue={service.category} required />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="edit_is_active" name="is_active" defaultChecked={service.is_active} />
                                  <Label htmlFor="edit_is_active">Активна</Label>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit" className="bg-rose-600 hover:bg-rose-700">Сохранить</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        {/* Удаление */}
                        <form action={deleteService}>
                          <input type="hidden" name="id" value={service.id} />
                          <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Услуги не найдены</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}