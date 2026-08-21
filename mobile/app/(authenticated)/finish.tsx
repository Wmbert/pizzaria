import {
    KeyboardAvoidingView,
    View,
    Text, 
    StyleSheet,
    Platform,
    ScrollView,
    Alert
} from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, fontSize, spacing } from "@/constants/theme";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import api from "@/services/api";

export default function Finish(){
    const router = useRouter();
    const { order_id, table} = useLocalSearchParams<{
        order_id: string;
        table: string;
    }>();

    const[customer, setCustomer] = useState("");
    const[loading, setLoading] = useState(false);

    async function handleFinishOrder(){
        try{
            setLoading(true);

            await api.put("/order/send",{
                order_id: order_id,
                name: customer ?? "Sem nome",
            })

            Alert.alert("Sucesso", "Pedido enviado para cozinha");
            router.dismissAll();
            router.replace("/(authenticated)/dashboard");

        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    return(
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "padding"}
        >
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.content}>

                    <View>
                        <Text style={styles.text}>Você deseja finalizar o pedido?</Text>
                        <Text style={styles.table}>Mesa: {table}</Text>
                    </View>

                    <Input
                        placeholder="Nome do cliente"
                        placeholderTextColor={colors.gray}
                        value={customer}
                        onChangeText={setCustomer}
                    />

                    <Button
                        title="Finalizar pedido"
                        onPress={handleFinishOrder}
                        loading={loading}
                    />
                </View>


            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.background
    },
    scrollView:{
        flex: 1,
    },
    scrollContent:{
        flexGrow: 1,
        justifyContent: "center",
        paddingVertical: spacing.xl,
    },
    content:{
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
        gap: spacing.lg
    },
    text:{
        color: colors.primary,
        fontSize: fontSize.xl,
        fontWeight: "bold",
        textAlign: "center",
    },
    table:{
        color: colors.primary,
        fontSize: fontSize.xl,
        fontWeight: "bold",
        textAlign: "center",
    }
})