import { Router } from "express";
import pedidoController from "../controller/pedidoController.js";

const pedidoRoutes = Router();

pedidoRoutes.post("/", pedidoController.criar);
pedidoRoutes.get("/", pedidoController.selecionar);
pedidoRoutes.put("/:idPedido", pedidoController.editar);
pedidoRoutes.delete("/:idPedido", pedidoController.deletar);

pedidoRoutes.post("/:idPedido/itens", pedidoController.criarItens);
pedidoRoutes.put("/:idPedido/itens/:idItemPedido", pedidoController.editarItens);
pedidoRoutes.delete("/:idPedido/itens/:idItemPedido", pedidoController.deletarItens);

export default pedidoRoutes;