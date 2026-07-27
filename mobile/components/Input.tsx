//componente Input
import { 
    View, 
    TextInput,
    TextInputProps, 
    Text, 
    StyleSheet
} from "react-native";

import { 
    colors,
    fontSize,
    spacing,
    borderRadius
 } from "@/constants/theme";

//InputProps tem tambem todas as tipagens do TextInputProps
interface InputProps extends TextInputProps{
    label?: string;
}

export function Input({ label, style, ...rest }: InputProps){
    return(
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TextInput
                style={[styles.input, style]}
                {...rest}
                //rest são todas as propriedades que você mandar
                //como placeholder por exemplo
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width: "100%"
    },
    label:{
        color: colors.primary,
        fontSize: fontSize.lg,
        marginBottom: spacing.sm,
    },
    input:{
        height: 50,
        backgroundColor: colors.backgroundInput,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        color: colors.primary,
        borderWidth: 1,
        borderColor: colors.borderColor,
        fontSize: fontSize.lg
    }
})