import {object, string} from 'yup';

export const getSellerSchema = object({
    sellers_id: string().required().trim().length(10)
})