//Arquivo para cookies
import { cookies } from "next/headers";
import { apiClient } from "@/lib/api";
import { User } from "@/lib/types";
import { redirect } from "next/navigation";

//Nome do cookie
const COOKIE_NAME = "token_pizzaria";

//Função para pegar o token no cookie
export async function getToken(): Promise<string | undefined>{
    //Inicializa os cookies
    const cookieStore = await cookies();
    //Retorna o valor que tem nos cookies
    return cookieStore.get(COOKIE_NAME)?.value;
}

//Função para salvar o token no cookie
export async function setToken(token: string){
    //Inicializa os cookies
    const cookieStore = await cookies();
    //Salva o valor no cookie
    cookieStore.set(COOKIE_NAME, token, {
        //Só pode ser acessado pelo server
        httpOnly: true,
        //Tempo de vida do cookie (30 dias no caso)
        maxAge: 60 * 60 * 24 * 30,
        //Caminhos que vai ser aceito (todos)
        path: "/",
        //Controla comportamento do cookie entre sites
        sameSite: true,
        //Garante que o cookie seja enviado apenas por https
        //Somente em produção
        secure: process.env.NODE_ENV == "production",
    })
}

//Função para deletar o token no cookie
export async function removeToken(){
    //Inicializa os cookies
    const cookieStore = await cookies();
    //Deleta o cookie
    cookieStore.delete(COOKIE_NAME);
}

//Verifica se tem usuário logado
export async function getUser(): Promise< User | null>{
    try{
        const token = await getToken();

        //Verifica se tem token
        if(!token){
            return null;
        }

        //Pega os detalhes do usuário
        const user = await apiClient<User>("/me", {
            token: token
        })

        return user;

    }catch(error){
        console.log(error);
        return null;
    }
}

//Função para pegar se o user é admin
export async function requiredAdmin(): Promise<User>{
    //Pega o user
    const user = await getUser();

    //Verifica se tem um user
    if(!user){
        redirect("/access-denied");
    }

    //Verifica se o user é admin
    if(user?.role !== "ADMIN"){
        redirect("/access-denied");
    }
    
    return user;
}