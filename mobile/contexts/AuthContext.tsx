//AuthContext.tsx
import { 
    createContext, 
    useContext, 
    useState,
    useEffect 
} from "react";
import api from "@/services/api";
import { LoginResponse, User } from "@/types/index";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthProviderProps{
    children: React.ReactNode;

}

interface AuthContextData{
    user: User | null;
    signed: boolean; //true logado, false não logado
    loading: boolean;
    //signIn vai ser a função de login
    //Quem usar vai ter que mandar os parâmetros descritos
    //Ela é async, Por isso Promise e devolde void
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData)


export function AuthProvider({ children }: AuthProviderProps){
    const[signed, setSigned] = useState(false);
    const[loading, setLoading] = useState(true);
    const[user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function loadData(){
            await loadStorageData();
        }
    }, [])

    //Busca os detalhes salvos no storage
    //Para permancia de login
    async function loadStorageData(){
        try{
            setLoading(true);
            const storedToken = await AsyncStorage.getItem("@token:pizzaria");
            const storedUser = await AsyncStorage.getItem("@user:pizzaria");

            if(storedToken && storedUser){
                setUser(JSON.parse(storedUser));
                
            }

        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    //função de login
    async function signIn(email: string, password: string){
        try{
            const response = await api.post<LoginResponse>("/session",{
                email: email,
                password: password
            })

            //Desconstrooi os detalhes do usuário
            const { token, ...userData} = response.data;

            //Salva o token no AsyncStorage
            await AsyncStorage.setItem("@token:pizzaria", token);
            //Salva os dados do usuário
            await AsyncStorage.setItem("@user:pizzaria", JSON.stringify(userData));

            setUser(userData);

        }catch(error: any){
            if(error.response?.data?.error){
                console.log(error.response?.data?.error);
                return;
            }

            console.log(error);
        }
    }
    
    //Função de logout
    async function signOut(){
        await AsyncStorage.multiRemove(["@token:pizzaria","@user:pizzaria"])
        setUser(null);
    }

    return(
        <AuthContext value={{
            user,
            //Só vai ser true se tiver algo em user
            signed: !!user, //!! Transforma o user em boolean (true ou false)
            loading,
            signIn,
            signOut,
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