import { API_BASE_URL } from '@/config/env'

export interface RequestOptions extends RequestInit {
  timeout?: number
}

export async function request<T>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  const token = localStorage.getItem('token')
  const hasBody = options?.body !== undefined
  
  // 构建完整的 URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`
  
  const headers: HeadersInit = {
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  }

  const timeout = options?.timeout || 30000
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '请求失败' }))
      throw new Error(error.message || '请求失败')
    }

    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('请求超时')
      }
      throw error
    }
    throw new Error('网络请求失败')
  }
}

export function get<T>(url: string, options?: RequestOptions): Promise<T> {
  return request<T>(url, { ...options, method: 'GET' })
}

export function post<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
  return request<T>(url, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  })
}

export function put<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
  return request<T>(url, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  })
}

export function del<T>(url: string, options?: RequestOptions): Promise<T> {
  return request<T>(url, { ...options, method: 'DELETE' })
}
