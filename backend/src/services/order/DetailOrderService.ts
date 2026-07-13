import prismaClient from "../../prisma"

interface DetailOderServiceProps{
    order_id: string;
}

class DetailOrderService{
    async execute({order_id}: DetailOderServiceProps){

        const order = await prismaClient.order.findFirst({
            where:{
                id: order_id
            },
            select:{
                id: true,
                table: true,
                name: true,
                draft: true,
                status: true,
                createdAt: true,
                items:{
                    select:{
                        id: true,
                        amount: true,
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
                }
            }
        })

        if(!order){
            throw new Error("Pedido não encontrado");
        }

        return order;
    }
}

export { DetailOrderService }