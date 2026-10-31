import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import CatalogPage, { ProductDetailPage } from './pages/CatalogPage.jsx'
import './Portfolio.css'

const siteBase = import.meta.env.BASE_URL
const repositoryBase = 'https://github.com/odilbek1525/test'

const copy = {
  ru: {
    navProjects: 'Проекты',
    navAbout: 'Обо мне',
    navContact: 'Контакты',
    available: 'Открыт к предложениям',
    role: 'FRONTEND-РАЗРАБОТЧИК',
    titleBefore: 'Создаю сайты,',
    titleAccent: 'которые хочется',
    titleAfter: 'открывать.',
    intro: 'Привет! Я начинающий frontend-разработчик. Превращаю идеи в быстрые, понятные и аккуратные интерфейсы.',
    viewProjects: 'Смотреть проекты',
    contactMe: 'Связаться со мной',
    based: 'На связи из России · Работаю удалённо',
    selected: 'ИЗБРАННОЕ',
    projectsTitle: 'Проекты',
    projectsText: 'Небольшая подборка работ и экспериментов.',
    openProject: 'Открыть проект',
    openRepository: 'Открыть репозиторий на GitHub',
    catalogTitle: 'Витрина товаров',
    catalogDescription: 'Каталог товаров с поиском, фильтрацией, пагинацией и подробными страницами.',
    catalogType: 'React · Axios · Zustand',
    fengShuiTitle: 'Feng Shui',
    fengShuiDescription: 'Макет магазина товаров для дома, вдохновлённый гармонией и философией фэн-шуй.',
    perfumeTitle: 'PERFUME LINE',
    perfumeDescription: 'Макет сайта коллекции парфюмерии с разделами о бренде и ароматах.',
    frontendType: 'HTML · CSS · Адаптивная вёрстка',
    aboutLabel: 'НЕМНОГО ОБО МНЕ',
    aboutTitle: 'Люблю превращать сложное в простое.',
    aboutText: 'Сейчас развиваюсь во frontend-разработке: изучаю React, работаю с API и уделяю внимание деталям интерфейса. Мне важно, чтобы сайт был не только красивым, но и удобным на любом устройстве.',
    aboutPhoto: 'Иллюстрация-заглушка — замените её на своё фото',
    skillsLabel: 'ИНСТРУМЕНТЫ',
    skillsTitle: 'Навыки',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vite', 'REST API', 'Git', 'Адаптивная вёрстка'],
    contactLabel: 'ЕСТЬ ИДЕЯ?',
    contactTitle: 'Давайте создадим что-нибудь классное.',
    contactText: 'Открыт к предложениям о работе, интересным проектам и хорошему разговору.',
    email: 'Написать на почту',
    telegram: 'Telegram',
    editHint: 'Открывайте демо проектов или смотрите исходный код на GitHub.',
    footer: 'Сделано с интересом к деталям',
    themeLight: 'Светлая тема',
    themeDark: 'Тёмная тема',
    language: 'Язык',
  },
  en: {
    navProjects: 'Projects',
    navAbout: 'About',
    navContact: 'Contact',
    available: 'Open to opportunities',
    role: 'FRONTEND DEVELOPER',
    titleBefore: 'I build websites',
    titleAccent: 'you will love',
    titleAfter: 'to explore.',
    intro: "Hi! I'm an aspiring frontend developer turning ideas into fast, clear, and polished interfaces.",
    viewProjects: 'Explore projects',
    contactMe: 'Get in touch',
    based: 'Based in Russia · Available remotely',
    selected: 'SELECTED WORK',
    projectsTitle: 'Projects',
    projectsText: 'A small collection of work and experiments.',
    openProject: 'Open project',
    openRepository: 'Open project repository on GitHub',
    catalogTitle: 'Product storefront',
    catalogDescription: 'An API-powered catalogue with search, filtering, pagination, and detailed product pages.',
    catalogType: 'React · Axios · Zustand',
    fengShuiTitle: 'Feng Shui',
    fengShuiDescription: 'A homeware storefront concept inspired by harmony and Feng Shui.',
    perfumeTitle: 'PERFUME LINE',
    perfumeDescription: 'A fragrance collection website concept with brand and collection sections.',
    frontendType: 'HTML · CSS · Responsive design',
    aboutLabel: 'A LITTLE ABOUT ME',
    aboutTitle: 'Making the complex feel simple.',
    aboutText: "I'm growing as a frontend developer: learning React, working with APIs, and paying attention to interface details. I want every website to feel both beautiful and easy to use on any device.",
    aboutPhoto: 'Placeholder illustration — replace it with your own photo',
    skillsLabel: 'MY TOOLKIT',
    skillsTitle: 'Skills',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vite', 'REST API', 'Git', 'Responsive design'],
    contactLabel: 'HAVE AN IDEA?',
    contactTitle: "Let's build something great.",
    contactText: "I'm open to job opportunities, interesting projects, and a good conversation.",
    email: 'Send me an email',
    telegram: 'Telegram',
    editHint: 'Open project demos or browse the source code on GitHub.',
    footer: 'Made with an eye for detail',
    themeLight: 'Light theme',
    themeDark: 'Dark theme',
    language: 'Language',
  },
}

