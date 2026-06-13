"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    console.log("CookieConsent: useEffect запущен")
    const consent = localStorage.getItem('cookieConsent')
    console.log("CookieConsent: consent =", consent)
    if (!consent) {
      console.log("CookieConsent: setShow(true)")
      setShow(true)
    }
  }, [])

  console.log("CookieConsent: рендер, show =", show)

  if (!show) {
    console.log("CookieConsent: return null")
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-white border border-gray-200 shadow-xl rounded-lg p-4 z-50">
      <p className="text-sm text-gray-700 mb-3">
        Мы используем файлы cookie для улучшения работы сайта. <Link href="/privacy" className="text-rose-600 hover:underline">Подробнее</Link>
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => {
            localStorage.setItem('cookieConsent', 'true')
            setShow(false)
          }}
          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Принять
        </button>
        <button
          onClick={() => setShow(false)}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}