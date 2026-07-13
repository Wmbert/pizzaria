//middleware
import { Request, Response, NextFunction} from "express";
import { verify } from "jsonwebtoken";

interface PayLoad{
    sub: string;
}

export function isAuthenticaed(req: Request, res: Response, next: NextFunction){

    //Pega o token através do headers
    const authToken = req.headers.authorization;

    //verifica se tem um authToken no headers
    if(!authToken){
        //Status 401 é não autorizado
        return res.status(401).json({
            error: "Token não fornacido"
        })
    }

    //Desconstruindo token que vem do headers
    const [, token] = authToken.split(" ");
    
    try{
        //Verifica o token
        const { sub } = verify(token!, process.env.JWT_SECRET as string) as PayLoad;
        
        //Injetando o user id no request para o controller
        req.user_id = sub;

        return next();

    }catch(error){
        return res.status(402).json({
            error: "Token inválido"
        })
    }

}