/* ==========================================================================
   AEDEV — CLIENT ENGINE
   - Day / Night Theme Switcher (Dark & Light)
   - 3-Language Switcher (EN / UZ / RU)
   - Direct Contact Form & Telegram Bot (@ae_contact_bot) Handler
   - Smooth Scrolling & Active Navigation Spy
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     TELEGRAM BOT CONFIGURATION
     ------------------------------------------------------------------------ */
  const TG_CONFIG = {
    botUsername: 'ae_contact_bot',
    botToken: '',
    chatId: ''
  };

  /* ------------------------------------------------------------------------
     1. MULTILINGUAL DICTIONARY (EN / UZ / RU)
     ------------------------------------------------------------------------ */
  const translations = {
    en: {
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.portfolio': 'Portfolio',
      'nav.contact': 'Contact',

      'status.system': 'All Systems Operational',
      'hero.subtext': 'I build clean, reliable, and scalable backend solutions.',
      'hero.btnProjects': 'View Projects',
      'hero.btnCV': 'Download CV',
      'hero.btnContact': 'Contact Me',

      'about.title': 'About',
      'about.text': 'I am a Python Backend Developer focused on building practical, scalable, and clean backend systems. I enjoy turning ideas into reliable web solutions with clear architecture and real functionality.',

      'edu.title': 'Education',
      'edu.uni': 'University',
      'edu.uniPeriod': 'Present',
      'edu.uniDesc': 'Currently studying',
      'edu.sariqdev': 'Python Programming (Core & Advanced algorithms)',
      'edu.sariqdevPeriod': '2023 - Present',
      'edu.mohirdev': 'Python Backend & Web Development platform',
      'edu.mohirdevPeriod': '2024 - Present',

      'exp.title': 'Experience',
      'exp.soon': 'SOON',
      'exp.desc': 'Commercial backend engineering experience in progress. Currently focusing on real-world practical projects, clean architecture, and systems engineering.',
      'exp.hint': '// Production projects featured below',

      'skills.title': 'Skills',

      'project.title': 'Featured Project',
      'project.desc': 'Auto Sklad is a backend-focused project built for managing auto parts and related workflows. It highlights practical architecture, clean logic, and real project structure.',
      'project.feat1': 'Fast search by spare part SKU/article code and part name',
      'project.feat2': 'Real-time warehouse stock & inventory check via Telegram bot',
      'project.feat3': 'Secure Django admin panel for catalog, parts, and pricing management',
      'project.btn': 'View Project',
      'project.githubBtn': 'GitHub Repo',

      'git.commits': 'Commit Hygiene',
      'git.commitsDesc': 'Conventional commits: feat, fix, refactor, docs',
      'git.branching': 'Git Branching',
      'git.branchingDesc': 'Feature branches, clean PRs & code review',
      'git.clean': 'Architecture',
      'git.cleanDesc': 'PEP 8 standards, modular apps & robust error handling',

      'term.title': 'Backend Console',
      'term.desc': 'Interactive CLI environment. Run commands to inspect backend runtime & developer profile.',

      'contact.title': 'Contact',
      'contact.desc': 'Have a project, collaboration, or idea in mind? Let’s connect.',
      'contact.whatsappSub': 'WhatsApp Direct',

      'form.cardTitle': 'Send a message',
      'form.name': 'Name',
      'form.namePlaceholder': 'Your name',
      'form.phone': 'Phone Number',
      'form.phonePlaceholder': '+998 98 123 45 67',
      'form.message': 'Message',
      'form.msgPlaceholder': 'Write your message...',
      'form.send': 'Send',

      'toast.success': 'Your message has been received! We will contact you shortly.',
      'footer.rights': '© 2026 AEDEV. All rights reserved.'
    },

    uz: {
      'nav.home': 'Bosh sahifa',
      'nav.about': 'Haqimda',
      'nav.portfolio': 'Loyihalar',
      'nav.contact': 'Bogʻlanish',

      'status.system': 'Barcha tizimlar barqaror',
      'hero.subtext': 'Ishonchli, toza va kengayuvchan backend tizimlar yarataman.',
      'hero.btnProjects': 'Loyihalarni koʻrish',
      'hero.btnCV': 'Rezyumeni yuklab olish (PDF)',
      'hero.btnContact': 'Bogʻlanish',

      'about.title': 'Haqimda',
      'about.text': 'Men amaliy, kengayuvchan va toza backend tizimlar yaratishga qaratilgan Python Backend dasturchiman. Gʻoyalarni aniq arxitektura va real funksionallikka ega ishonchli veb-yechimlarga aylantirishdan zavqlanaman.',

      'edu.title': 'Taʼlim',
      'edu.uni': 'Universitet',
      'edu.uniPeriod': 'Hozirda',
      'edu.uniDesc': 'Tahsil olmoqdaman',
      'edu.sariqdev': 'Python dasturlash asoslari va algoritmlar kursi',
      'edu.sariqdevPeriod': '2023 - Hozirga qadar',
      'edu.mohirdev': 'Python Backend va amaliy dasturlash platformasi',
      'edu.mohirdevPeriod': '2024 - Hozirga qadar',

      'exp.title': 'Tajriba',
      'exp.soon': 'TEZ KUNDA',
      'exp.desc': 'Tijoriy backend muhandislik tajribasi shakllanmoqda. Hozirda asosiy eʼtibor real amaliy loyihalar, arxitektura va mustahkam tizimlar yaratishga qaratilgan.',
      'exp.hint': '// Real loyihalar quyida keltirilgan',

      'skills.title': 'Koʻnikmalar',

      'project.title': 'Asosiy Loyiha',
      'project.desc': 'Auto Sklad — avtomobil ehtiyot qismlari va ombor jarayonlarini boshqarish uchun yaratilgan backend tizim. U amaliy arxitektura, toza mantiq va real loyiha tuzilishini aks ettiradi.',
      'project.feat1': 'Ehtiyot qismlarni kodi (artikul) va nomi bo‘yicha tezkor qidiruv',
      'project.feat2': 'Telegram bot orqali ombordagi qoldiqlarni real vaqtda tekshirish',
      'project.feat3': 'Xavfsiz Django admin paneli orqali ehtiyot qismlar va narxlarni boshqarish',
      'project.btn': 'Loyihani Koʻrish',
      'project.githubBtn': 'GitHub Kodlar',

      'git.commits': 'Commit intizomi',
      'git.commitsDesc': 'Conventional commits: feat, fix, refactor, docs',
      'git.branching': 'Git tarmoqlash',
      'git.branchingDesc': 'Feature branchlar, toza PR va versiyalar nazorati',
      'git.clean': 'Arxitektura',
      'git.cleanDesc': 'PEP 8 standartlari, modulli tizim va xatoliklar nazorati',

      'term.title': 'Backend Konsoli',
      'term.desc': 'Interaktiv terminal. Buyruqlar orqali backend profil va maʼlumotlarni tekshirishingiz mumkin.',

      'contact.title': 'Bogʻlanish',
      'contact.desc': 'Loyihangiz, hamkorlik taklifingiz yoki gʻoyangiz bormi? Keling, bogʻlanamiz.',
      'contact.whatsappSub': 'Toʻgʻridan-toʻgʻri chat',

      'form.cardTitle': 'Xabar yuborish',
      'form.name': 'Ism',
      'form.namePlaceholder': 'Ismingiz',
      'form.phone': 'Telefon raqam',
      'form.phonePlaceholder': '+998 98 123 45 67',
      'form.message': 'Xabar',
      'form.msgPlaceholder': 'Xabaringizni yozing (masalan: portfolio yoki backend boʻyicha)...',
      'form.send': 'Yuborish',

      'toast.success': 'Xabaringiz qabul qilindi! Tez orada siz bilan bogʻlanamiz.',
      'footer.rights': '© 2026 AEDEV. Barcha huquqlar himoyalangan.'
    },

    ru: {
      'nav.home': 'Главная',
      'nav.about': 'Обо мне',
      'nav.portfolio': 'Проекты',
      'nav.contact': 'Контакты',

      'status.system': 'Все системы стабильны',
      'hero.subtext': 'Создаю надежные, чистые и масштабируемые серверные решения.',
      'hero.btnProjects': 'Смотреть проекты',
      'hero.btnCV': 'Скачать резюме (PDF)',
      'hero.btnContact': 'Связаться со мной',

      'about.title': 'Обо мне',
      'about.text': 'Я Python Backend разработчик, сфокусированный на практичных, масштабируемых и чистых серверных системах. Мне нравится превращать идеи в надежные веб-решения с понятной архитектурой и реальной функциональностью.',

      'edu.title': 'Образование',
      'edu.uni': 'Университет',
      'edu.uniPeriod': 'Настоящее время',
      'edu.uniDesc': 'Студент',
      'edu.sariqdev': 'Основы Python и алгоритмические курсы',
      'edu.sariqdevPeriod': '2023 - Настоящее время',
      'edu.mohirdev': 'Платформа практического обучения Python Backend',
      'edu.mohirdevPeriod': '2024 - Настоящее время',

      'exp.title': 'Опыт работы',
      'exp.soon': 'СКОРО',
      'exp.desc': 'Формирование коммерческого опыта в backend-разработке. В настоящее время фокус на практических реальных проектах, архитектуре и чистом коде.',
      'exp.hint': '// Реальные проекты представлены ниже',

      'skills.title': 'Навыки',

      'project.title': 'Главный Проект',
      'project.desc': 'Auto Sklad — backend-система для учета автозапчастей и управления рабочими процессами склада. Демонстрирует практичную архитектуру, чистую логику и надежную структуру проекта.',
      'project.feat1': 'Быстрый поиск автозапчастей по артикулу (SKU) и названию',
      'project.feat2': 'Проверка остатков на складе в реальном времени через Telegram-бота',
      'project.feat3': 'Управление каталогом запчастей и ценами через защищенную админ-панель Django',
      'project.btn': 'Смотреть проект',
      'project.githubBtn': 'Репозиторий GitHub',

      'git.commits': 'Культура коммитов',
      'git.commitsDesc': 'Conventional commits: feat, fix, refactor, docs',
      'git.branching': 'Ветвление в Git',
      'git.branchingDesc': 'Feature-ветки, чистые PR и контроль версий',
      'git.clean': 'Архитектура',
      'git.cleanDesc': 'Стандарты PEP 8, модульная структура и надежный код',

      'term.title': 'Серверная консоль',
      'term.desc': 'Интерактивный терминал. Выполняйте команды для проверки бэкенд-профиля.',

      'contact.title': 'Контакты',
      'contact.desc': 'Есть идея проекта, предложение о сотрудничестве? Давайте свяжемся.',
      'contact.whatsappSub': 'Прямой чат',

      'form.cardTitle': 'Отправить сообщение',
      'form.name': 'Имя',
      'form.namePlaceholder': 'Ваше имя',
      'form.phone': 'Номер телефона',
      'form.phonePlaceholder': '+998 98 123 45 67',
      'form.message': 'Сообщение',
      'form.msgPlaceholder': 'Напишите ваше сообщение...',
      'form.send': 'Отправить',

      'toast.success': 'Ваше сообщение принято! Скоро свяжемся с вами.',
      'footer.rights': '© 2026 AEDEV. Все права защищены.'
    }
  };

  /* ------------------------------------------------------------------------
     2. DOM INITIALIZATION
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {

    /* --- Theme Toggle Engine (Dark / Light) --- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = themeToggleBtn.querySelector('.sun-icon');
    const moonIcon = themeToggleBtn.querySelector('.moon-icon');

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('site_theme', theme);

      if (theme === 'light') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }

    const savedTheme = localStorage.getItem('site_theme') || 'dark';
    applyTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'light' ? 'dark' : 'light');
    });

    /* --- Language Switcher Engine --- */
    const langBtns = document.querySelectorAll('.lang-btn');

    function applyLanguage(lang) {
      if (!translations[lang]) return;
      localStorage.setItem('site_lang', lang);
      document.documentElement.setAttribute('lang', lang);

      langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
          el.textContent = translations[lang][key];
        }
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
          el.setAttribute('placeholder', translations[lang][key]);
        }
      });
    }

    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        applyLanguage(btn.getAttribute('data-lang'));
      });
    });

    const savedLang = localStorage.getItem('site_lang') || 'en';
    applyLanguage(savedLang);

    /* --- Header & Scroll Spy --- */
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navPill = document.getElementById('nav-pill');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });

    function updateNav() {
      const scrollY = window.scrollY + 140;
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }
    window.addEventListener('scroll', updateNav, { passive: true });

    if (mobileToggle && navPill) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = navPill.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', isOpen);
      });

      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navPill.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    /* --- Direct Contact Form & Telegram Bot Handler --- */
    const contactForm = document.getElementById('direct-contact-form');
    const toastNotice = document.getElementById('toast-notice');

    function showToast(msg) {
      toastNotice.textContent = msg;
      toastNotice.classList.add('show');
      setTimeout(() => {
        toastNotice.classList.remove('show');
      }, 4000);
    }

    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('input-name').value.trim();
        const phone = document.getElementById('input-phone').value.trim();
        const message = document.getElementById('input-message').value.trim();

        const formattedText = 
