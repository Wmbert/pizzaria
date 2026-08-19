//(authenticated)/dashboard.tsx
import { useState } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { 
    colors,
    fontSize, 
    spacing, 
    borderRadius 
} from "@/constants/theme";

import { 
    SafeAreaView 
} from "react-native-safe-area-context";

import { Order } from "@/types/index";

import api from "@/services/api";
import { useRouter } from "expo-router"

export default function Dashboard(){
    const router = useRouter();
    const { signOut } = useAuth();

    const[tableNumber, setTableNumber] = useState("");
    const[loading,setLoading] = useState(false);

    async function handleOpenTable(){
        if(!tableNumber){
            Alert.alert("Atenção", "Digite um número da mesa válido");
            return;
        }

        //Converte o número da table para number
        const table = parseInt(tableNumber);
        
        //Verifica se o número da mesa é um número
        if(isNaN(table) || table <= 0){
            Alert.alert("Atenção", "Digite um número da mesa válido");
            return;           
        }

        try{
            setLoading(true);

            const response = await api.post<Order>("/order", {
                table: table
            })

            //Envia parametros para a tela de order
            router.push({
                pathname: "/(authenticated)/order",
                params: { 
                    table: response.data.table.toString(), 
                    order_id: response.data.id
                },
            });
            
            setTableNumber("");

        }catch(error){
            console.log(error);
            Alert.alert("Erro", "Falha ao abrir mesa");
        }finally{
            setLoading(false);
        }
    }

    return(
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor={colors.background}/>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <SafeAreaView style={styles.header}>
                        <TouchableOpacity style={styles.signoutButton}>
                            <Text style={styles.signoutText}>Sair</Text>
                        </TouchableOpacity>
                    </SafeAreaView>

                    <View style={styles.content}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>
                                Sujeito <Text style={styles.logoBrand}>Pizzaria</Text>
                            </Text>
                        </View>

                        <Text style={styles.title}>Novo pedido</Text>
                        <Input
                            placeholder="Número da mesa"
                            style={styles.input}
                            placeholderTextColor={colors.gray}
                            value={tableNumber}
                            onChangeText={setTableNumber}
                            keyboardType="numeric"
                        />
                        <Button
                            title="Abrir mesa"
                            onPress={handleOpenTable}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardContainer:{
        flex: 1,
    },
    scrollContent:{
        flexGrow: 1,
    },
    header:{
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.sm,
        paddingTop: 24
    },
    signoutButton:{
        backgroundColor: colors.red,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
    },
    signoutText:{
        color: colors.primary,
        fontSize: fontSize.md
    },
    content:{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: spacing.xl,

    },
    logoContainer:{
        alignItems: "center",
        marginBottom: spacing.xl,
    },
    logoText:{
        fontSize: 34,
        fontWeight: "bold",
        color: colors.primary
    },
    logoBrand:{
        color: colors.brand,
    },
    title:{
        fontSize: fontSize.xl,
        color: colors.primary,
        textAlign: "center",
        marginBottom: spacing.md
    },
    input:{
        marginBottom: spacing.md
    },
})