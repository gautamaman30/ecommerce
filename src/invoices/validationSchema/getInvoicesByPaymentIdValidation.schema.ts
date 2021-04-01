import { string, object } from 'yup';

const getInvoicesByPaymentIdSchema = object({
    payment_id: string().required().trim().length(10)
});

export {getInvoicesByPaymentIdSchema};