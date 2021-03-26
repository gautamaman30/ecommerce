import { object, string } from 'yup'

const getOrdersByProductIdSchema = object({
    product_id: string().required().trim().length(10)
});

export {getOrdersByProductIdSchema};