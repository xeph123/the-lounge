import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../../config/prisma'
import { generateToken } from '../../utils/jwt'
import { successResponse, errorResponse } from '../../utils/response'
import { AuthRequest } from '../../middlewares/auth'

export const signup = async (req: Request, res: Response) => {
  const { email, password, name, department, role } = req.body

  if (!email || !password || !name) {
    return res.status(400).json(errorResponse('이메일, 비밀번호, 이름은 필수 항목입니다.', 'BAD_REQUEST'))
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json(errorResponse('이미 사용 중인 이메일입니다.', 'CONFLICT'))
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        department,
        role: role || 'USER',
      },
    })

    const { password: _, ...userWithoutPassword } = newUser
    res.status(201).json(successResponse(userWithoutPassword))
  } catch (error) {
    res.status(500).json(errorResponse('회원가입 중 오류가 발생했습니다.', 'SERVER_ERROR >> ' + error))
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json(errorResponse('이메일 또는 비밀번호가 일치하지 않습니다.', 'AUTH_FAILED'))
    }

    // 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      return res.status(401).json(errorResponse('이메일 또는 비밀번호가 일치하지 않습니다.', 'AUTH_FAILED'))
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role })
    
    const { password: _, ...userWithoutPassword } = user
    res.json(successResponse({ token, user: userWithoutPassword }))
  } catch (error) {
    res.status(500).json(errorResponse('로그인 중 오류가 발생했습니다.'))
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  const { email, name, newPassword } = req.body

  if (!email || !name || !newPassword) {
    return res.status(400).json(errorResponse('이메일, 이름, 새 비밀번호는 필수 항목입니다.', 'BAD_REQUEST'))
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    
    if (!user || user.name !== name) {
      return res.status(404).json(errorResponse('사용자 정보를 찾을 수 없습니다.', 'NOT_FOUND'))
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    res.json(successResponse({ message: '비밀번호가 성공적으로 변경되었습니다.' }))
  } catch (error) {
    res.status(500).json(errorResponse('비밀번호 변경 중 오류가 발생했습니다.'))
  }
}

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { id: true, email: true, name: true, role: true, department: true }
    })
    
    if (!user) {
      return res.status(404).json(errorResponse('사용자를 찾을 수 없습니다.', 'NOT_FOUND'))
    }
    
    res.json(successResponse(user))
  } catch (error) {
    res.status(500).json(errorResponse('정보 조회 중 오류가 발생했습니다.'))
  }
}
