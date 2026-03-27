import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { errorResponse } from '../utils/response'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(errorResponse('인증이 필요합니다.', 'UNAUTHORIZED'))
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)

  if (!decoded) {
    return res.status(401).json(errorResponse('유효하지 않은 토큰입니다.', 'INVALID_TOKEN'))
  }

  req.user = decoded as any
  next()
}
