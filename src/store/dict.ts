// src/stores/dictionary.ts
import { defineStore } from 'pinia'
import { getDict } from '@/service/dict/index'

interface CacheItem<T> {
  value: T
  timestamp: number
}

export const useDictionaryStore = defineStore({
  id: 'dictionary',
  state: () => ({
    cache: new Map<string, CacheItem<any>>(),
    cacheTimeout: 3000000, // 默认缓存有效期5分钟
  }),
  actions: {
    async fetchFromAPI<T>(key: string): Promise<T> {
      const response = await getDict(key)
      return response.data
    },

    async get<T>(key: string): Promise<T | undefined> {
      const cachedItem = this.cache.get(key)

      if (cachedItem && Date.now() - cachedItem.timestamp < this.cacheTimeout) {
        return cachedItem.value
      } else {
        // 从缓存中移除过期的条目
        this.cache.delete(key)

        // 从 API 获取数据并缓存
        const value = await this.fetchFromAPI<T>(key)
        this.set(key, value)
        return value
      }
    },

    set<T>(key: string, value: T): void {
      this.cache.set(key, {
        value,
        timestamp: Date.now(),
      })
    },

    remove(key: string): void {
      this.cache.delete(key)
    },

    clear(): void {
      this.cache.clear()
    },
  },
})
