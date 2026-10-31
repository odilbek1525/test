import axios from 'axios'
import { create } from 'zustand'
import fallbackProducts from './fallbackProducts'

const PRODUCTS_URL = 'https://dummyjson.com/products'

const getFallbackProducts = ({ limit, skip, sortBy, order, search, category }) => {
  const query = search.trim().toLocaleLowerCase('ru')
  const filtered = fallbackProducts.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category
    const searchableText = `${product.title} ${product.brand ?? ''} ${product.description}`.toLocaleLowerCase('ru')
    return matchesCategory && searchableText.includes(query)
  })

  if (sortBy) {
    const sortValue = (product) => sortBy === 'title' ? product.title.toLocaleLowerCase('ru') : product[sortBy]
    filtered.sort((first, second) => {
      const comparison = typeof sortValue(first) === 'string'
        ? sortValue(first).localeCompare(sortValue(second), 'ru')
        : sortValue(first) - sortValue(second)
      return order === 'desc' ? -comparison : comparison
    })
  }

  return { products: filtered.slice(skip, skip + limit), total: filtered.length }
}

export const useProductStore = create((set) => ({
  products: [],
  total: 0,
  categories: [],
  categoriesError: null,
  loading: false,
  error: null,
  fetchCategories: async (signal) => {
    try {
      const { data } = await axios.get(`${PRODUCTS_URL}/category-list`, { signal })
      if (!Array.isArray(data) || !data.every((category) =>
        typeof category === 'string' || (typeof category?.slug === 'string' && category.slug.length > 0),
      )) {
        throw new Error('Сервер вернул список категорий в неожиданном формате.')
      }

      set({
        categories: data.map((category) => typeof category === 'string' ? category : category.slug),
        categoriesError: null,
      })
    } catch (error) {
      if (axios.isCancel(error)) return

      set({
        categories: [...new Set(fallbackProducts.map((product) => product.category))],
        categoriesError: axios.isAxiosError(error)
          ? error.response
            ? `Не удалось загрузить категории: ошибка ${error.response.status}.`
            : 'Не удалось загрузить список категорий.'
          : error instanceof Error
            ? error.message
            : 'Не удалось загрузить список категорий.',
      })
    }
  },
  fetchProduct: async (id, signal) => {
    const { data } = await axios.get(`https://dummyjson.com/products/${encodeURIComponent(id)}`, { signal })
    if (!data || !Number.isInteger(data.id)) {
      throw new Error('Сервер вернул данные товара в неожиданном формате.')
    }

    return data
  },
  fetchProducts: async ({ signal, limit = 12, skip = 0, sortBy, order = 'asc', search = '', category = 'all' } = {}) => {
    set({ loading: true, error: null })

    try {
      const endpoint = category !== 'all'
        ? `${PRODUCTS_URL}/category/${encodeURIComponent(category)}`
        : search.trim()
          ? `${PRODUCTS_URL}/search`
          : PRODUCTS_URL
      const { data } = await axios.get(endpoint, {
        signal,
        params: {
          limit,
          skip,
          ...(sortBy ? { sortBy, order } : {}),
          ...(search.trim() ? { q: search.trim() } : {}),
        },
      })
      if (!Array.isArray(data.products) || !Number.isInteger(data.total)) {
        throw new Error('Сервер вернул данные каталога в неожиданном формате.')
      }

      set({ products: data.products, total: data.total, loading: false, error: null })
    } catch (error) {
      if (axios.isCancel(error)) return

      const fallback = getFallbackProducts({ limit, skip, sortBy, order, search, category })
      set({
        products: fallback.products,
        total: fallback.total,
        loading: false,
        error: axios.isAxiosError(error)
          ? error.response
            ? `Сервер ответил с ошибкой ${error.response.status}.`
            : 'Проверьте подключение к интернету и попробуйте ещё раз.'
          : error instanceof Error
            ? error.message
            : 'Произошла непредвиденная ошибка. Попробуйте ещё раз.',
      })
    }
  },
}))
