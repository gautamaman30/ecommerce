import { string, object } from 'yup';

const getInvoicesByOrderIdSchema = object({
    order_id: string().required().trim().length(10)
});

export {getInvoicesByOrderIdSchema};