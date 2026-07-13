import { Request, Response } from "express";
import { AddItemOrderService } from "../../services/order/AddItemOrderService";

class AddItemOrderController{
    async handle(req: Request, res: Response){
        const { order_id, product_id, amount } = req.body;

        const addItem = new AddItemOrderService()

        const item = await addItem.execute({
            order_id: order_id,
            product_id: product_id,
            amount: amount
        })

        res.json(item);
    }
}

export { AddItemOrderController }