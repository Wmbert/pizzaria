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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { colors, fontSize, spacing, borderRadius } from "@/constants/theme";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard(){
    const { signOut } = useAuth();
    const insets = useSafeAreaInsets();

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
                        />
                        <Button
                            title="Abrir mesa"
                            onPress={() => {}}
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