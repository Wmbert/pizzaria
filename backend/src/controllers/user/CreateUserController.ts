import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";

class CreateUserController{
    async handle(req: Request, res: Response){

        const { name, email, password} = req.body;
        

        //Inicializando o service
        const createUserService = new CreateUserService();

        //Excutando o service
        const user = await createUserService.execute({
            name: name,
            email: email,
            password: password
        });

        res.json(user);
    }
}

export { CreateUserController }