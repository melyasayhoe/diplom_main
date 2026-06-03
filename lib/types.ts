export interface Master {
  id: string
  name: string
  specialty: string
  bio: string | null
  avatar_url: string | null
  experience_years: number | null
  rating: number
  total_reviews: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description: string | null
  duration_minutes: number
  price: number
  category: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  client_name: string
  client_email: string
  client_phone: string
  master_id: string
  service_id: string
  booking_date: string
  booking_time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  booking_id: string | null
  master_id: string
  client_name: string
  rating: number
  comment: string | null
  is_approved: boolean
  created_at: string
}

export interface WorkingHours {
  id: string
  master_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_working: boolean
  created_at: string
}

export interface MasterWithServices extends Master {
  services?: Service[]
}

export interface BookingWithDetails extends Booking {
  master?: Master
  service?: Service
}
