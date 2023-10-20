// giả xử là anh đang làm route '/login'
// thì người dùng mốn dùng sẽ truyền email và password
// tạo 1 request cp1 body là email và password
// - làm 1 middleware kiểm tra xem email và password
// có được truền lên hay không ?

import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import usersService from '~/services/users.services'
import { validate } from '~/utils/validation'

//khi vào /login
// Request, Response, NextFunction là n~ interface express func hỗ trợ
// mỗi lần bổ nghĩa thì cần import
export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing email or password'
    })
  }
  next()
}

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      }
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const isExist = await usersService.checkEmailExist(value)
          if (isExist) {
            throw new Error('Email already exists')
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
          // returnScore: true
        }
      },
      errorMessage:
        'Password must be at least characters long, contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol'
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
          // returnScore: true
        }
      },
      errorMessage:
        'confirm_password must be at least characters long, contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol',
      custom: {
        //value là confirm password vì nó nằm trong trường confirm password, req là req hiện tại
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('confirm_password does not match password')
          }
          return true //nếu không return true thì nó kẹt ở đây mãi
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)
