//Criando api client para reutilizar
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

//Retorna a url declara
export function getApiURL(){
    return API_URL;
}

//Tem tudo que o RequestInit(type do fecth) tem mais a interface FetchOption
interface FetchOptions extends RequestInit{
    //Interface com tipos que vem do backend
     token?: string;
    //Cache do next
     cache?: "force-cache" | "no-store";
    //Propriedades do next
     next?: {
        revalidate?: false | 0 | number;
        tags?: string[];
     }
}

export async function apiClient<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {

    //Recebe as props da requisição
    const { token, ...fetchOptions } = options;

    //Controi os headers
    const headers: Record<string, string> = {
        ...(fetchOptions.headers as Record<string, string>)
    }

    //Se tiver token ele injeta no header
    if(token){
        //Passa o token para a propriedade Authorization do header
        headers["Authorization"] = `Bearer ${token}`;
    }

    //Valida qual tipo que está recebendo, podendo ser um form-data
    //Se não é do tipo FormData
    if(!(fetchOptions.body instanceof FormData)){
        //Coloca dentro do headers o tipo application/json
        headers["Content-Type"] = "application/json";
    }

    //Faz o fetch da requisição
    const response = await fetch(`${API_URL}${endpoint}`, {
        //Repassa as options
        ...fetchOptions,
        //Repassa os header
        headers,
    })

    //Tratamento de erros
    if(!response.ok){
        const error = await response.json().catch(() => ({
            error: "Erro HTTT: " + response.status
        }))
        throw new Error(error.error || "Erro na requisição");
    }


    //Retorna a resposta do response
    return response.json();
}