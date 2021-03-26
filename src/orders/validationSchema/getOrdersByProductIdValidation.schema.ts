import { object, string } from 'yup'

const getOrdersByProductIdSchema = object({
    product_id: string().required().trim().length(8)
});

export {getOrdersByProductIdSchema};