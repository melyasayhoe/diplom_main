import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xhpqzaledddnxxzjvypl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocHF6YWxlZGRkbnh4emp2eXBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQxNDEyNywiZXhwIjoyMDk1OTkwMTI3fQ.cgfhTK4M5tlGNBUYricN7rqCMpX5hNWSOitAnoWd5sg'
)

async function createMaster() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'alexander.petrov@salon.com',
    password: 'SecurePass123!',
    email_confirm: true,
    user_metadata: {
      full_name: 'Александр Петров'
    }
  })

  if (error) {
    console.error('Ошибка:', error.message)
  } else {
    console.log('✅ Мастер создан! ID:', data.user.id)
  }
}

createMaster()