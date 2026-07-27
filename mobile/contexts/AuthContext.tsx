//AuthContext.tsx
import { createContext, useContext, useState } from "react";

interface AuthProviderProps{
    children: React.ReactNode;

}

interface AuthContextData{
    signed: boolean; //true logado, false não logado
    loading: boolean,
    //signIn vai ser a função de login
    //Quem usar vai ter que mandar os parâmetros descritos
    //Ela é async, Por isso Promise e devolde void
    signIn: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData)


export function AuthProvider({ children }: AuthProviderProps){
    const[signed, setSigned] = useState(false);
    const[loading, setLoading] = useState(false);

    async function signIn(email: string, password: string){
        
    }

    return(
        <AuthContext value={{
            signed,
            loading,
            signIn,
        }}>
            {children}
        </AuthContext>
    )
}

//hook para consumo de contexto
export function useAuth(){
    const context = useContext(AuthContext);

    if(!context){
        throw new Error("Contexto não foi encontrado");
    }

    return context;
}