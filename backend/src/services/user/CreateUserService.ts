import prismaClient from "../../prisma/index";
import { hash } from "bcryptjs";

interface CreateUserProps{
    name: string;
    email: string;
    password: string;
}

class CreateUserService{
    async execute({ name, email, password }: CreateUserProps){

        //Verifica se ja tem um email cadastrado
        const userAlredyExist = await prismaClient.user.findFirst({
            where:{
                email: email
            }
        })

        if(userAlredyExist){
            throw new Error("Usuário já existente!");
        }

        //Criptografia da senha
        const passwordHash = await hash(password, 8);
        
        //Cadastra no banco o usuário
        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash
            },
            //Seleciona o que deve estar no return
            select:{
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        })

        return user;
    }

}

export { CreateUserService }