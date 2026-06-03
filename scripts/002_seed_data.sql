-- Seed data for hairdresser booking system

-- Insert sample masters
INSERT INTO public.masters (name, specialty, bio, experience_years, rating, total_reviews) VALUES
  ('Анна Иванова', 'Колорист', 'Специалист по окрашиванию волос с 8-летним опытом. Работаю с современными техниками мелирования и балаяж.', 8, 4.9, 127),
  ('Мария Петрова', 'Стилист-универсал', 'Мастер стрижек и укладок. Люблю создавать образы, которые подчеркивают индивидуальность каждого клиента.', 6, 4.8, 95),
  ('Елена Смирнова', 'Парикмахер-стилист', 'Специализируюсь на свадебных прическах и вечерних укладках. Превращаю мечты в реальность!', 10, 5.0, 156),
  ('Ольга Волкова', 'Мастер по уходу', 'Эксперт по восстановлению и уходу за волосами. Использую профессиональную косметику премиум-класса.', 5, 4.7, 78)
ON CONFLICT DO NOTHING;

-- Insert sample services
INSERT INTO public.services (name, description, duration_minutes, price, category) VALUES
  ('Женская стрижка', 'Стрижка любой сложности с укладкой', 60, 1500.00, 'Стрижки'),
  ('Мужская стрижка', 'Классическая или модельная стрижка', 45, 1000.00, 'Стрижки'),
  ('Детская стрижка', 'Стрижка для детей до 12 лет', 30, 800.00, 'Стрижки'),
  ('Окрашивание волос', 'Полное окрашивание в один тон', 120, 3500.00, 'Окрашивание'),
  ('Мелирование', 'Классическое мелирование', 150, 4500.00, 'Окрашивание'),
  ('Балаяж', 'Современная техника окрашивания', 180, 5500.00, 'Окрашивание'),
  ('Укладка', 'Профессиональная укладка волос', 45, 1200.00, 'Укладки'),
  ('Вечерняя прическа', 'Сложная укладка для особого случая', 90, 2500.00, 'Укладки'),
  ('Свадебная прическа', 'Создание свадебного образа с репетицией', 120, 4000.00, 'Укладки'),
  ('Ботокс для волос', 'Процедура восстановления и разглаживания', 90, 3000.00, 'Уход'),
  ('Кератиновое выпрямление', 'Долговременное выпрямление волос', 180, 6000.00, 'Уход'),
  ('Ламинирование', 'Защита и блеск волос', 60, 2000.00, 'Уход')
ON CONFLICT DO NOTHING;

-- Link services to masters (using subqueries to get IDs)
INSERT INTO public.master_services (master_id, service_id)
SELECT m.id, s.id FROM public.masters m, public.services s
WHERE m.name = 'Анна Иванова' AND s.name IN ('Окрашивание волос', 'Мелирование', 'Балаяж', 'Женская стрижка')
ON CONFLICT DO NOTHING;

INSERT INTO public.master_services (master_id, service_id)
SELECT m.id, s.id FROM public.masters m, public.services s
WHERE m.name = 'Мария Петрова' AND s.name IN ('Женская стрижка', 'Мужская стрижка', 'Детская стрижка', 'Укладка')
ON CONFLICT DO NOTHING;

INSERT INTO public.master_services (master_id, service_id)
SELECT m.id, s.id FROM public.masters m, public.services s
WHERE m.name = 'Елена Смирнова' AND s.name IN ('Вечерняя прическа', 'Свадебная прическа', 'Укладка', 'Женская стрижка')
ON CONFLICT DO NOTHING;

INSERT INTO public.master_services (master_id, service_id)
SELECT m.id, s.id FROM public.masters m, public.services s
WHERE m.name = 'Ольга Волкова' AND s.name IN ('Ботокс для волос', 'Кератиновое выпрямление', 'Ламинирование', 'Женская стрижка')
ON CONFLICT DO NOTHING;

-- Add working hours for all masters (Mon-Sat, 9:00-19:00)
INSERT INTO public.working_hours (master_id, day_of_week, start_time, end_time, is_working)
SELECT m.id, dow, '09:00'::TIME, '19:00'::TIME, true
FROM public.masters m
CROSS JOIN generate_series(1, 6) AS dow
ON CONFLICT DO NOTHING;

-- Add some sample reviews
INSERT INTO public.reviews (master_id, client_name, rating, comment, is_approved)
SELECT m.id, 'Екатерина', 5, 'Анна - настоящий профессионал! Окрашивание получилось идеальным, именно то, что я хотела. Обязательно вернусь!', true
FROM public.masters m WHERE m.name = 'Анна Иванова'
ON CONFLICT DO NOTHING;

INSERT INTO public.reviews (master_id, client_name, rating, comment, is_approved)
SELECT m.id, 'Алексей', 5, 'Отличная стрижка, мастер учла все мои пожелания. Очень доволен результатом!', true
FROM public.masters m WHERE m.name = 'Мария Петрова'
ON CONFLICT DO NOTHING;

INSERT INTO public.reviews (master_id, client_name, rating, comment, is_approved)
SELECT m.id, 'Виктория', 5, 'Елена создала для меня шикарную свадебную прическу! Все гости были в восторге. Спасибо!', true
FROM public.masters m WHERE m.name = 'Елена Смирнова'
ON CONFLICT DO NOTHING;

INSERT INTO public.reviews (master_id, client_name, rating, comment, is_approved)
SELECT m.id, 'Наталья', 5, 'После процедуры кератинового выпрямления мои волосы преобразились! Ольга - мастер своего дела.', true
FROM public.masters m WHERE m.name = 'Ольга Волкова'
ON CONFLICT DO NOTHING;
