import { Request, Response } from 'express'
import prisma from '../../config/prisma'
import { successResponse, errorResponse } from '../../utils/response'
import { AuthRequest } from '../../middlewares/auth'
import bcrypt from 'bcryptjs'

export const getUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          include: {
            category: true,
            _count: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!user) {
      return res.status(404).json(errorResponse('사용자를 찾을 수 없습니다.', 'NOT_FOUND'))
    }

    const { password, ...userProfile } = user

    return res.json(successResponse(userProfile))
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return res.status(500).json(errorResponse('서버 오류가 발생했습니다.', 'INTERNAL_SERVER_ERROR'))
  }
}

export const updateMe = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id
  const { name, department, bio, password } = req.body

  if (!userId) {
    return res.status(401).json(errorResponse('인증이 필요합니다.', 'UNAUTHORIZED'))
  }

  try {
    const updateData: any = {}
    if (name) updateData.name = name
    if (department !== undefined) updateData.department = department
    if (bio !== undefined) updateData.bio = bio
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    const { password: _, ...userWithoutPassword } = updatedUser

    return res.json(successResponse(userWithoutPassword))
  } catch (error) {
    console.error('Error updating user profile:', error)
    return res.status(500).json(errorResponse('사용자 정보 수정 중 오류가 발생했습니다.', 'INTERNAL_SERVER_ERROR'))
  }
}

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json(errorResponse('권한이 없습니다.', 'FORBIDDEN'))
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    const usersWithoutPassword = users.map(({ password, ...user }) => user)

    return res.json(successResponse(usersWithoutPassword))
  } catch (error) {
    console.error('Error fetching all users:', error)
    return res.status(500).json(errorResponse('서버 오류가 발생했습니다.', 'INTERNAL_SERVER_ERROR'))
  }
}

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { role } = req.body

  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json(errorResponse('권한이 없습니다.', 'FORBIDDEN'))
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    })

    const { password: _, ...userWithoutPassword } = updatedUser

    return res.json(successResponse(userWithoutPassword))
  } catch (error) {
    console.error('Error updating user role:', error)
    return res.status(500).json(errorResponse('사용자 권한 수정 중 오류가 발생했습니다.', 'INTERNAL_SERVER_ERROR'))
  }
}
