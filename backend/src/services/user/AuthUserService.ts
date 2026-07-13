import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import prismaClient from "../../prisma/index";

interface AuthUserServiceProps{
    email: string;
    password: string
};

class AuthUserService{
    async execute({ email, password}: AuthUserServiceProps){

        //Verifica se existe um usuário na tebla com o email passado
        const user = await prismaClient.user.findFirst({
            where:{
                email: email
            }
        })

        //se não existir o usuário com esse email
        if(!user){
           throw new Error("Email ou Senha inválidos");
        }

        //Verifica se a senha está correta
        const passwordMath = await compare(password, user.password);

        //Se a senha estiver errada
        if(!passwordMath){
            throw new Error("Email ou Senha inválidos")
        }

        //Gerar token JWT
        const token = sign(
            {
                //payload
                name: user.name,
                email: user.email
            }, 
                //JWT scret
                process.env.JWT_SECRET as string,
            {
                //options
                subject: user.id,
                //Quando expira o token (30 dias)
                expiresIn: "30d"
            }
        )

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token
        }
    }
}

export { AuthUserService }