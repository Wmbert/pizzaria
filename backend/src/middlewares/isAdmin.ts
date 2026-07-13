import { Request, Response, NextFunction } from "express";
import prismaClient from "../prisma";

export const isAdmin = async (
    req: Request,
    res: Response, 
    next: NextFunction
): Promise<void> => {

    //Pega o user_id
    const user_id = req.user_id;

    //Verifica se tem user id
    if(!user_id){
        res.status(401).json({
            error: "Usuário sem permissão"
        })
        return;
    }

    //Busca o usuário
    const user = await prismaClient.user.findFirst({
        where:{
            id: user_id
        }
    })

    //Se não encontrou o usuário
    if(!user){
        res.status(401).json({
            error: "Usuário sem permissão"
        })   
        return;    
    }

    //Verifica se o user não é admin
    if(user.role !== "ADMIN"){
        res.status(401).json({
            error: "Usuário sem permissão"
        })   
        return; 
    }

    //User é admin
    next()
}