import { redirect } from "next/navigation";

export default function Home() {
  return (
    /*Redireciona para página de login*/
    redirect("/login")
  );
}
