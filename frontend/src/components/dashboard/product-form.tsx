//Form (modal) para criar novo produto
"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProductAction } from "@/actions/products";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/types";
import Image from "next/image";
import { Upload } from "lucide-react";

interface ProductFormProps {
  categories: Category[];
}

export function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [priceValue, setPriceValue] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null)

  //Converte o price para centavos
  function convertBrlToCents(value: string): number{
    //Remove R$, . e substitui onde tem , por .
    const cleanValue = value.replace(/[R$\s]/g, "").replace(/\./g, "").replace(",", ".");

    //Passa o valor para um número
    const reais = parseFloat(cleanValue) || 0;

    //Arredonda os número e converte para centavos
    return Math.round(reais * 100);
  }

  //Cria o produto
  async function handleCreateProduct(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    if(!imageFile){
      setIsLoading(false);
      return;
    }

    const formData = new FormData();

    const formElement = e.currentTarget;

    const name = (formElement.elements.namedItem("name") as HTMLInputElement)?.value;
    const description = (formElement.elements.namedItem("description") as HTMLInputElement)?.value;
    const priceInCents = convertBrlToCents(priceValue);
    
    formData.append("name", name);
    formData.append("description", description);
    //Tem que passar string e não number
    formData.append("price", priceInCents.toString());
    formData.append("category_id", selectedCategory);
    formData.append("file", imageFile);

    const result = await createProductAction(formData);

    if(result.success){
      setOpen(false);
      setSelectedCategory("");
      setPriceValue("");
      clearImagePreview();
      router.refresh();
      return;
    }else{
      console.log(result.error);
      alert(result.error);
    }
  }

  function fortmatToBrl(value: string){
    //remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    if(!numbers) return ""

    //Converter para number e dividir por 100 para ter os centados
    const amount = parseInt(numbers) / 100;

    return amount.toLocaleString("pt-BR",{
      style: "currency",
      currency: "BRL",
    })
  }

  //Formata o preço
  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>){
    const formated = fortmatToBrl(e.target.value);
    setPriceValue(formated);
  }

  //Função para exibir a image
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0]

    if(file){
      //Barra arquivos com mais de 5mb
      if(file.size > 5 * 1024 * 1024){
        return
      }
      //Salva o arquivo para ter acesso depois
      setImageFile(file);

      //Monta uma url de preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      }

      reader.readAsDataURL(file);
    }
  }

  function clearImagePreview(){
    setImageFile(null);
    setImagePreview(null);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger render={
        <Button className="bg-brand-primary hover:bg-brand-primary font-semibold">
          <Plus className="h-5 w-5 mr-2" />
          Novo produto
        </Button>
      }/>

      <DialogContent className="p-6 bg-app-card text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar novo produto</DialogTitle>
          <DialogDescription>Criando novo produto...</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleCreateProduct}>
          <div>
            <Label htmlFor="name" className="mb-2">
              Nome do produto
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Digite o nome do produto..."
              className="border-app-border bg-app-background text-white"
            />
          </div>

          <div>
            <Label htmlFor="price" className="mb-2">
              Preço
            </Label>
            <Input
              id="price"
              name="price"
              required
              placeholder="Ex: 35,00"
              className="border-app-border bg-app-background text-white"
              //Formata enquanto digita
              value={priceValue}
              onChange={handlePriceChange}
            />
          </div>

          <div>
            <Label htmlFor="description" className="mb-2">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Digite a descrição do produto..."
              className="border-app-border bg-app-background text-white min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="category" className="mb-2">
              Categoria
            </Label>

            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value ?? "")}
              required
            >

              <SelectTrigger className="border-app-border bg-app-background text-white">

                <SelectValue>
                  {/* 
                    Fluxo do select:
                    1) Cada SelectItem usa category.id como value (valor interno enviado no formData como category_id).
                    2) O estado selectedCategory guarda esse id selecionado.
                    3) No trigger, fazemos um find nas categorias para converter o id em nome e exibir algo amigavel.
                    Sem esse find, o componente pode mostrar apenas o value bruto (UUID/id), que nao e bom para UX.
                  */}
                  {selectedCategory
                    ? categories.find((category) => category.id === selectedCategory)?.name
                    : "Selecione uma categoria"}
                </SelectValue>

              </SelectTrigger>

              <SelectContent className="bg-app-card border-app-border">

                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="text-white hover:bg-transparent cursor-pointer"
                  >
                    {category.name}
                  </SelectItem>
                ))}

              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="mb-2">
              Imagem do produto
            </Label>
            
            {/*Preview de imagem */}
            {imagePreview ? (
              <div className="relative w-full h-48 border-lg rounded-lg overflow-hidden">

                <Image
                  src={imagePreview}
                  alt="Preview da imagem"
                  fill
                  className="object-cover z-10"
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={clearImagePreview}
                  className="absolute top-2 right-2 z-20"
                >
                  Excluir
                </Button>

              </div>
            ) : (
              <div className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2"/>
                <Label htmlFor="file" className="cursor-pointer">Clique para selecionar uma imagem</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  required
                  className="hidden"
                />
              </div>
            )}

          </div>

          <Button
            type="submit"
            disabled={isLoading || !selectedCategory}
            className="w-full bg-brand-primary text-white hover:bg-brand-primary disabled:opacity-50"
          >
            {isLoading ? "Criando..." : "Criar produto"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
