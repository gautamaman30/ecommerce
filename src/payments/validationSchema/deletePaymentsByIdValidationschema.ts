import { object, string } from 'yup'

const deletePaymentsByIdSchema = object({
    payment_id: string().required().trim().length(10)
})

export {deletePaymentsByIdSchema};