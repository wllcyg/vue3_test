// api/request.ts
import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { ref  } from 'vue'
import type { Ref, UnwrapRef } from 'vue'

// 定义响应数据接口
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 自定义配置接口
interface CustomRequestConfig<D = any> extends AxiosRequestConfig<D> {
  immediate?: boolean;
  // 可以添加其他自定义配置
}

// 自定义hooks返回类型
interface UseRequestReturn<T> {
  data: Ref<UnwrapRef<T | null>>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  execute: (config?: AxiosRequestConfig<any>) => Promise<T>;
}

// 默认配置
const defaultConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}

// 创建axios实例工厂函数
const createAxiosInstance = (config: Partial<AxiosRequestConfig> = {}) => {
  const instance = axios.create({
    ...defaultConfig,
    ...config
  })

  // 请求拦截器
  instance.interceptors.request.use(
      (reqConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        // 添加token
        const token = localStorage.getItem('token')
        if (token && reqConfig.headers) {
          reqConfig.headers.Authorization = `Bearer ${token}`
        }
        return reqConfig
      },
      (error: any) => Promise.reject(error)
  )

  // 响应拦截器
  instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>): any => {
        // 判断业务状态码
        const res = response.data
        return res
      },
      (error: any) => {
        // 处理HTTP错误
        return Promise.reject(error)
      }
  )

  return instance
}

// 默认实例
const defaultInstance = createAxiosInstance()

// 自定义useRequest Hook
export function useRequest<T = any, D = any>(
    url: string,
    config: CustomRequestConfig<D> = {}
): UseRequestReturn<T> {
  const {
    immediate = true,
    baseURL,
    ...restConfig
  } = config

  // 如果提供了baseURL，创建新的实例
  const instance = baseURL ? createAxiosInstance({ baseURL }) : defaultInstance

  const data = ref<T | null>(null) as Ref<UnwrapRef<T | null>>
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)

  // 执行请求的函数
  const execute = async (executeConfig?: AxiosRequestConfig<D>): Promise<T> => {
    loading.value = true
    error.value = null

    try {
      const mergedConfig = {
        ...restConfig,
        ...executeConfig
      }

      // 执行请求并明确响应的类型处理
      const response = await instance(url, mergedConfig)

      // 确保响应数据类型正确
      const responseData = response as unknown as T
      data.value = responseData as UnwrapRef<T>
      return responseData
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('未知错误')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 如果配置了立即执行
  if (immediate) {
    execute().catch(err => console.error(err))
  }

  return {
    data,
    loading,
    error,
    execute
  }
}

// 创建不同请求方法的快捷方式
export function useGet<T = any, D = any>(url: string, config: CustomRequestConfig<D> = {}) {
  return useRequest<T, D>(url, { ...config, method: 'get' })
}

export function usePost<T = any, D = any>(url: string, data?: D, config: CustomRequestConfig<D> = {}) {
  return useRequest<T, D>(url, { ...config, method: 'post', data })
}

export function usePut<T = any, D = any>(url: string, data?: D, config: CustomRequestConfig<D> = {}) {
  return useRequest<T, D>(url, { ...config, method: 'put', data })
}

export function useDelete<T = any, D = any>(url: string, config: CustomRequestConfig<D> = {}) {
  return useRequest<T, D>(url, { ...config, method: 'delete' })
}

// 导出创建实例的函数，允许创建不同配置的实例
export const createRequest = createAxiosInstance

// 导出类型定义
export type { ApiResponse, CustomRequestConfig, UseRequestReturn }