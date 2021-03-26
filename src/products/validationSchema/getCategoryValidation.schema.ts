import { object, string } from 'yup'

const getCategorySchema = object({
    name: string().required().trim().lowercase().min(6).max(100).matches(/^[a-z]+$/)
})

export {getCategorySchema};