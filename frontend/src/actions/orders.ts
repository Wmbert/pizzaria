//Actions para orders
"use server"
import { getToken } from "@/lib/auth";
import { apiClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

//Action para finalizar um pedido
export async function finishOrderAction(orderId: string){
    if(!orderId){
        return { success: false, error: "Falha ao finalizar o pedido"};
    }

    try{
        const token = await getToken();

        if(!token){
            return { success: false, error: "Falha ao finalizar o pedido"};
        };
    
        const data = {
            order_id: orderId
        };
    
        await apiClient("/order/finish",{
            method: "PUT",
            body: JSON.stringify(data),
            token: token
        });
    
        revalidatePath("/dashboard");
    
        return { success: true, error: ""};
    }catch(error){
        return { success: false, error: "Falha ao finalizar o pedido"};
        console.log(error);
    }

}