const projects = [
  { id: 'store', tone: 'store', title: 'catalogTitle', description: 'catalogDescription', type: 'catalogType', href: '/catalog', repositoryHref: `${repositoryBase}/tree/main/src/pages`, action: true },
  { id: 'feng-shui', tone: 'feng-shui', title: 'fengShuiTitle', description: 'fengShuiDescription', type: 'frontendType', href: `${siteBase}projects/feng-shui/index.html`, repositoryHref: `${repositoryBase}/tree/main/public/projects/feng-shui`, previewImage: `${siteBase}projects/feng-shui/img/harmony.jpg`, action: true, external: true },
  { id: 'perfume-line', tone: 'perfume-line', title: 'perfumeTitle', description: 'perfumeDescription', type: 'frontendType', href: `${siteBase}projects/perfume-line/index.html`, repositoryHref: `${repositoryBase}/tree/main/public/projects/perfume-line`, previewImage: `${siteBase}projects/perfume-line/img/Perfume-line.jpg`, action: true, external: true },
]

function ProjectPreview({ project, title }) {
  const { tone } = project

  return (
    <div className={`project-preview project-preview--${tone}`} aria-label={title}>
      {project.previewImage ? (
        <img className="project-preview__image" src={project.previewImage} alt="" />
      ) : (
        <div className="preview-store">
          <div className="preview-store__bar"><span /><span /><span /></div>
          <div className="preview-store__heading">find your<br /><b>everyday.</b></div>
          <div className="preview-store__tiles"><i /><i /><i /></div>
        </div>
      )}
      <span className="project-preview__number">0{projects.findIndex((project) => project.tone === tone) + 1}</span>
    </div>
  )
}

