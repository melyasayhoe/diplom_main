"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import type { Master, Service } from "@/lib/types"

// ОТКЛЮЧАЕМ КЭШИРОВАНИЕ СТРАНИЦЫ (ВАЖНО!)
export const dynamic = 'force-dynamic'

export default function BookingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [masters, setMasters] = useState<Master[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Client info
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [notes, setNotes] = useState("")

  // Текущий пользователь (может быть null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      loadMasters()
      loadServices()

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, phone")
          .eq("id", user.id)
          .single()

        if (profile) {
          setClientName(profile.name || "")
          setClientPhone(profile.phone || "")
          setClientEmail(user.email || "")
        }
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (selectedMaster && selectedDate) {
      loadAvailableTimes()
    }
  }, [selectedMaster, selectedDate])

  const loadMasters = async () => {
    const { data } = await supabase.from("masters").select("*").eq("is_active", true).order("name")
    if (data) setMasters(data)
  }

  const loadServices = async () => {
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("category", { ascending: true })
    if (data) setServices(data)
  }

  const loadAvailableTimes = async () => {
    if (!selectedMaster || !selectedDate) return

    const dayOfWeek = selectedDate.getDay()

    const { data: workingHours } = await supabase
      .from("working_hours")
      .select("*")
      .eq("master_id", selectedMaster.id)
      .eq("day_of_week", dayOfWeek)
      .eq("is_working", true)
      .single()

    if (!workingHours) {
      setAvailableTimes([])
      return
    }

    const now = new Date()
    const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000)

    // Нормализуем даты для корректного сравнения
    const todayStr = now.toISOString().split('T')[0]
    const selectedDateStr = selectedDate.toISOString().split('T')[0]
    const isToday = selectedDateStr === todayStr

    const dateStr = selectedDate.toISOString().split("T")[0]
    const { data: bookings } = await supabase
      .from("bookings")
      .select("booking_time, service:services(duration_minutes)")
      .eq("master_id", selectedMaster.id)
      .eq("booking_date", dateStr)
      .in("status", ["pending", "confirmed"])

    const times: string[] = []
    const start = parseInt(workingHours.start_time.split(":")[0])
    const end = parseInt(workingHours.end_time.split(":")[0])

    for (let hour = start; hour < end; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        
        // Если выбран СЕГОДНЯШНИЙ день, проверяем ограничение +3 часа
        if (isToday) {
          const slotTime = new Date(now)
          slotTime.setHours(hour, minute, 0, 0)
          
          if (slotTime < threeHoursFromNow) {
            continue // Пропускаем слоты, которые раньше чем через 3 часа
          }
        }
        
        times.push(timeStr)
      }
    }

    const bookedTimes = new Set(bookings?.map((b) => b.booking_time.slice(0, 5)) || [])
    const available = times.filter((time) => !bookedTimes.has(time))

    setAvailableTimes(available)
  }

  const handleMasterSelect = (masterId: string) => {
    const master = masters.find((m) => m.id === masterId)
    setSelectedMaster(master || null)
  }

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId)
    setSelectedService(service || null)
  }

  const handleNextStep = () => {
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMaster || !selectedService || !selectedDate || !selectedTime) {
      return
    }

    setIsLoading(true)

    try {
      const dateStr = selectedDate.toISOString().split("T")[0]

      const { error } = await supabase.from("bookings").insert({
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        master_id: selectedMaster.id,
        service_id: selectedService.id,
        booking_date: dateStr,
        booking_time: selectedTime,
        notes: notes || null,
        status: "pending",
        client_id: user?.id || null,
      })

      if (error) throw error

      setSuccess(true)
    } catch (error) {
      console.error("[v0] Booking error:", error)
      alert("Произошла ошибка при создании записи. Попробуйте снова.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Запись успешно создана!</h2>
            <p className="text-gray-600 mb-6">Мы отправили подтверждение на {clientEmail}</p>
            <div className="bg-rose-50 p-4 rounded-lg mb-6 text-left">
              <p className="font-semibold mb-2">Детали записи:</p>
              <p className="text-sm text-gray-700">Мастер: {selectedMaster?.name}</p>
              <p className="text-sm text-gray-700">Услуга: {selectedService?.name}</p>
              <p className="text-sm text-gray-700">Дата: {selectedDate?.toLocaleDateString("ru-RU")}</p>
              <p className="text-sm text-gray-700">Время: {selectedTime}</p>
            </div>
            <Link href="/">
              <Button className="w-full bg-rose-600 hover:bg-rose-700">На главную</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600 mb-6">
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>

          <h1 className="text-4xl font-bold mb-8">Онлайн запись</h1>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-rose-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <span className="text-sm font-medium">Выбор услуги</span>
            </div>
            <div className="flex-1 h-px bg-gray-300 mx-4" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-rose-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium">Дата и время</span>
            </div>
            <div className="flex-1 h-px bg-gray-300 mx-4" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? "bg-rose-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
              <span className="text-sm font-medium">Контакты</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Выберите мастера и услугу</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="master">Мастер</Label>
                    <Select value={selectedMaster?.id} onValueChange={handleMasterSelect}>
                      <SelectTrigger id="master">
                        <SelectValue placeholder="Выберите мастера" />
                      </SelectTrigger>
                      <SelectContent>
                        {masters.map((master) => (
                          <SelectItem key={master.id} value={master.id}>
                            {master.name} - {master.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="service">Услуга</Label>
                    <Select value={selectedService?.id} onValueChange={handleServiceSelect}>
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Выберите услугу" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - {service.price} ₽ ({service.duration_minutes} мин)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedService && (
                    <div className="bg-rose-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">{selectedService.name}</h3>
                      <p className="text-sm text-gray-700 mb-2">{selectedService.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="font-semibold">{selectedService.price} ₽</span>
                        <span className="text-gray-600">{selectedService.duration_minutes} минут</span>
                      </div>
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!selectedMaster || !selectedService}
                    className="w-full bg-rose-600 hover:bg-rose-700"
                  >
                    Далее
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Выберите дату и время</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Дата</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => {
                        // Сбрасываем время у текущей даты на полночь, чтобы сравнивать только дни
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        
                        // Блокируем прошедшие дни и воскресенье, но разрешаем сегодня
                        return date < today || date.getDay() === 0
                      }}
                      className="rounded-md border w-full"
                    />
                  </div>

                  {selectedDate && availableTimes.length > 0 && (
                    <div>
                      <Label>Время</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {availableTimes.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={selectedTime === time ? "default" : "outline"}
                            onClick={() => setSelectedTime(time)}
                            className={selectedTime === time ? "bg-rose-600 hover:bg-rose-700" : ""}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDate && availableTimes.length === 0 && (
                    <p className="text-center text-gray-600 py-4">
                      На выбранную дату нет свободного времени. Выберите другую дату.
                    </p>
                  )}

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Назад
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!selectedDate || !selectedTime}
                      className="flex-1 bg-rose-600 hover:bg-rose-700"
                    >
                      Далее
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Ваши контактные данные</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="name">Имя *</Label>
                    <Input
                      id="name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                      placeholder="Введите ваше имя"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      required
                      placeholder="example@mail.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      required
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Комментарий (необязательно)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Дополнительные пожелания или комментарии"
                      rows={3}
                    />
                  </div>

                  <div className="bg-rose-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Подтверждение записи</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>Мастер: {selectedMaster?.name}</p>
                      <p>Услуга: {selectedService?.name}</p>
                      <p>Дата: {selectedDate?.toLocaleDateString("ru-RU")}</p>
                      <p>Время: {selectedTime}</p>
                      <p className="font-semibold mt-2">Стоимость: {selectedService?.price} ₽</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Назад
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1 bg-rose-600 hover:bg-rose-700">
                      {isLoading ? "Создание записи..." : "Подтвердить запись"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}