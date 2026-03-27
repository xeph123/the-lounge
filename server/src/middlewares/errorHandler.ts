import { Request, Response, NextFunction } from 'express'
import { errorResponse } from '../utils/response'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  
  const status = err.status || 500
  const message = err.message || '서버 내부 오류가 발생했습니다.'
  const code = err.code || 'INTERNAL_ERROR'
  
  res.status(status).json(errorResponse(message, code, process.env.NODE_ENV === 'development' ? err.stack : undefined))
}
