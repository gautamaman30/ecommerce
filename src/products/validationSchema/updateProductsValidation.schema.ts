import { object, string, number } from 'yup'

const updateProductsSchema = object({
    product_id: string().required().trim().length(10),
    name: string().trim().lowercase().min(6).max(100).matches(/^[a-z]+$/),
    description: string().trim().min(10).max(200),
    brand_name: string().trim().lowercase().min(10).max(100),
    color: string().trim().lowercase().min(3).max(50).matches(/^[a-z]+$/),
    quantity: number().positive().integer().min(1),
    price: number().positive().transform((val, originalVal) => {
        return (Math.floor((val * 100)) / 100);
    }).min(1.00)
})

export {updateProductsSchema};