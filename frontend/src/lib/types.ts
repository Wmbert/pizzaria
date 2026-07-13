//Tipagem de retorno
export interface User{
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    createdAt: string;
}

//Tipagem retorno login
export interface AuthResponse{
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    token: string;
}

//tipagem categorias
export interface Category{
    id: string;
    name: string;
    createdAt: string;
}

//tipagem produtos
export interface Product{
    id: string;
    name: string;
    price: number;
    description: string;
    banner: string;
    disabled: boolean;
    category_id: string;
    createdAt: string;
    updatedAt: string;
    category?: {
        id: string;
        name: string;
    };
}

//Tipagem para oder
export interface Items{
    id: string;
    amount: number;
    product: {
        id: string;
        name: string;
        price: number;
        description: string;
        banner: string;
    }
}

export interface Order{
    id: string;
    table: number;
    name?: string;
    status: boolean; //false = produção, true = finalizado
    draft: boolean; //true = rascunho, false = enviar para produção
    createdAt: string;
    items?: Items[];
}