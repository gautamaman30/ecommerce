import { object, string } from 'yup'

const deleteSellersAccountSchema = object({
    sellers_id: string().required().trim().length(10)
})

export {deleteSellersAccountSchema};