//login.tsx
import { 
    View, 
    Text, 
    KeyboardAvoidingView, 
    ScrollView,
    StyleSheet,
    Alert
} from "react-native";

import { useState } from "react";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

import { useAuth } from "@/contexts/AuthContext";

import { 
    colors, 
    spacing, 
    fontSize 
} from "@/constants/theme";

export default function Login(){
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[loading, setLoading] = useState(false);

    const { signIn } = useAuth();

    async function handleLogin(){

        if(!email.trim() || !password.trim()){
            Alert.alert("Atenção", "Preencha todos os campos!");
            return;
        }
        try{
            setLoading(true);
            await signIn(email, password);
        }catch(error){
            console.log(error);
            Alert.alert("Error", "Erro ao fazer o login");
        } finally{
            setLoading(false);
        }
        
    }

    return(
        <KeyboardAvoidingView
            style={styles.container}
            //Da um padding de acordo com o sistema 
            behavior={"padding"}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                //Não fecha o teclado automaticamente quando clica em input
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>
                        Sujeito <Text style={styles.logoBrand}>Pizzaria</Text>
                    </Text>

                    <Text style={styles.logoSubtitle}>Garçom app</Text>
                </View>

                <View style={styles.formContainer}>
                    <Input
                        label="Email"
                        placeholder="Digite seu email..."
                        placeholderTextColor={colors.gray}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />

                    <Input
                        label="Senha"
                        placeholder="Digite sua senha..."
                        placeholderTextColor={colors.gray}
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Button
                        title="Acessar"
                        loading={loading}
                        onPress={handleLogin}
                    />
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    )
} 

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.background,
        flex:  1,
    },
    scrollContent:{
        justifyContent: "center",
        flexGrow: 1,
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
    logoSubtitle:{
        color: colors.primary,
        fontSize: fontSize.lg,
    },
    formContainer:{
        gap: spacing.md,
    }
})