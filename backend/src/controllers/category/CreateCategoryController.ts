import { Request, Response} from "express";
import { CreateCategoryService } from "../../services/category/CreateCategoryService";

class CreateCategoryController{
    async handle(req: Request, res: Response){

        const { name } = req.body;

        //Inicializa o service
        const createCategory = new CreateCategoryService();

        //executa o service
        const category = await createCategory.execute({ name });

        //201 é criado com sucesso
        res.status(201).json(category);
    }
}

export { CreateCategoryController };