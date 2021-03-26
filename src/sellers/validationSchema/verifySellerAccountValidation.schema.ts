import { object, string } from 'yup'

const verifySellersAccountSchema = object({
    sellers_id: string().required().trim().length(10)
})

export {verifySellersAccountSchema};