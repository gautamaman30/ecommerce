import { object, string } from 'yup'

const deleteProductsSchema = object({
    product_id: string().required().trim().length(10)
})

export {deleteProductsSchema};