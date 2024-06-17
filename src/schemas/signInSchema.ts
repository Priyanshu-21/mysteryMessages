import {z} from 'zod'; 

// creating zod schema for sigin, identifier : - username or email Address
export const signInSchema = z.object({
    identifer: z.string(), 
    password: z.string()
});