//Componente botão de deletar produto
"use client"
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deleteProductAction } from "@/actions/products";
import { useRouter } from "next/navigation";

interface DeleteButtonProps{
    productId: string;
}

export function DeleteButtonProduct({ productId }: DeleteButtonProps){
    const router = useRouter();

    async function handleDeleteProduct(){

        const result = await deleteProductAction(productId);

        if(result.seccess){
            router.refresh();
            return;
        }

        if(result.error){
            alert(result.error);
        }
    }

    return(
        <Button onClick={handleDeleteProduct} className="bg-red-600 hover:bg-brand-primary">
            <Trash className="w-5 h-5 text-white"/>
        </Button>
    )
}