`📩 Yangi murojaat (azimxon.uz):
👤 Ism: ${name}
📞 Tel: ${phone}
💬 Xabar: ${message || 'Kiritilmadi'}`;

        if (TG_CONFIG.botToken && TG_CONFIG.chatId) {
          try {
            await fetch(`https://api.telegram.org/bot${TG_CONFIG.botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: TG_CONFIG.chatId,
                text: formattedText
              })
            });
          } catch (err) {
            console.error('Telegram API error:', err);
          }
        }

        const encodedMsg = encodeURIComponent(formattedText);
        const tgUrl = `https://t.me/${TG_CONFIG.botUsername}?text=${encodedMsg}`;

        window.open(tgUrl, '_blank');
        contactForm.reset();

        const curLang = localStorage.getItem('site_lang') || 'en';
        showToast((translations[curLang] && translations[curLang]['toast.success']) || 'Xabaringiz qabul qilindi!');
      });
    }

    /* --- Interactive Terminal Console CLI --- */
    const termInput = document.getElementById('term-input');
    const termOutput = document.getElementById('term-output');
    const termClearBtn = document.getElementById('term-clear-btn');
    const termChips = document.querySelectorAll('.term-chip');

    const termCommands = {
      help: () => [
        'Available commands:',
        '  about    - Developer summary & backend specialization',
        '  skills   - Technical backend stack & databases',
        '  project  - Featured project details (@avtoozapchast_bot)',
        '  contact  - Direct communication channels',
        '  cv       - Download official CV PDF',
        '  clear    - Clear console output'
      ],
      about: () => [
        '{',
        '  "developer": "Azimxon Ergashev",',
        '  "role": "Python Backend Developer",',
        '  "focus": "Clean architecture, REST APIs, Telegram Bots",',
        '  "status": "Available for opportunities & projects"',
        '}'
      ],
      skills: () => [
        'Python, Django, Django REST Framework, PostgreSQL, SQLite, REST API, Git, GitHub'
      ],
      project: () => [
        'Project: Auto Sklad',
        'Description: Automotive parts & warehouse inventory management system',
        'Stack: Python, Django, DRF, PostgreSQL, Aiogram 3',
        'Telegram Bot: https://t.me/avtoozapchast_bot',
        'GitHub: https://github.com/azimxondev/avtoozapchast'
      ],
      contact: () => [
        'Email: azimxonergashev122@gmail.com',
        'Telegram: https://t.me/azimxon122',
        'GitHub: https://github.com/azimxondev'
      ],
      cv: () => {
        window.open('assets/Azimxon_Ergashev_CV.pdf', '_blank');
        return ['Downloading official CV: Azimxon_Ergashev_CV.pdf...'];
      },
      clear: () => []
    };

    function runTermCommand(raw) {
      if (!termOutput) return;
      const cmd = (raw || '').trim().toLowerCase();
      if (!cmd) return;

      const userLine = document.createElement('div');
      userLine.className = 'term-line term-user-line';
      userLine.innerHTML = `<span class="term-prompt">azimxon@server:~$</span> ${cmd}`;
      termOutput.appendChild(userLine);

      if (cmd === 'clear') {
        termOutput.innerHTML = '';
      } else if (termCommands[cmd]) {
        const lines = termCommands[cmd]();
        lines.forEach(txt => {
          const resp = document.createElement('div');
          resp.className = 'term-line term-response-line';
          resp.textContent = txt;
          termOutput.appendChild(resp);
        });
      } else {
        const err = document.createElement('div');
        err.className = 'term-line term-error-line';
        err.textContent = `bash: command not found: ${cmd}. Type 'help' for available commands.`;
        termOutput.appendChild(err);
      }

      termOutput.scrollTop = termOutput.scrollHeight;
    }

    if (termInput) {
      termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = termInput.value;
          termInput.value = '';
          runTermCommand(val);
        }
      });
    }

    if (termClearBtn) {
      termClearBtn.addEventListener('click', () => {
        if (termOutput) termOutput.innerHTML = '';
      });
    }

    termChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        runTermCommand(cmd);
      });
    });
  });
})();
