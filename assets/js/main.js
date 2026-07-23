/* =====================================================
   Azimxon — Backend Developer Portfolio
   Navigation · i18n (EN/UZ/RU) · Typewriter · Animations
   ===================================================== */

/* ---------- Mobile navigation ---------- */
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navItems = document.querySelectorAll(".nav__item"),
  header = document.getElementById("header");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("nav__menu--open");
  changeIcon();
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navMenu.classList.remove("nav__menu--open");
    changeIcon();
  });
});

function changeIcon() {
  if (navMenu.classList.contains("nav__menu--open")) {
    navToggle.classList.replace("ri-menu-3-line", "ri-close-line");
  } else {
    navToggle.classList.replace("ri-close-line", "ri-menu-3-line");
  }
}

/* ---------- Header shadow on scroll ---------- */
window.addEventListener("scroll", () => {
  header.classList.toggle("header--scroll", window.scrollY > 40);
});

/* ---------- Current year ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =====================================================
   Translations
   ===================================================== */
const translations = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.goals": "Goals",
    "nav.services": "Services",
    "nav.projects": "Projects",
    "nav.contact": "Contact",

    "hero.kicker": "👋 Hello, my name is",
    "hero.desc":
      "I'm a 20-year-old backend developer in the making — passionate about building reliable server-side applications, clean APIs and well-structured databases.",
    "hero.btn_contact": "Contact Me",
    "hero.btn_projects": "View Projects",

    "about.title": "About Me",
    "about.subtitle": "Who am I",
    "about.heading": "A backend developer focused on logic, data and clean architecture.",
    "about.p1":
      "My name is Azimxon, I'm 20 years old and I'm currently studying backend development. I enjoy the part of software you don't see — server-side logic, APIs, databases and making systems fast and reliable.",
    "about.p2":
      "I learn every day and I'm looking for opportunities to grow, join a strong engineering team and turn ideas into real, working products.",
    "about.btn": "Let's Talk",
    "about.stat_age": "Years old",
    "about.stat_learn": "Always learning",
    "about.stat_focus": "Backend focused",
    "about.stat_team": "Team player",

    "skills.title": "Tech Stack",
    "skills.subtitle": "Technologies I work with",
    "skills.cat1": "Languages & Frameworks",
    "skills.cat2": "Databases",
    "skills.cat3": "Tools & DevOps",

    "goals.title": "My Goals",
    "goals.subtitle": "Where I'm heading",
    "goals.g1_title": "Become a Mentor",
    "goals.g1_desc": "Grow deep expertise in backend development and help others learn the field.",
    "goals.g2_title": "Join a Company",
    "goals.g2_desc": "Work as a backend developer in a real company and grow through real challenges.",
    "goals.g3_title": "Work with a Great Team",
    "goals.g3_desc": "Collaborate with a strong, motivated team and build things together.",
    "goals.g4_title": "Ship Many Projects",
    "goals.g4_desc": "Design and deliver many meaningful projects that people actually use.",

    "services.title": "What I Do",
    "services.subtitle": "Backend services",
    "services.s1_title": "API Development",
    "services.s1_desc": "Building clean, well-documented REST APIs that are easy to use and scale.",
    "services.s2_title": "Database Design",
    "services.s2_desc": "Designing structured, efficient databases and writing optimized queries.",
    "services.s3_title": "Server-side Logic",
    "services.s3_desc": "Implementing reliable business logic and background processes on the server.",
    "services.s4_title": "Bot Development",
    "services.s4_desc": "Creating Telegram bots and automation tools that solve real problems.",
    "services.s5_title": "Auth & Security",
    "services.s5_desc": "Implementing authentication, authorization and keeping data safe.",
    "services.s6_title": "Clean Code & Git",
    "services.s6_desc": "Writing readable, maintainable code and working with version control.",

    "projects.title": "Projects",
    "projects.subtitle": "My recent work",
    "projects.p1_title": "REST API Service",
    "projects.p1_desc": "A sample backend REST API with authentication, a database and clean endpoints.",
    "projects.p2_title": "Telegram Bot",
    "projects.p2_desc": "An automation bot that handles user requests and connects to a database.",
    "projects.p3_title": "Blog Backend",
    "projects.p3_desc": "A backend for a blog with posts, users and comments stored in a database.",
    "projects.view": "View Project",
    "projects.more": "More on GitHub",

    "contact.title": "Interested in working together? Let's talk",
    "contact.desc":
      "Whether you have a project in mind or just want to connect, feel free to reach out. I'll get back to you as soon as I can.",
    "contact.btn_email": "Send Email",
    "contact.btn_tg": "Telegram",

    "footer.follow": "Follow Me",
    "footer.rights": "All Rights Reserved.",
  },

  uz: {
    "nav.home": "Bosh sahifa",
    "nav.about": "Men haqimda",
    "nav.skills": "Ko'nikmalar",
    "nav.goals": "Maqsadlar",
    "nav.services": "Xizmatlar",
    "nav.projects": "Loyihalar",
    "nav.contact": "Aloqa",

    "hero.kicker": "👋 Salom, mening ismim",
    "hero.desc":
      "Men 20 yoshli, backend yo'nalishida o'qiyotgan dasturchiman — ishonchli server ilovalari, toza API'lar va puxta ma'lumotlar bazalarini yaratishga qiziqaman.",
    "hero.btn_contact": "Bog'lanish",
    "hero.btn_projects": "Loyihalar",

    "about.title": "Men haqimda",
    "about.subtitle": "Men kimman",
    "about.heading": "Mantiq, ma'lumot va toza arxitekturaga e'tibor qaratadigan backend dasturchi.",
    "about.p1":
      "Mening ismim Azimxon, 20 yoshdaman va hozirda backend dasturlashni o'rganyapman. Dasturning ko'zga ko'rinmaydigan qismini — server mantiqi, API'lar, ma'lumotlar bazalari va tizimlarni tez hamda ishonchli qilishni yoqtiraman.",
    "about.p2":
      "Har kuni o'rganaman va o'sish, kuchli jamoaga qo'shilish hamda g'oyalarni real, ishlaydigan mahsulotga aylantirish imkoniyatlarini izlayapman.",
    "about.btn": "Suhbatlashamiz",
    "about.stat_age": "Yosh",
    "about.stat_learn": "Doim o'rganaman",
    "about.stat_focus": "Backend yo'nalishi",
    "about.stat_team": "Jamoaviy ishlayman",

    "skills.title": "Texnologiyalar",
    "skills.subtitle": "Men ishlatadigan texnologiyalar",
    "skills.cat1": "Tillar va Frameworklar",
    "skills.cat2": "Ma'lumotlar bazalari",
    "skills.cat3": "Vositalar va DevOps",

    "goals.title": "Maqsadlarim",
    "goals.subtitle": "Men qayerga intilayapman",
    "goals.g1_title": "Mentor bo'lish",
    "goals.g1_desc": "Backend sohasida chuqur bilimga ega bo'lib, boshqalarga o'rgatish.",
    "goals.g2_title": "Kompaniyaga ishga kirish",
    "goals.g2_desc": "Real kompaniyada backend dasturchi bo'lib ishlash va rivojlanish.",
    "goals.g3_title": "Yaxshi jamoa bilan ishlash",
    "goals.g3_desc": "Kuchli va intiluvchan jamoa bilan hamkorlikda ishlar yaratish.",
    "goals.g4_title": "Ko'plab loyihalar yaratish",
    "goals.g4_desc": "Odamlar foydalanadigan ko'plab foydali loyihalarni yaratish.",

    "services.title": "Nima qilaman",
    "services.subtitle": "Backend xizmatlari",
    "services.s1_title": "API yaratish",
    "services.s1_desc": "Ishlatish oson va kengaytiriladigan toza, hujjatlashtirilgan REST API'lar.",
    "services.s2_title": "Ma'lumotlar bazasi",
    "services.s2_desc": "Tuzilgan, samarali ma'lumotlar bazasini loyihalash va optimallashtirilgan so'rovlar.",
    "services.s3_title": "Server mantiqi",
    "services.s3_desc": "Serverda ishonchli biznes-mantiq va fon jarayonlarini amalga oshirish.",
    "services.s4_title": "Bot yaratish",
    "services.s4_desc": "Real muammolarni hal qiladigan Telegram botlar va avtomatlashtirish vositalari.",
    "services.s5_title": "Xavfsizlik",
    "services.s5_desc": "Autentifikatsiya, avtorizatsiya va ma'lumotlarni himoya qilish.",
    "services.s6_title": "Toza kod va Git",
    "services.s6_desc": "O'qiladigan, saqlanadigan kod yozish va versiyalar nazorati bilan ishlash.",

    "projects.title": "Loyihalar",
    "projects.subtitle": "So'nggi ishlarim",
    "projects.p1_title": "REST API Servisi",
    "projects.p1_desc": "Autentifikatsiya, ma'lumotlar bazasi va toza endpointlarga ega namunaviy backend REST API.",
    "projects.p2_title": "Telegram Bot",
    "projects.p2_desc": "Foydalanuvchi so'rovlarini qayta ishlaydigan va bazaga ulanadigan avtomatlashtirish boti.",
    "projects.p3_title": "Blog Backend",
    "projects.p3_desc": "Postlar, foydalanuvchilar va izohlar bazada saqlanadigan blog uchun backend.",
    "projects.view": "Ko'rish",
    "projects.more": "GitHub'da ko'proq",

    "contact.title": "Birga ishlashni xohlaysizmi? Keling, gaplashamiz",
    "contact.desc":
      "Loyihangiz bo'lsa yoki shunchaki bog'lanmoqchi bo'lsangiz, bemalol yozing. Imkon qadar tezroq javob beraman.",
    "contact.btn_email": "Email yuborish",
    "contact.btn_tg": "Telegram",

    "footer.follow": "Ijtimoiy tarmoqlar",
    "footer.rights": "Barcha huquqlar himoyalangan.",
  },

  ru: {
    "nav.home": "Главная",
    "nav.about": "Обо мне",
    "nav.skills": "Навыки",
    "nav.goals": "Цели",
    "nav.services": "Услуги",
    "nav.projects": "Проекты",
    "nav.contact": "Контакты",

    "hero.kicker": "👋 Привет, меня зовут",
    "hero.desc":
      "Мне 20 лет, я начинающий backend-разработчик — увлечён созданием надёжных серверных приложений, чистых API и продуманных баз данных.",
    "hero.btn_contact": "Связаться",
    "hero.btn_projects": "Проекты",

    "about.title": "Обо мне",
    "about.subtitle": "Кто я",
    "about.heading": "Backend-разработчик, сфокусированный на логике, данных и чистой архитектуре.",
    "about.p1":
      "Меня зовут Азимхон, мне 20 лет, и сейчас я изучаю backend-разработку. Мне нравится та часть программы, которую не видно — серверная логика, API, базы данных и то, что делает системы быстрыми и надёжными.",
    "about.p2":
      "Я учусь каждый день и ищу возможности для роста, чтобы присоединиться к сильной команде и превращать идеи в реальные, работающие продукты.",
    "about.btn": "Давайте поговорим",
    "about.stat_age": "Лет",
    "about.stat_learn": "Всегда учусь",
    "about.stat_focus": "Backend-направление",
    "about.stat_team": "Командный игрок",

    "skills.title": "Технологии",
    "skills.subtitle": "С чем я работаю",
    "skills.cat1": "Языки и фреймворки",
    "skills.cat2": "Базы данных",
    "skills.cat3": "Инструменты и DevOps",

    "goals.title": "Мои цели",
    "goals.subtitle": "К чему я стремлюсь",
    "goals.g1_title": "Стать ментором",
    "goals.g1_desc": "Развить глубокую экспертизу в backend и помогать другим учиться.",
    "goals.g2_title": "Работать в компании",
    "goals.g2_desc": "Работать backend-разработчиком в реальной компании и расти через задачи.",
    "goals.g3_title": "Сильная команда",
    "goals.g3_desc": "Сотрудничать с сильной, мотивированной командой и создавать вместе.",
    "goals.g4_title": "Много проектов",
    "goals.g4_desc": "Проектировать и создавать много полезных проектов, которыми пользуются люди.",

    "services.title": "Чем я занимаюсь",
    "services.subtitle": "Backend-услуги",
    "services.s1_title": "Разработка API",
    "services.s1_desc": "Чистые, документированные REST API, которые легко использовать и масштабировать.",
    "services.s2_title": "Проектирование БД",
    "services.s2_desc": "Проектирование структурированных, эффективных баз данных и оптимизация запросов.",
    "services.s3_title": "Серверная логика",
    "services.s3_desc": "Реализация надёжной бизнес-логики и фоновых процессов на сервере.",
    "services.s4_title": "Разработка ботов",
    "services.s4_desc": "Создание Telegram-ботов и инструментов автоматизации для реальных задач.",
    "services.s5_title": "Аутентификация",
    "services.s5_desc": "Реализация аутентификации, авторизации и защита данных.",
    "services.s6_title": "Чистый код и Git",
    "services.s6_desc": "Читаемый, поддерживаемый код и работа с системой контроля версий.",

    "projects.title": "Проекты",
    "projects.subtitle": "Мои недавние работы",
    "projects.p1_title": "REST API Сервис",
    "projects.p1_desc": "Пример backend REST API с аутентификацией, базой данных и чистыми эндпоинтами.",
    "projects.p2_title": "Telegram Бот",
    "projects.p2_desc": "Бот-автоматизация, который обрабатывает запросы и подключается к базе данных.",
    "projects.p3_title": "Backend для блога",
    "projects.p3_desc": "Backend для блога с постами, пользователями и комментариями в базе данных.",
    "projects.view": "Смотреть",
    "projects.more": "Больше на GitHub",

    "contact.title": "Хотите поработать вместе? Давайте поговорим",
    "contact.desc":
      "Если у вас есть проект или вы просто хотите связаться — пишите. Я отвечу как можно скорее.",
    "contact.btn_email": "Написать письмо",
    "contact.btn_tg": "Telegram",

    "footer.follow": "Соцсети",
    "footer.rights": "Все права защищены.",
  },
};

