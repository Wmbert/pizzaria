import { z } from "zod";

//Schema para validar criação de categoria
export const createCategorySchema = z.object({
    body: z.object({
        name: z
        .string({message: "Nome da categoria precisa ser um texto"})
        .min(2, {message: "Nome da categoria precisa ter pelo menos 2 caracteres"})
    })
})