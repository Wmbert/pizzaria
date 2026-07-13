"use client"

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Tags, LogOut, Menu, Ghost} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logOutAction } from "@/actions/auth";
//Componente para abrir menu lateral
import { 
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";


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

export function MobileSidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <div className="lg:hidden">

            <header className="sticky top-0 z-50 border-app-border bg-app-card">

                <div className="flex h-16 items-center justify-between">

                    {/*Icone para abrir menu no header */}
                    <Sheet open={open} onOpenChange={setOpen}>

                        <SheetTrigger render={
                            <Button variant="ghost" size={"icon"}>
                                <Menu className="w-6 h-6"/>
                            </Button>
                        }/>

                        {/*Conteúdo do menu*/}
                        <SheetContent 
                            side="left" 
                            className="w-72 p-0 bg-app-sidebar border-app-border"
                        >

                            <SheetHeader className="border-b border-app-border p-6">
                                <SheetTitle className="text-xl text-white font-bold">
                                    Menu
                                </SheetTitle>      
                            </SheetHeader>

                            <nav className="flex flex-col p-4 space-y-4">

                                {menuItems.map( menu => {
                                    const Icon = menu.icon;
                                    const isActive = pathname === menu.href

                                    return(
                                        <Link 
                                            href={menu.href} 
                                            key={menu.title}
                                            //cn serve para fazer renderização condicional com tailwind
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 text-sm rounded-md font-medium transition-colors duration-300 text-white",
                                                isActive ? "bg-brand-primary text-white" : "hover:bg-gray-600"
                                            )}
                                        >
                                            <Icon className="w-5 h-5"/>
                                            {menu.title}
                                        </Link>
                                    )

                                })}

                            </nav>

                            <div className="absolute bottom-0 border-t w-full border-app-border p-4">
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

                        </SheetContent>

                    </Sheet>

                    <h1 className="text-lg font-bold">
                        Sujeito<span className="text-brand-primary">Pizza</span>
                    </h1>

                    <div className="w-10"></div>

                </div>

            </header>

        </div>
    );
}