/* Typewriter roles per language */
const roles = {
  en: ["Backend Developer", "API Developer", "Database Enthusiast", "Always Learning 🚀"],
  uz: ["Backend Dasturchi", "API Dasturchi", "Ma'lumotlar bazasi ustasi", "Doim o'rganaman 🚀"],
  ru: ["Backend-разработчик", "API-разработчик", "Энтузиаст баз данных", "Всегда учусь 🚀"],
};

/* =====================================================
   Language switching
   ===================================================== */
const langButtons = document.querySelectorAll(".lang-btn");

function setLanguage(lang) {
  if (!translations[lang]) lang = "en";

  document.documentElement.lang = lang;
  localStorage.setItem("lang", lang);

  // Apply translations
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const text = translations[lang][key];
    if (text !== undefined) el.textContent = text;
  });

  // Highlight active buttons
  langButtons.forEach((btn) => {
    btn.classList.toggle("lang-btn--active", btn.dataset.lang === lang);
  });

  // Restart typewriter with the new language
  startTypewriter(roles[lang]);
}

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

/* Pick initial language: saved → browser → English */
function detectLanguage() {
  const saved = localStorage.getItem("lang");
  if (saved && translations[saved]) return saved;
  const nav = (navigator.language || "en").slice(0, 2);
  return translations[nav] ? nav : "en";
}

