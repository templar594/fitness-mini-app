import { useEffect, useMemo, useState } from "react";
import "./App.css";

const SERVICES = [
  {
    id: "personal",
    title: "Персональная тренировка",
    duration: "60 минут",
    price: 2000,
    icon: "🏋️",
  },
  {
    id: "gym",
    title: "Тренировка в зале",
    duration: "90 минут",
    price: 2500,
    icon: "💪",
  },
  {
    id: "online",
    title: "Онлайн-консультация",
    duration: "60 минут",
    price: 1500,
    icon: "💻",
  },
];

const TIMES = [
  "10:00",
  "11:30",
  "13:00",
  "15:00",
  "17:00",
  "18:30",
];

const WEEKDAYS = [
  "Вс",
  "Пн",
  "Вт",
  "Ср",
  "Чт",
  "Пт",
  "Сб",
];

function formatPrice(price) {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

function getNextDays(count = 6) {
  const result = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    result.push({
      id: date.toISOString().slice(0, 10),
      day: date.getDate(),
      weekday: WEEKDAYS[date.getDay()],
      month: date.toLocaleDateString("ru-RU", {
        month: "short",
      }),
    });
  }

  return result;
}

function App() {
  const dates = useMemo(() => getNextDays(6), []);

  const [selectedService, setSelectedService] = useState("personal");
  const [selectedDate, setSelectedDate] = useState(dates[0]?.id);
  const [selectedTime, setSelectedTime] = useState("11:30");

  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Если приложение открыто внутри Telegram —
    // автоматически подставляем имя пользователя.
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();

      const user = window.Telegram.WebApp.initDataUnsafe?.user;

      if (user) {
        const fullName = [user.first_name, user.last_name]
          .filter(Boolean)
          .join(" ");

        if (fullName) {
          setName(fullName);
        }

        if (user.username) {
          setTelegram(`@${user.username}`);
        }
      }
    }
  }, []);

  const currentService = SERVICES.find(
    (service) => service.id === selectedService
  );

  const currentDate = dates.find((date) => date.id === selectedDate);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Введите ваше имя");
      return;
    }

    setSubmitted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNewBooking = () => {
    setSubmitted(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="app">
      <div className="app-shell">
        {/* HEADER */}
        <header className="hero">
          <div className="hero-overlay" />

          <div className="hero-topbar">
            <button className="round-button" type="button">
              ←
            </button>

            <button className="round-button" type="button">
              ☰
            </button>
          </div>

          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-name">
                АЛЕКСЕЙ
                <br />
                УЛЬЯНОВ
              </div>

              <div className="hero-role">
                ПЕРСОНАЛЬНЫЙ ТРЕНЕР
              </div>
            </div>

            <div className="hero-values">
              <div className="hero-value">
                <span className="value-icon">◆</span>
                <span>СИЛА</span>
              </div>

              <div className="hero-value">
                <span className="value-icon">◷</span>
                <span>ВЫНОСЛИВОСТЬ</span>
              </div>

              <div className="hero-value">
                <span className="value-icon">▮</span>
                <span>РЕЗУЛЬТАТЫ</span>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="content">
          {/* SERVICES */}
          <section className="section">
            <h2>ВЫБЕРИТЕ ТРЕНИРОВКУ</h2>

            <div className="services">
              {SERVICES.map((service) => {
                const active = selectedService === service.id;

                return (
                  <button
                    key={service.id}
                    type="button"
                    className={`service-card ${
                      active ? "active" : ""
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="service-icon">
                      {service.icon}
                    </div>

                    <div className="service-info">
                      <div className="service-title">
                        {service.title}
                      </div>

                      <div className="service-meta">
                        {service.duration} ·{" "}
                        {formatPrice(service.price)}
                      </div>
                    </div>

                    <div
                      className={`radio ${
                        active ? "checked" : ""
                      }`}
                    >
                      {active && "✓"}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* DATE */}
          <section className="section">
            <h2>ВЫБЕРИТЕ ДАТУ</h2>

            <div className="dates">
              {dates.map((date) => {
                const active = selectedDate === date.id;

                return (
                  <button
                    key={date.id}
                    type="button"
                    className={`date-card ${
                      active ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelectedDate(date.id);
                      setSubmitted(false);
                    }}
                  >
                    <strong>{date.day}</strong>
                    <span>{date.weekday}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* TIME */}
          <section className="section">
            <h2>ВЫБЕРИТЕ ВРЕМЯ</h2>

            <div className="times">
              {TIMES.map((time) => {
                const active = selectedTime === time;

                return (
                  <button
                    key={time}
                    type="button"
                    className={`time-button ${
                      active ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelectedTime(time);
                      setSubmitted(false);
                    }}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </section>

          {/* USER DATA */}
          <form className="section" onSubmit={handleSubmit}>
            <h2>ВАШИ ДАННЫЕ</h2>

            <div className="form-fields">
              <label className="field">
                <span>Как вас зовут?</span>
                <input
                  type="text"
                  placeholder="Введите имя"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSubmitted(false);
                  }}
                />
              </label>

              <label className="field">
                <span>Telegram</span>
                <input
                  type="text"
                  placeholder="@username"
                  value={telegram}
                  onChange={(e) => {
                    setTelegram(e.target.value);
                    setSubmitted(false);
                  }}
                />
              </label>
            </div>

            <button className="book-button" type="submit">
              ЗАПИСАТЬСЯ
              <span>→</span>
            </button>
          </form>

          {/* SUCCESS */}
          {submitted && (
            <section className="success-card">
              <div className="success-icon">✓</div>

              <div className="success-content">
                <h3>ЗАПИСЬ ОФОРМЛЕНА!</h3>

                <p>
                  Алексей получит ваш запрос
                  <br />
                  и свяжется с вами.
                </p>

                <div className="booking-summary">
                  <div>
                    <span>Услуга</span>
                    <strong>{currentService?.title}</strong>
                  </div>

                  <div>
                    <span>Дата</span>
                    <strong>
                      {currentDate?.day} {currentDate?.month}
                    </strong>
                  </div>

                  <div>
                    <span>Время</span>
                    <strong>{selectedTime}</strong>
                  </div>

                  <div>
                    <span>Стоимость</span>
                    <strong>
                      {formatPrice(currentService?.price || 0)}
                    </strong>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* LOCATION */}
          <section className="section info-section">
            <h2>МЕСТО ТРЕНИРОВКИ</h2>

            <div className="info-card">
              <div className="info-card-icon">📍</div>

              <div className="info-card-content">
                <h3>Alex Fitness</h3>

                <p>
                  Рязань, Первомайский проспект,
                  <br />
                  д. 70 корп. 1, лит. А
                </p>

                <span className="location-note">
                  ТРЦ «Виктория Плаза»
                </span>
              </div>
            </div>

            <a
              className="map-button"
              href="https://yandex.ru/maps/?text=Рязань%2C%20Первомайский%20проспект%2C%2070%20корпус%201"
              target="_blank"
              rel="noreferrer"
            >
              <span>ОТКРЫТЬ В ЯНДЕКС КАРТАХ</span>
              <span>↗</span>
            </a>
          </section>

          {/* CONTACTS */}
          <section className="section info-section">
            <h2>КОНТАКТЫ</h2>

            <div className="contacts">
              <a
                href="tel:+74912434364"
                className="contact-card"
              >
                <span className="contact-icon">☎</span>

                <div>
                  <span>Телефон</span>
                  <strong>+7 (4912) 43-43-64</strong>
                </div>
              </a>

              <a
                href="tel:+74912906009"
                className="contact-card"
              >
                <span className="contact-icon">☎</span>

                <div>
                  <span>Телефон</span>
                  <strong>+7 (4912) 90-60-09</strong>
                </div>
              </a>

              <a
                href="https://ryazan.alexfitness.ru/"
                target="_blank"
                rel="noreferrer"
                className="contact-card"
              >
                <span className="contact-icon">↗</span>

                <div>
                  <span>Сайт клуба</span>
                  <strong>ryazan.alexfitness.ru</strong>
                </div>
              </a>
            </div>
          </section>

          {/* BOTTOM */}
          <footer className="footer">
            <div className="footer-name">
              АЛЕКСЕЙ УЛЬЯНОВ
            </div>

            <div className="footer-role">
              ПЕРСОНАЛЬНЫЙ ТРЕНЕР
            </div>

            <div className="footer-line" />
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;