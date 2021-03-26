import { object, string } from 'yup'

const deleteCategorySchema = object({
    name: string().required().trim().lowercase().min(6).max(100).matches(/^[a-z]+$/)
})

export {deleteCategorySchema};