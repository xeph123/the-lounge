import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import router from './routes'
import { errorHandler } from './middlewares/errorHandler'

dotenv.config()

const app = express()

app.set('trust proxy', 1)
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.use('/api', router)

app.get('/', (req, res) => {
  res.send('THE LOUNGE API Server is running')
})

app.use(errorHandler)

export default app
