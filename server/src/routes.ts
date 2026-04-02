import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import * as authController from './modules/auth/auth.controller'
import * as userController from './modules/user/user.controller'
import * as postController from './modules/post/post.controller'
import * as commentController from './modules/comment/comment.controller'
import * as categoryController from './modules/category/category.controller'
import { authenticate } from './middlewares/auth'

const router = Router()

// Supabase Storage Setup
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_KEY || ''
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null

// Upload setup (Memory Storage)
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase Storage 설정이 되어있지 않습니다 (.env 확인)' })
  }

  try {
    const file = req.file
    const ext = path.extname(file.originalname).toLowerCase()
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const filename = `${uniqueSuffix}${ext}`

    // Supabase 'uploads' 버킷에 파일 업로드
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      })

    if (error) {
      console.error('Supabase 업로드 에러:', error)
      return res.status(500).json({ error: '스토리지 업로드에 실패했습니다.' })
    }

    // Public URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filename)

    res.json({ url: publicUrl })
  } catch (err) {
    console.error('업로드 중 예기치 않은 에러:', err)
    res.status(500).json({ error: '업로드 중 서버 에러가 발생했습니다.' })
  }
})

// Auth
router.post('/auth/signup', authController.signup)
router.post('/auth/login', authController.login)
router.post('/auth/reset-password', authController.resetPassword)
router.get('/auth/me', authenticate, authController.me)

// Users
router.put('/users/me', authenticate, userController.updateMe)
router.get('/users', authenticate, userController.getAllUsers)
router.get('/users/:id', userController.getUserProfile)
router.put('/users/:id/role', authenticate, userController.updateUserRole)

// Categories
router.get('/categories', categoryController.getCategories)

// Posts
router.get('/posts', postController.getPosts)
router.post('/posts', authenticate, postController.createPost)
router.get('/posts/:id', postController.getPostById)
router.put('/posts/:id', authenticate, postController.updatePost)
router.delete('/posts/:id', authenticate, postController.deletePost)

// Comments
router.get('/posts/:postId/comments', commentController.getComments)
router.post('/posts/:postId/comments', authenticate, commentController.createComment)
router.put('/comments/:id', authenticate, commentController.updateComment)
router.delete('/comments/:id', authenticate, commentController.deleteComment)

export default router
