import prismaClient from "../../prisma/index";

class DetailUserService{
    async execute(user_id: string){

        try{

            const user = await prismaClient.user.findFirst({
                where:{
                    //Busca on o id vai ser igual ao user_id
                    id: user_id
                },
                //Quais propriedades vão ser retornadas
                select:{
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                }
            });

            if(!user){
                throw new Error("Usuário não encontrado");
            }

            return user;

        }catch(error){
            console.log(error);
            throw new Error("Usuário não encontrado");
        }

    }
}

export { DetailUserService };