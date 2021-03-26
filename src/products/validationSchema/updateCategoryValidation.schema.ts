import { object, string } from 'yup'

const updateCategorySchema = object({
    category_name: string().required().trim().lowercase().min(6).max(100).matches(/^[a-z]+$/),
    description: string().trim().min(10).max(200)
})

export {updateCategorySchema};