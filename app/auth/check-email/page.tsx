import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-rose-50 to-white">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle>Проверьте вашу почту</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Мы отправили письмо с подтверждением на вашу электронную почту.
            Пожалуйста, перейдите по ссылке в письме, чтобы завершить регистрацию.
          </p>
          <Link href="/auth/login">
            <Button className="w-full bg-rose-600 hover:bg-rose-700">
              Войти после подтверждения
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}