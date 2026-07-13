//Modal de detalhes de uma order
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/format";
import { Order } from "@/lib/types";
import { finishOrderAction } from "@/actions/orders";
import { useRouter } from "next/navigation";

interface OrderModalProps {
  orderId: string | null
  onClose: () => Promise<void>
  token: string
}

export function OrderModal({ onClose, orderId, token }: OrderModalProps) {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchOrder = async () => {
        if (!orderId) {
            setOrder(null);
            return;
        }

        try {
            setLoading(true);

            const response = await apiClient<Order>(`/order/detail?order_id=${orderId}`, {
            method: "GET",
            token: token,
            });

            setOrder(response);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function loadOrder() {
            await fetchOrder();
        };

        loadOrder();
    }, [orderId]);

    const handleOpenChange = async (open: boolean) => {
        if (!open) {
            await onClose()
        };
        };

        const handleFinishOrder = async () => {
        if(!orderId) return;

        const result = await finishOrderAction(orderId);

        if(!result.success){
            console.log(result.error);
        }

        if(result.success){
            router.refresh();
            onClose();
        }

    };

    const calculateTotal = () => {
        if(!order?.items) return 0
        return order?.items?.reduce( (total, item) => {
            return total + item.product.price * item.amount
        }, 0)
    }

    return (
        <Dialog open={orderId !== null} onOpenChange={handleOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="max-w-[calc(100%-2rem)] bg-app-card text-white ring-app-border sm:max-w-xl"
            >
                <DialogHeader>
                    <DialogTitle className="text-4xl font-bold">Detalhe do pedido</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <p className="text-gray-300">Carregando detalhes do pedido...</p>
                ) : !order ? (
                    <p className="text-gray-300">Pedido nao encontrado.</p>
                ) : (
                    <div className="space-y-8">
                        <div className="grid gap-6 grid-cols-1">
                            <div>
                                <p className="text-sm text-gray-400">Nome da categoria</p>
                                <p className="text-2xl font-bold">Mesa {order.table}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">Cliente</p>
                                <p className="text-2xl font-bold">{order.name || "Sem nome"}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">Status</p>
                                <Badge variant="secondary" className="mt-2 text-xs font-bold">
                                    Em produção
                                </Badge>
                            </div>

                        </div>

                        <div className="space-y-4">
                            <h3 className="text-3xl font-bold">Itens do pedido</h3>

                        {order.items && order.items.length > 0 ? (
                                <div className="space-y-5">
                                    {order.items.map((item) => {
                                        const itemSubtotal = item.product.price * item.amount

                                        return (
                                                <div key={item.id} className="space-y-1">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <p className="text-2xl font-bold">
                                                                {item.product.name}
                                                            </p>
                                                            <p className="text-lg text-gray-300">
                                                                Quantidade: {item.amount}
                                                            </p>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold">
                                                                {formatPrice(item.product.price)}
                                                            </p>
                                                            <p className="text-lg text-gray-300">
                                                                Subtotal: {formatPrice(itemSubtotal)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                        )
                                    })}
                                </div>
                        ) : (
                            <p className="text-gray-300">Sem itens neste pedido.</p>
                        )}
                    </div>

                        <div className="flex items-center justify-between border-t border-app-border pt-5">
                            <p className="text-4xl font-bold">Total</p>
                            <p className="text-5xl font-bold text-brand-primary">{formatPrice(calculateTotal() )}</p>
                        </div>
                    </div>
                )}

                <DialogFooter className="mt-2 border-app-border bg-transparent p-0 sm:justify-end">
                    <Button
                    variant="outline"
                    className="h-11 border-app-border bg-transparent px-7 text-xl font-bold text-white hover:text-white hover:bg-transparent"
                    onClick={() => onClose()}
                    >
                    Fechar
                    </Button>
                    
                    <Button 
                    onClick={handleFinishOrder}
                    className="h-11 bg-brand-primary px-7 text-xl font-bold text-white hover:bg-brand-primary/90" 
                    >
                    Finalizar pedido
                    </Button>

                </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}