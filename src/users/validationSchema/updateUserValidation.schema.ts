import { object, string } from 'yup'

const updateUserSchema = object({
    first_name: string().trim().lowercase().min(3).max(100).matches(/^[a-z]+$/),
    last_name: string().trim().lowercase().min(3).max(100).matches(/^[a-z]+$/)
})

export {updateUserSchema};