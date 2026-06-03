import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  // Редирект на корень текущего сайта (localhost:3000)
  return NextResponse.redirect(new URL("/", request.url))
}