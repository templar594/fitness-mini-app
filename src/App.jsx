import { useState } from "react"
import "./App.css"

const services = [
  {
    id: 1,
    title: "Персональная тренировка",
    description: "Индивидуальная тренировка с тренером",
    duration: "60 минут",
    price: "2 000 ₽",
  },
  {
    id: 2,
    title: "Тренировка в зале",
    description: "Силовая программа под ваши цели",
    duration: "90 минут",
    price: "2 500 ₽",
  },
  {
    id: 3,
    title: "Онлайн-консультация",
    description: "Разбор питания и тренировочного плана",
    duration: "45 минут",
    price: "1 500 ₽",
  },
]

const dates = [
  { day: "Сегодня", date: "6 окт." },
  { day: "Завтра", date: "7 окт." },
  { day: "Чт", date: "8 окт." },
  { day: "Пт", date: "9 окт." },
  { day: "Сб", date: "10 окт." },
]

const times = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "17:00",
  "18:00",
  "19:00",
]

function App() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const canContinue =
    selectedService &&
    selectedDate &&
    selectedTime

  const confirmBooking = () => {
    if (!name || !phone) {
      alert("Пожалуйста, заполните имя и телефон")
      return
    }

    setStep(4)
  }

  return (
    <div className="app">

      {/* Шапка */}
      <header className="header">
        <div className="trainer-avatar">
          💪
        </div>

        <div>
          <h1>Алексей Ульянов</h1>
          <p>Персональный фитнес-тренер</p>
        </div>
      </header>

      {/* Профиль */}
      {step === 1 && (
        <>
          <div className="hero">
            <div className="hero-icon">🏋️</div>

            <h2>Тренируйся эффективнее</h2>

            <p>
              Персональные тренировки, питание
              и программа под твои цели.
            </p>
          </div>

          <h3 className="section-title">
            Выберите тренировку
          </h3>

          <div className="services">
            {services.map((service) => (
              <button
                className={`service-card ${
                  selectedService?.id === service.id
                    ? "selected"
                    : ""
                }`}
                key={service.id}
                onClick={() => setSelectedService(service)}
              >
                <div className="service-top">
                  <strong>{service.title}</strong>
                  <span>{service.price}</span>
                </div>

                <p>{service.description}</p>

                <small>{service.duration}</small>
              </button>
            ))}
          </div>

          <button
            className="primary-button"
            disabled={!selectedService}
            onClick={() => setStep(2)}
          >
            Выбрать дату
          </button>
        </>
      )}

      {/* Дата и время */}
      {step === 2 && (
        <>
          <button
            className="back-button"
            onClick={() => setStep(1)}
          >
            ← Назад
          </button>

          <h2 className="page-title">
            Выберите дату
          </h2>

          <div className="dates">
            {dates.map((item) => (
              <button
                key={item.date}
                className={`date-card ${
                  selectedDate?.date === item.date
                    ? "selected"
                    : ""
                }`}
                onClick={() => setSelectedDate(item)}
              >
                <strong>{item.day}</strong>
                <span>{item.date}</span>
              </button>
            ))}
          </div>

          {selectedDate && (
            <>
              <h3 className="section-title">
                Выберите время
              </h3>

              <div className="times">
                {times.map((time) => (
                  <button
                    key={time}
                    className={`time-button ${
                      selectedTime === time
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            className="primary-button"
            disabled={!canContinue}
            onClick={() => setStep(3)}
          >
            Продолжить
          </button>
        </>
      )}

      {/* Данные клиента */}
      {step === 3 && (
        <>
          <button
            className="back-button"
            onClick={() => setStep(2)}
          >
            ← Назад
          </button>

          <h2 className="page-title">
            Ваши данные
          </h2>

          <div className="booking-summary">
            <strong>{selectedService.title}</strong>

            <span>
              {selectedDate.day}, {selectedDate.date}
            </span>

            <span>
              {selectedTime}
            </span>
          </div>

          <div className="form">
            <label>
              Ваше имя
              <input
                type="text"
                placeholder="Например, Сергей"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label>
              Телефон
              <input
                type="tel"
                placeholder="+7 900 000-00-00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
          </div>

          <button
            className="primary-button"
            onClick={confirmBooking}
          >
            Подтвердить запись
          </button>
        </>
      )}

      {/* Подтверждение */}
      {step === 4 && (
        <div className="success">
          <div className="success-icon">
            ✓
          </div>

          <h2>Вы записаны!</h2>

          <p>
            Ваша тренировка подтверждена.
          </p>

          <div className="booking-summary">
            <strong>{selectedService.title}</strong>

            <span>
              {selectedDate.day}, {selectedDate.date}
            </span>

            <span>
              {selectedTime}
            </span>

            <span>
              Тренер: Алексей Петров
            </span>
          </div>

          <button
            className="primary-button"
            onClick={() => {
              setStep(1)
              setSelectedService(null)
              setSelectedDate(null)
              setSelectedTime(null)
              setName("")
              setPhone("")
            }}
          >
            Новая запись
          </button>
        </div>
      )}

    </div>
  )
}

export default App