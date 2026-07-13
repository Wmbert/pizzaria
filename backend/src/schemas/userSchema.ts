import z, { object } from "zod";

//Schema para criação de usuário
export const createUserSchema = object({
    body: z.object({
        name: z
            .string({message: "O nome precisa ser um texto"})
            .min(3, {message: "O nome precisa ter no minimo 3 letras"}),
        email: z.email({message: "Precisa ser um email válido"}),
        password: z
            .string({message: "A senha é obrigatória"})
            .min(6, {message: "A senha deve ter ao menos 6 caracteres"})
    })
})

//Schema para validar dados de login
export const authUserSchema = z.object({
    body: z.object({
        email: z.email({message: "Precisa ser um email válido!"}),
        password: z
            .string({message: "A senha é obrigatória!"})
            .min(1, {message: "A senha é obrigatória!"}),
    })
})