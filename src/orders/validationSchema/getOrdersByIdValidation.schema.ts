import { object, string } from 'yup'

const getOrdersByIdSchema = object({
    order_id: string().required().trim().length(10)
});

export {getOrdersByIdSchema};