import { object, string } from 'yup'

const getProductsByCategorySchema = object({
    product_category: string().required().trim().lowercase().min(6).max(100).matches(/^[a-z]+$/)
})

export {getProductsByCategorySchema};