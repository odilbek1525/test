import axios from 'axios'
import { create } from 'zustand'
import fallbackProducts from './fallbackProducts'

const PRODUCTS_URL = 'https://dummyjson.com/products?limit=0'

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,
  fetchProduct: async (id, signal) => {
    const { data } = await axios.get(`https://dummyjson.com/products/${encodeURIComponent(id)}`, { signal })
    if (!data || !Number.isInteger(data.id)) {
      throw new Error('Сервер вернул данные товара в неожиданном формате.')
    }

    return data
  },
  fetchProducts: async (signal) => {
    set({ loading: true, error: null })

    try {
      const { data } = await axios.get(PRODUCTS_URL, { signal })
      if (!Array.isArray(data.products)) {
        throw new Error('Сервер вернул данные каталога в неожиданном формате.')
      }

      set({ products: data.products, loading: false, error: null })
    } catch (error) {
      if (axios.isCancel(error)) return

      set({
        products: fallbackProducts,
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
