import jwt from 'jsonwebtoken'

// làm hàm nhận vào payload, privateKey, options từ đó ký tên

// nếu ký thất bại phải trả về reject, nếu kh reject sao bắt lỗi
export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privateKey?: string
  options: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) throw reject(err)
      resolve(token as string)
    })
  })
}
