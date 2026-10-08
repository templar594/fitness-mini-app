import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://script.google.com/macros/s/AKfycbxQWtDfb7XHPzDyKvfdLxWvaSc86Ra4iVAq2ZhsDSJqKik75JBNbh4Z87c2PPDWUvf-/exec";

function App() {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // =========================
  // ЗАГРУЗКА УСЛУГ
  // =========================

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setServices(
            data.services.filter((service) => service.active)
          );
        }
      })
      .catch((error) => {
        console.error("Ошибка загрузки услуг:", error);
      })
      .finally(() => {
        setLoadingServices(false);
      });
  }, []);

  // =========================
  // ДАТЫ
  // =========================

  const dates = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();

    date.setDate(date.getDate() + index);

    return {
      value: date.toISOString().split("T")[0],

      day: date.toLocaleDateString("ru-RU", {
        weekday: "short",
      }),

      number: date.getDate(),

      month: date.toLocaleDateString("ru-RU", {
        month: "short",
      }),
    };
  });

  // =========================
  // ПОЛУЧАЕМ СВОБОДНЫЕ ЧАСЫ
  // =========================

  const loadAvailableTimes = async (date) => {
    setLoadingTimes(true);
    setAvailableTimes([]);
    setSelectedTime(null);
    setBookingError("");

    try {
      const response = await fetch(
        `${API_URL}?action=slots&date=${date}`
      );

      const data = await response.json();

      if (data.success) {
        setAvailableTimes(data.slots);
      } else {
        setBookingError("Не удалось получить расписание");
      }
    } catch (error) {
      console.error(error);
      setBookingError("Ошибка загрузки расписания");
    } finally {
      setLoadingTimes(false);
    }
  };

  // =========================
  // ВЫБОР ДАТЫ
  // =========================

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    loadAvailableTimes(date);
  };

  // =========================
  // ЗАПИСЬ
  // =========================

  const handleBooking = async () => {
    if (
      !selectedService ||
      !selectedDate ||
      !selectedTime ||
      !name
    ) {
      return;
    }

    setBookingLoading(true);
    setBookingError("");

    const bookingData = {
      date: selectedDate,
      time: selectedTime,
      service: selectedService.name,
      client: name,
      telegramId: telegram,
      phone: "",
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.error || "Ошибка записи"
        );
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);

      setBookingError(
        error.message ||
          "Не удалось отправить запись"
      );

      // Если слот уже заняли —
      // обновляем список свободного времени
      if (selectedDate) {
        loadAvailableTimes(selectedDate);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // =========================
  // SUCCESS
  // =========================

  if (submitted) {
    return (
      <div className="app">
        <div className="success-screen">
          <div className="success-icon">✓</div>

          <h1>Заявка отправлена</h1>

          <p>
            {name}, ваша запись на тренировку принята.
          </p>

          <div className="success-card">
            <div>
              <span>Услуга</span>
              <strong>
                {selectedService?.name}
              </strong>
            </div>

            <div>
              <span>Дата</span>
              <strong>{selectedDate}</strong>
            </div>

            <div>
              <span>Время</span>
              <strong>{selectedTime}</strong>
            </div>

            <div>
              <span>Стоимость</span>
              <strong>
                {selectedService?.price} ₽
              </strong>
            </div>
          </div>

          <button
            className="main-button"
            onClick={() => {
              setSubmitted(false);
              setSelectedService(null);
              setSelectedDate(null);
              setSelectedTime(null);
              setAvailableTimes([]);
              setName("");
              setTelegram("");
            }}
          >
            Вернуться
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN
  // =========================

  return (
    <div className="app">

      {/* HERO */}

      <section className="hero">
        <img
          src="/trainer.jpg"
          alt="Алексей Ульянов"
          className="hero-image"
        />

        <div className="hero-overlay" />

        <div className="hero-content">

          <div className="hero-values">
            <span>СИЛА</span>
            <span>ВЫНОСЛИВОСТЬ</span>
            <span>РЕЗУЛЬТАТЫ</span>
          </div>

          <div className="hero-info">
            <h1>Алексей Ульянов</h1>
            <p>Персональный тренер</p>
          </div>

        </div>
      </section>

      {/* ABOUT */}

      <section className="section about">
        <div className="section-label">
          ТРЕНЕР
        </div>

        <h2>
          Тренировки под вашу цель
        </h2>

        <p>
          Персональные тренировки с
          индивидуальным подходом,
          контролем техники и программой
          под ваш уровень подготовки.
        </p>
      </section>

      {/* SERVICES */}

      <section className="section">

        <div className="section-label">
          УСЛУГИ
        </div>

        <h2>
          Выберите тренировку
        </h2>

        {loadingServices ? (

          <div className="loading">
            Загружаем услуги...
          </div>

        ) : services.length === 0 ? (

          <div className="empty">
            Услуги пока недоступны
          </div>

        ) : (

          <div className="services">

            {services.map((service) => (

              <button
                key={service.id}
                className={`service-card ${
                  selectedService?.id === service.id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedService(service)
                }
              >

                <div className="service-top">

                  <h3>
                    {service.name}
                  </h3>

                  <span className="service-price">
                    {service.price} ₽
                  </span>

                </div>

                <p>
                  {service.description}
                </p>

                <span className="service-duration">
                  {service.duration} минут
                </span>

              </button>

            ))}

          </div>

        )}

      </section>

      {/* DATE */}

      <section className="section">

        <div className="section-label">
          ДАТА
        </div>

        <h2>
          Выберите день
        </h2>

        <div className="dates">

          {dates.map((date) => (

            <button
              key={date.value}
              className={`date-card ${
                selectedDate === date.value
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleDateSelect(date.value)
              }
            >

              <span>
                {date.day}
              </span>

              <strong>
                {date.number}
              </strong>

              <small>
                {date.month}
              </small>

            </button>

          ))}

        </div>

      </section>

      {/* TIME */}

      {selectedDate && (

        <section className="section">

          <div className="section-label">
            ВРЕМЯ
          </div>

          <h2>
            Свободное время
          </h2>

          {loadingTimes ? (

            <div className="loading">
              Проверяем свободное время...
            </div>

          ) : availableTimes.length === 0 ? (

            <div className="empty">
              На этот день свободного времени нет
            </div>

          ) : (

            <div className="times">

              {availableTimes.map((time) => (

                <button
                  key={time}
                  className={`time-button ${
                    selectedTime === time
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedTime(time)
                  }
                >
                  {time}
                </button>

              ))}

            </div>

          )}

        </section>

      )}

      {/* CONTACT */}

      {selectedTime && (

        <section className="section">

          <div className="section-label">
            КОНТАКТЫ
          </div>

          <h2>
            Оставьте данные
          </h2>

          <div className="form">

            <input
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />

            <input
              type="text"
              placeholder="Telegram @username"
              value={telegram}
              onChange={(event) =>
                setTelegram(event.target.value)
              }
            />

          </div>

        </section>

      )}

      {/* BOOKING */}

      {selectedTime && (

        <section className="section booking-section">

          <div className="booking-summary">

            <div>
              <span>Услуга</span>

              <strong>
                {selectedService?.name}
              </strong>
            </div>

            <div>
              <span>Дата</span>

              <strong>
                {selectedDate}
              </strong>
            </div>

            <div>
              <span>Время</span>

              <strong>
                {selectedTime}
              </strong>
            </div>

            <div>
              <span>Стоимость</span>

              <strong>
                {selectedService?.price} ₽
              </strong>
            </div>

          </div>

          {bookingError && (

            <div className="empty">
              {bookingError}
            </div>

          )}

          <button
            className="main-button"
            disabled={
              !selectedService ||
              !name ||
              bookingLoading
            }
            onClick={handleBooking}
          >

            {bookingLoading
              ? "ОТПРАВЛЯЕМ..."
              : "ЗАПИСАТЬСЯ"}

          </button>

        </section>

      )}

      {/* LOCATION */}

      <section className="section location">

        <div className="section-label">
          ГДЕ
        </div>

        <h2>
          Alex Fitness
        </h2>

        <p>
          Рязань, Первомайский проспект,
          д. 70 корп. 1, лит. А
        </p>

        <a
          href="https://yandex.ru/maps/?text=Рязань%2C%20Первомайский%20проспект%2C%2070%20корпус%201"
          target="_blank"
          rel="noreferrer"
          className="map-button"
        >
          Открыть на карте
        </a>

      </section>

      {/* CONTACTS */}

      <section className="section contacts">

        <div className="section-label">
          КОНТАКТЫ
        </div>

        <a href="tel:+74912434364">
          +7 (4912) 43-43-64
        </a>

        <a href="tel:+74912906009">
          +7 (4912) 90-60-09
        </a>

        <a
          href="https://ryazan.alexfitness.ru/"
          target="_blank"
          rel="noreferrer"
        >
          ryazan.alexfitness.ru
        </a>

      </section>

      <footer>
        Alex Fitness · Персональный тренер
      </footer>

    </div>
  );
}

export default App;