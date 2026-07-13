import { z } from "zod";

export const createOrderSchema = z.object({
    body: z.object({
        table: z
            .number({ message: "O número da mesa deve ser numérico" })
            .int({ message: "O número da mesa deve ser inteiro" })
            .positive({ message: "O número da mesa deve ser positivo" }),
        name: z.string().optional()
    })
})


export const addItemOderSchema = z.object({
    body: z.object({
        order_id: z
            .string({ message: "Order deve ser uma string" })
            .min(1, { message: "A order_id é obrigatória" }),
        product_id: z
            .string({ message: "Produto deve ser uma string" })
            .min(1, { message: "A product_id é obrigatória" }),
        amount: z
            .number()
            .int("Quantidade deve ser um número inteiro")
            .positive("Quantidade deve ser um número")
    })
})

export const removeItemOrderSchema = z.object({
    query: z.object({
        item_id: z
            .string({ message: "item_id deve ser uma string" })
            .min(1, { message: "O item_id é obrigatório" })
    })
})

export const detailOrderSchema = z.object({
    query: z.object({
        order_id: z
            .string({ message: "Order deve ser uma string" })
            .min(1, { message: "A order_id é obrigatória" }),
    })
})

export const sendOrderSchema = z.object({
    body: z.object({
        order_id: z
            .string({ message: "Order deve ser uma string" })
            .min(1, { message: "A order_id é obrigatória" }),
        name: z
            .string({ message: "Nome precisa ser uma string" })
    })
})

export const finishOrderSchema = z.object({
    body: z.object({
        order_id: z
            .string({ message: "Order deve ser uma string" })
            .min(1, { message: "A order_id é obrigatória" }),
    })
})

export const deleteOrderSchema = z.object({
    body: z.object({
        order_id: z
            .string({ message: "Order deve ser uma string" })
            .min(1, { message: "A order_id é obrigatória" }),
    })
})