import { object, string } from 'yup'

const deleteOrdersSchema = object({
    order_id: string().required().trim().length(10)
});

export {deleteOrdersSchema};