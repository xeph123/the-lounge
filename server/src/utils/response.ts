export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    debug?: any
  }
  meta?: {
    page?: number
    limit?: number
    totalCount?: number
  }
  timestamp: string
}

export const successResponse = (data: any, meta?: any): ApiResponse => ({
  success: true,
  data,
  meta,
  timestamp: new Date().toISOString(),
})

export const errorResponse = (message: string, code: string = 'INTERNAL_ERROR', debug?: any): ApiResponse => ({
  success: false,
  error: {
    code,
    message,
    debug,
  },
  timestamp: new Date().toISOString(),
})
