import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import { A11y, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import fallbackProducts from '../store/fallbackProducts'
import { useProductStore } from '../store/productStore'
import '../App.css'

const siteBase = import.meta.env.BASE_URL
const pageSize = 12

const formatPrice = (price) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price)

const getDiscountedPrice = (price, discountPercentage) =>
  price * (1 - discountPercentage / 100)

function ProductCard({ product }) {
  const discount = Math.round(product.discountPercentage)

  return (
    <Link className="product-card" to={`/catalog/${product.id}`} aria-label={`Подробнее о товаре: ${product.title}`}>
      <div className="product-card__image-wrap">
        {discount > 0 && <span className="product-card__discount">−{discount}%</span>}
        <img
          className="product-card__image"
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          loading="lazy"
        />
        <span className="product-card__category">{product.category}</span>
      </div>
      <div className="product-card__content">
        <div className="product-card__meta">
          <span className="product-card__brand">{product.brand || 'Без бренда'}</span>
          <span className="product-card__rating">
            <span aria-hidden="true">★</span> {product.rating.toFixed(1)}
          </span>
        </div>
        <h2 className="product-card__title">{product.title}</h2>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__footer">
          <div className="product-card__price">
            <strong>{formatPrice(getDiscountedPrice(product.price, product.discountPercentage))}</strong>
            {discount > 0 && (
              <span>{formatPrice(product.price)}</span>
            )}
          </div>
          <span className={`product-card__stock ${product.stock < 10 ? 'is-low' : ''}`}>
            {product.stock > 0 ? `В наличии: ${product.stock}` : 'Нет в наличии'}
          </span>
        </div>
      </div>
    </Link>
  )
}

function LoadingState() {
  return (
    <div className="product-grid" aria-label="Загрузка товаров">
      {Array.from({ length: 8 }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-card__image" />
          <div className="skeleton-card__line skeleton-card__line--short" />
          <div className="skeleton-card__line" />
          <div className="skeleton-card__line skeleton-card__line--medium" />
        </div>
      ))}
    </div>
  )
}

