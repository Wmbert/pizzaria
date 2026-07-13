import { RegisterForm } from "@/components/forms/register-form";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Register(){
    //Pega os detalhes do usuário
    const user = await getUser();

    //Caso tenha usuário redireciona para página dashboard
    if(user){
        redirect("/dashboard")
    }

    return(
        <div className="bg-app-background min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full">
                <RegisterForm />
            </div>
        </div>
    )
}