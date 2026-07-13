import { Readable } from "node:stream";
import prismaClient from "../../prisma";
import cloudinary from "../../config/cloudinary";

interface CreateProductServiceProps{
    name: string;
    price: number;
    description: string;
    category_id: string;
    imageBuffer: Buffer;
    imageName: string;
}

class CreateProductService{
    async execute({
        name,
        price,
        description,
        category_id,
        imageBuffer,
        imageName
    }: CreateProductServiceProps){
        
        //verifica se a categoria existe
        const categoryExists = await prismaClient.category.findFirst({
            where:{
                id: category_id,
            }
        })

        if(!categoryExists){
            throw new Error("Categoria não encontrada");
        }

        //Envia para o cloudinary, salva a imagem e pega a AuthUserController
        let bannerUrl = ""

        try{

            const result = await new Promise<any>((resolve, reject) => {

                const uploadStream = cloudinary.uploader.upload_stream({
                    folder: "products",//pasta onde vai ficar
                    resource_type: "image",//Tipo de arquivo
                    public_id: `${Date.now()}-${imageName.split(".")[0]}`//id do nome, gerado aleatorio
                }, (error, result) => {
                    //Rejeita a promise se tiver error
                    if(error) reject(error);
                    //Deixa seguir a promise
                    else resolve(result);
                })

                //Cria o stream do buffer(imagem)
                const bufferStream = Readable.from(imageBuffer);
                //Faz pipe para o cloudinary
                bufferStream.pipe(uploadStream);
            })
            
            //Passa a url da imagem para a variavel
            bannerUrl = result.secure_url

        }catch(error){
            throw new Error("Erro ao fazer upload da imagem");
        }

        const product = await prismaClient.product.create({
            data:{
                name: name,
                price: price,
                description: description,
                banner: bannerUrl,
                category_id: category_id
            },
            select:{
                id: true,
                name: true,
                price: true,
                description: true,
                category_id: true,
                banner: true,
                createdAt: true
            }
        })

        return product;
    }
}

export { CreateProductService }