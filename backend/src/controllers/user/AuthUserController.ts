import { Request, Response } from "express";
import { AuthUserService } from "../../services/user/AuthUserService";

class AuthUserController{
    async handle(req: Request, res: Response) {
        const {email, password} = req.body;

        //Inicializando o service de login
        const authService = new AuthUserService();

        //Executção do service
        const session = await authService.execute({
            email: email,
            password: password,
        })

        res.json(session);
    }
};

export { AuthUserController };