//Página acesso negado
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldX, LogOut } from "lucide-react";
import { logOutAction } from "@/actions/auth";

export default async function AccessDinied(){
  const user = await getUser();

  if(!user){
    redirect("/login");
  }

  return (
    <main 
      className="flex min-h-screen items-center justify-center p-4 bg-app-background"
    >
      <Card className="w-full bg-app-card text-white max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldX className="w-16 h-16 text-brand-primary"/>
          </div>
          <CardTitle className="text-2xl font-bold">Acesso Negado</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <CardDescription className="text-gray-300 text-center">
            Você não tem permissão para acessar o painel administrativo.
          </CardDescription>
          <p className="text-sm text-gray-400 text-center">
            Se você acredita que isso é um erro, por favor, consulte o responsável pelo sistema.
          </p>
          <form action={logOutAction} className="flex justify-center pt-2">
            <Button
              type="submit"
              variant="destructive"
              className="w-full border-app-border text-white"
            >
              <LogOut/>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}