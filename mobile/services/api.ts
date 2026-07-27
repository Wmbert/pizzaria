//services/api.ts
import axios from "axios";
import { API_CONFIG} from "../config/api.config";
import AsyncStorage from "@react-native-async-storage/async-storage"

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        "Content-Type": "application/json"
    }
})

//interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("@token:pizzaria");

        if(token){
            //Se tiver token ele coloca o token no header
            config.headers.Authorization = `Bearer ${token}`;
        }

        //Se não tiver token retorna sem injetar
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

//Intercepta errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        //Se o error for token inválido ele remove o token do storage
        if(error.response?.status === 401){
            await AsyncStorage.removeItem("@tokne:pizzaria");
        }

        return Promise.reject(error);
    }
)

export default api;