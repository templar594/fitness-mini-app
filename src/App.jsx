import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://script.google.com/macros/s/AKfycbxQWtDfb7XHPzDyKvfdLxWvaSc86Ra4iVAq2ZhsDSJqKik75JBNbh4Z87c2PPDWUvf-/exec";

const PHONE = "+7 (920) 995-65-45";
const PHONE_LINK = "tel:+79209956545";
const INSTAGRAM_URL = "https://www.instagram.com/ulyanov_fit/";
const VK_URL = "https://vk.ru/ulyanov_fit";

const MAP_URL =
  "https://yandex.ru/maps/?text=Рязань%2C%20Первомайский%20проспект%2C%2070%20корпус%201";


function App() {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [selectedService, setSelectedService] = useState(null);
  const [bookingMode, setBookingMode] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  /*
    ==========================================================
    ГЛАВНОЕ ИЗМЕНЕНИЕ

    Теперь ВСЕ спойлеры управляются одним состоянием.

    activeSpoiler:
      null
      "survey"
      "old-client"
      "consultation-group"
      "online-group"
      "offline-group"
      "nutrition-group"
      "service:..."
      "offline:..."
  */

  const [activeSpoiler, setActiveSpoiler] = useState(null);
  const [activeDetail, setActiveDetail] = useState(null);


  /* Опрос */

  const [surveyStep, setSurveyStep] = useState(1);

  const [surveyGoals, setSurveyGoals] =
    useState([]);

  const [surveyExperience, setSurveyExperience] =
    useState("");

  const [surveyProblems, setSurveyProblems] =
    useState([]);

  const [surveyFormat, setSurveyFormat] =
    useState("");

  const [surveyComment, setSurveyComment] =
    useState("");

  const [surveyName, setSurveyName] =
    useState("");

  const [surveyPhone, setSurveyPhone] =
    useState("");

  const [surveyTelegram, setSurveyTelegram] =
    useState("");

  const [recommendation, setRecommendation] =
    useState(null);

  const [surveySending, setSurveySending] =
    useState(false);

  const [surveySent, setSurveySent] =
    useState(false);


  /* ==========================================================
     LOAD SERVICES
  ========================================================== */

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setServices(
            (data.services || []).filter(
              (service) => service.active
            )
          );
        }
      })
      .catch((error) => {
        console.error(
          "Ошибка загрузки услуг:",
          error
        );
      })
      .finally(() => {
        setLoadingServices(false);
      });
  }, []);


  /* ==========================================================
     DATES
  ========================================================== */

  const dates = Array.from(
    { length: 14 },
    (_, index) => {
      const date = new Date();

      date.setDate(
        date.getDate() + index
      );

      return {
        value: date
          .toISOString()
          .split("T")[0],

        day: date.toLocaleDateString(
          "ru-RU",
          {
            weekday: "short",
          }
        ),

        number: date.getDate(),

        month: date.toLocaleDateString(
          "ru-RU",
          {
            month: "short",
          }
        ),
      };
    }
  );


  /* ==========================================================
     SERVICE GROUPS
  ========================================================== */

  const consultationServices =
    services.filter((service) =>
      service.name
        .toLowerCase()
        .includes("консульта")
    );


  const onlineServices =
    services.filter((service) =>
      service.name
        .toLowerCase()
        .includes("онлайн")
    );


  const nutritionServices =
    services.filter((service) =>
      service.name
        .toLowerCase()
        .includes("пит")
    );


  const virtualOnlineServices = [
    {
      id: "online30",
      name: "Онлайн сопровождение — 30 дней",
      description: "",
      price: 0,
      active: true,
    },
    {
      id: "online90",
      name: "Онлайн сопровождение — 90 дней",
      description: "",
      price: 0,
      active: true,
    },
  ];


  const virtualNutritionService = {
    id: "nutrition",
    name: "Сопровождение по питанию",
    description: "",
    price: 0,
    active: true,
  };


  const virtualConsultationService = {
    id: "consultation",
    name: "Консультация",
    description: "",
    price: 0,
    active: true,
  };


  const subscriptionBookingService = {
    id: "subscription-booking",
    name: "Запись на тренировку по абонементу",
    description: "",
    price: 0,
    active: true,
  };


  /* ==========================================================
     UNIVERSAL SPOILER
  ========================================================== */

  const toggleSpoiler = (id) => {
    setActiveDetail(null);
    setActiveSpoiler(
      activeSpoiler === id
        ? null
        : id
    );
  };


  const closeAllSpoilers = () => {
    setActiveSpoiler(null);
    setActiveDetail(null);
  };


  /* ==========================================================
     DESCRIPTIONS
  ========================================================== */

  const getDescription = (service) => {
    const name =
      service.name.toLowerCase();


    if (name.includes("консульта")) {
      return {
        text:
          "Разбор вашей задачи, текущего состояния и целей. Поможет понять, с чего начать и какой формат работы будет оптимальным.",

        items: [
          "Разбор целей",
          "Оценка текущей ситуации",
          "Ответы на вопросы",
          "Рекомендации по дальнейшим шагам",
        ],
      };
    }


    if (name.includes("90")) {
      return {
        text:
          "Флагманский формат для комплексной работы над формой, силой, техникой и результатом.",

        items: [
          "Индивидуальная система тренировок",
          "Регулярная корректировка",
          "Контроль динамики",
          "Работа с техникой",
          "Рекомендации по питанию",
          "Постоянная обратная связь",
        ],
      };
    }


    if (name.includes("30")) {
      return {
        text:
          "Индивидуальное онлайн сопровождение для тех, кто хочет выстроить системный тренировочный процесс под свою цель.",

        items: [
          "Индивидуальная система тренировок",
          "Корректировка процесса",
          "Контроль динамики",
          "Обратная связь",
        ],
      };
    }


    if (name.includes("пит")) {
      return {
        text:
          "Работа с питанием под вашу цель без универсальных шаблонов.",

        items: [
          "Разбор текущего питания",
          "Рекомендации",
          "Корректировка рациона",
          "Контроль динамики",
        ],
      };
    }


    return {
      text:
        service.description ||
        "Индивидуальный формат работы с тренером.",

      items: [],
    };
  };


  /* ==========================================================
     OFFLINE DESCRIPTIONS
  ========================================================== */

  const offlineDescriptions = {
    blocks: {
      text:
        "Блок тренировочных занятий с фиксированным количеством тренировок. Вы выбираете пакет, дату начала и удобное время.",

      items: [
        "5, 10 или 20 тренировок",
        "Выбор даты начала",
        "Предпочтительное время",
        "Дальнейшее расписание согласовывается с тренером",
      ],
    },

    split: {
      text:
        "Сплит-тренировки в группе для тех, кому подходит формат совместных тренировок с разделением тренировочного процесса.",

      items: [
        "5, 10 или 20 тренировок",
        "Групповой формат",
        "Выбор даты начала",
        "Согласование расписания с тренером",
      ],
    },

    personal: {
      text:
        "Персональные тренировки один на один с тренером с учётом вашей цели, уровня подготовки и текущих возможностей.",

      items: [
        "5, 10 или 20 тренировок",
        "Индивидуальная работа",
        "Контроль техники",
        "Согласование дальнейшего расписания",
      ],
    },
  };


  /* ==========================================================
     BOOKING META
  ========================================================== */

  const getBookingMeta = (service) => {
    if (!service) {
      return {
        type: "single",
        quantity: 1,
        requiresTime: true,
      };
    }


    if (
      bookingMode ===
      "subscription"
    ) {
      return {
        type: "subscription",
        quantity: "",
        requiresTime: true,
      };
    }


    const name =
      service.name.toLowerCase();


    if (
      name.includes("30 дней")
    ) {
      return {
        type: "package",
        quantity: "30 дней",
        requiresTime: false,
      };
    }


    if (
      name.includes("90 дней")
    ) {
      return {
        type: "package",
        quantity: "90 дней",
        requiresTime: false,
      };
    }


    if (
      name.includes("5 тренировок") ||
      name.includes("10 тренировок") ||
      name.includes("20 тренировок")
    ) {
      const match =
        name.match(/5|10|20/);


      return {
        type: "package",
        quantity: match
          ? match[0]
          : "Пакет",

        requiresTime: true,
      };
    }


    return {
      type: "single",
      quantity: 1,
      requiresTime: true,
    };
  };


  /* ==========================================================
     SELECT SERVICE
  ========================================================== */

  const selectService = (service) => {

    /*
      При выборе услуги:
      закрываем абсолютно все спойлеры.
    */

    closeAllSpoilers();

    setBookingMode("service");

    setSelectedService(service);

    setSelectedDate("");

    setSelectedTime("");

    setAvailableTimes([]);

    setBookingError("");

    setTimeout(() => {
      document
        .getElementById("booking")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };


  /* ==========================================================
     SUBSCRIPTION BOOKING
  ========================================================== */

  const startSubscriptionBooking =
    () => {

      closeAllSpoilers();

      setBookingMode(
        "subscription"
      );

      setSelectedService(
        subscriptionBookingService
      );

      setSelectedDate("");

      setSelectedTime("");

      setAvailableTimes([]);

      setBookingError("");

      setTimeout(() => {
        document
          .getElementById("booking")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    };


  /* ==========================================================
     LOAD TIMES
  ========================================================== */

  const loadAvailableTimes =
    async (date) => {

      setLoadingTimes(true);

      setAvailableTimes([]);

      setSelectedTime("");

      setBookingError("");

      try {
        const response =
          await fetch(
            `${API_URL}?action=slots&date=${date}`
          );

        const data =
          await response.json();


        if (data.success) {
          setAvailableTimes(
            data.slots || []
          );
        } else {
          setBookingError(
            data.error ||
              "Не удалось загрузить расписание"
          );
        }

      } catch (error) {

        console.error(error);

        setBookingError(
          "Ошибка загрузки расписания"
        );

      } finally {
        setLoadingTimes(false);
      }
    };


  /* ==========================================================
     SELECT DATE
  ========================================================== */

  const handleDateSelect = (
    date
  ) => {

    setSelectedDate(date);

    setSelectedTime("");

    const meta =
      getBookingMeta(
        selectedService
      );


    if (meta.requiresTime) {
      loadAvailableTimes(date);
    } else {
      setAvailableTimes([]);
    }
  };


  /* ==========================================================
     ARRAY TOGGLE
  ========================================================== */

  const toggleArray = (
    value,
    array,
    setter
  ) => {

    if (array.includes(value)) {

      setter(
        array.filter(
          (item) =>
            item !== value
        )
      );

    } else {

      setter([
        ...array,
        value,
      ]);
    }
  };


  /* ==========================================================
     RECOMMENDATION
  ========================================================== */

  const calculateRecommendation =
    () => {

      const goals =
        surveyGoals
          .join(" ")
          .toLowerCase();

      const format =
        surveyFormat.toLowerCase();

      const problems =
        surveyProblems
          .join(" ")
          .toLowerCase();


      if (
        format.includes("питанию") &&
        !goals.includes("восстанов")
      ) {
        return {
          serviceName:
            "Сопровождение по питанию",

          reason:
            "Вы указали, что основной интерес — работа с питанием. Поэтому логично начать именно с этого направления.",

          type: "nutrition",
        };
      }


      if (
        goals.includes("восстанов") ||
        problems.includes("травм")
      ) {
        return {
          serviceName:
            "Консультация",

          reason:
            "В вашей ситуации сначала важно разобраться с текущими ограничениями и определить дальнейший план работы.",

          type: "consultation",
        };
      }


      if (
        format.includes("персональ")
      ) {
        return {
          serviceName:
            "Персональные тренировки",

          reason:
            "Вы выбрали персональную работу, поэтому оптимально начать с индивидуальных тренировок.",

          type: "personal",
        };
      }


      if (
        format.includes("сплит") ||
        format.includes("группе")
      ) {
        return {
          serviceName:
            "Сплит-тренировки в группе",

          reason:
            "Вы указали групповой формат, поэтому вам подойдёт сплит-тренировка.",

          type: "split",
        };
      }


      if (
        format.includes("онлайн")
      ) {

        if (
          surveyGoals.length >= 2
        ) {
          return {
            serviceName:
              "Онлайн сопровождение — 90 дней",

            reason:
              "У вас комплексная задача, поэтому лучше подойдёт длительная системная работа с регулярной корректировкой.",

            type: "online90",
          };
        }


        return {
          serviceName:
            "Онлайн сопровождение — 30 дней",

          reason:
            "Для вашей задачи оптимально начать с месячного онлайн-сопровождения.",

          type: "online30",
        };
      }


      if (
        surveyGoals.length >= 2
      ) {
        return {
          serviceName:
            "Онлайн сопровождение — 90 дней",

          reason:
            "У вас несколько целей одновременно, поэтому лучше всего подходит системная работа на протяжении нескольких месяцев.",

          type: "online90",
        };
      }


      return {
        serviceName:
          "Консультация",

        reason:
          "Лучше начать с консультации, чтобы подробнее разобрать вашу задачу и подобрать оптимальный формат.",

        type: "consultation",
      };
    };


  /* ==========================================================
     FIND RECOMMENDED SERVICE
  ========================================================== */

  const findRecommendedService =
    () => {

      if (!recommendation) {
        return null;
      }


      const target =
        recommendation.serviceName
          .toLowerCase();


      const exact =
        services.find(
          (service) =>
            service.name
              .toLowerCase()
              .includes(target)
        );


      if (exact) {
        return exact;
      }


      if (
        recommendation.type ===
        "consultation"
      ) {
        return virtualConsultationService;
      }


      if (
        recommendation.type ===
        "online30"
      ) {
        return virtualOnlineServices[0];
      }


      if (
        recommendation.type ===
        "online90"
      ) {
        return virtualOnlineServices[1];
      }


      if (
        recommendation.type ===
        "nutrition"
      ) {
        return virtualNutritionService;
      }


      return null;
    };


  /* ==========================================================
     COMPLETE SURVEY
  ========================================================== */

  const completeSurvey =
    async () => {

      if (
        !surveyName.trim() ||
        !surveyPhone.trim()
      ) {
        return;
      }


      const result =
        calculateRecommendation();


      setRecommendation(result);

      setSurveySending(true);


      try {

        const response =
          await fetch(API_URL, {
            method: "POST",

            body: JSON.stringify({
              action: "survey",

              client:
                surveyName.trim(),

              phone:
                surveyPhone.trim(),

              telegramId:
                surveyTelegram.trim(),

              surveyGoals:
                surveyGoals.join(", "),

              surveyExperience,

              surveyProblems:
                surveyProblems.join(", "),

              surveyFormat,

              surveyResult:
                surveyComment.trim(),

              recommendation:
                `${result.serviceName} — ${result.reason}`,
            }),
          });


        const data =
          await response.json();


        if (!data.success) {
          throw new Error(
            data.error ||
              "Не удалось отправить анкету"
          );
        }


        setSurveySent(true);

      } catch (error) {

        console.error(error);

        alert(
          error.message ||
            "Не удалось отправить анкету"
        );

      } finally {

        setSurveySending(false);
      }
    };


  /* ==========================================================
     BOOKING
  ========================================================== */

  const handleBooking =
    async () => {

      const meta =
        getBookingMeta(
          selectedService
        );


      if (
        !selectedService ||
        !selectedDate ||
        !name.trim() ||
        !phone.trim() ||
        (
          meta.requiresTime &&
          !selectedTime
        )
      ) {
        return;
      }


      setBookingLoading(true);

      setBookingError("");


      try {

        const response =
          await fetch(API_URL, {
            method: "POST",

            body: JSON.stringify({

              action: "booking",

              bookingType:
                meta.type ===
                "subscription"
                  ? "По действующему абонементу"
                  : meta.type ===
                    "package"
                  ? "Пакет"
                  : "Разовая",

              service:
                selectedService.name,

              quantity:
                meta.quantity,

              startDate:
                selectedDate,

              time:
                selectedTime,

              client:
                name.trim(),

              telegramId:
                telegram.trim(),

              phone:
                phone.trim(),

              surveyGoals:
                surveyGoals.join(", "),

              surveyExperience,

              surveyProblems:
                surveyProblems.join(", "),

              surveyFormat,

              surveyResult:
                surveyComment.trim(),

              recommendation:
                recommendation
                  ? recommendation.serviceName
                  : "",
            }),
          });


        const data =
          await response.json();


        if (!data.success) {
          throw new Error(
            data.error ||
              "Не удалось создать заявку"
          );
        }


        setSubmitted(true);

      } catch (error) {

        console.error(error);

        setBookingError(
          error.message
        );


        if (
          selectedDate &&
          getBookingMeta(
            selectedService
          ).requiresTime
        ) {
          loadAvailableTimes(
            selectedDate
          );
        }

      } finally {

        setBookingLoading(false);
      }
    };


  /* ==========================================================
     SUCCESS
  ========================================================== */

  if (submitted) {

    return (
      <div className="app">

        <div className="success-screen">

          <div className="success-icon">
            ✓
          </div>

          <div className="section-label">
            ЗАЯВКА
          </div>

          <h1>
            Заявка отправлена
          </h1>

          <p>
            {name}, Алексей получил вашу заявку.
          </p>


          <div className="success-card">

            <div>
              <span>
                Формат
              </span>

              <strong>
                {selectedService?.name}
              </strong>
            </div>


            <div>
              <span>
                Дата
              </span>

              <strong>
                {selectedDate}
              </strong>
            </div>


            {selectedTime && (
              <div>
                <span>
                  Время
                </span>

                <strong>
                  {selectedTime}
                </strong>
              </div>
            )}

          </div>


          <button
            className="main-button"
            onClick={() => {

              setSubmitted(false);

              setSelectedService(null);

              setBookingMode(null);

              setSelectedDate("");

              setSelectedTime("");

              setName("");

              setPhone("");

              setTelegram("");

              closeAllSpoilers();
            }}
          >
            Вернуться
          </button>

        </div>

      </div>
    );
  }


  /* ==========================================================
     MAIN
  ========================================================== */

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

        <div className="hero-role">
          Тренер методист
          <br />
          по физическому развитию
        </div>


        <div className="hero-content">

          <h1>
            Алексей
            <br />
            Ульянов
          </h1>


          <div className="hero-values">

            <span>СИЛА</span>

            <span>ФОРМА</span>

            <span>ТЕХНИКА</span>

            <span>ВОССТАНОВЛЕНИЕ</span>

          </div>


          <div className="hero-slogan">
            Создаю систему под человека,
            <br />
            а не загоняю под шаблон
          </div>

        </div>

      </section>


      {/* EXPERIENCE */}

      <section className="section experience-section">

        <div className="section-label">
          ОПЫТ И ПРАКТИКА
        </div>


        <div className="experience-grid">

          <div className="experience-card">

            <strong>19</strong>

            <span>
              лет личного
              <br />
              тренировочного опыта
            </span>

          </div>


          <div className="experience-divider" />


          <div className="experience-card">

            <strong>7</strong>

            <span>
              лет
              <br />
              практики
            </span>

          </div>

        </div>

      </section>


      {/* ABOUT */}

      <section className="section about-trainer">

        <div className="section-label">
          О ТРЕНЕРЕ
        </div>


        <h2>
          Система под вашу цель
        </h2>


        <p className="about-text">
          Создаю систему под человека,
          а не загоняю под шаблон.
          Работаю с физической формой,
          техникой и функциональностью,
          учитывая индивидуальные цели
          и возможности человека.
        </p>


        <div className="focus-grid">

          <div>Сила</div>

          <div>Техника</div>

          <div>Форма</div>

          <div>Рекомпозиция</div>

          <div>Снижение веса</div>

          <div>Функциональность</div>

          <div>
            Подготовка к нормативам
          </div>

          <div>
            Восстановление после травм
          </div>

        </div>

      </section>


      {/* NEW CLIENTS */}

      <section className="section survey-section">

        <div className="section-label">
          ДЛЯ НОВЫХ КЛИЕНТОВ
        </div>


        <button
          className={`survey-intro ${
            activeSpoiler ===
            "survey"
              ? "open"
              : ""
          }`}
          onClick={() =>
            toggleSpoiler(
              "survey"
            )
          }
        >

          <div>

            <span className="survey-kicker">
              🎯 ПЕРВАЯ ВСТРЕЧА
            </span>

            <strong>
              Расскажите о своей цели
            </strong>

            <small>
              Несколько вопросов,
              чтобы подобрать
              подходящий формат
            </small>

          </div>


          <span className="survey-arrow">
            {activeSpoiler ===
            "survey"
              ? "−"
              : "+"}
          </span>

        </button>


        {activeSpoiler ===
          "survey" && (

          <div className="survey-content">

            {surveyStep === 1 && (
              <div className="survey-step">

                <span className="survey-progress">
                  1 / 6
                </span>

                <h3>
                  Чего вы хотите добиться?
                </h3>

                <p>
                  Можно выбрать несколько вариантов
                </p>


                <div className="survey-options">

                  {[
                    "🔥 Снижение веса",
                    "💪 Набор мышечной массы",
                    "🏋️ Стать сильнее",
                    "🧍 Улучшить форму",
                    "🔄 Рекомпозиция",
                    "⚡ Улучшить функциональность",
                    "🎯 Подготовиться к нормативам",
                    "🩹 Восстановление после травмы",
                  ].map(
                    (option) => (
                      <button
                        key={option}
                        className={`survey-option ${
                          surveyGoals.includes(
                            option
                          )
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          toggleArray(
                            option,
                            surveyGoals,
                            setSurveyGoals
                          )
                        }
                      >
                        {option}
                      </button>
                    )
                  )}

                </div>


                <button
                  className="survey-next"
                  disabled={
                    surveyGoals.length === 0
                  }
                  onClick={() =>
                    setSurveyStep(2)
                  }
                >
                  Далее
                </button>

              </div>
            )}


            {surveyStep === 2 && (
              <div className="survey-step">

                <span className="survey-progress">
                  2 / 6
                </span>

                <h3>
                  Какой у вас тренировочный опыт?
                </h3>


                <div className="survey-options">

                  {[
                    "Начинаю с нуля",
                    "Был опыт, но сейчас не тренируюсь",
                    "Тренируюсь регулярно",
                    "Большой тренировочный опыт",
                  ].map(
                    (option) => (
                      <button
                        key={option}
                        className={`survey-option ${
                          surveyExperience ===
                          option
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          setSurveyExperience(
                            option
                          )
                        }
                      >
                        {option}
                      </button>
                    )
                  )}

                </div>


                <div className="survey-navigation">

                  <button
                    className="survey-back"
                    onClick={() =>
                      setSurveyStep(1)
                    }
                  >
                    Назад
                  </button>


                  <button
                    className="survey-next"
                    disabled={
                      !surveyExperience
                    }
                    onClick={() =>
                      setSurveyStep(3)
                    }
                  >
                    Далее
                  </button>

                </div>

              </div>
            )}


            {surveyStep === 3 && (
              <div className="survey-step">

                <span className="survey-progress">
                  3 / 6
                </span>

                <h3>
                  Что сейчас мешает получить результат?
                </h3>

                <p>
                  Можно выбрать несколько вариантов
                </p>


                <div className="survey-options">

                  {[
                    "Не знаю, как правильно тренироваться",
                    "Не понимаю, как питаться",
                    "Нет стабильного результата",
                    "Не хватает дисциплины",
                    "Не получается составить программу",
                    "Есть ограничения после травм",
                    "Не хватает времени",
                    "Другое",
                  ].map(
                    (option) => (
                      <button
                        key={option}
                        className={`survey-option ${
                          surveyProblems.includes(
                            option
                          )
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          toggleArray(
                            option,
                            surveyProblems,
                            setSurveyProblems
                          )
                        }
                      >
                        {option}
                      </button>
                    )
                  )}

                </div>


                <div className="survey-navigation">

                  <button
                    className="survey-back"
                    onClick={() =>
                      setSurveyStep(2)
                    }
                  >
                    Назад
                  </button>


                  <button
                    className="survey-next"
                    disabled={
                      surveyProblems.length ===
                      0
                    }
                    onClick={() =>
                      setSurveyStep(4)
                    }
                  >
                    Далее
                  </button>

                </div>

              </div>
            )}


            {surveyStep === 4 && (
              <div className="survey-step">

                <span className="survey-progress">
                  4 / 6
                </span>

                <h3>
                  Какой формат вам интересен?
                </h3>


                <div className="survey-options">

                  {[
                    "Персональные тренировки",
                    "Сплит / тренировки в группе",
                    "Онлайн сопровождение",
                    "Сопровождение по питанию",
                    "Пока не знаю — хочу рекомендацию",
                  ].map(
                    (option) => (
                      <button
                        key={option}
                        className={`survey-option ${
                          surveyFormat ===
                          option
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          setSurveyFormat(
                            option
                          )
                        }
                      >
                        {option}
                      </button>
                    )
                  )}

                </div>


                <div className="survey-navigation">

                  <button
                    className="survey-back"
                    onClick={() =>
                      setSurveyStep(3)
                    }
                  >
                    Назад
                  </button>


                  <button
                    className="survey-next"
                    disabled={
                      !surveyFormat
                    }
                    onClick={() =>
                      setSurveyStep(5)
                    }
                  >
                    Далее
                  </button>

                </div>

              </div>
            )}


            {surveyStep === 5 && (
              <div className="survey-step">

                <span className="survey-progress">
                  5 / 6
                </span>

                <h3>
                  Что ещё важно учесть?
                </h3>

                <p>
                  Комментарий необязателен
                </p>


                <textarea
                  className="survey-textarea"
                  value={surveyComment}
                  onChange={(event) =>
                    setSurveyComment(
                      event.target.value
                    )
                  }
                  placeholder="Например: хочу заниматься утром, есть старые ограничения, есть конкретная цель..."
                  rows="5"
                />


                <div className="survey-navigation">

                  <button
                    className="survey-back"
                    onClick={() =>
                      setSurveyStep(4)
                    }
                  >
                    Назад
                  </button>


                  <button
                    className="survey-next"
                    onClick={() =>
                      setSurveyStep(6)
                    }
                  >
                    Далее
                  </button>

                </div>

              </div>
            )}


            {surveyStep === 6 &&
              !surveySent && (
                <div className="survey-step">

                  <span className="survey-progress">
                    6 / 6
                  </span>

                  <h3>
                    Контакты
                  </h3>

                  <p>
                    Имя и Фамилия и телефон
                    обязательны.
                    Telegram можно указать
                    по желанию.
                  </p>


                  <div className="form">

                    <input
                      type="text"
                      placeholder="Имя и Фамилия *"
                      value={surveyName}
                      onChange={(event) =>
                        setSurveyName(
                          event.target.value
                        )
                      }
                    />


                    <input
                      type="tel"
                      placeholder="Номер телефона *"
                      value={surveyPhone}
                      onChange={(event) =>
                        setSurveyPhone(
                          event.target.value
                        )
                      }
                    />


                    <input
                      type="text"
                      placeholder="Telegram @username — необязательно"
                      value={surveyTelegram}
                      onChange={(event) =>
                        setSurveyTelegram(
                          event.target.value
                        )
                      }
                    />

                  </div>


                  <button
                    className="survey-next"
                    disabled={
                      !surveyName.trim() ||
                      !surveyPhone.trim() ||
                      surveySending
                    }
                    onClick={
                      completeSurvey
                    }
                  >
                    {surveySending
                      ? "ОТПРАВЛЯЕМ..."
                      : "ПОЛУЧИТЬ РЕКОМЕНДАЦИЮ"}
                  </button>

                </div>
              )}


            {surveySent &&
              recommendation && (
                <div className="survey-complete">

                  <div className="survey-complete-icon">
                    ✓
                  </div>

                  <h3>
                    Мы подобрали формат
                  </h3>

                  <p>
                    По вашим ответам
                    лучше всего подходит:
                  </p>


                  <div className="recommendation-card">

                    <span>
                      РЕКОМЕНДАЦИЯ
                    </span>

                    <strong>
                      {recommendation.serviceName}
                    </strong>

                    <p>
                      {recommendation.reason}
                    </p>

                  </div>


                  {findRecommendedService() && (
                    <button
                      className="survey-services-button"
                      onClick={() =>
                        selectService(
                          findRecommendedService()
                        )
                      }
                    >
                      Выбрать этот формат
                    </button>
                  )}

                </div>
              )}

          </div>
        )}

      </section>


      {/* OLD CLIENTS */}

      <section className="section old-client-section">

        <div className="section-label">
          ДЛЯ ПОСТОЯННЫХ КЛИЕНТОВ
        </div>


        <button
          className="old-client-header"
          onClick={() =>
            toggleSpoiler(
              "old-client"
            )
          }
        >

          <div>

            <strong>
              Я уже знаю, что хочу
            </strong>

            <small>
              Пропустить знакомство и сразу
              выбрать нужный формат
            </small>

          </div>


          <span>
            {activeSpoiler ===
            "old-client"
              ? "−"
              : "+"}
          </span>

        </button>


        {activeSpoiler ===
          "old-client" && (

          <div className="old-client-content">

            <button
              className="subscription-booking-card"
              onClick={
                startSubscriptionBooking
              }
            >

              <div className="subscription-booking-icon">
                ✓
              </div>


              <div className="subscription-booking-text">

                <strong>
                  Записаться на тренировку
                </strong>

                <span>
                  У меня уже есть оплаченный
                  пакет / абонемент
                </span>

              </div>


              <b>
                Выбрать →
              </b>

            </button>


            <div className="old-client-divider">
              или выбрать другую услугу
            </div>


            <p>
              Выберите нужный формат,
              если хотите приобрести новую услугу.
            </p>


            <div className="old-client-services">

              {[
                ...services,
                ...virtualOnlineServices,
                virtualNutritionService,
                virtualConsultationService,
              ]
                .filter(
                  (service, index, array) =>
                    array.findIndex(
                      (item) =>
                        item.name ===
                        service.name
                    ) === index
                )
                .map(
                  (service) => (
                    <button
                      key={`old-${service.id}`}
                      className="old-client-service"
                      onClick={() =>
                        selectService(
                          service
                        )
                      }
                    >

                      <span>
                        {service.name}
                      </span>

                      <b>
                        Выбрать →
                      </b>

                    </button>
                  )
                )}

            </div>

          </div>
        )}

      </section>


      {/* SERVICES */}

      <section
        className="section services-section"
        id="services"
      >

        <div className="section-label">
          УСЛУГИ
        </div>

        <h2>
          Выберите свой формат
        </h2>

        {loadingServices ? (
          <div className="loading">
            Загружаем услуги...
          </div>
        ) : (
          <div className="service-groups">

            {/* ONLINE */}
            <div className="service-group featured-group">
              <button
                className="group-header"
                onClick={() => toggleSpoiler("online-group")}
              >
                <div>
                  <div className="group-title-line">
                    <span className="group-kicker">ОНЛАЙН</span>
                    <span className="hot-badge">🔥 ПОПУЛЯРНОЕ</span>
                  </div>
                  <strong>Онлайн сопровождение</strong>
                </div>
                <span className="group-arrow">
                  {activeSpoiler === "online-group" ? "−" : "+"}
                </span>
              </button>

              {activeSpoiler === "online-group" && (
                <div className="group-content">
                  {onlineServices.length
                    ? onlineServices.map((service) => (
                        <ServiceOption
                          key={service.id}
                          service={service}
                          flagship={service.name.toLowerCase().includes("90")}
                          activeDetail={activeDetail}
                          setActiveDetail={setActiveDetail}
                          onSelect={selectService}
                          getDescription={getDescription}
                        />
                      ))
                    : virtualOnlineServices.map((service) => (
                        <ServiceOption
                          key={service.id}
                          service={service}
                          flagship={service.id === "online90"}
                          activeDetail={activeDetail}
                          setActiveDetail={setActiveDetail}
                          onSelect={selectService}
                          getDescription={getDescription}
                        />
                      ))}
                </div>
              )}
            </div>

            {/* CONSULTATION */}
            <div className="service-group">
              <button
                className="group-header"
                onClick={() => toggleSpoiler("consultation-group")}
              >
                <div>
                  <span className="group-kicker">ИНДИВИДУАЛЬНО</span>
                  <strong>Консультация</strong>
                </div>
                <span className="group-arrow">
                  {activeSpoiler === "consultation-group" ? "−" : "+"}
                </span>
              </button>

              {activeSpoiler === "consultation-group" && (
                <ConsultationContent
                  service={consultationServices[0] || virtualConsultationService}
                  activeDetail={activeDetail}
                  setActiveDetail={setActiveDetail}
                  onSelect={selectService}
                  getDescription={getDescription}
                />
              )}
            </div>

            {/* OFFLINE */}
            <div className="service-group">
              <button
                className="group-header"
                onClick={() => toggleSpoiler("offline-group")}
              >
                <div>
                  <span className="group-kicker">В ЗАЛЕ</span>
                  <strong>Оффлайн тренировки</strong>
                </div>
                <span className="group-arrow">
                  {activeSpoiler === "offline-group" ? "−" : "+"}
                </span>
              </button>

              {activeSpoiler === "offline-group" && (
                <div className="offline-content">
                  <OfflineCategory
                    title="Блоки тренировочных занятий"
                    type="blocks"
                    description={offlineDescriptions.blocks}
                    activeDetail={activeDetail}
                    setActiveDetail={setActiveDetail}
                    onSelect={selectService}
                  />
                  <OfflineCategory
                    title="Сплит-тренировки в группе"
                    type="split"
                    description={offlineDescriptions.split}
                    activeDetail={activeDetail}
                    setActiveDetail={setActiveDetail}
                    onSelect={selectService}
                  />
                  <OfflineCategory
                    title="Персональные тренировки"
                    type="personal"
                    description={offlineDescriptions.personal}
                    activeDetail={activeDetail}
                    setActiveDetail={setActiveDetail}
                    onSelect={selectService}
                  />
                </div>
              )}
            </div>

            {/* NUTRITION */}
            <div className="service-group">
              <button
                className="group-header"
                onClick={() => toggleSpoiler("nutrition-group")}
              >
                <div>
                  <span className="group-kicker">ОТДЕЛЬНО</span>
                  <strong>Сопровождение по питанию</strong>
                </div>
                <span className="group-arrow">
                  {activeSpoiler === "nutrition-group" ? "−" : "+"}
                </span>
              </button>

              {activeSpoiler === "nutrition-group" && (
                <div className="group-content">
                  {nutritionServices.length
                    ? nutritionServices.map((service) => (
                        <ServiceOption
                          key={service.id}
                          service={service}
                          flagship={false}
                          activeDetail={activeDetail}
                          setActiveDetail={setActiveDetail}
                          onSelect={selectService}
                          getDescription={getDescription}
                        />
                      ))
                    : (
                      <ServiceOption
                        service={virtualNutritionService}
                        flagship={false}
                        activeDetail={activeDetail}
                        setActiveDetail={setActiveDetail}
                        onSelect={selectService}
                        getDescription={getDescription}
                      />
                    )}
                </div>
              )}
            </div>

          </div>
        )}
      </section>


      {/* BOOKING */}

      {selectedService && (
        <section
          className="section booking-section"
          id="booking"
        >

          <div className="section-label">

            {bookingMode ===
            "subscription"
              ? "ЗАПИСЬ ПО АБОНЕМЕНТУ"
              : "ЗАПИСЬ"}

          </div>


          <h2>

            {bookingMode ===
            "subscription"
              ? "Выберите день и время"
              : getBookingMeta(
                  selectedService
                ).type === "package"
              ? "Выберите дату начала"
              : "Выберите дату"}

          </h2>


          <div
            className={`selected-service-box ${
              bookingMode ===
              "subscription"
                ? "subscription-selected-box"
                : ""
            }`}
          >

            <span>

              {bookingMode ===
              "subscription"
                ? "ДЕЙСТВУЮЩИЙ АБОНЕМЕНТ"
                : "ВЫБРАННАЯ УСЛУГА"}

            </span>


            <strong>
              {selectedService.name}
            </strong>


            <button
              type="button"
              className="change-service-button"
              onClick={() => {

                setSelectedService(null);

                setBookingMode(null);

                setSelectedDate("");

                setSelectedTime("");

                setAvailableTimes([]);
              }}
            >
              Изменить
            </button>

          </div>


          <div className="dates">

            {dates.map(
              (date) => (
                <button
                  type="button"
                  key={date.value}
                  className={`date-card ${
                    selectedDate ===
                    date.value
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleDateSelect(
                      date.value
                    )
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
              )
            )}

          </div>


          {selectedDate && (
            <div className="booking-time-block">

              <div className="section-label">
                ВРЕМЯ
              </div>


              <h2>
                Выберите время
              </h2>


              {loadingTimes ? (
                <div className="loading">
                  Проверяем свободное время...
                </div>
              ) : availableTimes.length ? (

                <div className="times">

                  {availableTimes.map(
                    (time) => (
                      <button
                        type="button"
                        key={time}
                        className={`time-button ${
                          selectedTime ===
                          time
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedTime(
                            time
                          )
                        }
                      >
                        {time}
                      </button>
                    )
                  )}

                </div>

              ) : (

                <div className="empty">
                  На выбранную дату свободных
                  слотов нет.
                </div>

              )}

            </div>
          )}


          {bookingError && (
            <div className="booking-error">
              {bookingError}
            </div>
          )}


          {selectedDate &&
            selectedTime && (
              <div className="booking-form-block">

                <div className="section-label">
                  КОНТАКТЫ
                </div>


                <h2>
                  Оставьте данные
                </h2>


                <div className="form">

                  <input
                    type="text"
                    placeholder="Имя и Фамилия *"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                  />


                  <input
                    type="tel"
                    placeholder="Номер телефона *"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value
                      )
                    }
                  />


                  <input
                    type="text"
                    placeholder="Telegram @username — необязательно"
                    value={telegram}
                    onChange={(event) =>
                      setTelegram(
                        event.target.value
                      )
                    }
                  />

                </div>


                <button
                  type="button"
                  className="main-button"
                  disabled={
                    !name.trim() ||
                    !phone.trim() ||
                    bookingLoading
                  }
                  onClick={
                    handleBooking
                  }
                >
                  {bookingLoading
                    ? "ОТПРАВЛЯЕМ..."
                    : bookingMode ===
                      "subscription"
                    ? "ЗАПИСАТЬСЯ НА ТРЕНИРОВКУ"
                    : "ОТПРАВИТЬ ЗАЯВКУ"}
                </button>

              </div>
            )}

        </section>
      )}


      {/* CONTACTS */}

      <section className="section trainer-contacts">

        <div className="section-label">
          КОНТАКТЫ
        </div>


        <h2>
          Связаться с тренером
        </h2>


        <div className="contact-cards">

          <a
            href={PHONE_LINK}
            className="contact-card"
          >

            <span className="contact-icon">
              ☎
            </span>

            <div>

              <small>
                Телефон
              </small>

              <strong>
                {PHONE}
              </strong>

            </div>

          </a>


          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="contact-card"
          >

            <span className="contact-icon instagram-icon">

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >

                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                />

              </svg>

            </span>


            <div>

              <small>
                Instagram
              </small>

              <strong>
                @ulyanov_fit
              </strong>

            </div>

          </a>


          <a
            href={VK_URL}
            target="_blank"
            rel="noreferrer"
            className="contact-card"
          >

            <span className="contact-icon">
              VK
            </span>


            <div>

              <small>
                ВКонтакте
              </small>

              <strong>
                ulyanov_fit
              </strong>

            </div>

          </a>

        </div>

      </section>


      {/* MAP */}

      <section className="section map-section">

        <div className="section-label">
          КАК ДОБРАТЬСЯ
        </div>


        <h2>
          Где проходят тренировки
        </h2>


        <div className="map-card">

          <a
            href={MAP_URL}
            target="_blank"
            rel="noreferrer"
            className="map-preview"
          >

            <div className="map-grid" />

            <div className="map-road road-one" />
            <div className="map-road road-two" />
            <div className="map-road road-three" />


            <div className="map-marker">
              <span>
                ●
              </span>
            </div>


            <div className="map-place">

              <strong>
                Alex Fitness
              </strong>

              <span>
                Рязань
              </span>

            </div>

          </a>


          <div className="map-info">

            <strong>
              Alex Fitness
            </strong>


            <p>
              Рязань, Первомайский проспект,
              д. 70 корп. 1, лит. А
              <br />
              ТРЦ «Виктория Плаза»
            </p>


            <a
              href={MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="map-button"
            >
              Открыть маршрут
            </a>

          </div>

        </div>

      </section>


      <footer>
        Алексей Ульянов · Тренер-методист
      </footer>

    </div>
  );
}


