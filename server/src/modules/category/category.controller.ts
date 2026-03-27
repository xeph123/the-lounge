import { Request, Response } from 'express'
import prisma from '../../config/prisma'
import { successResponse, errorResponse } from '../../utils/response'

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany()
    res.json(successResponse(categories))
  } catch (error) {
    res.status(500).json(errorResponse('카테고리 조회 중 오류가 발생했습니다.'))
  }
}
