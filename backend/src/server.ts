import cors from "cors";
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { routes } from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes)

//Proteção em caso de excessão(erro) no service
//underline omite o uso 
app.use( (error: Error, _: Request, res: Response, next: NextFunction) => {

    //Se tem um erro do tipo Error
    if(error instanceof Error){
        return res.status(400).json({
            error: error.message
        })
    }

    return res.status(500).json({
        error: "Internal server error!"
    })
})

const PORT = process.env.PORT! || 3333;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
    
})