import { Request, Response } from 'express'
import prisma from '../../config/prisma'
import { successResponse, errorResponse } from '../../utils/response'
import { AuthRequest } from '../../middlewares/auth'

export const getPosts = async (req: Request, res: Response) => {
  const { category, search, page = '1', limit = '20', sort = 'latest' } = req.query
  const skip = (Number(page) - 1) * Number(limit)
  const take = Number(limit)

  try {
    const where: any = {}
    if (category) {
      where.category = { slug: String(category) }
    }
    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { content: { contains: String(search) } },
      ]
    }

    const orderBy: any = sort === 'latest' ? { createdAt: 'desc' } : { viewCount: 'desc' }

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: true,
          author: { select: { id: true, name: true, role: true, bio: true } },
          _count: { select: { comments: true, likes: true } },
          tags: true,
        },
      }),
      prisma.post.count({ where }),
    ])

    res.json(successResponse(posts, { page: Number(page), limit: take, totalCount }))
  } catch (error) {
    res.status(500).json(errorResponse('게시글 목록 조회 중 오류가 발생했습니다.'))
  }
}

export const createPost = async (req: AuthRequest, res: Response) => {
  const { title, content, categorySlug, thumbnail, tags = [] } = req.body

  try {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
    if (!category) {
      return res.status(400).json(errorResponse('존재하지 않는 카테고리입니다.', 'INVALID_CATEGORY'))
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        thumbnail,
        categoryId: category.id,
        authorId: req.user!.id,
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, role: true } },
        tags: true,
      },
    })

    res.status(201).json(successResponse(post))
  } catch (error) {
    res.status(500).json(errorResponse('게시글 작성 중 오류가 발생했습니다.'))
  }
}

export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const post = await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      include: {
        category: true,
        author: { select: { id: true, name: true, role: true, department: true, bio: true } },
        _count: { select: { comments: true, likes: true } },
        tags: true,
      },
    })

    res.json(successResponse(post))
  } catch (error) {
    res.status(404).json(errorResponse('게시글을 찾을 수 없습니다.', 'NOT_FOUND'))
  }
}

export const updatePost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { title, content, thumbnail, tags } = req.body

  try {
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) {
      return res.status(404).json(errorResponse('게시글을 찾을 수 없습니다.', 'NOT_FOUND'))
    }

    if (post.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json(errorResponse('수정 권한이 없습니다.', 'FORBIDDEN'))
    }

    const updateData: any = { title, content, thumbnail }
    
    if (tags) {
      updateData.tags = {
        set: [], // 기존 관계 제거
        connectOrCreate: tags.map((tag: string) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      }
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        author: { select: { id: true, name: true, role: true } },
        tags: true,
      },
    })

    res.json(successResponse(updatedPost))
  } catch (error) {
    res.status(500).json(errorResponse('게시글 수정 중 오류가 발생했습니다.'))
  }
}

export const deletePost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  try {
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) {
      return res.status(404).json(errorResponse('게시글을 찾을 수 없습니다.', 'NOT_FOUND'))
    }

    if (post.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json(errorResponse('삭제 권한이 없습니다.', 'FORBIDDEN'))
    }

    await prisma.post.delete({ where: { id } })
    res.json(successResponse({ message: '삭제되었습니다.' }))
  } catch (error) {
    res.status(500).json(errorResponse('게시글 삭제 중 오류가 발생했습니다.'))
  }
}
