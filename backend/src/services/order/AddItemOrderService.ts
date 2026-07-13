import prismaClient from "../../prisma"

interface AddItemOrderServiceProps{
    order_id: string;
    product_id: string;
    amount: number
}

class AddItemOrderService{
    async execute({order_id, product_id, amount}: AddItemOrderServiceProps){
        try{

            const orderExists = await prismaClient.order.findFirst({
                where:{
                    id: order_id
                }
            })

            if(!orderExists){
                throw new Error("Order não encontrada ou inexistente");
            }

            const productsExists = await prismaClient.product.findFirst({
                where: {
                    id: product_id,
                    disabled: false
                }
            })

            if(!productsExists){
                throw new Error("Produto não encontrado ou inexistente");
            }

            const item = await prismaClient.item.create({
                data:{
                    order_id: order_id,
                    product_id: product_id,
                    amount: amount
                },
                select:{
                    id: true,
                    amount: true,
                    order_id: true,
                    product_id: true,
                    createdAt: true,
                    product:{
                        select:{
                            id: true,
                            name: true,
                            price: true,
                            description: true,
                            banner: true
                        }
                    }
                }
            })
            
            return item;

        }catch(error){
            throw new Error("Falha ao adicionar item no pedido");
        }
    }
}

export { AddItemOrderService }