/* =====================================================
   Typewriter effect
   ===================================================== */
const typewriterEl = document.getElementById("typewriter");
let twWords = [];
let twWordIndex = 0;
let twCharIndex = 0;
let twDeleting = false;
let twTimer = null;

function startTypewriter(words) {
  twWords = words;
  twWordIndex = 0;
  twCharIndex = 0;
  twDeleting = false;
  if (twTimer) clearTimeout(twTimer);
  typeLoop();
}

function typeLoop() {
  const current = twWords[twWordIndex];
  typewriterEl.textContent = current.slice(0, twCharIndex);

  let delay = twDeleting ? 55 : 110;

  if (!twDeleting && twCharIndex === current.length) {
    delay = 1600; // pause at full word
    twDeleting = true;
  } else if (twDeleting && twCharIndex === 0) {
    twDeleting = false;
    twWordIndex = (twWordIndex + 1) % twWords.length;
    delay = 350;
  } else {
    twCharIndex += twDeleting ? -1 : 1;
  }

  twTimer = setTimeout(typeLoop, delay);
}

/* =====================================================
   Init
   ===================================================== */
setLanguage(detectLanguage());

/* =====================================================
   ScrollReveal animations
   ===================================================== */
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    duration: 1400,
    distance: "60px",
    delay: 200,
    reset: false,
    easing: "cubic-bezier(0.5, 0, 0, 1)",
  });

  sr.reveal(".hero__content", { origin: "left" });
  sr.reveal(".hero__visual", { origin: "right", delay: 300 });
  sr.reveal(".section__header", { origin: "top" });
  sr.reveal(".about__content", { origin: "left" });
  sr.reveal(".about__stats", { origin: "right" });
  sr.reveal(
    ".skills__group, .goal-card, .service-card, .project-card",
    { interval: 100 }
  );
  sr.reveal(".contact__card, .footer__content", { origin: "bottom" });
}