function App() {
  const { products, total, categories, categoriesError, loading, error, fetchProducts, fetchCategories } = useProductStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('title-asc')
  const [page, setPage] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchCategories(controller.signal)
    return () => controller.abort()
  }, [fetchCategories])

  useEffect(() => {
    const controller = new AbortController()
    const [sortBy, order] = sort.split('-')

    fetchProducts({
      signal: controller.signal,
      limit: pageSize,
      skip: page * pageSize,
      sortBy,
      order,
      search,
      category,
    })

    return () => controller.abort()
  }, [category, fetchProducts, page, search, sort])

  const pageCount = Math.ceil(total / pageSize)

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Витрина — главная">
          <span className="brand__mark" aria-hidden="true">в</span>
          <span>витрина<span className="brand__dot">.</span></span>
        </Link>
        <span className="header-note">Каталог товаров</span>
        <a className="header-link" href="#catalog">Перейти к каталогу <span aria-hidden="true">↓</span></a>
      </header>

      <main>
        <section className="hero">
          <div className="hero__content">
            <p className="eyebrow"><span className="eyebrow__dot" /> КОЛЛЕКЦИЯ ДНЯ</p>
            <h1>Находите то,<br />что <span>вдохновляет.</span></h1>
            <p className="hero__description">
              Изучайте тщательно подобранные товары для жизни, работы и маленьких радостей.
            </p>
            <a className="hero__button" href="#catalog">Смотреть каталог <span aria-hidden="true">↘</span></a>
          </div>
          <div className="hero__visual" aria-hidden="true">
            <div className="hero__sun" />
            <div className="hero__orbit hero__orbit--one" />
            <div className="hero__orbit hero__orbit--two" />
            <div className="hero__spark hero__spark--one">✳</div>
            <div className="hero__spark hero__spark--two">✦</div>
            <div className="hero__tag">ПОДБРАНО<br />С ЛЮБОВЬЮ</div>
            <div className="hero__visual-caption">Новая глава начинается с деталей.</div>
          </div>
          <span className="hero__index">01 — {total.toString().padStart(2, '0')}</span>
        </section>

        <section className="catalog" id="catalog">
          <div className="catalog__heading">
            <div>
              <p className="eyebrow">ВАША СЛЕДУЮЩАЯ НАХОДКА</p>
              <h2>Популярное сейчас<span>.</span></h2>
            </div>
            <p className="catalog__count">
              {loading ? 'Загружаем каталог…' : error ? 'Резервный каталог' : `${total} товаров`}
            </p>
          </div>

          <div className="catalog__toolbar">
            <label className="search-field">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.5 4.5" />
              </svg>
              <input
                type="search"
                placeholder="Найти что-то особенное"
                value={search}
                onChange={(event) => {
                  setPage(0)
                  setSearch(event.target.value)
                }}
                aria-label="Поиск товаров"
              />
            </label>
            <label className="sort-field">
              <span>Сортировка</span>
              <select
                value={sort}
                onChange={(event) => {
                  setPage(0)
                  setSort(event.target.value)
                }}
                aria-label="Сортировка товаров"
              >
                <option value="title-asc">Название: А — Я</option>
                <option value="title-desc">Название: Я — А</option>
                <option value="price-asc">Цена: по возрастанию</option>
                <option value="price-desc">Цена: по убыванию</option>
                <option value="stock-asc">Количество: по возрастанию</option>
                <option value="stock-desc">Количество: по убыванию</option>
              </select>
            </label>
          </div>

          <div className="category-list" aria-label="Категории товаров">
            <button
              className={`category-chip ${category === 'all' ? 'is-active' : ''}`}
              onClick={() => {
                setPage(0)
                setCategory('all')
              }}
              type="button"
            >
              Все товары
            </button>
            {categories.map((item) => (
              <button
                className={`category-chip ${category === item ? 'is-active' : ''}`}
                key={item}
                onClick={() => {
                  setPage(0)
                  setCategory(item)
                }}
                type="button"
              >
                {item.replaceAll('-', ' ')}
              </button>
            ))}
          </div>

          {categoriesError && (
            <p className="catalog__notice" role="status">{categoriesError}</p>
          )}

          {error && products.length > 0 && (
            <div className="state-message state-message--error" role="alert">
              <span className="state-message__icon" aria-hidden="true">!</span>
              <div>
                <h3>Показан резервный каталог</h3>
                <p>{error} Сейчас отображаются демонстрационные товары.</p>
                <button className="retry-button" onClick={() => fetchProducts()} type="button">Попробовать снова</button>
              </div>
            </div>
          )}

          {loading ? (
            <LoadingState />
          ) : products.length > 0 ? (
            <>
              <div className="product-grid">
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
              {pageCount > 1 && (
                <nav aria-label="Страницы каталога">
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="Вперёд →"
                    nextAriaLabel="Следующая страница"
                    onPageChange={({ selected }) => setPage(selected)}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    forcePage={page}
                    previousLabel="← Назад"
                    previousAriaLabel="Предыдущая страница"
                    renderOnZeroPageCount={null}
                    containerClassName="pagination"
                    pageClassName="pagination__page"
                    pageLinkClassName="pagination__link"
                    previousClassName="pagination__previous"
                    previousLinkClassName="pagination__button"
                    nextClassName="pagination__next"
                    nextLinkClassName="pagination__button"
                    breakClassName="pagination__break"
                    breakLinkClassName="pagination__link"
                    activeClassName="is-active"
                    disabledClassName="is-disabled"
                    ariaLabelBuilder={(item) => `Страница ${item}`}
                  />
                </nav>
              )}
            </>
          ) : (
            <div className="state-message state-message--empty">
              <span className="state-message__icon" aria-hidden="true">⌕</span>
              <div>
                <h3>Ничего не нашлось</h3>
                <p>Попробуйте изменить запрос или выбрать другую категорию.</p>
                <button
                  className="retry-button"
                  onClick={() => {
                    setSearch('')
                    setCategory('all')
                    setPage(0)
                  }}
                  type="button"
                >
                  Сбросить фильтры
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <Link className="brand brand--footer" to="/" aria-label="Витрина — главная">
          <span className="brand__mark" aria-hidden="true">в</span>
          <span>витрина<span className="brand__dot">.</span></span>
        </Link>
        <span>Товары, которые делают каждый день особенным.</span>
        <span>Данные предоставлены DummyJSON</span>
      </footer>
    </div>
  )
}

