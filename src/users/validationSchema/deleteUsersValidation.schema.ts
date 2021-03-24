import { object, string } from 'yup'

const deleteUsersSchema = object({
    username: string().required().trim().min(8).max(100)
})

export {deleteUsersSchema};