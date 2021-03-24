import { object, string } from 'yup'

const createUserSchema = object({
    username: string().required().trim().min(8).max(100),
    email: string().required().trim().email().max(100),
    first_name: string().required().trim().lowercase().min(3).max(100).matches(/^[a-z]+$/),
    last_name: string().required().trim().lowercase().min(3).max(100).matches(/^[a-z]+$/),
    password: string().required().trim().min(8).max(100).matches(/^[a-zA-Z0-9!@#$%&*]+$/)
})

export {createUserSchema};