/* ==========================================================
   SERVICE OPTION
========================================================== */

function ServiceOption({
  service,
  flagship,
  activeDetail,
  setActiveDetail,
  onSelect,
  getDescription,
}) {
  const detailId = `service:${service.id}`;
  const isOpen = activeDetail === detailId;
  const description = getDescription(service);

  return (
    <div className={`service-option-wrap ${flagship ? "flagship-option-wrap" : ""}`}>
      <div className="service-option">
        <div className="service-main-info">
          <div className="option-title-line">
            <strong>{service.name}</strong>
            {flagship && (
              <span className="flagship-badge">⭐ ФЛАГМАН</span>
            )}
          </div>
        </div>

        <div className="service-actions">
          <button
            type="button"
            className="details-button"
            onClick={() =>
              setActiveDetail(isOpen ? null : detailId)
            }
          >
            {isOpen ? "Свернуть" : "Подробнее"}
          </button>

          <button
            type="button"
            className="service-choose-button"
            onClick={() => onSelect(service)}
          >
            Выбрать
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="service-details">
          <p>{description.text}</p>
          {description.items.length > 0 && (
            <ul>
              {description.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}


function ConsultationContent({
  service,
  activeDetail,
  setActiveDetail,
  onSelect,
  getDescription,
}) {
  const detailId = "consultation-detail";
  const isOpen = activeDetail === detailId;
  const description = getDescription(service);

  return (
    <div className="consultation-content">
      <div className="consultation-actions">
        <button
          type="button"
          className="details-button"
          onClick={() =>
            setActiveDetail(isOpen ? null : detailId)
          }
        >
          {isOpen ? "Свернуть" : "Подробнее"}
        </button>

        <button
          type="button"
          className="service-choose-button"
          onClick={() => onSelect(service)}
        >
          Выбрать
        </button>
      </div>

      {isOpen && (
        <div className="service-details">
          <p>{description.text}</p>
          {description.items.length > 0 && (
            <ul>
              {description.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}


function OfflineCategory({
  title,
  type,
  description,
  activeDetail,
  setActiveDetail,
  onSelect,
}) {
  const detailId = `offline:${type}`;
  const isOpen = activeDetail === detailId;

  return (
    <div className="offline-category">
      <div className="offline-category-head">
        <div className="offline-category-title">{title}</div>
        <button
          type="button"
          className="offline-more-button"
          onClick={() =>
            setActiveDetail(isOpen ? null : detailId)
          }
        >
          {isOpen ? "Свернуть" : "Подробнее"}
        </button>
      </div>

      {isOpen && (
        <div className="offline-description">
          <p>{description.text}</p>
          <ul>
            {description.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="package-grid">
        {[5, 10, 20].map((count) => {
          const service = {
            id: `${type}-${count}`,
            name: `${title} — ${count} тренировок`,
            price: 0,
            description: "",
          };

          return (
            <PackageCard
              key={service.id}
              service={service}
              onSelect={onSelect}
            />
          );
        })}
      </div>
    </div>
  );
}


function PackageCard({
  service,
  onSelect,
}) {

  const count =
    service.name.match(
      /5|10|20/
    )?.[0];


  return (
    <div className="package-card">

      <button
        type="button"
        className="package-main-button"
        onClick={() =>
          onSelect(service)
        }
      >

        <strong>
          {count}
        </strong>

        <span>
          тренировок
        </span>

        <small>
          Выбрать
        </small>

      </button>

    </div>
  );
}


export default App;