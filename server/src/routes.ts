import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import * as authController from './modules/auth/auth.controller'
import * as userController from './modules/user/user.controller'
import * as postController from './modules/post/post.controller'
import * as commentController from './modules/comment/comment.controller'
import * as categoryController from './modules/category/category.controller'
import { authenticate } from './middlewares/auth'

const router = Router()

// Upload setup
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})

const upload = multer({ storage })

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  const url = `/uploads/${req.file.filename}`
  res.json({ url })
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
