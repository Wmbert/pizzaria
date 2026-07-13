import { Router } from "express";
import multer from "multer";

import uploadConfig from "./config/multer";

import { CreateUserController} from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { ListCategoryController } from "./controllers/category/ListCategoryController";
import { CreateProductController } from "./controllers/product/CreateProductController";
import { ListProductsController } from "./controllers/product/ListProductsController";
import { DeleteProductController } from "./controllers/product/DeleteProductController";
import { CreateOrderController } from "./controllers/order/CreateOrderController";
import { ListOrdersController } from "./controllers/order/ListOdersController";
import { AddItemOrderController } from "./controllers/order/AddItemOderController";
import { RemoveItemOrderController } from "./controllers/order/RemoveItemOrderController";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { SendOrderController } from "./controllers/order/SendOrderController";
import { FinishOrderController } from "./controllers/order/FinishOrderController";
import { DeleteOrderController } from "./controllers/order/DeleteOrderController";

import { validateSchema } from "./middlewares/validateSchema";
import { isAuthenticaed } from "./middlewares/isAuthenticated";
import { isAdmin } from "./middlewares/isAdmin";
import { createUserSchema, authUserSchema } from "./schemas/userSchema";
import { createCategorySchema } from "./schemas/categorySchema"
import { createProductSchema, listProductsSchema } from "./schemas/productSchema";
import { 
    createOrderSchema,
    addItemOderSchema,
    removeItemOrderSchema,
    detailOrderSchema,
    sendOrderSchema,
    finishOrderSchema,
    deleteOrderSchema
} from "./schemas/orderSchema";

const routes = Router();
const upload = multer(uploadConfig);

//Rota users
routes.post(
    "/users", 
    validateSchema(createUserSchema), 
    new CreateUserController().handle
);

//Rota Auth
routes.post(
    "/session", 
    validateSchema(authUserSchema), 
    new AuthUserController().handle
);

//Rota detalhe do usuário
routes.get(
    "/me",
    isAuthenticaed,
    new DetailUserController().handle
);

//Rota category
routes.post(
    "/category",
    isAuthenticaed,
    isAdmin,
    validateSchema(createCategorySchema),
    new CreateCategoryController().handle
)

//Rota listas categorias
routes.get(
    "/category",
    isAuthenticaed,
    new ListCategoryController().handle
)

//Rota para criar um produto
routes.post(
    "/product",
    isAuthenticaed,
    isAdmin,
    validateSchema(createProductSchema),
    upload.single("file"),
    new CreateProductController().handle
)

//Rota para listar todos os produtos com statis disabled
routes.get(
    "/products",
    isAuthenticaed,
    validateSchema(listProductsSchema),
    new ListProductsController().handle
)

//Rota para deletar um produto
routes.delete(
    "/product",
    isAuthenticaed,
    isAdmin,
    new DeleteProductController().handle
)

//Rota para criar pedido
routes.post(
    "/oder",
    isAuthenticaed,
    isAdmin,
    validateSchema(createOrderSchema),
    new CreateOrderController().handle
)

//Rota para buscar pedidos
routes.get(
    "/orders",
    isAuthenticaed,
    new ListOrdersController().handle
)

//Rota para adicionar itens a order
routes.post(
    "/order/add",
    isAuthenticaed,
    validateSchema(addItemOderSchema),
    new AddItemOrderController().handle
)

//Rota para remover item de uma order
routes.delete(
    "/order/remove",
    isAuthenticaed,
    validateSchema(removeItemOrderSchema),
    new RemoveItemOrderController().handle
)

//Rota detalhes de uma order
routes.get(
    "/order/detail",
    isAuthenticaed,
    validateSchema(detailOrderSchema),
    new DetailOrderController().handle
)

//Rota para enviar pedido para cozinha
routes.put(
    "/order/send",
    isAuthenticaed,
    validateSchema(sendOrderSchema),
    new SendOrderController().handle
)

//Rota para finalizar pedido
routes.put(
    "/order/finish",
    isAuthenticaed,
    validateSchema(finishOrderSchema),
    new FinishOrderController().handle
)

//Rota para excluir um pedido
routes.delete(
    "/order",
    isAuthenticaed,
    validateSchema(deleteOrderSchema),
    new DeleteOrderController().handle
)

export { routes }