function PortfolioPage({ language, setLanguage, theme, setTheme }) {
  const t = copy[language]

  return (
    <div className="portfolio-app" data-theme={theme}>
      <header className="portfolio-header">
        <a className="portfolio-logo" href="#home" aria-label="Portfolio home">A<span>.</span></a>
        <nav className="portfolio-nav" aria-label="Main navigation">
          <a href="#projects">{t.navProjects}</a>
          <a href="#about">{t.navAbout}</a>
          <a href="#contact">{t.navContact}</a>
        </nav>
        <div className="portfolio-controls">
          <button
            className="icon-control"
            type="button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={theme === 'light' ? t.themeDark : t.themeLight}
            title={theme === 'light' ? t.themeDark : t.themeLight}
          >
            {theme === 'light' ? '☾' : '☀'}
          </button>
          <button
            className="language-control"
            type="button"
            onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
            aria-label={`${t.language}: ${language === 'ru' ? 'English' : 'Русский'}`}
          >
            {language === 'ru' ? 'EN' : 'RU'}
          </button>
        </div>
      </header>

      <main>
        <section className="portfolio-hero" id="home">
          <div className="portfolio-hero__copy">
            <div className="availability"><span />{t.available}</div>
            <p className="portfolio-eyebrow">{t.role}</p>
            <h1>{t.titleBefore}<br /><span>{t.titleAccent}</span><br />{t.titleAfter}</h1>
            <p className="portfolio-hero__intro">{t.intro}</p>
            <div className="portfolio-hero__actions">
              <a className="button button--primary" href="#projects">{t.viewProjects}<span>↘</span></a>
              <a className="button button--text" href="#contact">{t.contactMe}<span>↗</span></a>
            </div>
            <p className="portfolio-location"><span>⌖</span> {t.based}</p>
          </div>
          <div className="portrait-panel">
            <div className="portrait-panel__frame">
              <img src={`${siteBase}profile-photo.svg`} alt="Placeholder portrait illustration" />
              <span className="portrait-panel__badge">HELLO<br />WORLD!</span>
            </div>
            <span className="portrait-panel__caption">01 / THE PERSON BEHIND THE PIXELS</span>
          </div>
          <span className="portfolio-hero__index">PORTFOLIO — 2026</span>
        </section>

        <section className="portfolio-section projects-section" id="projects">
          <div className="section-heading">
            <div><p className="portfolio-eyebrow">{t.selected}</p><h2>{t.projectsTitle}<span>.</span></h2></div>
            <p>{t.projectsText}</p>
          </div>
          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.id}>
                <ProjectPreview project={project} title={t[project.title]} />
                <div className="project-card__details">
                  <div className="project-card__text">
                    <p className="project-card__type">{t[project.type]}</p>
                    <h3>{t[project.title]}</h3>
                    <p>{t[project.description]}</p>
                  </div>
                  <div className="project-card__links">
                    {project.action && (project.external ? (
                      <a
                        className="project-card__link"
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${t.openProject}: ${t[project.title]}`}
                      >
                        ↗
                      </a>
                    ) : (
                      <Link className="project-card__link" to={project.href} aria-label={`${t.openProject}: ${t[project.title]}`}>↗</Link>
                    ))}
                    <a
                      className="project-card__link"
                      href={project.repositoryHref}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${t.openRepository}: ${t[project.title]}`}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.1-1.5 6.1-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.1-.4-3.7 1.4a13 13 0 0 0-6.7 0C5.7 1.1 4.6 1.5 4.6 1.5a4.8 4.8 0 0 0-.1 3.6 5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.1 6.4 6.1 6.7a3.4 3.4 0 0 0-.9 2.7V22" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="sample-note">{t.editHint}</p>
        </section>

        <section className="portfolio-section about-section" id="about">
          <div className="about-copy">
            <p className="portfolio-eyebrow">{t.aboutLabel}</p>
            <h2>{t.aboutTitle}</h2>
            <p className="about-copy__body">{t.aboutText}</p>
            <div className="skills-block">
              <p className="portfolio-eyebrow">{t.skillsLabel}</p>
              <h3>{t.skillsTitle}</h3>
              <div className="skills-list">
                {t.skills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </div>
          </div>
          <div className="about-photo">
            <img src={`${siteBase}profile-photo.svg`} alt="Placeholder portrait illustration" />
            <span>{t.aboutPhoto}</span>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div>
            <p className="portfolio-eyebrow">{t.contactLabel}</p>
            <h2>{t.contactTitle}</h2>
            <p>{t.contactText}</p>
          </div>
          <div className="contact-links">
            <a href="mailto:your.email@example.com">your.email@example.com <span>↗</span></a>
            <a href="https://t.me/your_username" target="_blank" rel="noreferrer">{t.telegram} <span>↗</span></a>
          </div>
        </section>
      </main>

      <footer className="portfolio-footer">
        <a className="portfolio-logo" href="#home" aria-label="Portfolio home">A<span>.</span></a>
        <span>© 2026 · {t.footer}</span>
        <a href="#home">BACK TO TOP ↑</a>
      </footer>
    </div>
  )
}

function AppRoutes() {
  const [language, setLanguage] = useState('ru')
  const [theme, setTheme] = useState('light')
  const location = useLocation()

  useEffect(() => {
    document.documentElement.lang = language
    document.title = location.pathname.startsWith('/catalog')
      ? 'Витрина — каталог товаров'
      : language === 'ru'
        ? 'Портфолио — Frontend-разработчик'
        : 'Portfolio — Frontend Developer'
  }, [language, location.pathname])

  return (
    <Routes>
      <Route
        path="/"
        element={<PortfolioPage language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} />}
      />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/catalog/:productId" element={<ProductDetailPage />} />
      <Route path="*" element={<PortfolioPage language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
