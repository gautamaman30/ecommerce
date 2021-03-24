import { object, string } from 'yup'

const loginUserSchema = object({
    username: string().required().trim().min(8).max(100),
    password: string().required().trim().min(8).max(100).matches(/^[a-zA-Z0-9!@#$%&*]+$/)
})

export {loginUserSchema};