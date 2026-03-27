import { Request, Response } from 'express'
import prisma from '../../config/prisma'
import { successResponse, errorResponse } from '../../utils/response'
import { AuthRequest } from '../../middlewares/auth'

export const getComments = async (req: Request, res: Response) => {
  const { postId } = req.params

  try {
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null }, // 최상위 댓글만 먼저 가져오고 대댓글은 include
      include: {
        author: { select: { id: true, name: true, role: true } },
        replies: {
          include: {
            author: { select: { id: true, name: true, role: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(successResponse(comments))
  } catch (error) {
    res.status(500).json(errorResponse('댓글 조회 중 오류가 발생했습니다.'))
  }
}

export const createComment = async (req: AuthRequest, res: Response) => {
  const { postId } = req.params
  const { content, parentId } = req.body

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) {
      return res.status(404).json(errorResponse('게시글을 찾을 수 없습니다.', 'NOT_FOUND'))
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        parentId,
        authorId: req.user!.id,
      },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    })

    res.status(201).json(successResponse(comment))
  } catch (error) {
    res.status(500).json(errorResponse('댓글 작성 중 오류가 발생했습니다.'))
  }
}

export const updateComment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { content } = req.body

  if (!content) {
    return res.status(400).json(errorResponse('내용은 필수 항목입니다.', 'BAD_REQUEST'))
  }

  try {
    const comment = await prisma.comment.findUnique({ where: { id } })
    if (!comment) {
      return res.status(404).json(errorResponse('댓글을 찾을 수 없습니다.', 'NOT_FOUND'))
    }

    if (comment.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json(errorResponse('수정 권한이 없습니다.', 'FORBIDDEN'))
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    })

    res.json(successResponse(updatedComment))
  } catch (error) {
    res.status(500).json(errorResponse('댓글 수정 중 오류가 발생했습니다.'))
  }
}

export const deleteComment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  try {
    const comment = await prisma.comment.findUnique({ where: { id } })
    if (!comment) {
      return res.status(404).json(errorResponse('댓글을 찾을 수 없습니다.', 'NOT_FOUND'))
    }

    if (comment.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json(errorResponse('삭제 권한이 없습니다.', 'FORBIDDEN'))
    }

    await prisma.comment.delete({ where: { id } })
    res.json(successResponse({ message: '삭제되었습니다.' }))
  } catch (error) {
    res.status(500).json(errorResponse('댓글 삭제 중 오류가 발생했습니다.'))
  }
}
