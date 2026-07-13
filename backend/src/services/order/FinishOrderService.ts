import prismaClient from "../../prisma";

interface FinishOrderServiceProps{
    order_id: string;
}

class FinishOrderService{
    async execute({order_id}: FinishOrderServiceProps){
        try{
            const order = await prismaClient.order.findFirst({
                where:{
                    id: order_id
                }
            })

            if(!order){
                throw new Error("Falha ao finalizar pedido");
            }

            const updateOrder = await prismaClient.order.update({
                where:{
                    id: order_id
                },
                data:{
                    status: true,
                },
                select:{
                    id: true,
                    table: true,
                    name: true,
                    draft: true,
                    status: true,
                    createdAt: true
                }
            })

            return updateOrder;

        }catch(error){
            throw new Error("Falha ao finalizar pedido");
        }
    }
}

export { FinishOrderService }