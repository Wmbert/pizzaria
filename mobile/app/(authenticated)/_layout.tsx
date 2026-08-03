//(authenticated)/_layout.tsx
import { Stack } from "expo-router";

export default function AuhtenticatedLayout(){
    return(
        <Stack>
            <Stack.Screen name="dashboard"/>
        </Stack>
    )
}