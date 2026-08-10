import { useEffect } from "react";
import { View, StyleSheet, ActivityIndicator} from "react-native";
import { colors } from "@/constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { useSegments, useRouter } from "expo-router";

export default function Index(){
    const { loading, signed } = useAuth();

    /*
        Retorna um array com os seguimentos da url atual
        -> Se estiver no /login ["login"]
        -> Se estiver /(authenticated)/dashboard -> ["(authenticated", "dashboard"]
    */
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if(loading) return;

        /*
            Pega a primeira posição e verifica se está em um grupo de rotas authenticated
            verificando se você está em uma rota de usuário logado
        */
        const inAuthGroup = segments[0] === "(authenticated)";

        /*
            Se o usuário não está logado e está dentro de uma rota authenticated
         */
        if(!signed && inAuthGroup){
            //Redireciona para o login
            router.replace("/login")
        }else if(signed && !inAuthGroup){
            /*
                Se estiver logado e não estiver dentro de uma rota authenticated
                Redireciona para rota authenticated
            */
            router.replace("/(authenticated)/dashboard");
        }else if(!signed){
            router.replace("/login");
        }

    }, [loading, signed, router]);

    if(loading){
        return(
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.brand}/>
            </View>
        )        
    }

    return(
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.brand}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center"
    }
})