function ProductDetailPage() {
  const { productId } = useParams()
  const { products, fetchProduct } = useProductStore()
  const [detail, setDetail] = useState({ productId: null, product: null, loading: true, error: null })

  useEffect(() => {
    const controller = new AbortController()

    fetchProduct(productId, controller.signal)
      .then((product) => {
        if (!controller.signal.aborted) {
          setDetail({ productId, product, loading: false, error: null })
        }
      })
      .catch((fetchError) => {
        if (controller.signal.aborted) return
        const fallbackProduct = products.find((item) => item.id === Number(productId))
          ?? fallbackProducts.find((item) => item.id === Number(productId))
          ?? null
        setDetail({
          productId,
          product: fallbackProduct,
          loading: false,
          error: fallbackProduct
            ? null
            : fetchError instanceof Error
              ? fetchError.message
              : 'Не удалось загрузить товар.',
        })
      })

    return () => controller.abort()
  }, [fetchProduct, productId, products])

  const currentDetail = detail.productId === productId
    ? detail
    : { product: null, loading: true, error: null }
  const { product, loading, error } = currentDetail

  if (loading) {
    return (
      <main className="app-shell product-detail">
        <p className="product-detail__message" role="status">Загружаем описание товара…</p>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="app-shell product-detail">
        <Link className="product-detail__back" to="/catalog">← Вернуться в каталог</Link>
        <div className="state-message state-message--error" role="alert">
          <span className="state-message__icon" aria-hidden="true">!</span>
          <div>
            <h3>Не удалось открыть товар</h3>
            <p>{error ?? 'Товар не найден.'}</p>
          </div>
        </div>
      </main>
    )
  }

  const images = product.images?.length ? product.images : [product.thumbnail]
  const discount = Math.round(product.discountPercentage)

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/catalog" aria-label="Витрина — каталог">
          <span className="brand__mark" aria-hidden="true">в</span>
          <span>витрина<span className="brand__dot">.</span></span>
        </Link>
        <Link className="header-link" to="/catalog">Вернуться к каталогу <span aria-hidden="true">←</span></Link>
      </header>
      <main className="product-detail">
        <Link className="product-detail__back" to="/catalog">← Все товары</Link>
        <article className="product-detail__layout">
          <div className="product-detail__gallery">
            {discount > 0 && <span className="product-card__discount">−{discount}%</span>}
            <Swiper
              modules={[A11y, Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={12}
              className="product-detail__swiper"
              aria-label={`Изображения товара: ${product.title}`}
            >
              {images.map((image, index) => (
                <SwiperSlide key={image}>
                  <img
                    src={image.startsWith('http') || image.startsWith(siteBase)
                      ? image
                      : `${siteBase}${image.replace(/^\//, '')}`}
                    alt={`${product.title} — фото ${index + 1}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="product-detail__content">
            <p className="eyebrow">{product.category}</p>
            <p className="product-card__brand">{product.brand || 'Без бренда'}</p>
            <h1>{product.title}</h1>
            <p className="product-detail__rating"><span aria-hidden="true">★</span> {product.rating.toFixed(1)} / 5</p>
            <p className="product-detail__description">{product.description}</p>
            <div className="product-detail__price">
              <strong>{formatPrice(getDiscountedPrice(product.price, product.discountPercentage))}</strong>
              {discount > 0 && (
                <span>{formatPrice(product.price)}</span>
              )}
            </div>
            <p className={`product-card__stock ${product.stock < 10 ? 'is-low' : ''}`}>
              {product.stock > 0 ? `В наличии: ${product.stock}` : 'Нет в наличии'}
            </p>
            <dl className="product-detail__facts">
              <div><dt>Артикул</dt><dd>{product.sku || '—'}</dd></div>
              <div><dt>Категория</dt><dd>{product.category}</dd></div>
              {product.warrantyInformation && <div><dt>Гарантия</dt><dd>{product.warrantyInformation}</dd></div>}
              {product.shippingInformation && <div><dt>Доставка</dt><dd>{product.shippingInformation}</dd></div>}
              {product.returnPolicy && <div><dt>Возврат</dt><dd>{product.returnPolicy}</dd></div>}
            </dl>
          </div>
        </article>
        {images.length > 1 && (
          <div className="product-detail__thumbnails" aria-label="Фотографии товара">
            {images.map((image, index) => (
              <img
                src={image.startsWith('http') || image.startsWith(siteBase)
                  ? image
                  : `${siteBase}${image.replace(/^\//, '')}`}
                alt={`${product.title} — фото ${index + 1}`}
                key={image}
                loading="lazy"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export { ProductDetailPage }
export default App
