// file này dùng để dịnh nghĩa lại Req truyền lên từ client
import { Request } from 'express'

declare module 'express' {
  interface Request {
    user?: User //trong 1 request có thể có hoặc không có user
  }
}
