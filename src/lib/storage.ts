// 本地存储管理

export const storage = {
  // 保存数据
  setItem(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
    } catch (error) {
      console.error(`Failed to save ${key}:`, error)
    }
  },

  // 获取数据
  getItem<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue ?? null
    } catch (error) {
      console.error(`Failed to get ${key}:`, error)
      return defaultValue ?? null
    }
  },

  // 删除数据
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error)
    }
  },

  // 清空所有数据
  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Failed to clear storage:', error)
    }
  },

  // 获取所有键
  keys(): string[] {
    try {
      return Object.keys(localStorage)
    } catch (error) {
      console.error('Failed to get keys:', error)
      return []
    }
  },

  // 获取存储大小
  size(): number {
    try {
      let size = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          size += localStorage[key].length + key.length
        }
      }
      return size
    } catch (error) {
      console.error('Failed to get size:', error)
      return 0
    }
  },
}

// 用户信息存储
export const userStorage = {
  setUser(user: any): void {
    storage.setItem('user', user)
  },

  getUser(): any {
    return storage.getItem('user')
  },

  setToken(token: string): void {
    storage.setItem('token', token)
  },

  getToken(): string | null {
    return storage.getItem('token')
  },

  clear(): void {
    storage.removeItem('user')
    storage.removeItem('token')
  },
}

// 应用数据存储
export const appStorage = {
  setLastSync(timestamp: number): void {
    storage.setItem('lastSync', timestamp)
  },

  getLastSync(): number {
    return storage.getItem('lastSync', 0)
  },

  setAppVersion(version: string): void {
    storage.setItem('appVersion', version)
  },

  getAppVersion(): string {
    return storage.getItem('appVersion', '1.0.0')
  },
}
