import { object, string } from 'yup'

const getProductsByIdSchema = object({
    product_id: string().required().trim().length(10)
})

export {getProductsByIdSchema};