//Configuração multer
import multer from "multer";

//Use o memoryStorge para manter o arquivo em memoria
//e enviar diretamente para o cloudinary

export default {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 //5mb
    },
    fileFilter: (_: any, file: Express.Multer.File, cb: any) => {
        //Tipos de imagens suportadas
        const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];

        //Verifica se o arquivo é do tipo suportado
        if(allowedMimes.includes(file.mimetype)){
            //Para aceitar o arquivo passe true
            cb(null, true);
        }else{
            cb(new Error("Use apenas arquivos jpeg, jpg ou png"));
        }
    }
}