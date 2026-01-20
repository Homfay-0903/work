/**
 * 通用数据缓存管理工具
 *
 * 提供简单易用的数据缓存功能，支持过期时间管理
 * 适用于页面级数据缓存，减少重复API请求
 */

interface CacheItem<T> {
    data: T
    timestamp: number
    expireTime: number
}

class DataCacheManager {
    private prefix = 'data-cache-'

    /**
     * 设置缓存
     * @param key 缓存键
     * @param data 缓存数据
     * @param expireTime 过期时间（毫秒），默认5分钟
     */
    set<T>(key: string, data: T, expireTime = 5 * 60 * 1000): void {
        try {
            const cacheItem: CacheItem<T> = {
                data,
                timestamp: Date.now(),
                expireTime,
            }
            localStorage.setItem(this.prefix + key, JSON.stringify(cacheItem))
        } catch (error) {
            console.warn(`[DataCache] 设置缓存失败: ${key}`, error)
        }
    }

    /**
     * 获取缓存
     * @param key 缓存键
     * @returns 缓存数据，如果不存在或已过期则返回null
     */
    get<T>(key: string): T | null {
        try {
            const cached = localStorage.getItem(this.prefix + key)
            if (!cached) return null

            const cacheItem: CacheItem<T> = JSON.parse(cached)
            const now = Date.now()

            if (now - cacheItem.timestamp > cacheItem.expireTime) {
                this.remove(key)
                return null
            }

            return cacheItem.data
        } catch (error) {
            console.warn(`[DataCache] 读取缓存失败: ${key}`, error)
            return null
        }
    }

    /**
     * 移除缓存
     * @param key 缓存键
     */
    remove(key: string): void {
        try {
            localStorage.removeItem(this.prefix + key)
        } catch (error) {
            console.warn(`[DataCache] 移除缓存失败: ${key}`, error)
        }
    }

    /**
     * 清空所有缓存
     */
    clear(): void {
        try {
            const keys = Object.keys(localStorage)
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key)
                }
            })
        } catch (error) {
            console.warn('[DataCache] 清空缓存失败', error)
        }
    }

    /**
     * 检查缓存是否存在且未过期
     * @param key 缓存键
     * @returns 是否有效
     */
    has(key: string): boolean {
        return this.get(key) !== null
    }

    /**
     * 获取或设置缓存（如果缓存不存在则通过factory函数获取）
     * @param key 缓存键
     * @param factory 数据获取函数
     * @param expireTime 过期时间（毫秒）
     * @returns 缓存数据
     */
    async getOrSet<T>(key: string, factory: () => Promise<T>, expireTime = 5 * 60 * 1000): Promise<T> {
        const cached = this.get<T>(key)
        if (cached !== null) {
            return cached
        }

        const data = await factory()
        this.set(key, data, expireTime)
        return data
    }
}

export const dataCache = new DataCacheManager()
