import { object, string } from 'yup'

const getProductsBySellersIdSchema = object({
    sellers_id: string().required().trim().length(10)
})

export {getProductsBySellersIdSchema};