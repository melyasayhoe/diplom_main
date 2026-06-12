import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Политика обработки персональных данных</h1>
        <p className="text-sm text-gray-600 mb-8">Последнее обновление: 12 июня 2026 г.</p>
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Общие положения</h2>
            <p className="text-gray-700">
              Настоящая Политика определяет порядок обработки персональных данных посетителей сайта <strong>«Салон красоты Багира»</strong> (далее — Оператор, Сайт).
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">2. Персональные данные, которые мы собираем</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li><strong>Имя, телефон, адрес электронной почты</strong> — при заполнении формы онлайн-записи;</li>
              <li><strong>Данные для входа (email, пароль)</strong> — при регистрации личного кабинета;</li>
              <li><strong>Данные файлов cookie</strong> — для обеспечения работоспособности сайта;</li>
              <li><strong>Данные из встроенных сервисов (Яндекс.Карты)</strong> — для отображения отзывов и рейтинга (обработка данных осуществляется Яндексом).</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">3. Цели обработки персональных данных</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Оформление и подтверждение онлайн-записи;</li>
              <li>Идентификация пользователя при входе в личный кабинет;</li>
              <li>Направление уведомлений о статусе бронирования;</li>
              <li>Техническое обеспечение работы сайта (сессии, cookie);</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">4. Правовые основания обработки</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Ваше добровольное согласие, выраженное при заполнении формы записи или регистрации;</li>
              <li>Исполнение договора (оказание услуг, подтверждение записи);</li>
              <li>Требования закона (хранение данных в соответствии с ФЗ-152);</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">5. Передача данных третьим лицам</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li><strong>Яндекс.Карты (виджет отзывов)</strong> — данные передаются Яндексу в рамках работы встроенного iframe;</li>
              <li><strong>Supabase (база данных)</strong> — хранение данных на серверах в ЕС;</li>
              <li><strong>Vercel (хостинг сайта)</strong> — технические данные для работы сервера.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">6. Порядок отзыва согласия</h2>
            <p className="text-gray-700">
              Вы можете отозвать своё согласие на обработку персональных данных в любой момент, направив письменное уведомление по адресу: <strong>info@salon.ru</strong>. После получения уведомления мы удалим ваши данные в течение 30 дней, если иное не предусмотрено законом.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">7. Контактные данные оператора</h2>
            <p className="text-gray-700">
              <strong>Наименование:</strong> ИП Мельник И.А.<br />
              <strong>Адрес:</strong> г. Вологда, ул. Северная, 10Б<br />
              <strong>Email:</strong> <a href="mailto:info@salon.ru" className="text-rose-600 hover:underline">info@salon.ru</a>
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">8. Срок хранения данных</h2>
            <p className="text-gray-700">
              Персональные данные хранятся в течение срока действия договора (активности учётной записи) + 3 года после его окончания, если иное не требуется законом.
            </p>
          </div>
          <div className="mt-6 text-center text-gray-500 text-xs">
            <Link href="/" className="text-rose-600 hover:text-rose-700">Вернуться на главную</Link>
          </div>
        </div>
      </div>
    </div>
  )
}