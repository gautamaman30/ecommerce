import { object, string } from 'yup'

const getUsersByUsernameSchema = object({
    username: string().required().trim().min(8).max(100)
})

export {getUsersByUsernameSchema};