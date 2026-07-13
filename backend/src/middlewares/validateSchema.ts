import { NextFunction, Request, Response } from "express"
import { ZodError, ZodType } from "zod"

//Função para validar o scheme
export const validateSchema = 
    (schema: ZodType) => async (req: Request, res: Response, next: NextFunction) => {
        try{
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            })

            //Caso não dê erro ele segue
            return next();
        }catch(error){
            //Se ele é do tipo ZodError retorna o erro de acordo com o zod
            if(error instanceof ZodError){
                return res.status(400).json({
                    error: "Erro de validação",
                    details: error.issues.map(issue => ({
                        message: issue.message
                    }))
                })
            }

            //Se não é um erro do zod
            return res.status(500).json({
                error: "Erro interno do servidor"
            })
        }
    }