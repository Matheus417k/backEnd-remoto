import { Router } from "express";
import produtoController from "../controller/produtoController.js";
import uploadImage from "../middlewares/uploadImage.middleware.js";

const produtoRoutes = Router();

produtoRoutes.post('/', uploadImage, produtoController.criar)
produtoRoutes.put('/:idProduto', produtoController.editar)
produtoRoutes.delete('/:idProduto', produtoController.deletar)
produtoRoutes.get('/', produtoController.selecionar)


export default produtoRoutes