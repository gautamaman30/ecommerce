import { object, string } from 'yup'

const getPaymentsByIdSchema = object({
    payment_id: string().required().trim().length(10)
})

export {getPaymentsByIdSchema};