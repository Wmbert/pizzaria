"use client"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Tags, LogOut} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logOutAction } from "@/actions/auth";

interface SidebarProps{
    userName: string;
}

//Const com os itens do menu
const menuItems = [
    {
        title: "Pedidos",
        href: "/dashboard",
        icon: ShoppingCart
    },
    {
        title: "Produtos",
        href: "/dashboard/products",
        icon: Package
    },
    {
        title: "Categorias",
        href: "/dashboard/categories",
        icon: Tags
    },
]

export function SideBar({ userName }: SidebarProps){

    //Indica em qual url que você está
    const pathname = usePathname();

    return(
        <aside className="hidden lg:flex flex-col h-screen w-64 border-r border-app-border bg-app-sidebar">
            {/*Header da sidebar*/}
            <div className="border-b border-app-border p-6">
                <h2 className="text-xl font-bold">
                    Sujeito<span className="text-brand-primary">Pizzaria</span>
                </h2>
                <p className="text-sm text-gray-300 mt-1">Olá, {userName}</p>
            </div>

            {/*Menu */}
            <nav className="flex-1 p-4 space-y-4">

                {menuItems.map( menu => {
                    const Icon = menu.icon;
                    const isActive = pathname === menu.href

                    return(
                        <Link 
                            href={menu.href} 
                            key={menu.title}
                            //cn serve para fazer renderização condicional com tailwind
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm rounded-md font-medium transition-colors duration-300",
                                isActive ? "bg-brand-primary text-white" : "hover:bg-gray-600"
                            )}
                        >
                            <Icon className="w-5 h-5"/>
                            {menu.title}
                        </Link>
                    )

                })}

            </nav>

            <div className="border-t border-app-border p-4">
                <form action={logOutAction}>
                    <Button 
                        type="submit"
                        variant="ghost"
                        className="w-full justify-start gap-3 text-white hover:text-white hover:bg-transparent"
                    >
                        <LogOut className="w-5 h-5"/>
                        Sair
                    </Button>
                </form>
            </div>
        </aside>
    )
}