import { Router } from "express";
import categoriaController from "../controller/categoriaController.js";

const categoriaRoutes = Router();

categoriaRoutes.post('/', categoriaController.criar)
categoriaRoutes.put('/:idCategoria', categoriaController.editar)
categoriaRoutes.delete('/:idCategoria', categoriaController.deletar)
categoriaRoutes.get('/', categoriaController.selecionar)

export default categoriaRoutes