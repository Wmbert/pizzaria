//Página de login actions
"use server"//Vai executar o server side
import { apiClient } from "@/lib/api";
import { User, AuthResponse } from "@/lib/types"
import { setToken, removeToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function registerAction(
    prevState: { success: boolean; error: string, redirectTo?: string} | null,
    formData: FormData
){
    try{
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
    
        const data = {
            name: name,
            email: email,
            password: password
        }
    
        //Implementando api api client
        //User é a tipagem do retorno do user
        await apiClient<User>("/users", {
            //Método http
            method: "POST",
            //Fetch options
            body: JSON.stringify(data)
        })

        //RedirectTo retornar para o front qual o caminho quer redirecionar
        return { success: true, error: "", redirectTo: "/login"};

    }catch(error){

        if(error instanceof Error){
            return { success: false, error: error.message}
        }

        return { success: false, error: "Erro ao criar conta"};

    }
} 

//Action para fazer login
export async function loginAction(
    prevState: { success: boolean; error: string, redirectTo?: string} | null,
    formData: FormData
){

    try{
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
    
        const data = {
            email: email,
            password: password
        }
    
        const response = await apiClient<AuthResponse>("/session", {
            method: "POST",
            body: JSON.stringify(data),
        })

        //Salva o token
        await setToken(response.token);
        
        return { success: true, error: "", redirectTo: "/dashboard"};

    }catch(error){
        console.log(error);
        if(error instanceof Error){
            return { 
                success: false, 
                error: error.message || "Erro ao fazer login"
            }
        };

        return { success: false, error: "Erro ao fazer login"};
    }
}

//Action para sair da conta
export async function logOutAction(){
    await removeToken();
    redirect("/login");
}