import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category, Product } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Package } from "lucide-react";
import { ProductForm } from "@/components/dashboard/product-form";
import Image from "next/image";
import { DeleteButtonProduct } from "@/components/dashboard/delete-button";

export default async function Products() {
  const token = await getToken();
  //Busca categorias para formulario
  const categories = await apiClient<Category[]>("/category", {
    token: token!
  })

  //Busca produtos
  const products = await apiClient<Product[]>("/products", {
    token: token!
  })

  //Função para formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price / 100);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Produtos
          </h1>
          <p className="text-sm sm:text-base mt-1">
            Gerencie seus produtos
          </p>
        </div>

        <ProductForm categories={categories} />
      </div>

      {products.length !== 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-app-card border-app-border transition-shadow hover:shadow-md text-white"
            >
              <div className="relative w-full h-48">
                <Image
                  src={product.banner}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardHeader>
                <CardTitle className="gap-2 flex items-center justify-between text-base md:text-lg">
                  <div className="flex flex-row gap-2">
                    <Package className="w-5 h-5"/>
                    <span>{product.name}</span>
                  </div>

                  <DeleteButtonProduct productId={product.id}/>

                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-gray-200 text-sm">
                  Preco: {formatPrice(product.price)}
                </p>
                <p className="text-gray-200 text-sm">
                  Categoria: {product.category?.name || "Sem categoria"}
                </p>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {product.description}
                </p>
              </CardContent>

            </Card>
          ))}

        </div>
        
      )}

    </div>
  );
}