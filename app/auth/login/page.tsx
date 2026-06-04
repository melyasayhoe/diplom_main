"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Успешный вход
    const userId = data.user.id

    // 1. Проверяем, является ли пользователь мастером
    const { data: master } = await supabase
      .from("masters")
      .select("id")
      .eq("id", userId)
      .maybeSingle()

    if (master) {
      router.push("/masters/dashboard") // ✅ Исправлено с /master/dashboard на /masters/dashboard
      setLoading(false)
      return
    }

    // 2. Проверяем, является ли пользователь админом
    const { data: admin } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", userId)
      .maybeSingle()

    if (admin) {
      router.push("/admin")
      setLoading(false)
      return
    }

    // 3. Иначе — это клиент
    // ✅ Исправленный блок: убрана проверка на "/master"
    if (redirectTo.includes("/admin")) {
      router.push("/client/dashboard")
    } else {
      router.push(redirectTo)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Вход в систему</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700">
              {loading ? "Вход..." : "Войти"}
            </Button>
            <div className="text-center text-sm">
              Нет аккаунта?{" "}
              <Link href="/auth/register" className="text-rose-600 hover:underline">
                Зарегистрироваться
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}