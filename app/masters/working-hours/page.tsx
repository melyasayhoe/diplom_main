import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

async function updateWorkingHours(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const masterId = formData.get("masterId") as string
  const day_of_week = parseInt(formData.get("day_of_week") as string)
  const start_time = formData.get("start_time") as string
  const end_time = formData.get("end_time") as string
  const is_working = formData.get("is_working") === "on"

  const { error } = await supabase
    .from("working_hours")
    .update({ start_time, end_time, is_working })
    .eq("master_id", masterId)
    .eq("day_of_week", day_of_week)

  if (error) console.error(error)
  revalidatePath("/master/working-hours")
}

export default async function MasterWorkingHoursPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: master } = await supabase
    .from("masters")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!master) redirect("/")

  const { data: hours } = await supabase
    .from("working_hours")
    .select("*")
    .eq("master_id", user.id)
    .order("day_of_week")

  const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/master/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600">
              <ArrowLeft className="w-4 h-4" />
              Личный кабинет
            </Link>
            <h1 className="text-xl font-bold">Рабочие часы</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Редактирование рабочих часов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hours && hours.map((h: any) => (
                <form key={h.id} action={updateWorkingHours} className="flex items-end gap-4 border p-4 rounded-lg">
                  <input type="hidden" name="masterId" value={user.id} />
                  <input type="hidden" name="day_of_week" value={h.day_of_week} />
                  <div className="w-20">
                    <Label className="text-sm">{dayNames[h.day_of_week]}</Label>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Начало</Label>
                    <Input type="time" name="start_time" defaultValue={h.start_time?.slice(0,5)} />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Конец</Label>
                    <Input type="time" name="end_time" defaultValue={h.end_time?.slice(0,5)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id={`is_working_${h.day_of_week}`} name="is_working" defaultChecked={h.is_working} />
                    <Label htmlFor={`is_working_${h.day_of_week}`} className="text-sm cursor-pointer">Работаю</Label>
                  </div>
                  <Button type="submit" size="sm">Сохранить</Button>
                </form>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}