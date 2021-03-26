import { object, string, number } from 'yup'

const createOrdersSchema = object({
    product_id: string().required().trim().length(10),
    quantity: number().required().positive().integer().min(1)
})

export {createOrdersSchema};