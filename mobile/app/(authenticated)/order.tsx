import { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    ActivityIndicator, 
    StyleSheet,
    Pressable,
    ScrollView,
    Alert
 } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Category, Item, Product } from "@/types/index";
import api from "@/services/api";
import { colors, fontSize, spacing } from "@/constants/theme";
import { Select } from "@/components/Select";
import { QuantityControl } from "@/components/QuantityControl";
import { Button } from "@/components/Button";
import { OrderItem } from "@/components/OrderItem";

export default function Order(){
    const router = useRouter();
    const insets = useSafeAreaInsets();
    //Pega os parametros que vem pela rota
    const { order_id, table} = useLocalSearchParams<{
        order_id: string;
        table: string;
    }>();
    const[categories, setCategories] = useState<Category[]>([]);
    const[selectedCategory, setSelectedCategory] = useState("");

    const[products, setProducts] = useState<Product[]>([]);
    const[selectedProduct, setSelectedProduct] = useState("");

    const[quantity, setQuantity] = useState(1);

    const[loadingCategories, setLoadingCategories] = useState(true);
    const[loadingProducts, setLoadingProducts] = useState(false);
    const[loadingAddItem, setLoadingAddItem] = useState(false);

    const[items, setItem] = useState<Item[]>([]);

    useEffect(() => {
        async function loadDataCategories(){
            loadCategories();
        }

        loadDataCategories();
    },[])

    useEffect(() => {
        if(selectedCategory){
            loadProducts(selectedCategory);
        }else{
            setProducts([]);
            setSelectedCategory("");
        }
    }, [selectedCategory])

    async function loadCategories(){
        try{
            const response = await api.get<Category[]>("/category");
            setCategories(response.data);
        }catch(error){
            console.log(error);
        }finally{
            setLoadingCategories(false);
        }
    }

    async function loadProducts(categoryId: string){
        try{
            setLoadingProducts(true);

            const response = await api.get<Product[]>("/category/product", {
                params: {
                    category_id: categoryId,
                }
            })

            setProducts(response.data);

        }catch(error){
            console.log(error);
        }finally{
            setLoadingProducts(false);
        }
    }

    async function handleAddItem(){
        try{
            setLoadingAddItem(true);

            const response = await api.post<Item>("/order/add",{
                order_id: order_id,
                product_id: selectedProduct,
                amount: quantity
            })

            setItem([...items, response.data]);
            setSelectedCategory("");
            setSelectedProduct("");
            setQuantity(1);
        }catch(error){
            console.log(error);
        }finally{
            setLoadingAddItem(false);
        }
    }

    async function handleRemoveItem(item_id: string){
        try{

            await api.delete("/order/remove",{
                params:{
                    item_id: item_id
                }
            })

            const updatedItems = items.filter( item => item.id !== item_id);

            setItem(updatedItems);

            Alert.alert("Item removido", "Seu item foi removido da mesa");


        }catch(error){
            console.log(error);
            Alert.alert("Atenção", "Erro ao remover item da mesa");
        }
    }

    if(loadingCategories){
        return(
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.brand} />
            </View>
        )
    }

    function handleAdvance(){
        if(items.length === 0) return;

        router.push({
            pathname: "/(authenticated)/finish",
            params: {
                order_id: order_id,
                table: table
            }
        })
    }

    return(
        <View style={styles.container}>
            <SafeAreaView style={styles.header}>

                <View style={styles.headerContent}>

                    <Text style={styles.headerTitle}>{table}</Text>

                    <Pressable 
                        style={styles.closeButton} 
                        onPress={ () => router.back }
                    >
                        <Ionicons name="trash" size={20} color={colors.primary}/>
                    </Pressable>

                </View>
            </SafeAreaView>

            <ScrollView 
                style={styles.scrollContent}
                contentContainerStyle={{
                    paddingBottom: insets.bottom + 40
                }}
            >
                <Select 
                    label="Categorias"
                    placeholder="Selecione a categoria"
                    options={categories.map(( category ) => ({
                        label: category.name,
                        value: category.id
                    }))}
                    selectedValue={selectedCategory}
                    onValueChange={setSelectedCategory}
                />

                {loadingProducts ? (
                    <ActivityIndicator size="small" color={colors.brand}/>
                ): (
                    selectedCategory && (
                        <Select
                            placeholder="Selecione um produto"
                            options={products.map((product) => ({
                                label: product.name,
                                value: product.id,
                            }))}
                            selectedValue={selectedProduct}
                            onValueChange={setSelectedProduct}
                        />
                    )
                )}

                { selectedProduct && (
                    <View style={styles.quantitySection}>
                        <Text style={styles.quantityLabel}>Quantidade</Text>

                        <QuantityControl 
                            quantity={quantity}
                            onIncrement={() => setQuantity(quantity => quantity + 1)}
                            onDecrement={() => {
                                if(quantity <= 1){
                                    setQuantity(1);
                                    return;
                                }
                                setQuantity(quantity => quantity - 1);
                            }}
                        />
                    </View>
                )}

                {selectedProduct && (
                    <Button
                        title="Adicionar"
                        onPress={handleAddItem}
                        variant="secondary"
                    />
                )}

                {items.length > 0 && (
                    <View style={styles.itemsSection}>
                        <Text style={styles.itemsTitle}>Itens adicionados</Text>

                        {items.map( (item) => (
                            <OrderItem
                                item={item}
                                key={item.id}
                                onRemove={handleRemoveItem}
                            />
                        ))}
                    </View>
                )}

                {items.length > 0 && (
                    <View style={styles.footer}>
                        <Button
                            title="Avançar"
                            onPress={handleAdvance}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background
    },
    container:{
        flex: 1,
        backgroundColor: colors.background,
    },
    header:{
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor,
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.lg
    },
    headerContent:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle:{
        fontSize: fontSize.lg,
        color: colors.primary,
        fontWeight: "bold",
    },
    closeButton:{
        backgroundColor: colors.red,
        padding: spacing.sm,
        borderRadius: 8
    },
    scrollContent:{
        padding: spacing.lg,
        gap: 14,
    },
    quantitySection:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: spacing.md
    },
    quantityLabel:{
        color: colors.primary,
        fontSize: fontSize.lg,
        fontWeight: "bold",
    },
    itemsSection:{
        marginTop: spacing.xl,
        gap: spacing.md
    },
    itemsTitle:{
        color: colors.primary,
        fontWeight: "bold",
        fontSize: fontSize.lg,
    },
    footer:{
        paddingTop: 24,
    }
})